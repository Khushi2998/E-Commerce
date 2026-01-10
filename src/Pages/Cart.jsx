import { useEffect, useState } from "react";
import {
  getCart,
  updateCartItem,
  removeCartItem,
  checkout,
} from "../api/cartApi";



const Cart = () => {
  const [cart, setCart] = useState([]);
  const [editingQty, setEditingQty] = useState({});

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
      setCart((prev) =>
        prev.filter((i) => i.cartId !== item.cartId)
      );
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
  }catch(err){
    console.error(err);
    loadCart();
  }
 }

  const handleRemove = async (id) => {
    await removeCartItem(id);
    setCart((prev) => prev.filter((i) => i.cartId !== id));
  };

  const handleCheckout = async () => {
    const result = await checkout();
    alert(`Order #${result.orderId} placed!`);
    setCart([]);
  };

  const total = cart.reduce((sum, i) => sum + i.total, 0);

  return (
    <div className="cart-container">
      <h2>Your Cart</h2>

      {cart.length === 0 && <p className="empty">Cart is empty</p>}

      {cart.map((item) => (
        <div key={item.cartId} className="cart-row">
          <img src={`http://localhost:5253${item.image}`} alt={item.productName} />

          <div className="info">
            <h4>{item.productName}</h4>
            <p>₹{item.price}</p>
          </div>

          <div className="qty-control">
            <button
              className="qty-btn"
              disabled={item.quantity <= 1}
              onClick={() => updateQty(item, -1)}
            >
              −
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
