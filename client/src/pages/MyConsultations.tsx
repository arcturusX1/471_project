import { useEffect, useState } from "react";

export default function MyConsultations() {
  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    fetch("http://localhost:5000/api/consultations/my-consultations", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`
      }
    })
      .then(res => res.json())
      .then(setData);
  }, []);

  return (
    <div className="dashboard-container">
      <h2>My Consultations</h2>

      {data.length === 0 && <p>No consultations yet.</p>}

      {data.map(c => (
        <div key={c._id} className="consultation-card">
          <p><strong>Faculty:</strong> {c.faculty?.name}</p>
          <p><strong>Course:</strong> {c.reason}</p>
          <p><strong>Time:</strong> {new Date(c.preferredStart).toLocaleString()}</p>
          <p><strong>Status:</strong> {c.status}</p>

          {c.status === 'Accepted' && !c.feedbackForST && (
            <button>Give Feedback</button>
          )}
        </div>
      ))}
    </div>
  );
}
