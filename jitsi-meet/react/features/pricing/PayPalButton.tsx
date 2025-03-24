import React, { useState } from "react";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import axios from "axios";
import * as dotenv from 'dotenv';




const PayPalButton = () => {
    const _clientId = process.env.PAYPAL_CLIENT_ID;

    const [orderId, setOrderId] = useState("");

    const createOrder = async () => {
        try {
            const response = await axios.post("http://localhost:3000/paypal/create-order", {
                amount: "9.99", // Giá gói subscription
            });
            setOrderId(response.data.id);
            return response.data.id;
        } catch (error) {
            console.error("Error creating order", error);
        }
    };

    const captureOrder = async (data: any) => {
        try {
            const response = await axios.post(`http://localhost:3000/paypal/capture-order/${data.orderID}`);
            alert("Thanh toán thành công!");
        } catch (error) {
            console.error("Error capturing order", error);
        }
    };

    return (
        <PayPalScriptProvider options={{ clientId: _clientId?.toString() || "" }}>

            <PayPalButtons
                createOrder={createOrder}
                onApprove={captureOrder}
            />
        </PayPalScriptProvider>
    );
};

export default PayPalButton;
