import { BASE_URL } from '@/utils/app.constent';
import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

interface UserProfile {
  userId: string;
  fullName: string;
  email: string;
  type: string;
}

interface AuthState {
  token: string | null;
  userProfile: UserProfile | null;
  loading: boolean;
  error: string | null;
}

// Updated initial state with loading and error fields.
const initialState: AuthState = {
  token: null,
  userProfile: null,
  loading: false,
  error: null,
};


// Define the type for user data
interface userData {
  firstname: string;
  lastname: string;
  email: string;
  password: string;
  type: string;
}

// Define the type for the API response
interface SignupResponse {
  message: string;
}

// Create an async thunk for logging in.
export const loginUser = createAsyncThunk<
  // Return type of the payload creator (the fulfilled action)
  { token: string; user: UserProfile },{ email: string; password: string },
  {rejectValue: string;}
>(
  'auth/loginUser',
  async (credentials, { rejectWithValue }) => {
    try {
      // Replace with your actual API endpoint and request configuration.
      const response = await axios.post(`${BASE_URL}/user/login`, credentials);
      return response?.data?.data;
    } catch (error: any) {
      // If the request fails, return a rejected action with the error message.
      return rejectWithValue(error.response?.data?.message);
    }
  }
);
// Create an async thunk for signing in.
export const signinUser = createAsyncThunk<string, userData, {rejectValue: string;}>(
  'auth/signinUser',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await axios.post<SignupResponse>(`${BASE_URL}/user/signup`, userData);
      return response?.data?.message;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message);
    }
  }
);


const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // For manual login, you could still use this if needed.
    setCredentials: (
      state,
      action: PayloadAction<{ token: string; user: UserProfile }>
    ) => {
      state.token = action.payload.token;
      state.userProfile = action.payload.user;
      state.loading = false;
      state.error = null;
    },
    clearCredentials: (state) => {
      state.token = null;
      state.userProfile = null;
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // When the loginUser thunk is dispatched:
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.token = action.payload.token;
        state.userProfile = action.payload.user;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Login failed';
      });
  },
});

export const { setCredentials, clearCredentials } = authSlice.actions;
export default authSlice.reducer;
