import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import './Admin.css';
import { faBars, faBell, faGauge, faHouse, faUsers, faWarehouse } from '@fortawesome/free-solid-svg-icons';
import { NavLink, Navigate, Route, Router, Routes } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import ProductPage from './Product';
import AccountPage from './Account';
import DashboardPage from './Dashboard';
import axios from 'axios';
const nav = [
    {
        title: 'Home',
        icon: <FontAwesomeIcon icon={faHouse} style={{ color: '#4daf46' }} size="xl" className="admin__nav--icon" />,
        link: 'dashboard',
    },
    {
        title: 'Dashboard',
        icon: <FontAwesomeIcon icon={faGauge} style={{ color: '#4daf46' }} size="xl" className="admin__nav--icon" />,
        link: 'dashboard',
    },
    {
        title: 'Product',
        icon: (
            <FontAwesomeIcon icon={faWarehouse} style={{ color: '#4daf46' }} size="xl" className="admin__nav--icon" />
        ),
        link: 'product',
    },
    {
        title: 'Notify',
        icon: <FontAwesomeIcon icon={faBell} style={{ color: '#4daf46' }} size="xl" className="admin__nav--icon" />,
        link: 'notify',
    },
    {
        title: 'Account',
        icon: <FontAwesomeIcon icon={faUsers} style={{ color: '#4daf46' }} size="xl" className="admin__nav--icon" />,
        link: 'account',
    },
];
function Admin() {
    const [showNav, setShowNav] = useState(true);
    const [product, setProduct] = useState([]);
    const [account, setAccount] = useState([]);
    const [order, setOrder] = useState([]);

    const navRef = useRef();
    const handleToggleNav = () => {
        setShowNav(!showNav);
    };
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
    return (
        <div className="admin__body">
            <section className={`admin__nav ${showNav ? '' : 'admin__show'}`} ref={navRef}>
                <NavLink to="/" className="admin__nav--logo">
                    <img src="/logo.webp" alt="" className="logo" />
                </NavLink>
                {nav.map((item) => {
                    return (
                        <NavLink key={item.title} to={item.link}>
                            <div className="admin__nav--item">
                                {item.icon}
                                <h5>{item.title}</h5>
                            </div>
                        </NavLink>
                    );
                })}
            </section>

            <section className={`admin__content ${showNav ? '' : 'full__width'}`}>
                <div className={`admin__content--header ${showNav ? '' : 'header__fullwidth'}`}>
                    {' '}
                    <FontAwesomeIcon icon={faBars} size="2xl" onClick={handleToggleNav} className="toggle__navbar" />
                    <div>
                        <img alt="avatar" src="/avatar.jpg" className="admin__content--header--avatar" />
                        <span>admin</span>
                    </div>
                </div>
                <section style={{ height: 150 }}></section>
                <div className="admin__container">
                    <Routes>
                        <Route path="/product" element={<ProductPage product={product}></ProductPage>} />
                        <Route path="/account" element={<AccountPage account={account}></AccountPage>} />{' '}
                        <Route
                            path="/dashboard"
                            element={<DashboardPage product={product} account={account} order={order}></DashboardPage>}
                        />{' '}
                        <Route path="*" element={<Navigate to="/admin/dashboard" />} />
                    </Routes>
                </div>
            </section>
        </div>
    );
}

export default Admin;
