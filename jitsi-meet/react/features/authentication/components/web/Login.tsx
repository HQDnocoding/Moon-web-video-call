import React, { useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';

const LoginContainer = styled.div`
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
    margin-top: 10px;

    &:hover {
        background: #0056b3;
    }
`;

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleLogin = () => {
        alert(`Đăng nhập thành công: ${email}`);
    };

    return (
        <LoginContainer>
            <h2>Đăng nhập</h2>
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
            <Button onClick={handleLogin}>Đăng nhập</Button>
            <p>
                Or
            </p>
            <a onClick={() => navigate('/register')} style={{ fontWeight:700,fontSize:20}}>
                Đăng ký
            </a>
        </LoginContainer>
    );
};

export default LoginPage;
