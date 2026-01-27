const KEY = "wishlist";

export const getWishlist = () =>
  JSON.parse(localStorage.getItem(KEY)) || [];

export const addWishlist = (productId) => {
  const list = getWishlist();
  if (!list.includes(productId)) {
    list.push(productId);
    localStorage.setItem(KEY, JSON.stringify(list));
  }
};

export const removeWishlist = (productId) => {
  const list = getWishlist().filter(id => id !== productId);
  localStorage.setItem(KEY, JSON.stringify(list));
};

export const clearWishlist = () =>
  localStorage.removeItem(KEY);
