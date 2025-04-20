import React, { useState, useEffect } from "react";
import styled from "styled-components";
import axios from "axios";
import { BASE_URL } from "../../../configs/APIs";

// Styled Components (giữ nguyên các style cũ và thêm mới)
const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 100vh;
  background-color: #f3f4f6;
  padding: 20px;
`;

const Row = styled.div`
  display: flex;
  gap: 20px;
  flex-wrap: nowrap;
  overflow-x: auto;
  padding: 20px;
`;

const PlanCard = styled.div`
  background: white;
  padding: 20px;
  border-radius: 16px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  border: 1px solid #e5e7eb;
  transition: transform 0.3s ease;
  min-width: 300px;
  text-align: center;

  &:hover {
    transform: scale(1.05);
  }
`;

const PlanPrice = styled.p`
  font-size: 20px;
  font-weight: 600;
  color: #2563eb;
`;

const FeatureList = styled.ul`
  margin-top: 16px;
  list-style: none;
  padding: 0;
`;

const FeatureItem = styled.li`
  display: flex;
  align-items: center;
  font-size: 16px;
  color: #374151;
  
  &:before {
    content: "✅";
    margin-right: 8px;
  }
`;

const Button = styled.button`
  width: 100%;
  margin-top: 12px;
  padding: 10px;
  background-color: #3b82f6;
  color: white;
  font-size: 16px;
  font-weight: bold;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.3s ease;

  &:hover {
    background-color: #2563eb;
  }
`;






// Styled Components
const SubscriptionInfo = styled.div`
  margin-top: 20px;
  background: linear-gradient(135deg, #ffffff, #f9fafb); /* Gradient nền nhẹ */
  padding: 24px;
  border-radius: 12px;
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.05); /* Đổ bóng nhẹ */
  border: 1px solid #e5e7eb;
  width: 100%;
  max-width: 500px;
  transition: transform 0.2s ease, box-shadow 0.2s ease;

  &:hover {
    transform: translateY(-2px); /* Hiệu ứng nổi lên khi hover */
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
  }
`;

const PlanTitle = styled.h3`
  font-size: 1.5rem; /* 24px */
  font-weight: 700;
  color: #1f2937; /* Màu xám đậm */
  margin-bottom: 16px;
  display: flex;
  align-items: center;
  gap: 8px;

  &:before {
    content: "📦"; /* Icon gói */
    font-size: 1.2rem;
  }
`;

const InfoItem = styled.p`
  font-size: 1rem; /* 16px */
  color: #4b5563; /* Màu xám trung */
  margin: 8px 0;
  display: flex;
  justify-content: space-between;
  align-items: center;

  b {
    color: #111827; /* Màu đen đậm */
    font-weight: 600;
  }
`;

const NextBilling = styled(InfoItem)`
  color: #047857; /* Màu xanh lá cho ngày thanh toán */
  font-weight: 500;

  b {
    color: #065f46;
  }
`;

const CancelButton = styled.button`
  width: 100%;
  margin-top: 20px;
  padding: 12px;
  background: #ef4444; /* Màu đỏ */
  color: white;
  font-size: 1rem;
  font-weight: 600;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.3s ease, transform 0.2s ease;

  &:hover {
    background: #dc2626; /* Đỏ đậm hơn khi hover */
    transform: scale(1.02); /* Phóng to nhẹ */
  }

  &:active {
    transform: scale(0.98); /* Thu nhỏ khi nhấn */
  }
`;

const LoadingMessage = styled.div`
  font-size: 1.2rem;
  color: #4b5563;
  padding: 20px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
