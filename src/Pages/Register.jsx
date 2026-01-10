import { useState } from "react";
import axios from "axios";
import {NavLink} from 'react-router-dom'

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
    email: ""
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await API.post("/register", formData);
      alert(res.data); 
      setFormData({
        name: "",
        contact: "",
        email: ""
      }); 
    } catch (err) {
   
      const message = err.response?.data || err.message;
      alert("Registration failed: " + message);
      console.error("Registration error:", message);
    }
  };

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

          <button type="submit">Register</button>
        </form>
        <NavLink to="/login">Already Registered?</NavLink>
      </div>
      
    </div>
  );
};

export default Register;
