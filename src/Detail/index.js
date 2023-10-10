import { Button, Col, Container, Row } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import LoadingAntd from '~/Loading/Loading.antd';
import useAxios from '~/useAxios';
import './Detail.css';
import { increment } from '~/redux';
import { ToastContainer, toast } from 'react-toastify';
import { useDispatch } from 'react-redux';
import api from '~/config/axios';
import { Modal } from 'antd';
import { faCartPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useState } from 'react';
function Detail() {
    const { confirm } = Modal;
    const { id } = useParams();
    const [quantityAddToCart, setQuantityAddToCart] = useState(1);
    let { data, loading } = useAxios({
        url: `${process.env.REACT_APP_API_URL}/product/${id}`,
        method: 'get',
    });
    const dispatch = useDispatch();
    const addToCartSuccess = () =>
        toast.success('Thêm mặt hàng thành công', {
            position: 'bottom-left',
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: 'light',
        });
    const decreaseQuantityError = () =>
        toast.warn('Ít nhất 1 sản phẩm', {
            position: 'bottom-left',
            autoClose: 2000,
            theme: 'light',
        });
    const changeQuantityError = (max) =>
        toast.warn(`Số lượng phải lớn hơn 1 và nhỏ hơn ${max}`, {
            position: 'bottom-left',
            autoClose: 2000,
            theme: 'light',
        });
    const increaseQuantityError = (max) =>
        toast.warn(`Tối đa ${max}`, {
            position: 'bottom-left',
            autoClose: 2000,
            theme: 'light',
        });
    const handleAddToCart = async (ID) => {
        console.log(ID);
        try {
            const res = await api.post(
                '/cart',
                {
                    uid: localStorage.getItem('uid'),
                    cakeID: ID,
                    quantity: quantityAddToCart,
                },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                },
            );

            if (res.data.status !== 409) {
                dispatch(increment());
                addToCartSuccess();
            }
        } catch (error) {
            console.log(error);
            if (error.response.status === 409) {
                addToCartSuccess();
            } else alert(error.status);
        }
    };
    const handleConfirm = (id, quantity) => {
        if (quantityAddToCart < 1 || quantityAddToCart > quantity) {
            changeQuantityError(quantity);
        } else
            confirm({
                style: { marginTop: 150 },
                zIndex: 9999,
                title: 'Mua hàng',
                content: 'Thêm mặt hàng này vào giỏ hàng của bạn?',
                onOk() {
                    handleAddToCart(id);
                },
                onCancel() {
                    console.log('Cancel');
                },
            });
    };
    console.log(quantityAddToCart);
    return (
        <>
            {loading && <LoadingAntd></LoadingAntd>}
            {data && Array.isArray(data) && data.length > 0 && (
                <Container>
                    <Row lg={2} md={2} sm={2} xl={2} xs={2} className="detail_component">
                        <Col className="detail_img">
                            <img alt="Img" src={data[0].data.metadata.images} width={380} height={380} />
                        </Col>
                        <Col className="detail_info">
                            <h2>Tên: {data[0].data.metadata.name}</h2>
                            <div className="detail_info--head">
                                <p className="detail_info--brand">Thương hiệu: </p>
                                <p>Mã sản phẩm: {id}</p>
                            </div>
                            <div className="detail_info--head">
                                <p className="detail_info--sold">Đã bán: {data[0].data.metadata.sold}</p>
                                <p className="detail_info--inventory">Còn lại: {data[0].data.metadata.inventory}</p>
                            </div>
                            <div className="detail_info--head">
                                <h6 className="detail_info--original--price">
                                    {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(
                                        data[0].data.metadata.price,
                                    )}
                                </h6>
                                <h4 className="detail_info--discounted--price">
                                    Giá:{' '}
                                    {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(
                                        data[0].data.metadata.sale.percent
                                            ? data[0].data.metadata.price -
                                                  (data[0].data.metadata.price * data[0].data.metadata.sale.percent) /
                                                      100
                                            : data[0].data.metadata.price,
                                    )}
                                </h4>
                                <h6 className="detail_info--original--sale">
                                    {data[0].data.metadata.sale.percent || 0}% giảm
                                </h6>
                            </div>
                            <div className="detail_info--head">
                                <p className="detail__info--number--selected">Số lượng</p>
                                <Button
                                    variant="light"
                                    className="detail__info--number--btn"
                                    onClick={() => {
                                        quantityAddToCart <= 1
                                            ? decreaseQuantityError()
                                            : setQuantityAddToCart((prev) => prev - 1);
                                    }}
                                >
                                    -
                                </Button>
                                <input
                                    value={quantityAddToCart}
                                    className="detail__info--number--input"
                                    onChange={(e) => {
                                        if (/^\d*$/.test(e.target.value)) {
                                            setQuantityAddToCart(e.target.value * 1);
                                        } else {
                                            toast.warn(`Chi được phép nhập số`, {
                                                position: 'bottom-left',
                                                autoClose: 2000,
                                                theme: 'light',
                                            });
                                        }
                                    }}
                                />
                                <Button
                                    variant="light"
                                    className="detail__info--number--btn"
                                    onClick={() => {
                                        quantityAddToCart >= data[0].data.metadata.inventory
                                            ? increaseQuantityError(data[0].data.metadata.inventory)
                                            : setQuantityAddToCart((prev) => prev + 1);
                                    }}
                                >
                                    +
                                </Button>
                            </div>
                            <div className="detail_info--head detail__btn">
                                <Button
                                    size="lg"
                                    className="detail__btn--order"
                                    onClick={() => handleConfirm(id, data[0].data.metadata.inventory)}
                                >
                                    <FontAwesomeIcon icon={faCartPlus} />
                                    <span style={{ marginLeft: 12 }}>Thêm vào giỏ hàng</span>
                                </Button>
                            </div>
                        </Col>
                    </Row>
                    <ToastContainer />
                </Container>
            )}
            f
        </>
    );
}

export default Detail;
