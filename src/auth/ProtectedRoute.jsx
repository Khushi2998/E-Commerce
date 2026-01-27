import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children, adminOnly = false }) {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role"); // "Admin" / "Customer"

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (adminOnly && role !== "Admin") {
    return <Navigate to="/" replace />;
  }

  return children;
}

