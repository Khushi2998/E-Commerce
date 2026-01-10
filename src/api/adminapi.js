import axios from "axios";
import { getToken } from "../auth/auth";

const API = axios.create({
  baseURL: "https://localhost:7248/api/auth/admin/login",
});

API.interceptors.request.use(config => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const getAdminProducts = () => API.get("/products");
export const addAdminProduct = (data) => API.post("/products", data);
export const deleteAdminProduct = (id) => API.delete(`/products/${id}`);

export const getCategories = () => API.get("/categories");
export const addCategory = (data) => API.post("/categories", data);

export const getFeedback = () => API.get("/feedback");
export const getFAQs = () => API.get("/faqs");
