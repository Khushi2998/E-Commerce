import { useEffect, useState } from "react";
import { getFAQs } from "../api/adminapi";

export default function AdminFAQs() {
  const [data, setData] = useState([]);

  useEffect(() => {
    getFAQs().then(res => setData(res.data));
  }, []);

  return (
    <>
      <h2>FAQs</h2>
      {data.map(f => (
        <div key={f.id}>
          <strong>{f.question}</strong>
          <p>{f.answer}</p>
        </div>
      ))}
    </>
  );
}
