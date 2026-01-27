import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { AuthContext } from "../components/AuthContext";
import { syncWishlist } from "../admin/syncWishlist";
import { toast } from "sonner";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword,setShowPassword]=useState(false);
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);
 
  const handleSubmit = async (e) => {
    e.preventDefault();
    

    try {
      const res = await api.post("/auth/login", {
        email,
        password,
      });

      const { token, role } = res.data;

      // Save everything
      localStorage.setItem("token", token);
      localStorage.setItem("role", role);

      login(res.data); // context
      await syncWishlist();

      toast.success("Login successful!");

      // Role-based redirect
       setTimeout(() => {
        if (role === "Admin") {
          navigate("/dashboard/products");
        } else {
          navigate("/");
        }
      }, 1000);

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
    {showPassword ? <FaEyeSlash/> : <FaEye/>}
  </button>
      </div>
      <button type="submit">Login</button>

      {/* {error && <p style={{ color: "red" }}>{error}</p>} */}
    </form>
  );
}
