import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getOrderDetails } from "../api/api";

export default function OrderDetails() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const steps = [
  "Pending",
  "Placed",
  "Shipped",
  "Out For Delivery",
  "Delivered"
];
  useEffect(() => {
    getOrderDetails(id).then(res => setOrder(res.data));
  }, [id]);

  if (!order) return <p>Loading...</p>;

  return (
    <div className="page">
      <h2>Order #{order.id}</h2>

      <p><b>Status:</b> {order.status}</p>
      <p><b>Total:</b> ₹{order.totalAmount}</p>
      <p><b>Placed:</b> {new Date(order.createdAt).toLocaleString()}</p>

      <h4>Shipping Address:</h4>
      <p>{order.shippingAddress}</p>

      {/* <StatusTimeline status={order.status} /> */}
      <div className="stepper">
        <div className="stepper-line">
    <div
      className="stepper-line-progress"
      style={{
        width: `${(steps.indexOf(order.status) / (steps.length - 1)) * 100}%`
      }}
    />
  </div>
  {steps.map((step, index) => {
   const currentIndex = steps.indexOf(order.status);
  const isCompleted = index < currentIndex;
  const isActive = index === currentIndex;

    return (
      <div key={index} className="step-wrapper">

        {/* CIRCLE */}
        <div
          className={`step-circle 
            ${isCompleted ? "completed" : ""} 
            ${isActive ? "active" : ""}`}
        >
          {isCompleted ? "✓" : ""}
        </div>
        
      {/* CONNECTOR LINE */}
        {index !== 0 && (
          <div
            className={`step-line 
              ${index <= currentIndex ? "completed" : ""}`}
          />
        )}
        {/* LABEL */}
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
    </div>
  );
}

const STATUS_STEPS = [
  "Pending",
  "Placed",
  "Shipped",
  "OutForDelivery",
  "Delivered"
];

const StatusTimeline = ({ status }) => {
  const currentIndex = STATUS_STEPS.indexOf(status);

  return (
    <ul className="timeline">
      {STATUS_STEPS.map((step,index) => (
        <li
          key={step}
          className={index <= currentIndex ? "done" : ""}
        >
          {step.replace(/([A-Z])/g, " $1")}
        </li>
      ))}
    </ul>
  );
};
