import React, { useState } from 'react';
import type { RegisterData } from '../types/auth'; // Using the type we created
import './Auth.css';

const Register: React.FC = () => {
  const [formData, setFormData] = useState<RegisterData>({
   name: "",
   universityId: "",
   email: "",
   password: "",
   roles: "student", // lowercase
   department: ""
  });


  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      if (response.ok) {
        alert("Registration Successful!");
        // Logic to redirect to login or dashboard
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error("Error during registration:", error);
    }
  };

  return (
    <div className="auth-container">
      <form className="auth-form" onSubmit={handleSubmit}>
        <h2>Create Account</h2>
        <input name="name" placeholder="Full Name" onChange={handleChange} required />
        <input name="universityId" placeholder="Student ID or FacultyInitial" onChange={handleChange} required />
        <input name="email" type="email" placeholder="Email" onChange={handleChange} required />
        <input name="password" type="password" placeholder="Password" onChange={handleChange} required />
        
        <select name="roles" value={formData.roles} onChange={handleChange}>
          <option value="student">Student</option>
          <option value="faculty">Faculty</option>
        </select>

        <input name="department" placeholder="Department" onChange={handleChange} required />
        
        <button type="submit">Register</button>
      </form>
    </div>
  );
};

export default Register;