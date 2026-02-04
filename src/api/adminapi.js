// src/api/adminapi.js
import api from "./api";

// CATEGORIES
export const getCategories = async () => {
  const res = await api.get("/admin/categories");
  return res.data; // only data
};

export const addCategory = async (payload) => {
  await api.post("/admin/categories",payload)};

export const deleteCategory = async (payload) => {
  await api.delete(`/admin/categories/${id}`,payload)}; 

export const updateCategory = async (id,payload) => {
  await api.put(`/admin/categories/${id}`,payload)};  

// PRODUCTS
export const getAdminProducts = async () => {
  const res = await api.get("/admin/products");
  return res.data;
};

export const addAdminProduct = async (product) => {
  return await api.post("/admin/products", product);
};

export const deleteAdminProduct = async (id) => {
  return await api.delete(`/admin/products/${id}`);
};

export const updateAdminProduct = (id, formData) => {
  return api.put(`/admin/products/${id}`, formData);
};

export const getAllOrders = () =>
  api.get("/admin/orders");

export const updateOrderItemStatus = (orderItemId, status) =>
  api.put(`/admin/orders/items/${orderItemId}/status`, { status });

export const getFeedback = () => {
  return api.get("/feedback");
};

export const getFAQs = () => {
  return api.get("/faqs");
};

// add FAQ
export const addFAQ = (data) => {
  return api.post("/faqs", data);
};

// delete FAQ
export const deleteFAQ = (id) => {
  return api.delete(`/faqs/${id}`);
};