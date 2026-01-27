import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api";

const CheckoutAddress = () => {
  const navigate = useNavigate();

  const [address, setAddress] = useState({
    FullName: "",
    Phone: "",
    AddressLine: "",
    City: "",
    State: "",
    Pincode: "",
    PaymentMethod: "COD"
  });

  const handleChange = (e) => {
    setAddress({ ...address, [e.target.name]: e.target.value });
  };

  const handleCheckout = async () => {
    try {
      //  Create order in DB
      const res = await api.post("/checkout", address);
      const { orderId, amount } = res.data;

      if (!orderId) throw new Error("Order ID missing");

      //  COD FLOW
      if (address.PaymentMethod === "COD") {
        navigate(`/order-success/${orderId}`);
        return;
      }

      //  Create Razorpay order
      const paymentRes = await api.post("/payment/create-order", {
        orderId
      });

      const options = {
        key: "rzp_test_S6QkTjrryLsY7X",
        amount: paymentRes.data.amount * 100, // rupees → paise
        currency: "INR",
        order_id: paymentRes.data.razorpayOrderId,
        name: "Infinity Store",
        description: "Order Payment",

        handler: async function (response) {
          try {
            console.log("Razorpay response:", response);
    await api.post("/payment/verify-payment", {
        orderId:orderId,
       razorpay_order_id: response.razorpay_order_id,
    razorpay_payment_id: response.razorpay_payment_id,
    razorpay_signature: response.razorpay_signature
            });

            // Success redirect
            navigate(`/order-success/${orderId}`);
          } catch {
            alert("Payment verification failed");
          }
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.open();

    } catch (err) {
      console.error(err);
      alert("Checkout failed");
    }
  };

  return (
    <div className="checkout">
      <h2>Delivery Address</h2>

      <input name="FullName" placeholder="Full Name" onChange={handleChange} />
      <input name="Phone" placeholder="Phone" onChange={handleChange} />
      <input name="AddressLine" placeholder="Address" onChange={handleChange} />
      <input name="City" placeholder="City" onChange={handleChange} />
      <input name="State" placeholder="State" onChange={handleChange} />
      <input name="Pincode" placeholder="Pincode" onChange={handleChange} />

      <h3>Payment Method</h3>

      <label>
        <input type="radio" name="PaymentMethod" value="COD"
          checked={address.PaymentMethod === "COD"} onChange={handleChange} />
        Cash on Delivery
      </label>

      <label>
        <input type="radio" name="PaymentMethod" value="UPI"
          checked={address.PaymentMethod === "UPI"} onChange={handleChange} />
        UPI / Online Payment
      </label>

      <button onClick={handleCheckout}>Place Order</button>
    </div>
  );
};

export default CheckoutAddress;
