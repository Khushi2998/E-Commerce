import { useEffect, useState } from "react";
import {
  getAdminProducts,
  getCategories,
  addAdminProduct,
  updateAdminProduct
} from "../api/adminapi";

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);

  const [editingId, setEditingId] = useState(null);
  const [selectedCategoryId, setSelectedCategoryId] = useState("");
  const [newCategory, setNewCategory] = useState("");

  const [form, setForm] = useState({
    name: "",
    price: "",
    description: "",
    stock: 0,
    isActive: true,
    image: null
  });

  const [editingImage, setEditingImage] = useState("");

  useEffect(() => {
    loadProducts();
    loadCategories();
  }, []);

  const loadProducts = async () => {
    const data = await getAdminProducts();
    setProducts(data);
  };

  const loadCategories = async () => {
    const data = await getCategories();
    setCategories(data);
  };

  // ================= RESET FORM =================
  const resetForm = () => {
    setEditingId(null);
    setSelectedCategoryId("");
    setNewCategory("");
    setEditingImage("");
    setForm({
      name: "",
      price: "",
      description: "",
      stock: 0,
      isActive: true,
      image: null
    });
  };

  // ================= SUBMIT =================
  const submit = async (e) => {
    e.preventDefault();

    const fd = new FormData();
    fd.append("Name", form.name);
    fd.append("Price", String(form.price));
    fd.append("Description", form.description);
    fd.append("Stock", String(form.stock));
    fd.append("IsActive", String(form.isActive));

    if (selectedCategoryId === "other") {
      if (!newCategory.trim()) {
        alert("Enter category name");
        return;
      }
      fd.append("CategoryName", newCategory.trim());
    } else {
      const cat = categories.find(c => String(c.id) === selectedCategoryId);
      if (cat) fd.append("CategoryName", cat.name);
    }

    if (form.image) fd.append("Image", form.image);

    if (editingId) {
      await updateAdminProduct(editingId, fd);
    } else {
      await addAdminProduct(fd);
    }

    resetForm();
    loadProducts();
  };

  // ================= EDIT =================
  const editProduct = (p) => {
    setEditingId(p.productId);
    setSelectedCategoryId(String(p.categoryId));
    setEditingImage(p.productImage || "");

    setForm({
      name: p.productName || "",
      price: p.productPrice || "",
      description: p.productDescription || "",
      stock: p.productStock ?? 0,
      isActive: p.productIsActive ?? true,
      image: null
    });

    window.scrollTo({ top: 0, behavior: "smooth" });
  };


  return (
    <div className="admin-products">
      <h2>{editingId ? "Edit Product" : "Add Product"}</h2>

      {/* ================= FORM ================= */}
      <form onSubmit={submit} className="product-form">
        <input
          placeholder="Product Name"
          value={form.name}
          onChange={e => setForm({ ...form, name: e.target.value })}
          required
        />

        <input
          type="number"
          placeholder="Price"
          value={form.price}
          onChange={e => setForm({ ...form, price: e.target.value })}
          required
        />

        <select
          value={selectedCategoryId}
          onChange={(e) => setSelectedCategoryId(e.target.value)}
          required
        >
          <option value="">Select Category</option>
          {categories.map(c => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
          <option value="other">Other</option>
        </select>

        {selectedCategoryId === "other" && (
          <input
            placeholder="New Category"
            value={newCategory}
            onChange={e => setNewCategory(e.target.value)}
            required
          />
        )}

        <textarea
          placeholder="Description"
          value={form.description}
          onChange={e => setForm({ ...form, description: e.target.value })}
        />

        <input
          type="number"
          min="0"
          placeholder="Stock"
          value={form.stock}
          onChange={e => setForm({ ...form, stock: Number(e.target.value) })}
        />
        
        {editingId && (
          <div className="status-toggle-edit">
            <label>Status:</label>
            <button
              type="button"
              className={form.isActive ? "active" : "inactive"}
              onClick={() =>
                setForm({ ...form, isActive: !form.isActive })
              }
            >
              {form.isActive ? "Active" : "Inactive"}
            </button>
          </div>
        )}

        {editingImage && (
          <img
            src={`https://localhost:7248${editingImage}`}
            alt="Current"
            width="80"
            style={{ marginBottom: "10px" }}
          />
        )}

        <input
          type="file"
          accept="image/*"
          onChange={e => setForm({ ...form, image: e.target.files[0] })}
        />

        <div style={{display:"flex",gap:"10px"}}>
          <button type="submit">
            {editingId ? "Update Product" : "Add Product"}
          </button>

          {editingId && (
            <button type="button" onClick={resetForm}>
              Cancel
            </button>
          )}
        </div>
      </form>

      {/* ================= TABLE ================= */}
      <table className="product-table">
        <thead>
          <tr>
            <th>Image</th>
            <th>Name</th>
            <th>Price</th>
            <th>Stock</th>
            <th>Status</th>
            <th>Edit</th>
          </tr>
        </thead>

        <tbody>
          {products.map(p => (
            <tr key={p.productId}>
              <td>
                {p.productImage && (
                  <img
                    src={`https://localhost:7248${p.productImage}`}
                    alt=""
                    width="50"
                  />
                )}
              </td>
              <td>{p.productName}</td>
              <td>₹{p.productPrice}</td>
              <td>{p.productStock}</td>
              <td>
                <span className={p.productIsActive ? "active" : "inactive"}>
                  {p.productIsActive ? "Active" : "Inactive"}
                </span>
              </td>
              <td>
                <button onClick={() => editProduct(p)}>Edit</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
