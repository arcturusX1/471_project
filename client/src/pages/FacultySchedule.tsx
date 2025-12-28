import React, { useEffect, useState } from 'react';
import './Dashboard.css';

const FacultySchedule: React.FC = () => {
  const [sessions, setSessions] = useState<any[]>([]);

  useEffect(() => {
    const fetchSchedule = async () => {
      const res = await fetch('http://localhost:5000/api/consultations/schedule', {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      const data = await res.json();
      setSessions(data);
    };
    fetchSchedule();
  }, []);

  return (
    <div className="dashboard-container">
      <h2>My Consultation Schedule</h2>
      <p>These are your confirmed meetings with students.</p>
      
      <div className="schedule-grid">
        {sessions.length > 0 ? (
          sessions.map((session) => (
            <div key={session._id} className="schedule-card">
              <div className="status-badge">Accepted</div>
              <h4>{session.reason}</h4>
              <p><strong>Student:</strong> {session.requester?.name}</p>
              <p><strong>ID:</strong> {session.requester?.universityId}</p>
              <p><strong>Time:</strong> {new Date(session.preferredStart).toLocaleString()}</p>
              
            </div>
          ))
        ) : (
          <p>You have no upcoming consultations scheduled.</p>
        )}
      </div>
    </div>
  );
};

export default FacultySchedule;