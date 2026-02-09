import { useState } from "react";
import axios from "axios";
import { useNavigate,NavLink } from "react-router-dom";
import { toast } from "sonner";

const API = axios.create({
  baseURL: "https://localhost:7248/api/auth",
  headers: {
    "Content-Type": "application/json",
  },
});

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    contact: "",
    email: "",
  });
 const navigate = useNavigate();
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await API.post("/register", formData);

      toast.success("🎉 Registration successful! Check your email.");
      
      setFormData({
        name: "",
        contact: "",
        email: "",
      });
     setTimeout(() => {
    navigate("/login");
  }, 1500);

    } catch (err) 
{    const status = err.response?.status;
  const message = err.response?.data?.message;
      if (status === 409) {
    toast.error(`📧 ${message || "Email already registered"}`);
  } else {
    toast.error(message || "❌ Registration failed. Try again");
  }
}};

  return (
    <div className="register-container">
      <div className="register-card">
        <h2>Create Account</h2>

        <form onSubmit={handleSubmit}>
          <input
            name="name"
            type="text"
            placeholder="Full Name"
            value={formData.name}
            onChange={handleChange}
            required
          />

          <input
            name="contact"
            type="text"
            placeholder="Contact"
            value={formData.contact}
            onChange={handleChange}
          />

          <input
            name="email"
            type="email"
            placeholder="Email Address"
            value={formData.email}
            onChange={handleChange}
            required
          />

          <button className="register-btn" type="submit">Register</button>
        </form>

        <NavLink to="/login">Already Registered?</NavLink>
      </div>
    </div>
  );
};

export default Register;
