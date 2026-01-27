import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { getProductById } from "../api/productApi";

export default function ProductDetails() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if(!id)return;
    getProductById(id)
      .then(data =>setProduct(data))
      .catch(err => {
        console.error(err);
        setError("Failed to load product");
      });
  }, [id]);

  if (error) return <p>{error}</p>;
  if (!product) return <p>Loading...</p>;

  return (
    <div className="page product-details">
      <h1>{product.name}</h1>

      <img
        src={
          product.image || product.Image
            ? `http://localhost:5253${product.image || product.Image}`
            : "/placeholder.webp"
        }
        alt={product.name}
        width="320"
        onError={(e) => (e.target.src = "/placeholder.webp")}
      />
      <p className="name">{product.name}</p>
      <p className="price">
        ₹{product.price}
      </p>

      <p className="desc">
        {product.description}
      </p>
    </div>
  );
}
