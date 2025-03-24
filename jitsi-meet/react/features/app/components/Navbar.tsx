import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import SettingsButton from "../../settings/components/web/SettingsButton";
import Watermarks from "../../base/react/components/web/Watermarks";
import "./Navbar.css";

const Navbar = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("access_token"));
    const navigate = useNavigate();

    useEffect(() => {
        // Theo dõi thay đổi của localStorage
        const checkAuth = () => setIsLoggedIn(!!localStorage.getItem("access_token"));
        window.addEventListener("storage", checkAuth);

        return () => window.removeEventListener("storage", checkAuth);
    }, []);

    const _onLogoutClick = () => {
        localStorage.removeItem('user');
        localStorage.removeItem('access_token')


        window.location.href = '/';
    };



    return (
        <div className="navbar">
            <div className="navbar-container">
                <div style={{ paddingTop: 30 }}>
                    <div className="welcome-watermark">
                        <Watermarks noMargins={true} />
                    </div>
                </div>
                <div className="navbar-links">
                    <h3 style={{ color: "white" }}>
                        Email {JSON.parse(localStorage.getItem("user") || "{}").email || ""}
                    </h3>

                    <button className="pricing-button" onClick={() => navigate('/pricing')}>
                        Gói dịch vụ
                    </button>
                    {!isLoggedIn ? (
                        <>
                            <button className="login-button" onClick={() => navigate('/login')}>
                                Đăng nhập
                            </button>
                            <button className="register-button" onClick={() => navigate('/register')}>
                                Đăng ký
                            </button>
                        </>
                    ) : (
                        <button className="logout-button" onClick={_onLogoutClick}>
                            Đăng xuất
                        </button>
                    )}
                </div>
            </div>
        </div>
    );

};

export default Navbar;
