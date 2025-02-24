import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import './ChangePassword.css';

const ChangePasswordPage = () => {
    const [error, setError] = useState('');
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const navigate = useNavigate();

    const accessToken = localStorage.getItem('accessToken');

    const handleOnSubmit = async (e) => {
        e.preventDefault();

        try {
            await axios.post('https://localhost:7217/api/Account/change-password', {
                currentPassword,
                newPassword
            }, {
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json'
                }
            });
            navigate('/login');
        } catch (err) {
            setError('Failed to change password. Please try again.');
        }
    };

    return (
        <div className="change-password-container">
            <form onSubmit={handleOnSubmit} className="change-password-form">
                <input 
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="Current Password"
                    required
                    className="input-field"
                />
                <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="New Password"
                    required
                    className="input-field"
                />
                <button type="submit" className="submit-btn">Change Password</button>
                {error && <div className="error-message">{error}</div>}
            </form>
        </div>
    );
};

export default ChangePasswordPage;
