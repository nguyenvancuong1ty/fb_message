import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { ref, getDownloadURL, uploadBytesResumable } from 'firebase/storage';
import { storage } from '~/firebase';
import api from '~/config/axios';
const Shop = () => {
    const [imgUrl, setImgUrl] = useState(null);
    const [progresspercent, setProgresspercent] = useState(0);

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(e, '---------', e.target);
        const file = e.target[0]?.files[0];
        if (!file) return;

        const storageRef = ref(storage, `files/${file.name}`);
        console.log('fullPath', storageRef.fullPath, '____', storageRef.name, '______', storageRef.bucket);
        const uploadTask = uploadBytesResumable(storageRef, file);

        uploadTask.on(
            'state_changed',
            (snapshot) => {
                const progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
                setProgresspercent(progress);
            },
            (error) => {
                alert(error.message);
            },
            () => {
                getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                    setImgUrl(downloadURL);
                });
            },
        );
    };
    const handleClick = () => {
        axios
            .post(
                `${process.env.REACT_APP_API_URL}/firebase/api/refreshToken?type_account=${localStorage.getItem(
                    'account',
                )}`,
                {},
                { withCredentials: true },
            )
            .then((response) => {
                console.log(response);
                localStorage.setItem('token', response.data.accessToken);
            })
            .catch((error) => {
                console.log(error);
            });
    };
    const handleChangeInput = (e) => {
        console.log(e.target.files);
    };
    useEffect(() => {
        async function fetchData() {
            const res = await api.post('/account/login', { id: 100 });
            console.log(res);
        }
        fetchData();
    }, []);
    const handlePushNotification = () => {
        axios({
            method: 'post',
            url: `${process.env.REACT_APP_API_URL}/notify-all`,
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
        });
    };
    return (
        <div>
            <div>
                <button onClick={handleClick}>lấy lại</button>
                <button onClick={handlePushNotification}>Gửi thông báo</button>
                <form onSubmit={handleSubmit} className="form">
                    <input type="file" onChange={handleChangeInput} />
                    <button type="submit">Upload</button>
                </form>
                {!imgUrl && (
                    <div className="outerbar">
                        <div className="innerbar" style={{ width: `${progresspercent}%` }}>
                            Loading...{progresspercent}%
                        </div>
                    </div>
                )}
                {imgUrl && <img src={imgUrl} alt="uploaded file" height={200} />}
            </div>
        </div>
    );
};

export default Shop;
