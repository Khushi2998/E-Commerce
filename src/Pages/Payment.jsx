import React, { useState } from "react";
import axios from "axios";

const CheckoutPage = () => {
  const [amount, setAmount] = useState(); // Example amount

  const handlePayment = async () => {
    try {
      // 1️⃣ Create order on backend
      const orderRes = await axios.post("https://localhost:7248/api/payment/create-order", {
        amount: amount
      });

      const { id, amount: orderAmount, currency } = orderRes.data;

      // 2️⃣ Open Razorpay checkout
      const options = {
        key: "YOUR_KEY_ID", // Razorpay test key
        amount: orderAmount, // in paise
        currency: currency,
        name: "My Store",
        description: "Test Transaction",
        order_id: id, // from backend
        handler: async function (response) {
          // 3️⃣ Verify payment on backend
          const verifyRes = await axios.post("https://localhost:7248/api/payment/verify-payment", {
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature
          });

          if (verifyRes.data.status === "success") {
            alert("Payment Successful!");
            // TODO: Update your order status in database here
          } else {
            alert("Payment Verification Failed!");
          }
        },
        theme: { color: "#3399cc" }
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error(err);
      alert("Payment failed!");
    }
  };

  return (
    <div>
      <h2>Checkout</h2>
      <p>Amount: ₹{amount}</p>
      <button onClick={handlePayment}>Pay Now</button>
    </div>
  );
};

export default CheckoutPage;
