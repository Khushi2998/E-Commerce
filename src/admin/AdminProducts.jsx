import { useEffect, useState } from "react";
import {
  getAdminProducts,
  addAdminProduct,
  deleteAdminProduct
} from "../api/adminapi";

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({
    name: "",
    price: "",
    categoryId: "",
    image: ""
  });

  const load = () =>
    getAdminProducts().then(res => setProducts(res.data));

  useEffect(load, []);

  const submit = async e => {
    e.preventDefault();
    await addAdminProduct(form);
    setForm({ name: "", price: "", categoryId: "", image: "" });
    load();
  };

  return (
    <>
      <h2>Products</h2>

      <form onSubmit={submit}>
        <input placeholder="Name" onChange={e => setForm({...form, name:e.target.value})}/>
        <input placeholder="Price" onChange={e => setForm({...form, price:e.target.value})}/>
        <input placeholder="CategoryId" onChange={e => setForm({...form, categoryId:e.target.value})}/>
        <input placeholder="Image URL" onChange={e => setForm({...form, image:e.target.value})}/>
        <button>Add</button>
      </form>

      <table>
        <thead>
          <tr><th>Name</th><th>Price</th><th>Action</th></tr>
        </thead>
        <tbody>
          {products.map(p => (
            <tr key={p.id}>
              <td>{p.name}</td>
              <td>₹{p.price}</td>
              <td>
                <button onClick={() => deleteAdminProduct(p.id).then(load)}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}
