import axios from "axios";

let loadUser = () => {}; // Khởi tạo một biến để lưu loadUser function
export const setLoadUser = (fn) => { 
    loadUser = fn; 
};

const axiosInstance = axios.create({
    baseURL: "https://localhost:7217/api",
    headers: { "Content-Type": "application/json" },
});

axiosInstance.interceptors.request.use((config) => {
    const token = localStorage.getItem("accessToken");
    console.log(' Request interceptor:', { 
        url: config.url, 
        hasToken: !!token,
        method: config.method 
    });
    console.log("[Axios] Sending request to:", config.url);
    console.log("[Axios] Access token:", token);
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Axios Interceptor để tự động refresh token
axiosInstance.interceptors.response.use(
    response => {
        console.log('[Axios] Response success:', { 
            url: response.config.url, 
            status: response.status 
        });
        return response;
    },
    async error => {
        console.error('[Axios] Response error:', { 
            url: error.config.url, 
            status: error.response?.status,
            message: error.message 
        });

        if (error.response?.status === 401 && !error.config._retry) {
            console.log('[Axios] Detected 401 error, attempting token refresh...');

            error.config._retry = true;

            try {
                console.log("Access token expired, refreshing...");
                
                const newAccessToken = await refreshToken();
                error.config.headers.Authorization = `Bearer ${newAccessToken}`;

                await loadUser();
                return axiosInstance.request(error.config);
            } catch (refreshError) {
                console.error("Refresh token failed", refreshError);
                window.location.href = "/login";
                return Promise.reject(refreshError);
            }
        }
        return Promise.reject(error);
    }
);


const refreshToken = async () => {
    const refreshToken = localStorage.getItem("refreshToken");
    if (!refreshToken) throw new Error("[Axios] No refresh token found");

    const response = await axios.post("https://localhost:7217/api/auth/refresh-token", { refreshToken });

    localStorage.setItem("accessToken", response.data.data.accessToken);
    localStorage.setItem("refreshToken", response.data.data.refreshToken);

    return response.data.accessToken;
};

export default axiosInstance;