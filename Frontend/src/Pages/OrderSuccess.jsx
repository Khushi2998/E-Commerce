
import { Link, useParams, useNavigate,useLocation } from "react-router-dom";

const OrderSuccess = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();
  const paymentMethod = location.state?.paymentMethod || "COD";
  return (
    <div className="order-success-page">
      <div className="success-card">

        {/* ICON */}
        <div className="success-icon">✓</div>

        <h2>Order Placed Successfully!</h2>

        <p className="order-id">
          Your order number is <b>#{id}</b>
        </p>

        <p className="success-msg">
          Thank you for shopping with us. We’ll notify you once your order is shipped.
        </p>

        <div className="success-actions">
          {paymentMethod !== "COD" && (<button className="primary-btn" onClick={() => navigate(`/invoice/${id}`)}>View Invoice</button>)}
          
          <Link to="/orders" className="secondary-link">
            Go to My Orders
          </Link>
        </div>

      </div>
    </div>
  );
};

export default OrderSuccess;

