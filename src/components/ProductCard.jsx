import { addToCart } from "../api/cartApi";

const ProductCard = ({ product }) => {
  const handleAdd = async () => {
    try {
      await addToCart(product.id, 1);
      alert("Added to cart");
    } catch (err) {
      if (err.response?.status === 401){
        Navigate("/login",{
          state:{from: `/product/${product.id}`},
        });
      }else{
          console.error(err);
        }
      
      }
    };

  return (
    <div className="card">
      <img
  src={`http://localhost:5253${product.image}`}
  alt={product.name}
  width="300"
  onError={(e) => {
    e.target.onerror = null;
    e.target.src = "/placeholder.webp";
  }}
/>

      <h3>{product.name}</h3>
      <p>₹{product.price}</p>
      <button onClick={handleAdd}>Add to Cart</button>
    </div>
  );
};

export default ProductCard;


