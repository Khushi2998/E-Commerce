import { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import {
  getCart,
  updateCartItem,
  removeCartItem,
} from "../api/cartApi";
import { confirmDelete } from "../auth/confirmDelete";
import { MdDeleteOutline } from "react-icons/md";
import { CartContext } from "../components/CartContext";
import image1 from "../../public/image1.png";
const Cart = () => {
  const [cart, setCart] = useState([]);
  const { fetchCartCount } = useContext(CartContext);
  const navigate = useNavigate();

  const loadCart = async () => {
    const data = await getCart();
    setCart(data);
  };

  useEffect(() => {
    loadCart();
  }, []);

  /*  UPDATE QUANTITY (FIXED) */
  const updateQty = async (item, delta) => {
    const newQty = item.quantity + delta;

    if (newQty < 1) {
      const ok = await confirmDelete("Remove this item from cart?");
      if (!ok) return;
    }

    //  Optimistic UI update
    setCart((prev) =>
      newQty < 1
        ? prev.filter((i) => i.cartId !== item.cartId)
        : prev.map((i) =>
            i.cartId === item.cartId
              ? {
                  ...i,
                  quantity: newQty,
                  total: newQty * i.price,
                }
              : i
          )
    );

    try {
      if (newQty < 1) {
        await removeCartItem(item.cartId);
      } else {
        await updateCartItem(item.cartId, newQty);
      }

  
      await fetchCartCount();

    } catch (err) {
      console.error(err);
      loadCart(); // rollback
    }
  };

  /* REMOVE ITEM */
  const handleRemove = async (id) => {
    const ok = await confirmDelete("Remove this item from cart?");
    if (!ok) return;

    try {
      await removeCartItem(id);

      setCart((prev) => prev.filter((i) => i.cartId !== id));

      //  update navbar count
      await fetchCartCount();

    } catch (err) {
      console.error("Failed to remove item:", err);
      loadCart();
    }
  };

  const handleCheckout = () => {
    navigate("/checkout");
  };

  /*  TOTAL  */
  const total = cart.reduce(
    (sum, i) => sum + i.quantity * i.price,
    0
  );

  return (
    <div className="cart-page">
      <h2>My Cart</h2>

      {cart.length === 0 && <img src={image1} alt="Your cart is empty " className="empty-state"/>}

      {cart.map((item) => (
        <div key={item.cartId} className="cart-card">
          <img
            src={`http://localhost:5253${item.image}`}
            alt={item.productName}
          />

          <div className="info">
            <h4>{item.productName}</h4>
            <p>₹{item.price}</p>
          </div>

          <div className="qty-control">
            <button
              className={`qty-btn ${item.quantity === 1 ? "danger" : ""}`}
              onClick={() => updateQty(item, -1)}
              title={item.quantity === 1 ? "Remove item" : "Decrease quantity"}
            >
              {item.quantity === 1 ? <MdDeleteOutline /> : "−"}
            </button>

            <span className="qty-value">{item.quantity}</span>

            <button
              className="qty-btn"
              onClick={() => updateQty(item, +1)}
            >
              +
            </button>
          </div>

          <div className="total">₹{item.quantity * item.price}</div>

          <button
            className="remove"
            onClick={() => handleRemove(item.cartId)}
          >
            ✕
          </button>
        </div>
      ))}

      {cart.length > 0 && (
        <div className="summary">
          <h3>Total: ₹{total}</h3>
          <button className="checkout" onClick={handleCheckout}>
            Checkout
          </button>
        </div>
      )}
    </div>
  );
};

export default Cart;
