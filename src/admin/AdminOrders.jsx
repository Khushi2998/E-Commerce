import { useEffect, useState } from "react";
import { getAllOrders, updateOrderStatus } from "../api/adminapi";

const ORDER_STATUSES = [
  { value: 0, label: "Pending" },
  { value: 1, label: "Placed" },
  { value: 2, label: "Shipped" },
  { value: 3, label: "Out For Delivery" },
  { value: 4, label: "Delivered" },
  { value: 5, label: "Cancelled" }
];

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    getAllOrders().then(res => {
      console.log("ORDERS:", res.data);
      setOrders(res.data);
    });
  }, []);

  const changeStatus = (orderId, status) => {
    updateOrderStatus(orderId, status).then(() => {
      getAllOrders().then(res => setOrders(res.data));
    });
  };

  return (
    <div className="page">
      <h2>All Orders</h2>

      <div className="admin-orders-card">
  <table className="admin-orders-table">

        <thead>
          <tr>
            <th>Order</th>
            <th>Customer</th>
            {/* <th>Email</th> */}
            <th>Amount</th>
            <th>Status</th>
          </tr>
        </thead>

        <tbody>
          {orders.map(o => (
            <tr key={o.orderId}>
              <td>#{o.orderId}</td>
              <td>{o.customerName}</td>
              {/* <td>{o.customerEmail}</td> */}
              <td>₹{o.totalAmount}</td>
              {/* <td>₹{o.createdAt}</td> */}
              <td>
                <select
                  value={o.status}
                  onChange={e =>
                    changeStatus(o.orderId, Number(e.target.value))
                  }
                >
                  {ORDER_STATUSES.map(s => (
                    <option key={s.value} value={s.value}>
                      {s.label}
                    </option>
                  ))}
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      </div>
    </div>
  );
}
