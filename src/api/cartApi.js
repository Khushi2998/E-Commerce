import api from "./api";
import { CartProvider } from "../components/CartContext";

// GET cart items
export const getCart = async () => {
  const res = await api.get("/cart", {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });
  return res.data;
};
export const getCartCount = () => {
  return api.get("/cart/count"); // <-- This needs to exist
};
// ADD to cart
export const addToCart = async (productId, qty = 1) => {
  await api.post(
    "/cart",
    { productId, quantity:qty },
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    }
  );
};

// UPDATE cart item quantity
export const updateCartItem = async (cartId, quantity) => {
  await api.put(
    `/cart/${cartId}`,
    { quantity },
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    }
  );
};

// REMOVE item from cart
export const removeCartItem = async (cartId) => {
  await api.delete(`/cart/${cartId}`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });
};

// CHECKOUT
export const checkout = async (paymentMethod) => {
  const res = await api.post(
    "/checkout",
    {paymentMethod},
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    }
  );
  return res.data;
};
