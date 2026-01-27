import { createContext, useEffect, useState } from "react";
import api from "../api/api";

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartCount, setCartCount] = useState(0);

 const fetchCartCount = async () => {
  const token=localStorage.getItem("token")
  if (!token){
    setCartCount(0);
    return;
  }
    try {
      const res = await api.get("/cart/count");
      setCartCount(res.data);
    } catch (err){
     if (err.response?.status === 401){
      setCartCount(0);
    } else {
      console.error(err);
    }
    }
  };

  useEffect(() => {
    fetchCartCount();
  }, []);

  return (
    <CartContext.Provider value={{ cartCount,setCartCount,fetchCartCount }}>
      {children}
    </CartContext.Provider>
  );
};
