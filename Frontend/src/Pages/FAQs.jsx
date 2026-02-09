import { useEffect, useState } from "react";
import api from "../api/api";

export default function FAQs() {
  const [faqs, setFaqs] = useState([]);
  const [openId, setOpenId] = useState(null);

  useEffect(() => {
    loadFaqs();
  }, []);

  const loadFaqs = async () => {
    const res = await api.get("/faqs"); 
    setFaqs(res.data);
  };

  return (
    <div className="faq-page">
      <h2 className="page-title">❓ Frequently Asked Questions</h2>

      <div className="faq-list">
        {faqs.map(faq => (
          <div className="faq-item" key={faq.id}>
            <div
              className="faq-question"
              onClick={() =>
                setOpenId(openId === faq.id ? null : faq.id)
              }
            >
              {faq.question}
              <span>{openId === faq.id ? "−" : "+"}</span>
            </div>

            {openId === faq.id && (
              <div className="faq-answer">
                {faq.answer}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
