import axios from 'axios';
import { useEffect, useState } from 'react';
import { Col, Container, Row } from 'react-bootstrap';
function DashboardPage() {
    const [product, setProduct] = useState([]);
    const [account, setAccount] = useState([]);
    const [order, setOrder] = useState([]);
    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await axios({
                    method: 'GET',
                    url: `${process.env.REACT_APP_API_URL}/product/search`,
                });
                setProduct(res.data.metadata);
            } catch {}
        };
        fetchData();
    }, []);
    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await axios({
                    method: 'GET',
                    url: `${process.env.REACT_APP_API_URL}/account/`,
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                });
                setAccount(res.data.metadata);
            } catch {}
        };
        fetchData();
    }, []);
    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await axios({
                    method: 'GET',
                    url: `${process.env.REACT_APP_API_URL}/order/all?type=shipped`,
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                });
                setOrder(res.data.metadata);
            } catch {}
        };
        fetchData();
    }, []);
    console.log(product);
    return (
        <>
            <Container>
                <Row>
                    <Col>
                        <div className="role__item">
                            <h5>{product && product.length > 0 ? product.length : 0}</h5>
                            <h5>Sản phẩm</h5>
                        </div>
                    </Col>
                    <Col>
                        <div className="role__item">
                            <h5>{account && account.length > 0 ? account.length : 0}</h5>
                            <h5>Người dùng</h5>
                        </div>
                    </Col>
                    <Col>
                        <div className="role__item">
                            <h5>{order && order.length > 0 ? order.length : 0}</h5>
                            <h5>Đơn hàng đã giao</h5>
                        </div>
                    </Col>
                    <Col>
                        <div className="role__item">4</div>
                    </Col>
                </Row>
            </Container>
        </>
    );
}

export default DashboardPage;
