import { Link, Outlet } from "react-router-dom";


export default function AdminLayout() {
  return (
    <div className="admin">
      <aside>
        <h2>Admin Panel</h2>
        <Link to="products">Products</Link>
        <Link to="categories">Categories</Link>
        <Link to="feedback">Feedback</Link>
        <Link to="faqs">FAQs</Link>
      </aside>

      <main>
        <Outlet />
      </main>
    </div>
  );
}
