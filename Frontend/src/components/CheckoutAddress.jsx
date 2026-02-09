import { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api";
import { CartContext } from "./CartContext";
import { toast } from "sonner";

const CheckoutAddress = () => {
  const navigate = useNavigate();
  const { fetchCartCount } = useContext(CartContext);

  const [addresses, setAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState("COD");

  const [newAddress, setNewAddress] = useState({
    label: "Home",
    Fullname:"",
    StreetAddress: "",
    City: "",
    State: "",
    Pincode: "",
    isDefault: false
  });

  /* ================= FETCH ADDRESSES ================= */
  useEffect(() => {
    fetchAddresses();
  }, []);

  const fetchAddresses = async () => {
    try {
      const res = await api.get("/address");
      setAddresses(res.data);

      const def = res.data.find(a => a.isDefault);
      if (def) setSelectedAddressId(def.id);
    } catch {
      toast.error("Failed to load addresses");
    }
  };

  /* ================= ADD NEW ADDRESS ================= */
  const handleAddAddress = async () => {
    const { StreetAddress, City, State, Pincode } = newAddress;

    if (!StreetAddress || !City || !State || !Pincode) {
      toast.error("Fill all address fields");
      return;
    }

    try {
      await api.post("/address", newAddress);
      toast.success("Address saved");
      setNewAddress({
        label: "Home",
        StreetAddress: "",
        City: "",
        State: "",
        Pincode: "",
        isDefault: false
      });
      fetchAddresses();
    } catch {
      toast.error("Failed to save address");
    }
  };

  /* ================= CHECKOUT ================= */
  const handleCheckout = async () => {
    if (!selectedAddressId) {
      toast.error("Please select an address");
      return;
    }

    try {
      const res = await api.post("/checkout", {
        addressId: selectedAddressId,
        paymentMethod
      });

      const { orderId } = res.data;

      await fetchCartCount();
      navigate(`/order-success/${orderId}`, { state: { paymentMethod } });
    } catch {
      toast.error("Checkout failed");
    }
  };

  return (
    <div className="checkout-container">
      <h2>Delivery Address</h2>

      {/* ================= ADDRESS LIST ================= */}
      {addresses.map(addr => (
  <label key={addr.id} className="checkout-address-card">
    <input
      type="radio"
      name="address"
      checked={selectedAddressId === addr.id}
      onChange={() => setSelectedAddressId(addr.id)}
    />

    <div className="checkout-address-content">
      <div className="checkout-address-header">
        <strong>{addr.label}</strong>
        {addr.isDefault && (
          <span className="checkout-default-badge">Default</span>
        )}
      </div>

      <p>{addr.streetAddress}</p>
      <p>
        {addr.city}, {addr.state} – {addr.pincode}
      </p>
    </div>
  </label>
))}


      {/* ================= ADD NEW ADDRESS ================= */}
      <h3>Add New Address</h3>

      <input
        placeholder="Street Address"
        value={newAddress.StreetAddress}
        onChange={e => setNewAddress({ ...newAddress, StreetAddress: e.target.value })}
      />
      <input
        placeholder="City"
        value={newAddress.City}
        onChange={e => setNewAddress({ ...newAddress, City: e.target.value })}
      />
      <input
        placeholder="State"
        value={newAddress.State}
        onChange={e => setNewAddress({ ...newAddress, State: e.target.value })}
      />
      <input
        placeholder="Pincode"
        value={newAddress.Pincode}
        onChange={e => setNewAddress({ ...newAddress, Pincode: e.target.value })}
      />

      <label>
        <input
          type="checkbox"
          checked={newAddress.isDefault}
          onChange={e => setNewAddress({ ...newAddress, isDefault: e.target.checked })}
        />
        Make this default
      </label>

      <button onClick={handleAddAddress}>Save Address</button>

      {/* ================= PAYMENT ================= */}
      <h3>Payment Method</h3>

      <label>
        <input
          type="radio"
          checked={paymentMethod === "COD"}
          onChange={() => setPaymentMethod("COD")}
        />
        Cash on Delivery
      </label>

      <label>
        <input
          type="radio"
          checked={paymentMethod === "UPI"}
          onChange={() => setPaymentMethod("UPI")}
        />
        UPI / Online
      </label>

      <button className="primary-btn" onClick={handleCheckout}>
        Place Order
      </button>
    </div>
  );
};

export default CheckoutAddress;
