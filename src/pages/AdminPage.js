import { useEffect, useState } from "react";
import axiosInstance from "../utils/axiosInstance";

export default function AdminPage() {
    const [message, setMessage] = useState('');
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const accessToken = localStorage.getItem('accessToken');

                if (!accessToken) {
                    throw new Error("Bạn chưa đăng nhập. Vui lòng đăng nhập để tiếp tục.");
                }

                const response = await axiosInstance.get('/Admin/admin', {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                });

                setMessage(response.data);
            } catch (err) {
                setError(err.response?.status === 403 
                    ? "Bạn không có quyền truy cập trang này!" 
                    : "Lỗi khi tải dữ liệu. Vui lòng thử lại.");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    return (
        <div>
            {loading && <p>Đang tải...</p>}
            {error ? <p style={{ color: "red" }}>{error}</p> : <p>{message}</p>}
        </div>
    );
}
