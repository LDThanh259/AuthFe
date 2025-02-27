import { createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios';
import axiosInstance, {setLoadUser} from '../utils/axiosInstance';

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Khởi tạo trạng thái authentication khi app load
    useEffect(() => {
        const initializeAuth = async () => {
            const token = localStorage.getItem('accessToken');
            console.log('[AuthContext] Found accessToken in storage:', !!token);

            if (token) {
                try {
                    console.log('[AuthContext] Validating access token...');

                    // Gọi API validate và nhận data user
                    const response = await axiosInstance.get('/auth/validate');

                    console.log('[AuthContext] Token validation successful:', response.data);

                    // Lấy user từ response.data.data (theo cấu trúc API)
                    setUser(response.data.data); 
                } catch (error) {
                    try {
                        console.error('[AuthContext] Token validation failed:', error);
                        await refreshToken();
                    } catch {
                        console.error('[AuthContext] Logout', error);
                        localStorage.removeItem('accessToken');

                        //logout();
                    }
                }
            } else{
                try {
                    console.log('[AuthContext] No access token, attempting refresh...');
                    await refreshToken();
                } catch(error) {
                    console.error('[AuthContext] Logout', error);

                    //logout();
                }
            }
            setLoading(false);  // Truyền loadUser vào axiosInstance
        };

        initializeAuth();
        setLoadUser(loadUser);
    }, []);

    const refreshToken = async () => {
        console.log('[AuthContext] Attempting token refresh...');

        try {
            const refreshToken = localStorage.getItem("refreshToken");
            console.log('[AuthContext] Refresh token exists:', !!refreshToken);

            if (!refreshToken) {
                logout();
                throw new Error("No refresh token available");
            }

            const response = await axiosInstance.post("/auth/refresh-token", {refreshToken});
            console.log('[AuthContext] Refresh token response:', response.data);

            localStorage.setItem("accessToken", response.data.data.accessToken);
            localStorage.setItem("refreshToken", response.data.data.refreshToken);
            console.log('[AuthContext] Tokens updated in localStorage');

            await loadUser();

        } catch( error) {
            console.error('[AuthContext] Refresh token failed, logging out...', error);
            logout();
            throw error;
        }
    }

    const loadUser = async () => {
        const token = localStorage.getItem('accessToken');
        console.log('[AuthContext load user] Found accessToken in storage:', !!token);

        if (!token) {
            setUser(null);
            return;
        }

        try {
            console.log('[AuthContext load user] Validating access token...');

            const response = await axios.get('https://localhost:7217/api/auth/validate', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setUser(response.data.data);
            console.log('[AuthContext load user] Validating access token...');
        } catch (error) {
            localStorage.removeItem('accessToken');

            //logout();
        }
    };

    const login = async (credentials) => {
        console.log('[AuthContext] Login attempt with credentials:', credentials);
        try {
            const response = await axios.post('https://localhost:7217/api/auth/login', credentials);
            console.log('[AuthContext] Login response:', response.data);
    
            localStorage.setItem('accessToken', response.data.data.accessToken);
            localStorage.setItem('refreshToken', response.data.data.refreshToken);
            console.log('[AuthContext] Tokens stored in localStorage');
    
            await loadUser();

        } catch( error) {
            console.error('[AuthContext] Login failed:', error);
            throw error;
        }
    };

    const logout = async () => {
        console.log('[AuthContext] Logging out...');
        const accessToken = localStorage.getItem('accessToken');
        try {
            const response = await axios.get('https://localhost:7217/api/auth/logout',{
                headers: { Authorization: `Bearer ${accessToken}` }
            });
            console.log('Logout successful:', response.data);
        } catch (error) {
            if (error.response) {
                console.log('Logout API error:', error.response.data);
            } else {
                console.log('Network error or server unreachable:', error.message);
            }
        } finally {
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
    
            setUser(null);
        }
    };

    // Context value cung cấp cho toàn app
    const value = {
        user,
        loading,
        login,
        logout,
        loadUser,
        isAuthenticated: !!user
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);