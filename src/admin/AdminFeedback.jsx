import { useEffect, useState } from "react";
import { getFeedback } from "../api/adminapi";

export default function AdminFeedback() {
  const [feedbacks, setFeedbacks] = useState([]);

  useEffect(() => {
    getFeedback()
      .then(res => {
        console.log("FEEDBACK RESPONSE ", res.data);
        setFeedbacks(res.data);
      })
      .catch(err => console.error(err));
  }, []);

  return (
    <>
      <h2>Feedback</h2>

      {feedbacks.length === 0 ? (
        <p>No feedback found</p>
      ) : (
        <ul>
          {feedbacks.map(f => (
            <li key={f.id}>{f.message}</li>
          ))}
        </ul>
      )}
    </>
  );
}
