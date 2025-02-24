import React, { useState, useEffect } from 'react';
import axiosInstance from '../utils/axiosInstance';
import { useNavigate } from 'react-router-dom';

const ProfilePage = () => {
    const [profile, setProfile] = useState(null);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProfile = async() => {
            try {
                const accessToken = localStorage.getItem('accessToken');

                const response = await axiosInstance.get('/Client/profile', {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                      },
                });
                setProfile(response.data);
            }catch(err) {
                setError('Failed to fetch profile. Please log in again.');
            }
        };

        fetchProfile();
    }, []);
    
    if (error) {
        return <div className="text-red-500">{error}</div>;
    }

    const handleOnclick = (e) => {
        navigate('/change-password');
    }

    return (
        <div className="p-4 border rounded-lg shadow-md">
            {profile ? (
                <div>
                    <h2 className="text-xl font-bold mb-2">User Profile</h2>
                    <p><strong>User ID:</strong> {profile.userId}</p>
                    <p><strong>Name:</strong> {profile.name}</p>
                    <p><strong>Email:</strong> {profile.email}</p>
                    <p><strong>Role:</strong> {profile.roles}</p>
                </div>
            ) : (
                <p>Loading profile...</p>
            )}
            <button onClick = {handleOnclick}>Change Password</button>
        </div>
    );
};

export default ProfilePage;