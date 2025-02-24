import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './LoginPage.css';
import { useSearchParams } from "react-router-dom";

export default function LoginPage() {
  const [identified, setIdentified] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const [searchParams] = useSearchParams();
  const returnUrl = searchParams.get("returnUrl") || "/";

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`https://localhost:7217/api/Auth/login?returnUrl=${returnUrl}`, {
        identified,
        password,
      });
      setMessage('Login successful!');
      localStorage.setItem('accessToken', response.data.accessToken);
      localStorage.setItem('refreshToken', response.data.refreshToken);

      navigate('/profile');
    } catch (error) {
      setMessage('Invalid email or password');
    }
  };

  const handleForgotPassword = (e) => {
    navigate('/forgot-password');
  };

  const handleGoogleLogin = async (e) => {
    // e.preventDefault();
    // try {
    //   const response = await axios.get('https://localhost:7217/api/Auth/external-login',);
    //   setMessage('Login successful!');
    //   localStorage.setItem('accessToken', response.accessToken);
    //   localStorage.setItem('refreshToken', response.refreshToken);

    //   navigate('/dashboard');
    // } catch(error) {
    //   setMessage('Invalid email or password');
    // }
    window.location.href = `https://localhost:7217/api/Auth/external-login?returnUrl=${returnUrl}`;
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2 className="login-title">Login</h2>
        <form onSubmit={handleLogin} className="login-form">
          <input
            type="text"
            placeholder="Username or Email"
            className="input-field"
            value={identified}
            onChange={(e) => setIdentified(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            className="input-field"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit" className="login-button">Login</button>
        </form>
        <a className="forgot-password-button" onClick={handleForgotPassword}>
          Forgot Password?
        </a>
        <button className="login-button" onClick={handleGoogleLogin}>
          Google
        </button>
        {message && <p className="login-message">{message}</p>}
      </div>
    </div>
  );
}
