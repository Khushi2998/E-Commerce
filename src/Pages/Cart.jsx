import { useEffect, useState,useContext } from "react";
import { useNavigate } from "react-router-dom";
import {
  getCart,
  updateCartItem,
  removeCartItem,
  checkout,
} from "../api/cartApi";
import {confirmDelete} from "../auth/confirmDelete"
import { MdDeleteOutline } from "react-icons/md";
import {CartContext} from "../components/CartContext";

const Cart = () => {
  const [cart, setCart] = useState([]);
  const [editingQty, setEditingQty] = useState({});
  const { fetchCartCount } = useContext(CartContext);
  const navigate = useNavigate();
  const loadCart = async () => {
    const data = await getCart();
    setCart(data);
  };

  useEffect(() => {
    loadCart();
  }, []);

  const commitQtyChange = async (item) => {
    const raw = editingQty[item.cartId];
    let qty = Number(raw);

    // cleanup editing state
    setEditingQty((prev) => {
      const copy = { ...prev };
      delete copy[item.cartId];
      return copy;
    });

    if (Number.isNaN(qty)) return;

    if (qty < 1) {
      await removeCartItem(item.cartId);
      setCart((prev) =>prev.filter((i) => i.cartId !== item.cartId)
      )
      return;
    }

    await updateCartItem(item.cartId, qty);

    setCart((prev) =>
      prev.map((i) =>
        i.cartId === item.cartId
          ? { ...i, quantity: qty, total: qty * i.price }
          : i
      )
    );
  };

 const updateQty=async (item,delta)=> {
  const newQty=item.quantity+delta;
  if (newQty < 1) {
    const ok = await confirmDelete("Remove this item from cart?");
    if (!ok) return;
  }

  setCart((prev)=>
  newQty<1? prev.filter((i)=> i.cartId !==item.cartId):prev.map((i)=>
  i.cartId === item.cartId ? {
    ...i,
    quantity:newQty,
    total:newQty*i.price,
  }:i));
  try{
    if(newQty <1){
      await removeCartItem(item.cartId);
    }else{
      await updateCartItem(item.cartId,newQty);
    }
    await fetchCartCount();
  }catch(err){
    console.error(err);
    loadCart();
  }
 }

  const handleRemove = async (id) => {
     const ok = await confirmDelete("Remove this item from cart?");
  if (!ok) return;
    try{
    await removeCartItem(id);
    await fetchCartCount();
    await loadCart();
    }catch (err) {
    console.error("Failed to remove item:", err);
    }};
  const handleCheckout = async () => {
   
    navigate("/checkout");
 
};

  const total = cart.reduce((sum, i) => sum + i.total, 0);

  return (
    <div className="cart-page">
      <h2>My Cart</h2>

      {cart.length === 0 && <p className="empty">Cart is empty</p>}

      {cart.map((item) => (
        <div key={item.cartId} className="cart-card">
          <img src={`http://localhost:5253${item.image}`} alt={item.productName} />

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
          
          <div className="total">₹{item.total}</div>

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
