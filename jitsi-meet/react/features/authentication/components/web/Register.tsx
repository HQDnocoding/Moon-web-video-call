import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

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

const RegisterPage = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleRegister = () => {
        alert(`Đăng ký thành công: ${username}`);
    };

    return (
        <RegisterContainer>
            <h2>Đăng ký tài khoản</h2>
            <Input
                type="text"
                placeholder="Tên người dùng"
                value={username}
                onChange={e => setUsername(e.target.value)}
            />
            <Input
                type="email"
                placeholder="Email"
                value={email}
                onChange={e => setEmail(e.target.value)}
            />
            <Input
                type="password"
                placeholder="Mật khẩu"
                value={password}
                onChange={e => setPassword(e.target.value)}
            />
            <Button onClick={handleRegister}>Đăng ký</Button>
            <p>
                Or
            </p>
            <a onClick={() => navigate('/login')} style={{ fontWeight:700,fontSize:20}}>
                Đăng nhập
            </a>
        </RegisterContainer>
    );
};

export default RegisterPage;
