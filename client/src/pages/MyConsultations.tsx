import { useEffect, useState } from "react";

export default function MyConsultations() {
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    fetch(
      `http://localhost:1623/api/consultations/student/${user.universityId}`
    )
      .then(res => res.json())
      .then(setData);
  }, []);

  return (
    <>
      <h2>My Consultations</h2>
      {data.map(c => (
        <div key={c._id}>
          {c.courseCode} — {c.status}
        </div>
      ))}
    </>
  );
}
