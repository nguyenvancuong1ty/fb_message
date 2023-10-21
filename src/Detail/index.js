import { Button, Col, Container, Row } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import LoadingAntd from '~/Loading/Loading.antd';
import useAxios from '~/useAxios';
import './Detail.css';
import { setCurrent } from '~/redux';
import { ToastContainer, toast } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux';
import api from '~/config/axios';
import { Modal } from 'antd';
import { faCartPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Fragment, useEffect, useRef, useState } from 'react';
import ChangeQuantityOrder from '~/component/ChangeQuantityOrder';
import Footer from '~/component/Footer';
function Detail() {
    const { confirm } = Modal;
    const formRef = useRef(null);
    const { id } = useParams();
    const number = useSelector((state) => state.numberReducer.number);
    const dataCart = useSelector((state) => state.dataCartReducer.dataCart);
    const [quantityAddToCart, setQuantityAddToCart] = useState(1);
    const [primaryImage, setPrimaryImage] = useState('');
    const [specialAttributes, setSpecialAttributes] = useState({});
    let { data, loading } = useAxios({
        url: `${process.env.REACT_APP_API_URL}/product/${id}`,
        method: 'get',
    });
    useEffect(() => {
        data && Array.isArray(data) && data.length > 0 && setPrimaryImage(data[0].data.metadata.images);
    }, [data]);
    useEffect(() => {
        const inputElements = formRef.current && formRef.current.querySelectorAll('select');
        inputElements &&
            inputElements.forEach((element) => {
                const { name, value } = element;
                setSpecialAttributes((prev) => {
                    return { ...prev, [name]: value };
                });
            });
    }, [data]);
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
    const changeQuantityError = (max) =>
        toast.warn(`Số lượng phải lớn hơn 1 và nhỏ hơn ${max}`, {
            position: 'bottom-left',
            autoClose: 2000,
            theme: 'light',
        });
    const handleAddToCart = async (ID) => {
        try {
            const res = await api.post(
                '/cart',
                {
                    uid: localStorage.getItem('uid'),
                    cakeID: ID,
                    quantity: quantityAddToCart,
                    modifier: specialAttributes,
                },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                },
            );

            if (res.data.status !== 409) {
                const data = dataCart.filter((item) => item.cakeID === ID);
                dispatch(setCurrent(number + quantityAddToCart - data[0].quantity));
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
        const allSelected = Object.values(specialAttributes).some((value) => value === '');
        if (allSelected) {
            toast.warn('Vui lòng chọn chi tiết', {
                position: 'bottom-left',
                autoClose: 2000,
                progress: undefined,
                theme: 'light',
            });
            return;
        } else {
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
        }
    };
    return (
        <>
            {loading && <LoadingAntd></LoadingAntd>}
            {data && Array.isArray(data) && data.length > 0 && (
                <Container>
                    <Row lg={2} md={2} sm={2} xl={2} xs={2} className="detail_component">
                        <Col>
                            <img alt="Img" src={primaryImage} width={380} height={380} className="detail_img" />
                            <div className="sub__img">
                                <div className="sub__imgs">
                                    {data[0].data.metadata.image &&
                                        data[0].data.metadata.image.length > 0 &&
                                        data[0].data.metadata.image.map((item, index) => {
                                            return (
                                                <img
                                                    alt="img"
                                                    src={item}
                                                    key={index}
                                                    className="sub__img--item "
                                                    onMouseMove={() => setPrimaryImage(item)}
                                                />
                                            );
                                        })}
                                </div>
                            </div>
                        </Col>
                        <Col className="detail_info">
                            <h2>Tên: {data[0].data.metadata.name}</h2>
                            <div className="detail_info--head">
                                <p className="detail_info--brand">Thương hiệu: </p>
                                <p>Mã sản phẩm: {id}</p>
                            </div>
                            <div className="detail_info--head">
                                <p className="detail_info--sold">Đã bán: {data[0].data.metadata.sold}</p>
                                <p className="detail_info--inventory">
                                    Còn lại: {data[0].data.metadata.quantity - data[0].data.metadata.sold}
                                </p>
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
                            <form
                                ref={formRef}
                                className=""
                                onSubmit={(e) => {
                                    e.preventDefault();
                                    handleConfirm(id, data[0].data.metadata.quantity - data[0].data.metadata.sold);
                                }}
                            >
                                <div className=" detail_info--head select">
                                    {data[0].data.metadata.attribute &&
                                        Array.isArray(Object.entries(data[0].data.metadata.attribute)) &&
                                        Object.entries(data[0].data.metadata.attribute).length > 0 &&
                                        Object.entries(data[0].data.metadata.attribute).map(([key, value], index) => {
                                            const select =
                                                value &&
                                                value.length > 0 &&
                                                value.map((item, index) => {
                                                    return (
                                                        <option value={item} key={item}>
                                                            {item}{' '}
                                                        </option>
                                                    );
                                                });
                                            return (
                                                <Fragment key={index}>
                                                    <p className="detail__info--number--selected">
                                                        {key}:{' '}
                                                        <select
                                                            defaultValue={''}
                                                            name={key}
                                                            id={key}
                                                            onChange={(e) => {
                                                                const { name, value } = e.target;
                                                                setSpecialAttributes((prev) => {
                                                                    return { ...prev, [name]: value };
                                                                });
                                                            }}
                                                        >
                                                            {' '}
                                                            <option value={''}>chọn {key}</option>
                                                            {select}
                                                        </select>
                                                    </p>{' '}
                                                </Fragment>
                                            );
                                        })}
                                </div>
                                <div className="detail_info--head">
                                    <p className="detail__info--number--selected">Số lượng</p>
                                    <ChangeQuantityOrder
                                        data={data}
                                        quantityAddToCart={quantityAddToCart}
                                        setQuantityAddToCart={setQuantityAddToCart}
                                    />
                                </div>
                                <div className="detail_info--head detail__btn">
                                    <Button type="submit" size="lg" className="detail__btn--order">
                                        <FontAwesomeIcon icon={faCartPlus} />
                                        <span style={{ marginLeft: 12 }}>Thêm vào giỏ hàng</span>
                                    </Button>
                                </div>
                            </form>

                            <hr />
                            <div className="detail_info--head">
                                <div className="detail_info--footer">
                                    <img
                                        src="https://deo.shopeemobile.com/shopee/shopee-pcmall-live-sg/6c502a2641457578b0d5f5153b53dd5d.png"
                                        alt="trả hàng"
                                        width={18}
                                    />
                                    <span>7 ngày miễn phí trả hàng</span>
                                </div>
                                <div className="detail_info--footer">
                                    <img
                                        src="https://deo.shopeemobile.com/shopee/shopee-pcmall-live-sg/511aca04cc3ba9234ab0e4fcf20768a2.png"
                                        alt="chinhhang"
                                        width={18}
                                    />
                                    <span>100% chính hãng</span>
                                </div>
                                <div className="detail_info--footer">
                                    <img
                                        src="https://deo.shopeemobile.com/shopee/shopee-pcmall-live-sg/16ead7e0a68c3cff9f32910e4be08122.png"
                                        alt="vanchuyen"
                                        width={18}
                                    />
                                    <span>Vận chuyển tận nơi</span>
                                </div>
                            </div>
                        </Col>
                    </Row>
                    <p>{data[0].data.metadata.detail}</p>
                    <ToastContainer />
                </Container>
            )}
            <Footer></Footer>
        </>
    );
}

export default Detail;
