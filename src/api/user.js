import { apiClient } from "./baseAPI";

export const userService = {
    me: async () => {
        try {
            const response = await apiClient.get("/user/me/");
            const data = response.data;
            return { success: true, data: data, error: null };
        } catch (error) {
            return {
                success: false,
                error: error.response?.data?.error || 'Failed to fetch user data. Please try again.',
                data: null,
            };
        }
    },
    onboard: async (payload) => {
        try {
            const response = await apiClient.post("/user/onboard/", payload);
            const data = response.data;
            return { success: true, data: data, error: null };
        } catch (error) {
            return {
                success: false,
                error: error.response?.data?.error || 'Failed to fetch user data. Please try again.',
                data: null,
            };
        }
    },
}