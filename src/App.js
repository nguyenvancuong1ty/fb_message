import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './Homepage';

import { useState } from 'react';
import OrderPage from './Orderpage';
import LoginCpn from './LoginCpn';
import NotificationComponent from './Notification';
import Shop from './Shop';
import Detail from './Detail';
import DefaultLayout from './Layout/defaultLayOut';
import Admin from './Admin';
function App() {
    const [show, setShow] = useState(false);
    const [showCart, setShowCart] = useState(false);
    const [uid, setUid] = useState(localStorage.getItem('uid'));
    return (
        <Router>
            <div className="App" onClick={() => setShowCart(false)}>
                <Routes>
                    <Route
                        path="/"
                        element={
                            <DefaultLayout
                                Page={<Home show={show} setShow={setShow} uid={uid} setUid={setUid} />}
                                setShow={setShow}
                                showCart={showCart}
                                setShowCart={setShowCart}
                                setUid={setUid}
                            />
                        }
                    />
                    <Route
                        path="/order"
                        element={
                            <DefaultLayout
                                Page={<OrderPage />}
                                setShow={setShow}
                                showCart={showCart}
                                setShowCart={setShowCart}
                                setUid={setUid}
                            />
                        }
                    />
                    <Route path="/notify" element={<NotificationComponent></NotificationComponent>} />
                    <Route path="/admin/*" element={<Admin></Admin>} />
                    <Route
                        path="/shop"
                        element={
                            <DefaultLayout
                                Page={<Shop />}
                                setShow={setShow}
                                showCart={showCart}
                                setShowCart={setShowCart}
                                setUid={setUid}
                            />
                        }
                    />
                    <Route
                        path="/detail/:id"
                        element={
                            <DefaultLayout
                                Page={<Detail />}
                                setShow={setShow}
                                showCart={showCart}
                                setShowCart={setShowCart}
                                setUid={setUid}
                            />
                        }
                    />
                </Routes>
            </div>
            {show && <LoginCpn setShow={setShow} setUid={setUid} />}
        </Router>
    );
}

export default App;
