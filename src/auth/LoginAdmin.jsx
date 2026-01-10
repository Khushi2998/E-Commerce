// src/auth/LoginAdmin.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const LoginAdmin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await axios.post("https://localhost:7248/api/auth/login", {
        email,
        password,
      });

      const { token, userId, name, email: userEmail } = res.data;

      // Save token and user info
      localStorage.setItem("token", token);
      localStorage.setItem("userId", userId);
      localStorage.setItem("userName", name);
      localStorage.setItem("userEmail", userEmail);

      // Determine role from token (decode if needed) or from backend response
      // Here, assuming backend sends role in token claims
      const payload = JSON.parse(atob(token.split(".")[1]));
      const role = payload.role;

      localStorage.setItem("role", role);

      if (role === "admin") {
        navigate("/admin"); // Admin panel
      } else {
        navigate("/dashboard"); // Customer dashboard
      }
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.message || "Invalid email or password"
      );
    }
  };

  return (
    <div className="login-container">
      <h2>Admin Login</h2>
      <form onSubmit={handleSubmit} className="login-form">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Login</button>
      </form>
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
};

export default LoginAdmin;
