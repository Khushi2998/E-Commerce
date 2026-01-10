import { useEffect, useState } from "react";
import api from "../api/api";
import Banner from "../components/Banner"
import ProductCard from '../components/ProductCard';


const Home = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    api.get("/products")
      .then((res) => {
        console.log("API RESPONSE:", res.data);
        setProducts(Array.isArray(res.data) ? res.data : res.data.products);
      })
      .catch((err) => console.error(err));
  }, []);

  return (
    <>
    <header>
     
    <Banner/>
    </header>
    <div className="container">
      <h1>Products</h1>

      <div className="grid">
        {products.map(p => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </div>
    </>
  );

};


export default Home;
