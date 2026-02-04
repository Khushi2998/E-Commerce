import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api";
import { CartContext } from "./CartContext";
import { AuthContext } from "./AuthContext";
import { toast } from "sonner";

const CheckoutAddress = () => {
  const navigate = useNavigate();
  const { fetchCartCount } = useContext(CartContext);
  const { user } = useContext(AuthContext);

  // Extract saved address from user profile if available
  const savedAddress = user
    ? {
        FullName: user.name || "",
        Phone: user.contact || "",
        AddressLine: user.address || "",
        City: user.city || "",
        State: user.state || "",
        Pincode: user.pincode || "",
        PaymentMethod: user.PaymentMethod || "COD",
      }
    : null;

  const [useSaved, setUseSaved] = useState(!!savedAddress);

  // Form state always uses 'address' for current input
  const [address, setAddress] = useState(
    savedAddress || {
      FullName: "",
      Phone: "",
      AddressLine: "",
      City: "",
      State: "",
      Pincode: "",
      PaymentMethod: "COD",
    }
  );

  // When toggling "use saved address", populate form from saved address
  useEffect(() => {
    if (useSaved && savedAddress) {
      setAddress({ ...savedAddress });
    } else if (!useSaved) {
      setAddress({
        FullName: "",
        Phone: "",
        AddressLine: "",
        City: "",
        State: "",
        Pincode: "",
        PaymentMethod: "COD",
      });
    }
  }, [useSaved]);

  // Handle form changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setAddress((prev) => ({ ...prev, [name]: value }));
  };

  // Validation
  const validateAddress = (addr) => {
    const { FullName, Phone, AddressLine, City, State, Pincode } = addr;
    if (!FullName || !Phone || !AddressLine || !City || !State || !Pincode) {
      toast.error("Please fill all required fields");
      return false;
    }
    if (!/^\d{10}$/.test(Phone)) {
      toast.error("Phone number must be 10 digits");
      return false;
    }
    if (!/^\d{6}$/.test(Pincode)) {
      toast.error("Pincode must be 6 digits");
      return false;
    }
    return true;
  };

  // Checkout handler
  const handleCheckout = async () => {
    try {
      if (!validateAddress(address)) return;

      const res = await api.post("/checkout", address);
      const { orderId } = res.data;
      if (!orderId) throw new Error("Order ID missing");

      // COD flow
      if (address.PaymentMethod === "COD") {
        await fetchCartCount();
        navigate(`/order-success/${orderId}`);
        return;
      }

      // Online payment (Razorpay)
      const paymentRes = await api.post("/payment/create-order", { orderId });
      const options = {
        key: "rzp_test_S6QkTjrryLsY7X",
        amount: paymentRes.data.amount * 100,
        currency: "INR",
        order_id: paymentRes.data.razorpayOrderId,
        name: "Infinity Store",
        description: "Order Payment",
        handler: async (response) => {
          try {
            await api.post("/payment/verify-payment", {
              orderId,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });
            await fetchCartCount();
            navigate(`/order-success/${orderId}`);
          } catch {
            toast.error("Payment verification failed");
          }
        },
      };
      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error(err);
      toast.error("Checkout failed");
    }
  };

  return (
    <div className="checkout-container">
      <h2 className="checkout-title">Delivery Address</h2>

      {/* Toggle saved/new */}
      {savedAddress && (
        <label className="saved-toggle" style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <input
            type="checkbox"
            checked={useSaved}
            onChange={() => setUseSaved(!useSaved)}
          />
          <span>Use saved address</span>
        </label>
      )}

      {/* Address form */}
      <div className="address-card">
        <div className="form-group">
          <label>Full Name *</label>
          <input name="FullName" value={address.FullName} onChange={handleChange} />
        </div>
        <div className="form-group">
          <label>Phone *</label>
          <input name="Phone" value={address.Phone} onChange={handleChange} />
        </div>
        <div className="form-group">
          <label>Street Address *</label>
          <textarea name="AddressLine" value={address.AddressLine} onChange={handleChange} />
        </div>
        <div className="grid-2">
          <div className="form-group">
            <label>City *</label>
            <input name="City" value={address.City} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label>State *</label>
            <input name="State" value={address.State} onChange={handleChange} />
          </div>
        </div>
        <div className="form-group">
          <label>Pincode *</label>
          <input name="Pincode" value={address.Pincode} onChange={handleChange} />
        </div>
      </div>

      {/* Payment */}
      <h3>Payment Method</h3>
      <div className="payment-options">
        <label className="payment-option">
          <input
            type="radio"
            name="PaymentMethod"
            value="COD"
            checked={address.PaymentMethod === "COD"}
            onChange={handleChange}
          />
          Cash on Delivery
        </label>
        <label className="payment-option">
          <input
            type="radio"
            name="PaymentMethod"
            value="UPI"
            checked={address.PaymentMethod === "UPI"}
            onChange={handleChange}
          />
          UPI / Online Payment
        </label>
      </div>

      <button className="primary-btn" onClick={handleCheckout}>
        Place Order
      </button>
    </div>
  );
};

export default CheckoutAddress;