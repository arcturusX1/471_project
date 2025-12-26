import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Auth.css';

const RequestConsultation: React.FC = () => {
  const [facultyList, setFacultyList] = useState<{_id: string, name: string}[]>([]);
  const [formData, setFormData] = useState({
    facultyId: "", // This will hold the ID while the user sees the Name
    reason: "",    // This is the "Course" input
    date: ""
  });
  const navigate = useNavigate();

  // Load faculty names when the page opens
  useEffect(() => {
    const fetchFaculty = async () => {
      const res = await fetch('http://localhost:5000/api/auth/faculty');
      const data = await res.json();
      setFacultyList(data);
    };
    fetchFaculty();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem('token');

    try {
      const response = await fetch('http://localhost:5000/api/consultations/request', {
        method: 'POST',
        headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify({
          faculty: formData.facultyId,
          reason: formData.reason, // The student typed the Course here
          preferredStart: formData.date
        }),
      });

      if (response.ok) {
        alert("Request Sent Successfully!");
        navigate('/student-dashboard');
      }
    } catch (error) {
      console.error("Request failed", error);
    }
  };

  return (
    <div className="auth-container">
      <form className="auth-form" onSubmit={handleSubmit}>
        <h2>Request Consultation</h2>
        
        <label>Course Name (Reason)</label>
        <input 
          name="reason" 
          placeholder="e.g. Data Structures" 
          onChange={(e) => setFormData({...formData, reason: e.target.value})} 
          required 
        />

        <label>Select Faculty</label>
        <select 
          onChange={(e) => setFormData({...formData, facultyId: e.target.value})} 
          required
        >
          <option value="">-- Choose a Faculty --</option>
          {facultyList.map(f => (
            <option key={f._id} value={f._id}>{f.name}</option>
          ))}
        </select>

        <label>Preferred Date & Time</label>
        <input 
          type="datetime-local" 
          onChange={(e) => setFormData({...formData, date: e.target.value})} 
          required 
        />

        <button type="submit">Submit Request</button>
      </form>
    </div>
  );
};

export default RequestConsultation;