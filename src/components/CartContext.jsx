import { createContext, useEffect, useRef, useState } from "react";
import api from "../api/api";
import { addToCart as addToCartApi } from "../api/cartApi";
export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartCount, setCartCount] = useState(0);
  const fetchedOnce = useRef(false);

  const fetchCartCount = async () => {
    try {
      const res = await api.get("/cart/count");
      setCartCount(res.data);
    } catch (err) {
      console.error("Cart count failed", err);
      setCartCount(0);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token && !fetchedOnce.current) {
      fetchedOnce.current = true;
      fetchCartCount();
    }
  }, []);

  const addToCart = async (productId, qty = 1) => {
  try {
    await addToCartApi(productId, qty); // call API properly
    await fetchCartCount(); // update navbar
  } catch (err) {
    console.error("Failed to add to cart:", err);
  }
};

  return (
    <CartContext.Provider value={{ cartCount, fetchCartCount, addToCart }}>
      {children}
    </CartContext.Provider>
  );
};