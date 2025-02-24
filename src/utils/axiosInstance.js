import axios from "axios";

const axiosInstance = axios.create({
    baseURL: "https://localhost:7217/api",
    //withCredentials: true // Gửi cookies (chứa refreshToken)
})

// Axios Interceptor để tự động refresh token
axiosInstance.interceptors.response.use(
    response => response,
    async error => {
        if (error.response?.status === 401 && !error.config._retry) {
            error.config._retry = true;

            try {
                const refreshToken = localStorage.getItem("refreshToken");

                const refreshResponse = await axiosInstance.post("/Auth/refresh-token", {
                    refreshToken
                });

                const newAccessToken = refreshResponse.data.accessToken;
                const newRefreshToken = refreshResponse.data.refreshToken;

                localStorage.setItem("accessToken", newAccessToken);
                localStorage.setItem("refreshToken", newRefreshToken);

                // Gửi lại request với accessToken mới
                error.config.headers["Authorization"] = `Bearer ${newAccessToken}`;
                return axiosInstance.request(error.config);
            } catch(refreshError) {
                console.error("Refresh token failed", refreshError);
                localStorage.removeItem("accessToken");
                window.location.href = "/login"; 
            }
        }
        return Promise.reject(error);
    }
);

export default axiosInstance;