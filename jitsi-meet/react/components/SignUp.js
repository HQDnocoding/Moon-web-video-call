import React, { useState } from 'react';

const SignUp = () => {
    const [form, setForm] = useState({
        username: '',
        password: '',
        confirm_pass: '',
        nickname: ''
    });

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (form.password !== form.confirm_pass) {
            alert('Mật khẩu không khớp!');
            return;
        }
        console.log('Đăng ký với dữ liệu:', form);
    };

    return (
        <div>
            <h1>Đăng Ký</h1>
        <form onSubmit={handleSubmit}>
            <input type="text" name="username" placeholder="Username" onChange={handleChange} required />
            <input type="password" name="password" placeholder="Password" onChange={handleChange} required />
            <input type="password" name="confirm_pass" placeholder="Confirm Password" onChange={handleChange} required />
            <input type="text" name="nickname" placeholder="Nickname" onChange={handleChange} />
            <button type="submit">Đăng Ký</button>
        </form>
        </div>
    );
};

export default SignUp;
