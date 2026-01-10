import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { getProductById } from "../api/productApi";

export default function ProductDetails() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);

  useEffect(() => {
    getProductById(id)
      .then(res => setProduct(res.data))
      .catch(err => console.error(err));
  }, [id]);

  if (!product) return <p>Loading...</p>;

  return (
    <div className="container">
      <h1>{product.name}</h1>
      <img src={product.image ? `http://localhost:5253${product.image}`
      : "/placeholder.webp"} width="300" 
      alt={product.name}
       onError={(e) => {
    console.log("IMAGE LOAD ERROR");
    e.target.src = "/placeholder.png";
  }}/>
      <p>Price: ₹{product.price}</p>
      <p>Category: {product.categoryName}</p>
    </div>
  );
}
