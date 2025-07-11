import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { userService } from "../../api/user";
import { productService } from '../../api/productService';

const initialState = {
    categories: null,
    products: null,
    isCategoryLoading: false,
    isProductLoading: false,
    error: null,
};

export const productCategory = createAsyncThunk(
    'product/category',
    async (_, { rejectWithValue }) => {
        try {
            const response = await productService.categoryList();
            if (!response.success || !response.data) {
                return rejectWithValue(response.error || 'Failed to load categories.');
            }
            return response;
        } catch (error) {
            if (error.message === 'Network Error') {
                return rejectWithValue('Network error. Please check your connection.');
            }
            return rejectWithValue(error.response.data);
        }
    }
)

const productSlice = createSlice({
    name: 'product',
    initialState,
    reducers: {
        clearError: (state) => {
            state.error = null;
        },
        resetProduct: (state) => {
            state.categories = null;
            state.products = null;
            state.isCategoryLoading = false;
            state.isProductLoading = false;
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(productCategory.pending, (state) => {
                state.isCategoryLoading = true;
                state.error = null;
            })
            .addCase(productCategory.fulfilled, (state, action) => {
                state.isCategoryLoading = false;
                state.categories = action.payload.data;
                state.error = null;
            })
            .addCase(productCategory.rejected, (state, action) => {
                state.isCategoryLoading = false;
                state.categories = null;
                state.error = action.payload;
            })
    }
});

export const { clearError, resetProduct } = productSlice.actions;
export default productSlice.reducer;