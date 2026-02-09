import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import axios from "../api/api";

const Search = () => {
  const [params] = useSearchParams();
  const query = params.get("query");
  const [products, setProducts] = useState([]);

  useEffect(() => {
    if (query) {
      axios
        .get(`/products/search?query=${query}`)
        .then((res) => setProducts(res.data))
        .catch((err) => console.error(err));
    }
  }, [query]);

  return (
    <div className="page">
      <h2>Search results for "{query}"</h2>

      {products.length === 0 && <p>No products found</p>}

      <div className="product-grid">
        {products.map((p) => (
          <div className="product-card" key={p.id}>
            <img src={`http://localhost:5253${p.image}`} alt={p.name} />
            <h4>{p.name}</h4>
            <p>₹{p.price}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Search;
