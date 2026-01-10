import { useEffect, useState } from "react";
import { getFeedback } from "../api/adminapi";

export default function AdminFeedback() {
  const [data, setData] = useState([]);

  useEffect(() => {
    getFeedback().then(res => setData(res.data));
  }, []);

  return (
    <>
      <h2>Feedback</h2>
      {data.map(f => (
        <p key={f.id}>{f.message}</p>
      ))}
    </>
  );
}
