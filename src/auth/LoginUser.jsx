import {useContext, useState } from "react";
import api from "../api/api"; // axios instance
import { useNavigate } from "react-router-dom";
import {AuthContext} from "../components/AuthContext";

export default function LoginUser() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const {login}=useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await api.post("/auth/login", {
        email,
        password,
      });
      
      // save token
      console.log("LOGIN RESPONSE:",res.data);
      login(res.data);
      localStorage.setItem("token", res.data.token);
      console.log("AFTER LOGIN,user set")
      localStorage.setItem("role", "Customer");

      navigate("/");
    } catch (err) {
      console.error(err);
      alert("Invalid email or password");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="auth">
      <h2>User Login</h2>

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
  );
}
