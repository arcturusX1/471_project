import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { AuthResponse } from '../types/auth';
import './Auth.css'; // Reusing the same CSS from Register

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data: AuthResponse = await response.json();

      if (response.ok && data.user && data.token) {
        // 1. Save token
        localStorage.setItem('token', data.token);

        // 2. IMPORTANT: Save the full user object so Dashboards can read user.name, user.universityId, etc.
        localStorage.setItem('user', JSON.stringify(data.user));

        // 3. Redirect based on role
        if (data.user.roles.includes('Faculty')) {
          navigate('/faculty-dashboard');
        } else {
          navigate('/student-dashboard');
        }
      } else {
        alert(data.message || "Invalid Login");
      }
    } catch (error) {
      console.error("Login error:", error);
      alert("Server error. Please try again later.");
    }
  };

  return (
    <div className="auth-container">
      <form className="auth-form" onSubmit={handleSubmit}>
        <h2>Login</h2>
        <input 
          type="email" 
          placeholder="Email" 
          value={email}
          onChange={(e) => setEmail(e.target.value)} 
          required 
        />
        <input 
          type="password" 
          placeholder="Password" 
          value={password}
          onChange={(e) => setPassword(e.target.value)} 
          required 
        />
        <button type="submit">Login</button>
        <p style={{ textAlign: 'center', marginTop: '10px' }}>
          Don't have an account? <span style={{ color: '#007bff', cursor: 'pointer' }} onClick={() => navigate('/register')}>Register</span>
        </p>
      </form>
    </div>
  );
};

export default Login;