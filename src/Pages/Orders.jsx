import { useEffect, useState } from "react";
import { getMyOrders } from "../api/orderApi";
import { useNavigate } from "react-router-dom";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    getMyOrders()
      .then(res => setOrders(res.data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div className="page">
      <h2>My Orders</h2>

      {orders.length === 0 && <p>No orders found</p>}

      {orders.map(order => (
        <div key={order.id} className="order-card">
          <h4>Order #{order.id}</h4>
          <p>
            <b>Date:</b>{" "}
            {new Date(order.createdAt).toLocaleDateString()}
          </p>
          <p><b>Total:</b> ₹{order.totalAmount}</p>
          <p><b>Status:</b>{order.status}</p>
          <button onClick={() => navigate(`/orders/${order.id}`)}>
             Track Order
          </button>
          <hr />
          <div className="order-items">
          {order.items?.map((item, index) => (
            <div key={index} className="order-item">
              {item.name} × {item.quantity} (₹{item.price})
            </div>
         
          ))}
           </div>
        </div>
      ))}
    </div>
  );
};

export default Orders;

