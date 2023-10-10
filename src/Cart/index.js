import { ExclamationCircleFilled } from '@ant-design/icons';
import './Cart.scss';
import { Checkbox, Empty, Modal, message } from 'antd';
import Quantity from '~/component/Quantity';
import axios from 'axios';
import { useState } from 'react';
import Billing from '~/component/Billing';
import { ToastContainer, toast } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux';
import { setCurrent, setDataCart } from '~/redux';
import LoadingAntd from '~/Loading/Loading.antd';
function Cart({ dataCart, number }) {
    const { confirm } = Modal;
    const dispatch = useDispatch();
    const totalCoin = useSelector((state) => state.totalCoinReducer.totalCoin);
    const [messageApi, contextHolder2] = message.useMessage();
    const [checkOut, setCheckOut] = useState([]);
    const [showBilling, setShowBilling] = useState(false);
    const [loading, setLoading] = useState(false);
    const handleDelete = (item) => {
        confirm({
            zIndex: 99999,
            bodyStyle: { height: 150 },
            centered: true,
            icon: <ExclamationCircleFilled />,
            title: 'Xóa hàng',
            content: 'Xóa mặt hàng này vào giỏ hàng của bạn?',
            onOk() {
                setLoading(true);
                axios({
                    url: `${process.env.REACT_APP_API_URL}/cart/${item.id}`,
                    method: 'delete',
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                })
                    .then(() => {
                        setLoading(false);
                        messageApi.open({
                            type: 'success',
                            content: 'Xóa thành công!',
                        });
                        const newDataCart = dataCart.filter((data) => data.id !== item.id);
                        console.log(newDataCart);
                        dispatch(setDataCart(newDataCart));
                        dispatch(setCurrent(number - item.quantity));
                    })
                    .catch((e) => {
                        messageApi.open({
                            type: 'error',
                            content: 'Xóa thất bại',
                        });
                    });
            },
            onCancel() {
                console.log('Cancel');
            },
        });
        localStorage.setItem('number_product', localStorage.getItem('number_product') - item.total_quantity);
    };
    const onChange = async (e, data) => {
        if (e.target.checked) {
            setCheckOut([...checkOut, data]);
        } else {
            const newItem = checkOut.filter((item) => {
                return item.cakeID !== data.cakeID;
            });
            setCheckOut(newItem);
        }
        try {
            const res = await axios({
                url: `${process.env.REACT_APP_API_URL}/cart/${localStorage.getItem('uid')}`,
                method: 'get',
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });
            console.log(res);
            const newData =
                res.data &&
                res.data.metadata.sort((a, b) => {
                    return a.product.price - b.product.price;
                });
            dispatch(setDataCart(newData));
        } catch (error) {
            alert(error.message);
        }
    };
    return (
        <>
            <div className="wrap_cart">
                {contextHolder2}
                {loading && <LoadingAntd subClass="subLoading" />}
                {!loading && Array.isArray(dataCart) && dataCart.length > 0 ? (
                    <>
                        {dataCart.map((item, index) => (
                            <div className="items" key={index}>
                                <Checkbox onChange={(e) => onChange(e, item)}></Checkbox>
                                <img className="images" src={item.product.images} alt="" />
                                <div className="content">
                                    <b>{item.product.name}</b>
                                    <div>
                                        <div className="price">
                                            Giá:{' '}
                                            {(
                                                item.product.price -
                                                (item.product.price * item.product.sale.percent || 0) / 100
                                            ).toLocaleString('en-US')}
                                        </div>

                                        <Quantity item={item} checkOut={checkOut} />
                                    </div>
                                </div>
                                <button className="delete" onClick={() => handleDelete(item)}>
                                    X
                                </button>
                            </div>
                        ))}

                        <footer>
                            <b className="total_price">
                                Tổng tiền tạm tính: <b>{totalCoin.toLocaleString('en-US')}đ</b>
                            </b>
                            (Chưa bao gồm phí ship) <br />
                            <button
                                onClick={() => {
                                    checkOut.length > 0
                                        ? setShowBilling(true)
                                        : toast.warning('Chọn ít nhất 1 sản phẩm!', {
                                              position: toast.POSITION.BOTTOM_LEFT,
                                              autoClose: 1000,
                                          });
                                }}
                                className="button"
                            >
                                Tiến hành Đặt hàng
                            </button>
                        </footer>
                        {showBilling && (
                            <Billing product={checkOut} total={totalCoin} setShowBilling={setShowBilling} />
                        )}
                        {/* <ToastContainer autoClose={1000} /> */}
                    </>
                ) : (
                    <Empty />
                )}
            </div>
        </>
    );
}

export default Cart;
