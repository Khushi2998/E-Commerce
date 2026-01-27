import axios from "axios";

const api = axios.create({
  baseURL: "https://localhost:7248/api",
});


api.interceptors.request.use(config => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});


api.interceptors.response.use(
  res => res,
  err => {
    if (err.response?.status === 401) {
      localStorage.clear();
      window.location.href = "/login"; 
    }
    return Promise.reject(err);
  }
);

export const getMyOrders = () =>
  api.get("/my/orders");

export const getOrderDetails = (orderId) =>
  api.get(`/orders/${orderId}`);

// ADMIN
export const getAllOrders = () =>
  api.get("/admin/orders");

export const updateOrderStatus = (orderId, status) =>
  api.put(`/admin/orders/${orderId}/status`, 
   {status: status});

// export const getOrderDetails = (orderId) =>
//   axios.get(`/orders/${orderId}`);

 export default api;

