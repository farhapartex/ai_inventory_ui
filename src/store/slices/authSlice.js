import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { authService } from '../../api/authService';

export const loginUser = createAsyncThunk(
    'auth/loginUser',
    async (credentials, { rejectWithValue }) => {
        try {
            const response = await authService.signin(credentials);
            if (!response.success || !response.data.token) {
                return rejectWithValue(response.error || 'Login failed');
            }
            localStorage.setItem('inventoryToken', response.data.token);
            return response;
        } catch (error) {
            if (error.message === 'Network Error') {
                return rejectWithValue('Network error. Please check your connection.');
            }
            return rejectWithValue(error.response.data);
        }
    }
)

export const signUpUser = createAsyncThunk(
    'auth/signUpUser',
    async (credentials, { rejectWithValue }) => {
        try {
            const response = await authService.signup(credentials);
            if (!response.success || !response.data.is_success) {
                return rejectWithValue(response.error || 'Sign Up failed');
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

export const logoutUser = createAsyncThunk(
    'auth/logoutUser',
    async (_, { rejectWithValue }) => {
        try {
            localStorage.removeItem('inventoryToken');
            localStorage.removeItem('user');
            return null;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

const initialState = {
    token: localStorage.getItem('inventoryToken') || null,
    isLoading: false,
    isAuthenticated: !!localStorage.getItem('inventoryToken'),
    error: null,
};


const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        clearError: (state) => {
            state.error = null;
        },
        resetAuth: (state) => {
            state.token = null;
            state.isAuthenticated = false;
            state.isLoading = false;
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(loginUser.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isAuthenticated = true;
                state.token = action.payload.token;
                state.error = null;
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.isLoading = false;
                state.isAuthenticated = false;
                state.token = null;
                state.error = action.payload;
            })
            .addCase(signUpUser.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(signUpUser.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isAuthenticated = false;
                state.token = null;
                state.error = null;
            })
            .addCase(signUpUser.rejected, (state, action) => {
                state.isLoading = false;
                state.isAuthenticated = false;
                state.token = null;
                state.error = action.payload;
            })

            // LOGOUT CASES
            .addCase(logoutUser.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(logoutUser.fulfilled, (state) => {
                state.isLoading = false;
                state.isAuthenticated = false;
                state.token = null;
                state.error = null;
            })
            .addCase(logoutUser.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            });
    }
});

export const { clearError, resetAuth, updateUserProfile } = authSlice.actions;
export default authSlice.reducer;