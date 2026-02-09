import { useEffect, useState } from "react";
import { getMyOrders } from "../api/api";
import { useNavigate } from "react-router-dom";
import image2 from "../../public/image2.png";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [page, setPage] = useState(1);
  const [totalOrders, setTotalOrders] = useState(0);
  const [loading, setLoading] = useState(false);

  const pageSize = 5;
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    setOrders([]); 

    getMyOrders(page, pageSize)
      .then(res => {
        setOrders(res.data.orders);
        setTotalOrders(res.data.totalOrders);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [page]);

  const totalPages = Math.ceil(totalOrders / pageSize);

  return (
    <div className="orders-page">
      <h2>My Orders</h2>

      {loading && <p>Loading orders...</p>}

      {!loading && orders.length === 0 && (
        <img
          src={image2}
          alt="No orders found"
          className="empty-state"
        />
      )}

      {orders.map(order => (
        <div key={order.id} className="order-card">
          <div className="order-left">
            <h4>Order #{order.id}</h4>
           <div className="order-items">
            {order.items.map((item, index) => (
              <div key={index} className="order-item">
                <img
                  src={`http://localhost:5253${item.image}`}
                  alt={item.name}
                  onError={e => e.target.src = "/placeholder.webp"}
                />

                <div>
                  <p>{item.name}</p>
                  <p>Qty: {item.quantity}</p>
                </div>

                <p>₹{item.price}</p>
              </div>
            ))}
          </div>
        </div>
          <div className="order-right">
            <p>{new Date(order.createdAt).toLocaleDateString()}</p>
            <p>₹{order.totalAmount}</p>

            <button className="track-btn" onClick={() => navigate(`/orders/${order.id}`)}>
              Track Order
            </button>
          </div>
        </div>
      ))}

      {/* PAGINATION */}
      {totalPages > 1 && (
        <div className="pagination">
          <button
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
          >
            Prev
          </button>

          <span>
            Page {page} of {totalPages}
          </span>

          <button
            disabled={page === totalPages}
            onClick={() => setPage(page + 1)}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default Orders;
