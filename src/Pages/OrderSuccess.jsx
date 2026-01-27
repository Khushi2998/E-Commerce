import { Link,useParams,useNavigate } from "react-router-dom";

const OrderSuccess = () => {
  const navigate=useNavigate();
    const { id } = useParams();
  return (
    <div className="page">
      <h2> Order Placed Successfully! </h2>
      <p>Your order number is <b>#{id}</b></p>
      <button
        className="btn"
        onClick={() => navigate(`/invoice/${id}`)}
      >
        View Invoice
      </button>

      <Link to="/orders">Go to My Orders</Link>
    </div>
  );
};

export default OrderSuccess;
