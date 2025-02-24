// src/pages/ResetPassword.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import './ResetPassword.css';

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  // Lấy email và token từ URL
  const email = searchParams.get('email');
  const token = searchParams.get('token');

  useEffect(() => {
    if (!email || !token) {
      navigate('/');
    }
  }, [email, token, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (password !== confirmPassword) {
      return setError('Mật khẩu không khớp');
    }

    try {
      setLoading(true);
      const response = await axios.post(
        'https://localhost:7217/api/Account/reset-password',
        {
          email,
          token: token,
          newPassword: password
        }
      );

      if (response.status === 200) {
        setSuccess(true);
        setTimeout(() => navigate('/login'), 3000);
      }
      if(response.status === 400) {
        setError("badrequest");
      }
    } catch (err) {
      setError(err.response?.data || 'Lỗi khi đặt lại mật khẩu');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="success-message">
        <h2>Đặt lại mật khẩu thành công!</h2>
        <p>Bạn sẽ được chuyển hướng đến trang đăng nhập...</p>
      </div>
    );
  }

  return (
    <div className="reset-password-container">
      <h2>Đặt Lại Mật Khẩu</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Email</label>
          <input 
            type="email" 
            value={email || ''} 
            disabled 
          />
        </div>

        <div className="form-group">
          <label>Mật khẩu mới</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label>Xác nhận mật khẩu</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>

        {error && <div className="error-message">{error}</div>}

        <button 
          type="submit" 
          disabled={loading}
          className="submit-btn"
        >
          {loading ? 'Đang xử lý...' : 'Đặt Lại Mật Khẩu'}
        </button>
      </form>
    </div>
  );
};

export default ResetPassword;