import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { api, endpoints } from "../../../../../configs/APIs";

const RegisterContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100vh;
    background-color: #f8f9fa;
`;

const Input = styled.input`
    width: 80%;
    padding: 10px;
    margin: 10px 0;
    border: 1px solid #ccc;
    border-radius: 5px;
`;

const Button = styled.button`
    padding: 10px 20px;
    background: #007bff;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;

    &:hover {
        background: #0056b3;
    }
`;

const ErrorText = styled.p`
    color: red;
`;

const RegisterPage: React.FC = () => {
    const [username, setUsername] = useState<string>("");
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    const handleRegister = async () => {
        setError(null);
        try {
            const response = await api.post(endpoints.register, {
                nickname: username,
                email,
                password,
            });

            if (response.status === 201) {
                alert("Đăng ký thành công!");
                navigate("/login");
            }
        } catch (err: any) {
            console.error("Lỗi đăng ký:", err);
            setError(err.response?.data?.message || "Đăng ký thất bại, thử lại!");
        }
    };

    return (
        <RegisterContainer>
            <h2>Đăng ký tài khoản</h2>
            {error && <ErrorText>{error}</ErrorText>}
            <Input
                type="text"
                placeholder="Tên người dùng"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
            />
            <Input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />
            <Input
                type="password"
                placeholder="Mật khẩu"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
            <Button onClick={handleRegister}>Đăng ký</Button>
            <p>Or</p>
            <a onClick={() => navigate("/login")} style={{ fontWeight: 700, fontSize: 20, cursor: "pointer" }}>
                Đăng nhập
            </a>
        </RegisterContainer>
    );
};

export default RegisterPage;
