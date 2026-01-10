import axios from "axios";


const api = axios.create({
  baseURL: "https://localhost:7248/api",
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);


/**
 * PUBLIC – get all products
 * GET /api/products
 */
// export const getProducts = async () => {
//   const res = await api.get("/products");

//   // Handle .NET $values issue safely
//   return Array.isArray(res.data)
//     ? res.data
//     : res.data?.$values || [];
// };

/**
 * PUBLIC – get product by id
 * GET /api/products/{id}
 */
export const getProductById = async (id) => {
  const res = await api.get(`/products/${id}`);
  return res.data;
};

/**
 * ADMIN – create product
 * POST /api/products
 */
export const createProduct = async (product) => {
  const res = await api.post("/products", product);
  return res.data;
};

/**
 * ADMIN – update product
 * PUT /api/products/{id}
 */
export const updateProduct = async (id, product) => {
  await api.put(`/products/${id}`, product);
};

/**
 * ADMIN – delete product
 * DELETE /api/products/{id}
 */
export const deleteProduct = async (id) => {
  await api.delete(`/products/${id}`);
};


export default api;