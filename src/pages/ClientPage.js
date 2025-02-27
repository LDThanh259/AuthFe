import { useEffect, useState } from "react";
import axiosInstance from "../utils/axiosInstance";
import { useNavigate } from "react-router-dom";
import { useAuth } from '../context/AuthContext';

export default function ClientPage() {
    const [message, setMessage] = useState('');
    const navigate = useNavigate();
    const { logout } = useAuth();

    useEffect(() => {
        const festData = async () => {
            try{
                const response = await axiosInstance.get('/client/user-only');
                setMessage(response.data);
            } catch(error) {
                console.log(error);
            }

        };
        festData();
    },[]);

    const handleLogout = async() => {
        await logout();
    }
    return (
        <div>
            <h1>{message}</h1>
            <div className="flex space-x-4">
                <button onClick={() => navigate('/profile')}>Profile</button>
                <button className=" mx-2" onClick={handleLogout}>Logout</button>
            </div>
        </div>
    )
}