import { useEffect, useState } from 'react';
import { Col, Container, Row } from 'react-bootstrap';
import LoadingAntd from '~/Loading/Loading.antd';
function DashboardPage({ product, account, order }) {
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        setTimeout(() => {
            setLoading(false);
        }, 500);
    }, []);
    return (
        <div className="admin__wrap--content">
            <Container>
                {' '}
                {loading ? (
                    <LoadingAntd subClass="subLoading" foreignClass="foreignClass" />
                ) : (
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
                )}
            </Container>
        </div>
    );
}

export default DashboardPage;
