import { apiClient } from "./baseAPI";

export const productService = {
    categoryList: async () => {
        try {
            const response = await apiClient.get("/product/categories/");
            const data = response.data;
            return { success: true, data: data, error: null };
        } catch (error) {
            return {
                success: false,
                error: error.response?.data?.error || 'Failed to load categories.',
                data: null,
            };
        }
    },
    categoryCreate: async (payload) => {
        try {
            const response = await apiClient.post("/product/categories/", payload);
            const data = response.data;
            return { success: true, data: data, error: null };
        } catch (error) {
            return {
                success: false,
                error: error.response?.data?.error || 'Failed to create category.',
                data: null,
            };
        }
    },
}