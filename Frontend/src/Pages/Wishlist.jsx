import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api";
import { removeWishlistItem } from "../api/wishlistapi";
import { FaCartPlus } from "react-icons/fa";
import { FiPlus } from "react-icons/fi";
import image3 from "../../public/image3.png";
import { toast } from "sonner";
import { addToCart } from "../api/cartApi";
export default function Wishlist() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [added, setAdded] = useState(false);
  const [cartState, setCartState] = useState({});
  const navigate = useNavigate();
  const [quantity, setQuantity] = useState(0);
  const isLoggedIn = !!localStorage.getItem("token");
  
  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/login", {
        state: { message: "Please login to view your wishlist" }
      });
      return;
    }

    loadWishlist();
  }, [isLoggedIn]);

  const loadWishlist = async () => {
    setLoading(true);

    try {
      //  Get wishlist product IDs
      const res = await api.get("/wishlist");
      const wishlistIds = Array.isArray(res.data) ? res.data : [];

      if (wishlistIds.length === 0) {
        setProducts([]);
        return;
      }

      // Get all products
      const productRes = await api.get("/products");
      const allProducts = Array.isArray(productRes.data)
        ? productRes.data
        : [];

      // Match wishlist products
      const matched = allProducts.filter(p =>
        wishlistIds.includes(p.id)
      );

      setProducts(matched);
    } catch (error) {
      console.error("Failed to load wishlist", error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

   const handleAdd = async (product) => {
  if (product.stock <= 0) {
    toast.error("Out of stock");
    return;
  }

  try {
    await addToCart(product.id, 1);

    setCartState(prev => ({
      ...prev,
      [product.id]: (prev[product.id] || 0) + 1
    }));
    window.dispatchEvent(new Event("cartUpdated", {
  detail: { productId: product.id, quantity: 1 }
}));
    toast.success("Added to cart");
  } catch (err) {
    console.error(err);
    if (err.response?.status === 401) {
      navigate("/login", {
        state: { message: "Please login to add items to cart" }
      });
    } else {
      toast.error("Failed to add to cart");
    }
  }
};

  const remove = async (id) => {
    await removeWishlistItem(id);
    loadWishlist();
    window.dispatchEvent(new Event("wishlistUpdated"));
  };

  if (loading) return <p className="page">Loading wishlist...</p>;

  return (
    <div className="wishlist-page">
      <h2>My Wishlist ❤️</h2>

      {products.length === 0 && <img src={image3} alt="Your wishlist is empty 💔" className="empty-state"/>}

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
              <button
  className={`cart-btn ${cartState[p.id] ? "added" : ""}`}
  onClick={() => handleAdd(p)}
  title={cartState[p.id] ? "Add more" : "Add to cart"}
>
  {cartState[p.id] ? <FiPlus size={18} /> : <FaCartPlus size={18} />}
</button>

{cartState[p.id] > 0 && (
  <span className="quantity-badge">{cartState[p.id]}</span>
)}
                        
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
