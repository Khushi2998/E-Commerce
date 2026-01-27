import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import api from "../api/api";
import { getWishlist, removeWishlist } from "../admin/WishlistStorage";
import { removeWishlistItem } from "../api/wishlistapi";

export default function Wishlist() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();
  const isLoggedIn = !!localStorage.getItem("token");

  useEffect(() => {
    loadWishlist();
  }, [isLoggedIn]);

  const loadWishlist = async () => {
    setLoading(true);

    try {
      let wishlistIds = [];

      //  Get wishlist IDs
      if (isLoggedIn) {
        const res = await api.get("/wishlist"); // returns [1,2,3]
        wishlistIds = Array.isArray(res.data) ? res.data : [];
      } else {
        wishlistIds = getWishlist(); // localStorage ids
      }

      if (wishlistIds.length === 0) {
        setProducts([]);
        return;
      }

      //  Get all products
      const productRes = await api.get("/products");
      const allProducts = Array.isArray(productRes.data)
        ? productRes.data
        : [];

      // 3️⃣ Match products by ID
      const matchedProducts = allProducts.filter(p =>
        wishlistIds.includes(p.id)
      );

      setProducts(matchedProducts);
    } catch (error) {
      console.error("Failed to load wishlist", error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const remove = async (id) => {
    if (isLoggedIn) {
      await removeWishlistItem(id);
    } else {
      removeWishlist(id);
    }
    loadWishlist();
  };

  if (loading) return <p className="page">Loading wishlist...</p>;

  return (
    <div className="wishlist-page">
  <h2>My Wishlist ❤️</h2>

  {products.length === 0 && <p>No items in wishlist</p>}

  <div className="wishlist-grid">
    {products.map(p => (
      <div className="wishlist-card" key={p.id}>
        <img
          src={`http://localhost:5253${p.image}`}
          alt={p.name}
          onError={(e) => (e.target.src = "/placeholder.webp")}
        />

        <h4>{p.name}</h4>
        <p>₹{p.price}</p>

        <div className="wishlist-actions">
          <button onClick={() => navigate(`/products/${p.id}`)}>
            View
          </button>
          <button className="danger" onClick={() => remove(p.id)}>
            ❌
          </button>
        </div>
      </div>
    ))}
  </div>
</div>

  );
}