`;

interface Plan {
  id: string;
  name: string;
  price: string;
  features: string[];
}
//==Duc them cai nay , do chay make bi loi=====
interface Link {
  rel: string;
  href: string;
}
function getLimitsByPlanId(planId: string) {
  const plan = plans.find(p => p.id === planId);
  if (!plan) {
    throw new Error(`Plan with ID ${planId} not found`);
  }

  const features = plan.features || [];

  const participantsMatch = features[0]?.match(/(\d+)/);
  const minutesMatch = features[1]?.match(/(\d+)/);

  const maxParticipants = participantsMatch ? parseInt(participantsMatch[1], 10) : 1;
  const maxMinutes = minutesMatch ? parseInt(minutesMatch[1], 10) : 1;

  return { maxParticipants, maxMinutes };
}
const SubscriptionPlans = () => {
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
  const [subscriptionId, setSubscriptionId] = useState("");
  const [subscriptionStatus, setSubscriptionStatus] = useState<string | null>(null);
  const [nextBillingTime, setNextBillingTime] = useState(null);

  const [user, setUser] = useState(() => {
    const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
    return storedUser;
  });
  const [isLoading, setIsLoading] = useState(true);

  const apiUrl = "https://localhost:3000";

  const checkSubscription = async () => {
    if (user?.subscriptionId) {

      try {

        const response = await axios.get(`${BASE_URL}/paypal/subscription-status/${user.subscriptionId}`);
        setSubscriptionStatus(response.data.status);
        setSubscriptionId(user.subscriptionId);

        // Tìm plan tương ứng
        const activePlan = plans.find(plan => plan.id === response.data.plan_id);
        setSelectedPlan(activePlan || null); // Gán activePlan hoặc null nếu không tìm thấy

        setNextBillingTime(response.data.billing_info?.next_billing_time);
      } catch (error) {
        console.error("Lỗi khi kiểm tra subscription:", error);
      }
    }
    setIsLoading(false);
    console.log("respone", selectedPlan);
  };


  // Kiểm tra trạng thái subscription khi component mount
  useEffect(() => {
    console.log("user", user);
    checkSubscription();

  }, [user]);

  // Gọi API tạo Subscription
  const handleCreateSubscription = async (planId: string) => {
    try {
      const response = await axios.post(`${BASE_URL}/paypal/create-subscription`, {
        email: user.email,
        planId
      });
      const { links, id } = response.data;

      setSubscriptionId(id);
      const updatedUser = { ...user, subscriptionId: id };
      localStorage.setItem("user", JSON.stringify(updatedUser));
      setUser(updatedUser);

      const approvalUrl = links.find((link: Link) => link.rel === "approve").href;
      window.open(approvalUrl, "_blank");

      const checkSubscriptionStatus = async () => {
        try {
          const subResponse = await axios.get(`${BASE_URL}/paypal/subscription-status/${id}`);
          if (subResponse.data.status === "ACTIVE") {
            setSubscriptionStatus("ACTIVE");
            setNextBillingTime(subResponse.data.billing_info?.next_billing_time);
            const activePlan = plans.find(plan => plan.id === subResponse.data.plan_id);
            setSelectedPlan(activePlan || null);
            window.location.href = "/";
          }
        } catch (error) {
          console.error("Lỗi khi kiểm tra subscription:", error);
        }
      };

      setTimeout(checkSubscriptionStatus, 5000);
      const { maxParticipants, maxMinutes } = getLimitsByPlanId(planId);
      // Lưu vào localStorage
      localStorage.setItem('maxMeetingMinutes', maxMinutes.toString());
      localStorage.setItem('maxParticipants', maxParticipants.toString());

    } catch (error) {
      console.error("Lỗi khi tạo Subscription:", error);
      alert("Có lỗi xảy ra khi tạo Subscription!");
    }
  };

  // Hủy subscription
  const handleCancelSubscription = async () => {
    if (!subscriptionId) return;

    // Hỏi xác nhận trước khi hủy
    const isConfirmed = window.confirm("Bạn có chắc chắn muốn hủy subscription này không?");
    if (!isConfirmed) return; // Nếu người dùng chọn "Cancel", thoát hàm

    try {
      await axios.post(`${BASE_URL}/paypal/cancel-subscription`, { subscriptionId });
      // Cập nhật trạng thái
      setSubscriptionStatus("CANCELLED");
      setSelectedPlan(null);
      setNextBillingTime(null);
      setSubscriptionId(""); // Xóa subscriptionId trong state

      // Cập nhật localStorage
      const updatedUser = { ...user, subscriptionId: null };
      localStorage.setItem("user", JSON.stringify(updatedUser));
      setUser(updatedUser);

      localStorage.setItem('maxMeetingMinutes', "1");
      localStorage.setItem('maxParticipants', "2");
      alert("Đã hủy subscription thành công!");
    } catch (error) {
      console.error("Lỗi khi hủy subscription:", error);
      alert("Có lỗi khi hủy subscription!");
    }


  };

  if (isLoading) {
    return (
      <Container>
        <LoadingMessage>Đang tải thông tin subscription...</LoadingMessage>
      </Container>
    );
  }
  if (!user?.email) {
    return <Container><InfoItem>Vui lòng đăng nhập để chọn gói đăng ký!</InfoItem>V</Container>;
  }

  return (
    <Container>
      {!subscriptionId ? <h1>Chọn gói đăng ký</h1> : <h1>Thông tin gói</h1>}


      <SubscriptionInfo>
        <PlanTitle>Gói hiện tại: {selectedPlan?.name}</PlanTitle>
        <InfoItem>
          Trạng thái: <b>{subscriptionStatus}</b>
        </InfoItem>
        <InfoItem>
          Subscription ID: <b>{subscriptionId}</b>
        </InfoItem>
        {subscriptionId !== "" && selectedPlan &&
          <>
            {
              selectedPlan.id == plans[0].id ?
                <InfoItem>Nhận được {plans[0].features[1]} && {plans[0].features[0]} </InfoItem>
                : <InfoItem>Nhận được {plans[1].features[1]} && {plans[1].features[0]} </InfoItem>
            }
          </>
        }
        {nextBillingTime && (
          <>
            {selectedPlan && selectedPlan.id == plans[0].id ?
              <InfoItem> Giá: <b>{plans[0].price}$</b></InfoItem>
              : <InfoItem>Giá <b>{plans[1].price}$</b> </InfoItem>}
            <NextBilling>
              Thanh toán tiếp theo: <b>{new Date(nextBillingTime).toLocaleDateString()}</b>
            </NextBilling>
          </>

        )}
        {subscriptionStatus === "ACTIVE" && (
          <CancelButton onClick={handleCancelSubscription}>
            Hủy đăng ký
          </CancelButton>
        )}
      </SubscriptionInfo>
      {!subscriptionId && <Row>
        {plans.map((plan, index) => (
          <PlanCard key={index}>
            <PlanTitle>{plan.name}</PlanTitle>
            <PlanPrice>${plan.price}/tháng</PlanPrice>
            <FeatureList>
              {plan.features.map((feature, i) => (
                <FeatureItem key={i}>{feature}</FeatureItem>
              ))}
            </FeatureList>
            <Button
              onClick={() => handleCreateSubscription(plan.id)}
              disabled={subscriptionStatus === "ACTIVE"}
            >
              {subscriptionStatus === "ACTIVE" ? "Đã đăng ký" : "Chọn gói"}
            </Button>
          </PlanCard>
        ))}
      </Row>}

    </Container>
  );
};


export const plans: Plan[] = [
  { id: "P-4AF6808322310423PM7PLDZA", name: "Basic", price: "5", features: ["2 thành viên tham gia tối đa", "2 phút họp"] },
  { id: "P-9PV332839E283305EM7PZ5OY", name: "Pro", price: "20", features: ["5 thành viên tham gia tối đa", "15 phút họp"] },
];

export default SubscriptionPlans;