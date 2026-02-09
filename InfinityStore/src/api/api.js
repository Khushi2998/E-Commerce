import axios from "axios";

const api = axios.create({
  baseURL: "https://localhost:7248/api",
});


api.interceptors.request.use(config => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  console.log("REQ:", config.url, config.params);
  return config;
},
  (error) => Promise.reject(error));


api.interceptors.response.use(
  res => res,
  err => {
    if (err.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");

     
    }
    return Promise.reject(err);
  }
);

// export const getMyOrders = (page=1,pageSize=5) =>
//   {return api.get(`/my/orders?page=${page}&pageSize=${pageSize}`);
//   };
export const getMyOrders = (page, pageSize) => {
  return api.get(`/my/orders?page=${page}&pageSize=${pageSize}`);
};


export const getOrderDetails = (orderId) =>
  api.get(`/orders/${orderId}`);

// ADMIN
export const getAllOrders = () =>
  api.get("/admin/orders");

export const updateOrderStatus = (orderId, status) =>
  api.put(`/admin/orders/${orderId}/status`, 
   {status: status});

 export default api;

