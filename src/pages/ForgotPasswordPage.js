// ForgotPasswordPage.jsx
import React, { useState } from 'react';
import axios from 'axios';
//import { useNavigate } from 'react-router-dom';
import './ForgotPasswordPage.css';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  //const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('https://localhost:7217/api/Account/forgot-password', {
        email,
      });
      setMessage(response.data.message || 'Check your email for reset instructions.');
    } catch (error) {
      setMessage(error.response?.data?.message || 'An error occurred.');
    }
  };

  return (
    <div className="forgot-container">
      <div className="forgot-card">
        <h2 className="forgot-title">Forgot Password</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Enter your email"
            className="input-field"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <button type="submit" className="submit-button">Submit</button>
        </form>
        {message && <p className="forgot-message">{message}</p>}
      </div>
    </div>
  );
}
