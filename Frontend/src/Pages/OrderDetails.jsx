import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api, { getOrderDetails } from "../api/api";
import { toast } from "sonner";

const ITEM_STEPS = [
  "Pending",
  "Placed",
  "Shipped",
  "Out For Delivery",
  "Delivered"
];

/* =========================
   ITEM STEPPER (PER PRODUCT)
========================= */
const ItemStepper = ({ status }) => {
  if (status === "Cancelled") {
    return (
      <div className="stepper cancelled">
        <span className="cancelled-label">❌ Item Cancelled</span>
      </div>
    );
  }

  const currentIndex = ITEM_STEPS.indexOf(status);

  return (
    <div className="stepper">
      {ITEM_STEPS.map((step, index) => {
        const isCompleted = index < currentIndex;
        const isActive = index === currentIndex;

        return (
          <div key={step} className="step-wrapper">
            {index !== 0 && (
              <div
                className={`step-line ${
                  index <= currentIndex ? "completed" : ""
                }`}
              />
            )}

            <div
              className={`step-circle 
                ${isCompleted ? "completed" : ""} 
                ${isActive ? "active" : ""}`}
            >
              {isCompleted ? "✓" : ""}
            </div>

            <span
              className={`step-label 
                ${isCompleted ? "completed" : ""} 
                ${isActive ? "active" : ""}`}
            >
              {step}
            </span>
          </div>
        );
      })}
    </div>
  );
};

/* =========================
   MAIN PAGE
========================= */
export default function OrderDetails() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loadingItemId, setLoadingItemId] = useState(null);

  useEffect(() => {
    fetchOrder();
  }, [id]);

  const fetchOrder = async () => {
    const res = await getOrderDetails(id);
    setOrder(res.data);
  };

  const cancelItem = async (itemId) => {
  toast.warning("Cancel this item?", {
    description: "This action cannot be undone.",
    action: {
      label: "Yes, cancel",
      onClick: async () => {
        setLoadingItemId(itemId);

        try {
          await api.post(`/orders/items/${itemId}/cancel`);
          toast.success("Item cancelled successfully");
          await fetchOrder();
        } catch {
          toast.error("Unable to cancel item");
        } finally {
          setLoadingItemId(null);
        }
      }
    },
    cancel: {
      label: "No"
    }
  });
};


  if (!order) return <p className="loading">Loading order…</p>;

  const isPrepaid = order.paymentMethod !== "COD";

  return (
    <div className="order-page">

      {/* HEADER */}
      <div className="order-header">
        <h2>Order #{order.id}</h2>
        <span className={`badge payment ${order.paymentMethod.toLowerCase()}`}>
  {order.paymentMethod}
</span>
      </div>

      {/* META */}
      <div className="order-meta">
        <p><b>Total:</b> ₹{order.totalAmount}</p>
        <p><b>Placed:</b> {new Date(order.createdAt).toLocaleString()}</p>
      </div>

      {/* ADDRESS */}
      <div className="card">
        <h4>Shipping Address</h4>
        <p>{order.shippingAddress}</p>
      </div>

      {/* ITEMS */}
      <h3 className="section-title">Items</h3>

      <div className="order-items-details">
        {order.items.map(item => (
          <div key={item.itemId} className="item-card">

            <img
              src={`http://localhost:5253${item.image}`}
              alt={item.name}
              onError={(e) => (e.target.src = "/placeholder.webp")}
            />

            <div className="item-info">
              <div className="item-top">
                <h4>{item.name}</h4>

                {/* STATUS BADGES */}
                {item.status === "Cancelled" && isPrepaid && (
                  <span className="badge refund initiated">
                    Refund Initiated (UPI)
                  </span>
                )}

                {item.status === "Cancelled" && !isPrepaid && (
                  <span className="badge neutral">
                    Cancelled (No refund)
                  </span>
                )}

                {item.status === "Delivered" && (
                  <span className="badge success">Delivered</span>
                )}
              </div>

              <p>Qty: {item.quantity}</p>
              <p className="price">₹{item.price}</p>

              {/* PER-ITEM STEPPER */}
              <ItemStepper status={item.status} />

              {/* ACTION */}
              {(item.status === "Pending" || item.status === "Placed") && (
                <button
                  className="btn danger"
                  disabled={loadingItemId === item.itemId}
                  onClick={() => cancelItem(item.itemId)}
                >
                  {loadingItemId === item.itemId
                    ? "Cancelling..."
                    : "Cancel Item"}
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}