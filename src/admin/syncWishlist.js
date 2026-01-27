import { getWishlist, clearWishlist } from "./WishlistStorage";
import { saveWishlist } from "../api/wishlistapi";

export const syncWishlist = async () => {
  const wishlist = getWishlist();

  if (wishlist.length === 0) return;

  try {
    await saveWishlist(wishlist); 
    clearWishlist(); 
  } catch (error) {
    console.error("Wishlist sync failed", error);
  }
};
