import { useState, useContext } from "react";
import { useNavigate,useLocation } from "react-router-dom";
import api from "../api/api";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { AuthContext } from "../components/AuthContext";
import {CartContext} from "../components/CartContext"
import { toast } from "sonner";
import { saveWishlist } from "../api/wishlistapi";
export default function Login() {
  const location = useLocation();
  const saved = JSON.parse(sessionStorage.getItem("postLoginAction"));
  const from = saved?.from || "/";
  const pendingAction = saved?.action;
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);
  const { addToCart } = useContext(CartContext);
  const { fetchCartCount } = useContext(CartContext);
  
  const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    //  LOGIN API
    const res = await api.post("/auth/login", { email, password });
    const { token, role } = res.data;

    //  SAVE AUTH
    localStorage.setItem("token", token);
    localStorage.setItem("role", role);
    login(res.data);

    // EXECUTE PENDING ACTION
    if (pendingAction) {
      if (pendingAction.type === "addToCart") {
        await addToCart(pendingAction.productId, pendingAction.qty || 1);
        await fetchCartCount();
      }

      if (pendingAction.type === "addToWishlist") {
        await saveWishlist([pendingAction.productId]);
        window.dispatchEvent(new Event("wishlistUpdated"));
      }
      sessionStorage.removeItem("postLoginAction");
    }

    toast.success("Login successful!", {
      duration: 1200,
      dismissible: true,
    });
    await fetchCartCount();
    //  RETURN TO PREVIOUS PAGE (MOST IMPORTANT)
    setTimeout(() => {
      if (from && from !== "/login") {
        navigate(from, { replace: true });
      } else if (role === "Admin") {
        navigate("/dashboard/products", { replace: true });
      } else {
        navigate("/", { replace: true });
      }
    }, 600);

  } catch (err) {
    toast.error("❌ Invalid email or password");
  }
};


  return (
    <form onSubmit={handleSubmit} className="auth">
      <h2>Login</h2>

      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <div className="password-field">
        <input
          type={showPassword ? "text" : "password"}
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button
          type="button"
          className="toggle-btn"
          onClick={() => setShowPassword(!showPassword)}
        >
          {showPassword ? <FaEyeSlash /> : <FaEye />}
        </button>
      </div>
      <button className="btn" type="submit">Login</button>

      {/* {error && <p style={{ color: "red" }}>{error}</p>} */}
    </form>
  );
}
