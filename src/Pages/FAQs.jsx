import InfoLayout from "../components/InfoLayout";
import { useState } from "react";

const faqs = [
  { q: "How do I place an order?", a: "Simply add items to cart and checkout." },
  { q: "Is COD available?", a: "Yes, Cash on Delivery is available." },
  { q: "How can I track my order?", a: "Tracking details are sent via email." },
];

const FAQs = () => {
  const [open, setOpen] = useState(null);

  return (
    <InfoLayout title="Frequently Asked Questions">
      {faqs.map((item, i) => (
        <div key={i} className="accordion">
          <button onClick={() => setOpen(open === i ? null : i)}>
            {item.q}
            <span>{open === i ? "−" : "+"}</span>
          </button>
          {open === i && <p>{item.a}</p>}
        </div>
      ))}
    </InfoLayout>
  );
};

export default FAQs;
