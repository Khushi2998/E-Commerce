import { useEffect, useState } from "react";
import { getCategories, addCategory, updateCategory, deleteCategory } from "../api/adminapi";
import { toast } from "sonner";
import { confirmDelete } from "../auth/confirmDelete";
export default function AdminCategories() {
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editingName, setEditingName] = useState("");

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    const res = await getCategories();
    if (Array.isArray(res)) setCategories(res);
    else if (Array.isArray(res.data)) setCategories(res.data);
    else setCategories([]);
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!newCategory.trim()) return toast.error("Category name required");
    try {
      await addCategory({ newCategoryName: newCategory });
      toast.success("Category added");
      setNewCategory("");
      loadCategories();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to add category");
    }
  };

  const startEdit = (cat) => {
    setEditingId(cat.id);
    setEditingName(cat.name);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditingName("");
  };

  const handleUpdate = async () => {
    if (!editingName.trim()) return toast.error("Name cannot be empty");
    try {
      await updateCategory(editingId, { name: editingName });
      toast.success("Category updated");
      cancelEdit();
      loadCategories();
    } catch (err) {
      toast.error("Failed to update category");
    }
  };

  const handleDelete = async (id) => {
  if (!(await confirmDelete("Delete this category?"))) return;
    try {
      await deleteCategory(id);
      toast.success("Category deleted");
      loadCategories();
    } catch (err) {
      toast.error("Failed to delete category");
    }
  };

  return (
    <div className="admin-categories">
      <h2>Manage Categories</h2>

      {/* ADD NEW CATEGORY */}
      <form onSubmit={handleAdd} className="category-form">
        <input
          type="text"
          placeholder="New Category"
          value={newCategory}
          onChange={(e) => setNewCategory(e.target.value)}
        />
        <button type="submit">Add Category</button>
      </form>

      {/* CATEGORY TABLE */}
      <table className="category-table">
        <thead>
          <tr>
            <th>#</th>
            <th>Name</th>
            <th>Edit</th>
            <th>Delete</th>
          </tr>
        </thead>
        <tbody>
          {categories.map((c, idx) => (
            <tr key={c.id}>
              <td>{idx + 1}</td>
              <td>
                {editingId === c.id ? (
                  <input
                    type="text"
                    value={editingName}
                    onChange={(e) => setEditingName(e.target.value)}
                  />
                ) : (
                  c.name
                )}
              </td>
              <td>
                {editingId === c.id ? (
                  <>
                    <button onClick={handleUpdate} className="btn-update">Save</button>
                    <button onClick={cancelEdit} className="btn-cancel">Cancel</button>
                  </>
                ) : (
                  <button onClick={() => startEdit(c)} className="btn-edit">Edit</button>
                )}
              </td>
              <td>
                <button onClick={() => handleDelete(c.id)} className="btn-delete">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
