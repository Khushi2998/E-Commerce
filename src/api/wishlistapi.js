import api from "./api";

export const saveWishlist = async (productIds) => {
  const token = localStorage.getItem("token");

  if (!token) {
    console.error("❌ No token for wishlist");
    return;
  }

  return api.post("/wishlist", productIds, {
    headers: { Authorization: `Bearer ${token}` }
  });
};

export const getWishlistFromDb = () =>
  api.get("/wishlist");


export const removeWishlistItem = async (productId) => {
  const token = localStorage.getItem("token");
  if (!token) return;

  return api.delete(`/wishlist/${productId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};