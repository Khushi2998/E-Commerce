import { useEffect, useState } from "react";
import { getMyOrders } from "../api/orderApi";
import { useNavigate } from "react-router-dom";
import image2 from "../../public/image2.png";
const Orders = () => {
  const [orders, setOrders] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    getMyOrders()
      .then(res => setOrders(res.data))
      .catch(console.error);
  }, []);

  return (
    <div className="orders-page">
      <h2>My Orders</h2>

      {orders.length === 0 &&(<img src={image2} alt="No orders found" className="empty-state" />
)}

      {orders.map(order => (
        <div key={order.id} className="order-card">

          {/* LEFT SIDE */}
       <div className="order-left">
  <h4 className="order-id">Order #{order.id}</h4>

  <div className="order-items">
    {order.items?.map((item, index) => (
      <div key={index} className="order-item">

        <img
          src={`http://localhost:5253${item.image}`}
          alt={item.name}
          onError={(e) => (e.target.src = "/placeholder.webp")}
        />

        <div className="item-info">
          <p className="item-name">{item.name}</p>
          <p className="item-qty">Qty: {item.quantity}</p>
         
        </div>

        <div className="item-price">
          ₹{item.price}
        </div>

      </div>
    ))}
  </div>
</div>


          {/* RIGHT SIDE */}
          <div className="order-right">
            <p className="order-date">
              {new Date(order.createdAt).toLocaleDateString()}
            </p>

            <p className="order-total">₹{order.totalAmount}</p>

           
            <span className={`payment-status ${order.paymentStatus?.toLowerCase()}`}>
              Payment: {order.paymentMethod || "Pending"}
            </span>

            <button
              className="track-btn"
              onClick={() => navigate(`/orders/${order.id}`)}
            >
              Track Order
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Orders;
