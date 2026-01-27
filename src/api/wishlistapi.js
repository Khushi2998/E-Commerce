import api from "./api";

export const saveWishlist = (productIds) =>
  api.post("/wishlist", productIds);

export const getWishlistFromDb = () =>
  api.get("/wishlist");

export const removeWishlistItem = (productId) =>
  api.delete(`/wishlist/${productId}`);
