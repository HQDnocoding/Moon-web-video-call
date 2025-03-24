import React, { useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { api, endpoints } from '../../../../../configs/APIs';
import axios from 'axios';
import { plans } from '../../../pricing/SubscriptionPlans';

interface Plan {
    id: string;
    name: string;
    price: string;
    features: string[];
  }

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

const ErrorText = styled.p`
  color: red;
  font-size: 14px;
`;

const LoginPage = () => {

    const apiUrl = "https://localhost:3000";


    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async () => {
        setError('');

        try {
            const response = await api.post(endpoints.login, { email, password });
            if (response.status !== 201) {
                throw new Error(response.data?.message || 'Đăng nhập thất bại');
            }

            // Lưu token và thông tin user vào localStorage
            localStorage.setItem('access_token', response.data.access_token);
            const userProfile = response.data.user_profile;
            localStorage.setItem('user', JSON.stringify(userProfile));

            let maxMeetingMinutes = 1; // Mặc định
            let maxParticipants = 2 // Mặc định

            const subscriptionId = userProfile.subscriptionId;
            console.log("sub3",subscriptionId);
            if (subscriptionId) {
                
                try {
                    // Gọi API để lấy thông tin subscription
                    const subResponse = await axios.get(`${apiUrl}/paypal/subscription-status/${subscriptionId}`);
                    maxMeetingMinutes=10;

                    const planId = subResponse.data.plan_id; // Lấy plan_id từ subscription
                    console.log("Plan ID from subscription:", planId);

                    maxMeetingMinutes=12;
                    // Tìm gói trong plans dựa trên plan_id
                    console.log("Plan ID from subscription:", plans );
                    console.log("Plan ID from subscription:", planId);
                    const subscribedPlan = plans.find(plan => plan.id === planId);
                    

                    if (subscribedPlan) {

                        const minutesMatch = subscribedPlan.features[1].match(/(\d+)/); // Lấy số từ "X phút họp"
                        const participantsMatch = subscribedPlan.features[0].match(/(\d+)/); // Lấy số từ "X thành viên tham gia tối đa"
                        maxMeetingMinutes = minutesMatch ? parseInt(minutesMatch[0], 10) : 1;
                        maxParticipants = participantsMatch ? parseInt(participantsMatch[0], 10) : 1;
                    } else {

                        console.log("No matching plan found for plan_id:", planId);
                    }
                } catch (subError) {

                    console.log("Error fetching subscription status:", subError);
                }
            } else {
                console.log("No subscriptionId found for user");
            }

            // Lưu vào localStorage
            localStorage.setItem('maxMeetingMinutes', maxMeetingMinutes.toString());
            localStorage.setItem('maxParticipants', maxParticipants.toString());

            window.location.href = '/';
        } catch (err: any) {
            setError(err.message);
        }
    };

    return (
        <LoginContainer>
            <h2>Đăng nhập</h2>
            {error && <ErrorText>{error}</ErrorText>}
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
            <p>Hoặc</p>
            <a onClick={() => navigate('/register')} style={{ fontWeight: 700, fontSize: 20, cursor: 'pointer' }}>
                Đăng ký
            </a>
        </LoginContainer>
    );
};

export default LoginPage;