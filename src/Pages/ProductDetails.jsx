import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState, useContext } from "react";
import { getProductById } from "../api/productApi";
import { addToCart } from "../api/cartApi";
import { toast } from "sonner";
import { FaCartPlus, FaHeart, FaRegHeart } from "react-icons/fa";
import { saveWishlist, removeWishlistItem } from "../api/wishlistapi";
import { CartContext } from "../components/CartContext";

export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { fetchCartCount } = useContext(CartContext);

  const [product, setProduct] = useState(null);
  const [error, setError] = useState(null);
  const [liked, setLiked] = useState(false);
  const [adding, setAdding] = useState(false);

  const isLoggedIn = !!localStorage.getItem("token");

  useEffect(() => {
    if (!id) return;

    getProductById(id)
      .then(data => setProduct(data))
      .catch(() => setError("Failed to load product"));
  }, [id]);

  const handleAddToCart = async () => {
    try {
      setAdding(true);
      await addToCart(product.id, 1);
      fetchCartCount();
      toast.success("Added to cart");
    } catch (err) {
      if (err.response?.status === 401) {
        navigate("/login");
      } else {
        toast.error("Failed to add to cart");
      }
    } finally {
      setAdding(false);
    }
  };

  const toggleWishlist = async () => {
    if (!isLoggedIn) {
      toast.info("Please login to use wishlist");
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

  if (error) return <p className="page">{error}</p>;
  if (!product) return <p className="page">Loading...</p>;

  const imageUrl =
    product.image || product.Image
      ? `http://localhost:5253${product.image || product.Image}`
      : "/placeholder.webp";

  return (
    <div className="page product-details">
      <div className="product-details-card">

        {/* IMAGE */}
        <div className="product-image">
          <img
            src={imageUrl}
            alt={product.name}
            onError={(e) => (e.target.src = "/placeholder.webp")}
          />
        </div>

        {/* INFO */}
        <div className="product-info">
          <h1>{product.name}</h1>

          <p className="price">₹{product.price}</p>

          <p className="desc">{product.description}</p>

          <div className="actions">
            <button
              className="add-cart"
              onClick={handleAddToCart}
              disabled={adding}
            >
              <FaCartPlus />
              {adding ? "Adding..." : "Add to Cart"}
            </button>

            <button
              className={`wishlist-btn ${liked ? "liked" : ""}`}
              onClick={toggleWishlist}
            >
              {liked ? <FaHeart /> : <FaRegHeart />}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}

