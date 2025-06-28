import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { userService } from "../../api/user";

const initialState = {
    user: JSON.parse(localStorage.getItem('user')) || null,
    isUserLoading: false,
    error: null,
};

export const userMe = createAsyncThunk(
    'user/me',
    async (_, { rejectWithValue }) => {
        try {
            const response = await userService.me();
            if (!response.success || !response.data) {
                return rejectWithValue(response.error || 'Failed to fetch user data');
            }
            localStorage.setItem('user', JSON.stringify(response.data));
            return response;
        } catch (error) {
            if (error.message === 'Network Error') {
                return rejectWithValue('Network error. Please check your connection.');
            }
            return rejectWithValue(error.response.data);
        }
    }
)

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        clearError: (state) => {
            state.error = null;
        },
        resetUser: (state) => {
            state.user = null;
            state.isUserLoading = false;
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(userMe.pending, (state) => {
                state.isUserLoading = true;
                state.error = null;
            })
            .addCase(userMe.fulfilled, (state, action) => {
                state.isUserLoading = false;
                state.user = action.payload.data;
                state.error = null;
            })
            .addCase(userMe.rejected, (state, action) => {
                state.isUserLoading = false;
                state.user = null;
                state.error = action.payload;
            })
    }
});

export const { clearError, resetUser } = userSlice.actions;
export default userSlice.reducer;