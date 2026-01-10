import { Navigate } from "react-router-dom";
import { isAdmin, isLoggedIn } from "./auth";

export default function ProtectedRoute({ children, adminOnly }) {
  if (!isLoggedIn()) return <Navigate to="/login" />;

  if (adminOnly && !isAdmin())
    return <Navigate to="/unauthorized" />;

  return children;
}
