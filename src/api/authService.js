import { apiClient } from "./baseAPI";

export const authService = {
    signin: async (payload) => {
        try {
            const response = await apiClient.post("/auth/signin/", payload);
            const data = response.data;
            return { success: true, data: data, error: null };
        } catch (error) {
            return {
                success: false,
                error: error.response?.data?.error || 'Signin failed. Please try again.',
                data: null,
            };
        }
    },
    signup: async (payload) => {
        try {
            const response = await apiClient.post("/auth/signup/", payload);
            const data = response.data;
            return { success: true, data: data, error: null };
        } catch (error) {
            return {
                success: false,
                error: error.response?.data?.error || 'Signin failed. Please try again.',
                data: null,
            };
        }
    }
}