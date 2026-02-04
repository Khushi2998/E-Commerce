import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "sonner";
import { FaHeart, FaRegHeart, FaCartPlus } from "react-icons/fa";
import { FiPlus,FiMinus } from "react-icons/fi";
import { saveWishlist, removeWishlistItem } from "../api/wishlistapi";
import { useContext, useState } from "react";
import { CartContext } from "./CartContext";
import { AuthContext } from "./AuthContext";
import {updateCartItem,removeCartItem} from "../api/cartApi";

export default function ProductCard({ product }) {
  const navigate = useNavigate();
  const location = useLocation();

  const { user } = useContext(AuthContext);
  const { addToCart, fetchCartCount } = useContext(CartContext);

  const isLoggedIn = !!user;
  const isAdmin = user?.role === "Admin";

  const [liked, setLiked] = useState(false);
  const [added, setAdded] = useState(false);
  const [quantity, setQuantity] = useState(0);

  const openDetails = () => navigate(`/products/${product.id}`);

  /* ================= WISHLIST ================= */
  const toggleWishlist = async () => {
    if (!isLoggedIn) {
      toast.info("Please login to use wishlist");

      sessionStorage.setItem(
        "postLoginAction",
        JSON.stringify({
          from: location.pathname,
          action: { type: "addToWishlist", productId: product.id }
        })
      );

      navigate("/login");
      return;
    }

    try {
      if (liked) {
        await removeWishlistItem(product.id);
        toast.info("Removed from wishlist");
      } else {
        await saveWishlist([product.id]);
        toast.success("Added to wishlist ❤️");
      }
      setLiked(!liked);
      window.dispatchEvent(new Event("wishlistUpdated"));
    } catch {
      toast.error("Wishlist action failed");
    }
  };

  /* ================= CART ================= */
  const handleAdd = async () => {
    if (!isLoggedIn) {
      sessionStorage.setItem(
        "postLoginAction",
        JSON.stringify({
          from: location.pathname,
          action: { type: "addToCart", productId: product.id, qty: 1 }
        })
      );
      navigate("/login");
      return;
    }

    try {
      await addToCart(product.id, 1);
      setAdded(true);
      setQuantity(q => q + 1);
      fetchCartCount();
      toast.success("Added to cart");
    } catch {
      toast.error("Failed to add to cart");
    }
  };
  const handleDecrease = async () => {
  if (quantity <= 1) {
    try {
      await removeCartItem(product.id);
      setQuantity(0);
      fetchCartCount();
      toast.info("Removed from cart");
    } catch {
      toast.error("Failed to remove item");
    }
    return;
  }

  try {
    await updateCartItem(product.id, quantity - 1);
    setQuantity(q => q - 1);
    fetchCartCount();
  } catch {
    toast.error("Failed to decrease quantity");
  }
};

  return (
    <div className="product-card">

      {/* IMAGE + WISHLIST */}
      <div className="image-wrapper" onClick={openDetails}>
        <img
          src={`http://localhost:5253${product.image}`}
          alt={product.name}
          onError={(e) => (e.target.src = "/placeholder.webp")}
        />

        {!isAdmin && (
          <button
            className={`wishlist-floating ${liked ? "liked" : ""}`}
            onClick={(e) => {
              e.stopPropagation();
              toggleWishlist();
            }}
          >
            {liked ? <FaHeart /> : <FaRegHeart />}
          </button>
        )}
      </div>

      {/* INFO */}
      <div className="product-info">
        <h3 className="product-name" onClick={openDetails}>
          {product.name}
        </h3>

        {isAdmin && (
          <p className={`stock ${product.stock > 0 ? "in" : "out"}`}>
            Stock: {product.stock}
          </p>
        )}

        {!isAdmin && (
          <div className="product-bottom">
            <span className="price">₹{product.price}</span>
            {quantity === 0 ? (
    <button className="cart-btn" onClick={handleAdd}>
      <FaCartPlus size={18} />
    </button>
  ) : (
    <div className="qty-controller">
      {/* <button onClick={handleDecrease}>
        <FiMinus />
      </button> */}

      <span className="qty">{quantity}</span>

      <button onClick={handleAdd}>
        <FiPlus />
      </button>
    </div>
  )}
          </div>
        )}
      </div>
    </div>
  );
}
