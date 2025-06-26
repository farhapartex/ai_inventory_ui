import axios from "axios";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "http://localhost:8000/api/v1";

export const apiClient = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
    }
});


apiClient.interceptors.request.user((config) => {
    const token = localStorage.getItem("inventoryToken");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
},
    (error) => Promise.reject(error)
);

apiClient.interceptors.response.user(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            try {
                const refreshToken = localStorage.getItem('inventoryRefreshToken');
                if (!refreshToken) {
                    return Promise.reject(error);
                }

                const response = await apiClient.post('/auth/refresh-token', { refreshToken });

                if (response.data.token) {
                    localStorage.setItem('inventoryToken', response.data.token);
                    localStorage.setItem('inventoryRefreshToken', response.data.refreshToken);
                    return apiClient(originalRequest);
                }
            } catch (refreshError) {
                localStorage.removeItem('inventoryToken');
                localStorage.removeItem('inventoryRefreshToken');
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error)
    }
);