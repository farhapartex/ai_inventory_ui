import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const similateAPICall = (credentials) => {
    return { token: "aksjdalksjhdlakjshdljkasd" };
}

// const simulateLoginAPI = async (credentials) => {
//   return new Promise((resolve, reject) => {
//     setTimeout(() => {
//       // Simulate API response
//       if (credentials.email && credentials.password) {
//         resolve({
//           token: 'fake-jwt-token-' + Date.now(),
//           user: {
//             id: 1,
//             email: credentials.email,
//             name: 'John Doe',
//             role: 'admin'
//           }
//         });
//       } else {
//         reject(new Error('Invalid credentials'));
//       }
//     }, 1000);
//   });
// };

export const loginUser = createAsyncThunk(
    'auth/loginUser',
    async (credentials, { rejectWithValue }) => {
        try {
            const response = await similateAPICall(credentials);
            localStorage.setItem('token', response.token);
            return response;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
)

export const logoutUser = createAsyncThunk(
    'auth/logoutUser',
    async (_, { rejectWithValue }) => {
        try {
            localStorage.removeItem('token');
            return {};
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

const initialState = {
    token: localStorage.getItem('token') || null,
    isLoading: false,
    isAuthenticated: !!localStorage.getItem('token'),
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
        updateUserProfile: (state, action) => {
            if (state.user) {
                state.user = { ...state.user, ...action.payload };
                localStorage.setItem('user', JSON.stringify(state.user));
            }
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
                state.user = action.payload.user;
                state.token = action.payload.token;
                state.error = null;
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.isLoading = false;
                state.isAuthenticated = false;
                state.user = null;
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
                state.user = null;
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