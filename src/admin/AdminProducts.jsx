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

  const [search, setSearch] = useState("");
  const [sortField, setSortField] = useState("productId");
  const [sortOrder, setSortOrder] = useState("desc");

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);
  const [totalCount, setTotalCount] = useState(0);

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [selectedCategoryId, setSelectedCategoryId] = useState("");
  const [newCategory, setNewCategory] = useState("");
  const [editingImage, setEditingImage] = useState("");

  const [form, setForm] = useState({
    name: "",
    price: "",
    description: "",
    stock: 0,
    isActive: true,
    image: null
  });

  /* ================= LOAD ================= */

  useEffect(() => {
    loadProducts();
    loadCategories();
  }, []);

  const loadProducts = async () => {
    const data = await getAdminProducts();
    setProducts(data || []);
  };

  const loadCategories = async () => {
    const data = await getCategories();
    setCategories(data || []);
  };

  /* ================= CATEGORY MAP ================= */

  const categoryMap = {};
  categories.forEach(c => (categoryMap[c.id] = c.name));

  /* ================= RESET ================= */

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

  /* ================= SUBMIT ================= */

  const submit = async (e) => {
    e.preventDefault();

    const fd = new FormData();
    fd.append("Name", form.name);
    fd.append("Price", form.price);
    fd.append("Description", form.description);
    fd.append("Stock", form.stock);
    fd.append("IsActive", form.isActive);

    if (selectedCategoryId === "other") {
      fd.append("CategoryName", newCategory.trim());
    } else {
      const cat = categories.find(c => String(c.id) === selectedCategoryId);
      if (cat) fd.append("CategoryName", cat.name);
    }

    if (form.image) fd.append("Image", form.image);

    editingId
      ? await updateAdminProduct(editingId, fd)
      : await addAdminProduct(fd);

    resetForm();
    setShowForm(false);
    loadProducts();
  };

  /* ================= EDIT ================= */

  const editProduct = (p) => {
    setEditingId(p.productId);
    setShowForm(true);

    setSelectedCategoryId(String(p.productCategory));
    setEditingImage(p.productImage || "");

    setForm({
      name: p.productName,
      price: p.productPrice,
      description: p.productDescription,
      stock: p.productStock,
      isActive: p.productIsActive,
      image: null
    });

    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  /* ================= FILTER + SORT ================= */

  const processedProducts = () => {
    let data = [...products];

    // SEARCH
    if (search.trim()) {
      const term = search.toLowerCase();
      data = data.filter(p =>
        p.productName?.toLowerCase().includes(term) ||
        categoryMap[p.productCategory]?.toLowerCase().includes(term) ||
        (term === "active" && p.productIsActive) ||
        (term === "inactive" && !p.productIsActive)
      );
    }

    // SORT
    data.sort((a, b) => {
      const A = a[sortField];
      const B = b[sortField];

      if (A == null || B == null) return 0;

      if (typeof A === "string") {
        return sortOrder === "asc"
          ? A.localeCompare(B)
          : B.localeCompare(A);
      }

      return sortOrder === "asc" ? A - B : B - A;
    });

    return data;
  };

  const allFiltered = processedProducts();
  const start = (currentPage - 1) * pageSize;
  const paginatedProducts = allFiltered.slice(start, start + pageSize);

  useEffect(() => {
    setTotalCount(allFiltered.length);
  }, [products, search, sortField, sortOrder]);

  // reset page on search/sort
  useEffect(() => {
    setCurrentPage(1);
  }, [search, sortField, sortOrder]);

  /* ================= UI ================= */

  return (
    <div className="admin-products">

      {/* HEADER */}
      <div className="admin-header">
        <h2>Admin Products</h2>
        <button
          className="toggle-form-btn"
          onClick={() => setShowForm(v => !v)}
        >
          {showForm ? "➖ Hide Form" : "➕ Add Product"}
        </button>
      </div>

      {/* FORM */}
      {showForm && (
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
            onChange={e => setSelectedCategoryId(e.target.value)}
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
            onChange={e => setForm({ ...form, stock: +e.target.value })}
          />

          {editingImage && (
            <img src={`https://localhost:7248${editingImage}`} width="80" />
          )}

          <input
            type="file"
            accept="image/*"
            onChange={e => setForm({ ...form, image: e.target.files[0] })}
          />

          <button type="submit">
            {editingId ? "Update" : "Add"}
          </button>
        </form>
      )}

      {/* CONTROLS */}
      <div className="admin-controls">
        <input
          className="admin-search-input"
          placeholder="Search..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />

        <select value={sortField} onChange={e => setSortField(e.target.value)}>
          <option value="productId">Recently Added</option>
          <option value="productName">Name</option>
          <option value="productPrice">Price</option>
          <option value="productStock">Stock</option>
        </select>

        <button onClick={() => setSortOrder(o => o === "asc" ? "desc" : "asc")}>
          {sortOrder === "asc" ? "⬆" : "⬇"}
        </button>
      </div>

      {/* TABLE */}
      <table className="product-table">
        <thead>
          <tr>
            <th>Image</th>
            <th>Name</th>
            <th>Category</th>
            <th>Price</th>
            <th>Stock</th>
            <th>Status</th>
            <th>Edit</th>
          </tr>
        </thead>

        <tbody>
          {paginatedProducts.map(p => (
            <tr key={p.productId}>
              <td>
                {p.productImage && (
                  <img src={`https://localhost:7248${p.productImage}`} width="50" />
                )}
              </td>
              <td>{p.productName}</td>
              <td>{categoryMap[p.productCategory]}</td>
              <td>₹{p.productPrice}</td>
              <td>{p.productStock}</td>
              <td className={p.productIsActive ? "active" : "inactive"}>
                {p.productIsActive ? "Active" : "Inactive"}
              </td>
              <td>
                <button onClick={() => editProduct(p)}>Edit</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* PAGINATION */}
      <div className="pagination">
        <button disabled={currentPage === 1} onClick={() => setCurrentPage(p => p - 1)}>
          Prev
        </button>
        <span>
          Page {currentPage} of {Math.ceil(totalCount / pageSize)}
        </span>
        <button
          disabled={currentPage * pageSize >= totalCount}
          onClick={() => setCurrentPage(p => p + 1)}
        >
          Next
        </button>
      </div>
    </div>
  );
}