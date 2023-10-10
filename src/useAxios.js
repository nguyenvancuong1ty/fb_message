import axios from 'axios';
import { useEffect, useState } from 'react';

function useAxios({ url, method, authentication, input }) {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    useEffect(() => {
        const getData = async () => {
            setLoading(true);
            await axios({
                method: method,
                url: url,
                data: input,
                headers: {
                    Authorization: authentication,
                },
            })
                .then((res) => {
                    Array.isArray(res) ? setData(res) : setData([res]);
                    setLoading(false);
                })
                .catch((e) => {
                    setLoading(false);
                    console.log(e.message);
                });
        };
        getData();
    }, [url, input, authentication, method]);
    return { data, loading };
}

export default useAxios;
