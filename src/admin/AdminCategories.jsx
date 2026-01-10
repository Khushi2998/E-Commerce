import { useEffect, useState } from "react";
import { getCategories, addCategory } from "../api/adminapi";

export default function AdminCategories() {
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState("");

  useEffect(() => {
    getCategories().then(res => setCategories(res.data));
  }, []);

  const submit = async e => {
    e.preventDefault();
    await addCategory({ name });
    setName("");
    const res = await getCategories();
    setCategories(res.data);
  };

  return (
    <>
      <h2>Categories</h2>

      <form onSubmit={submit}>
        <input value={name} onChange={e => setName(e.target.value)} />
        <button>Add</button>
      </form>

      <ul>
        {categories.map(c => (
          <li key={c.id}>{c.name}</li>
        ))}
      </ul>
    </>
  );
}
