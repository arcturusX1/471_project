import React, { useEffect, useState } from 'react';
import './Dashboard.css';

const ConsultationRequests: React.FC = () => {
  const [requests, setRequests] = useState<any[]>([]);

  const fetchRequests = async () => {
    const res = await fetch('http://localhost:5000/api/consultations/my-consultations', {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
    });
    const data = await res.json();
    setRequests(data);
  };

  useEffect(() => { fetchRequests(); }, []);

  const handleAction = async (id: string, status: string) => {
    await fetch(`http://localhost:5000/api/consultations/${id}`, {
      method: 'PUT',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}` 
      },
      body: JSON.stringify({ status })
    });
    fetchRequests(); // Refresh table after action
  };

  return (
    <div className="dashboard-container">
      <h2>Incoming Consultation Requests</h2>
      <table className="consultation-table">
        <thead>
          <tr>
            <th>Student Name</th>
            <th>Course (Reason)</th>
            <th>Date & Time</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {requests.map((req) => (
            <tr key={req._id}>
              <td>{req.requester?.name}</td>
              <td>{req.reason}</td>
              <td>{new Date(req.preferredStart).toLocaleString()}</td>
              <td>
                <button className="accept-btn" onClick={() => handleAction(req._id, 'Accepted')}>Accept</button>
                <button className="st-btn" onClick={() => alert("Redirecting to ST Assignment...")}>Assign ST</button>
                <button className="delete-btn" onClick={() => handleAction(req._id, 'Deleted')}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ConsultationRequests;