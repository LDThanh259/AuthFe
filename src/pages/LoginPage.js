import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './LoginPage.css';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import { useAuth } from '../context/AuthContext';
import axiosInstance from '../utils/axiosInstance';

export default function LoginPage() {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const { login, loadUser } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();
    console.log('[LoginPage] Form submitted:', { identifier });

    try {
      await login({ identifier, password });
      console.log('[LoginPage] Login successful, redirecting...');

      const redirectTo = location.state?.from?.pathname || '/';
      navigate(redirectTo, { replace: true });
    } catch (error) {
      console.error('[LoginPage] Login error:', error);

      setError('Invalid email or password');
    }
  };

  const handleSuccess = async (credentialResponse) => {
    console.log('[LoginPage] Google login success:', credentialResponse);

    try {
      const response = await axiosInstance.post('/auth/google', {
        token: credentialResponse.credential
      });
      console.log('[LoginPage] Google login response:', response.data);

      const data = response.data; 
      if (data.success) { 
        localStorage.setItem('accessToken', data.data.accessToken);
        localStorage.setItem('refreshToken', data.data.refreshToken);
        console.log('[LoginPage] Google tokens stored');

        await loadUser();
        console.log('[LoginPage] Google user loaded, redirecting...');

        const redirectTo = location.state?.from?.pathname || '/';
        navigate(redirectTo, { replace: true });
      } else {
        console.error('[LoginPage] Google login error:', data.errors);
        navigate('/');
      }
    } catch (error) {
      console.error("Error during Google login:", error);
      navigate('/');
      console.error("Google login error:", error);
    }
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
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
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
        <a className="forgot-password-button" href="/forgot-password">
          Forgot Password?
        </a>
        <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}>
          <div>
            <GoogleLogin
              onSuccess={handleSuccess}
              onError={() => setError('Login Failed')}
              useOneTap
            />
          </div>
        </GoogleOAuthProvider>
        {error && <p className="login-error">{error}</p>}
      </div>
    </div>
  );
}
