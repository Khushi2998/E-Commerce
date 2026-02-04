import { useEffect, useState } from "react";
import api from "../api/api";
import { toast } from "sonner";

export default function AdminFAQs() {
  const [faqs, setFaqs] = useState([]);
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    loadFaqs();
  }, []);

  const loadFaqs = async () => {
    const res = await api.get("/faqs");
    setFaqs(res.data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editingId) {
        await api.put(`/admin/faqs/${editingId}`, {
          question,
          answer,
        });
        toast.success("FAQ updated");
      } else {
        await api.post("/faqs", {
          question,
          answer,
        });
        toast.success("FAQ added");
      }

      setQuestion("");
      setAnswer("");
      setEditingId(null);
      loadFaqs();
    } catch {
      toast.error("Failed to save FAQ");
    }
  };

  const toggleStatus = async (id, isActive) => {
    await api.patch(`/admin/faqs/${id}/status`, {
      isActive: !isActive,
    });
    loadFaqs();
  };

  const editFaq = (faq) => {
    setEditingId(faq.id);
    setQuestion(faq.question);
    setAnswer(faq.answer);
  };

  const deleteFaq = async (id) => {
    if (!window.confirm("Delete this FAQ?")) return;
    await api.delete(`/admin/faqs/${id}`);
    toast.success("FAQ deleted");
    loadFaqs();
  };

  return (
  <div className="admin-page">
    <h2 className="page-title">📌 Manage FAQs</h2>

    {/* ADD / EDIT FORM */}
    <div className="card">
      <h3>{editingId ? "Edit FAQ" : "Add New FAQ"}</h3>

      <form className="faq-form" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Enter question"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          required
        />

        <textarea
          placeholder="Enter answer"
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          rows={4}
          required
        />

        <button type="submit" className="primary-btn">
          {editingId ? "Update FAQ" : "Add FAQ"}
        </button>
      </form>
    </div>

    {/* FAQ LIST */}
    <div className="card">
      <h3>All FAQs</h3>

      <table className="admin-table">
        <thead>
          <tr>
            <th>Question</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {faqs.length === 0 && (
            <tr>
              <td colSpan="3" className="empty">
                No FAQs found
              </td>
            </tr>
          )}

          {faqs.map((faq) => (
            <tr key={faq.id}>
              <td className="question">{faq.question}</td>

              <td>
                <span
                  className={`status ${
                    faq.isActive ? "active" : "inactive"
                  }`}
                >
                  {faq.isActive ? "Active" : "Inactive"}
                </span>
              </td>

              <td className="actions">
                <button onClick={() => editFaq(faq)}>Edit</button>

                <button
                  className="warning"
                  onClick={() => toggleStatus(faq.id, faq.isActive)}
                >
                  {faq.isActive ? "Disable" : "Enable"}
                </button>

                <button
                  className="danger"
                  onClick={() => deleteFaq(faq.id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

}
