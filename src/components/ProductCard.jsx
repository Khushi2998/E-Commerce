import { useNavigate } from "react-router-dom";
import { addToCart } from "../api/cartApi";
import { toast } from "sonner";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { addWishlist, removeWishlist, getWishlist } from "../admin/WishlistStorage";
import { saveWishlist, removeWishlistItem } from "../api/wishlistapi";
import { useEffect, useState, useContext } from "react";
import { CartContext } from "./CartContext";
import { FaCartPlus } from "react-icons/fa";
import { FiPlus } from "react-icons/fi";

export default function ProductCard({ product }) {
  const navigate = useNavigate();
  const [added, setAdded] = useState(false);
  const [liked, setLiked] = useState(false);
  const { fetchCartCount, setCartCount } = useContext(CartContext);
  const isLoggedIn = !!localStorage.getItem("token");

  useEffect(() => {
    setLiked(getWishlist().includes(product.id));
  }, [product.id]);

  const openDetails = () => {
    navigate(`/products/${product.id}`);
  };

  const toggleWishlist = async () => {
    if (liked) {
      isLoggedIn ? await removeWishlistItem(product.id) : removeWishlist(product.id);
    } else {
      isLoggedIn ? await saveWishlist([product.id]) : addWishlist(product.id);
    }
    setLiked(!liked);
  };

  const handleAdd = async () => {
    try {
      await addToCart(product.id, 1);
      setCartCount((prev) => prev + 1);
      fetchCartCount();
      setAdded(true);
      toast.success("Added to cart");
    } catch (err) {
      if (err.response?.status === 401) {
        navigate("/login", { state: { from: `/products/${product.id}` } });
      } else {
        console.error(err);
      }
    }
  };

  return (
    <div className="product-card">
      <div className="image-wrapper" onClick={openDetails}>
        <img
          src={`http://localhost:5253${product.image}`}
          alt={product.name}
          onError={(e) => (e.target.src = "/placeholder.webp")}
        />
      </div>

      <div className="product-info">
        <h3 onClick={openDetails} className="clickable">{product.name}</h3>
        <p className="price">₹{product.price}</p>

        <div className="product-actions">
          <button onClick={toggleWishlist} className={`wishlist-btn ${liked ? "liked" : ""}`}>
            {liked ? <FaHeart /> : <FaRegHeart />}
          </button>

          <button
  className={`cart-btn ${added ? "added" : ""}`}
  onClick={handleAdd}
  title={added ? "Add more" : "Add to cart"}
>
  {added ? <FiPlus size={18} /> : <FaCartPlus size={18} />}
</button>
        </div>
      </div>
    </div>
  );
}
