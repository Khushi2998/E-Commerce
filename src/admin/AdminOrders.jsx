import { useEffect, useState } from "react";
import { getAllOrders, updateOrderItemStatus } from "../api/adminapi";

const ITEM_STATUSES = [
  { value: 0, label: "Pending" },
  { value: 1, label: "Placed" },
  { value: 2, label: "Shipped" },
  { value: 3, label: "Out For Delivery" },
  { value: 4, label: "Delivered" },
  { value: 5, label: "Cancelled" },
];

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  // key = `${orderId}-${productId}`, value = selected status
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5; // orders per page
  const [changes, setChanges] = useState({}); 
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    loadOrders();
  }, []);
    const totalPages = Math.ceil(orders.length / pageSize);
    const paginatedOrders = orders.slice(
  (currentPage - 1) * pageSize,
  currentPage * pageSize
);
    const loadOrders = async () => {
    try {
      setLoading(true);
      const res = await getAllOrders();
      setOrders(res.data);
      setCurrentPage(1);
    } catch (err) {
      console.error("Failed to load orders:", err);
    } finally {
      setLoading(false);
    }
  }

  const handleChange = (itemId, value) => {
    setChanges((prev) => ({ ...prev, [itemId]: Number(value) }));
  };
  const handleUpdate = async (itemId) => {
    const status = changes[itemId];
    if (status === undefined) return;

    try {
      await updateOrderItemStatus(itemId, status);
      await loadOrders();
      setChanges((prev) => {
        const copy = { ...prev };
        delete copy[itemId];
        return copy;
      });
    } catch (err) {
      console.error("Failed to update item:", err);
      alert("Failed to update item status");
    }
  };

  return (
    <div className="page">
      <h2>All Orders</h2>
       {loading && <p>Loading orders...</p>}
       {!loading && orders.length === 0 && <p>No orders found.</p>}

      {paginatedOrders.map((order) => (
        <div key={order.orderId} className="admin-order-card">
          {/* ORDER HEADER */}
          <div className="order-header">
            <h3>Order #{order.orderId}</h3>
            <span>{order.customerName}</span>
            <span>₹{order.totalAmount}</span>
            <span>{new Date(order.createdAt).toLocaleString()}</span>
          </div>

          {/* ITEMS TABLE */}
          <div className="table-wrapper">
            <table className="admin-orders-table">
              <thead>
                <tr>
                  <th>Image</th>
                  <th>Product</th>
                  <th>Qty</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {order.items.map((item) => {
                const itemId = item.itemId;
                
                  return (
                    <tr key={itemId}>
                      <td>
                        <img
                       src={item.productImage ? `http://localhost:5253${item.productImage}` : "/placeholder.webp"}
                          alt={item.productName || "Product"}
                          className="product-image"
                          onError={(e) => (e.target.src = "/placeholder.webp")}
                          style={{ width: "50px", height: "50px", objectFit: "cover" }}
                        />
                      </td>
                      <td>{item.productName || "Unknown Product"}</td>
                      <td>{item.quantity}</td>
                      <td>
                        <select
                          value={changes[itemId] ?? item.status ?? 0}
                          onChange={(e) =>
                            handleChange(itemId, e.target.value)
                          }
                          disabled={item.status === 5} // cancelled = locked
                        >
                          {ITEM_STATUSES.map((s) => (
                            <option key={s.value} value={s.value}>
                              {s.label}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td>
                        <button
                          className="update-btn"
                          disabled={changes[itemId] === undefined || item.status === 5}
                          onClick={() => handleUpdate(itemId)}
                        >
                          Update
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

          </div>
 
        </div>
        
      ))}
                           {orders.length > pageSize && (
  <div className="pagination">
    <button
      disabled={currentPage === 1}
      onClick={() => setCurrentPage(p => p - 1)}
    >
      Prev
    </button>

    <span>
      Page {currentPage} of {totalPages}
    </span>

    <button
      disabled={currentPage === totalPages}
      onClick={() => setCurrentPage(p => p + 1)}
    >
      Next
    </button>
  </div>
)}
    </div>
  );
}


