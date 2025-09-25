import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { BASE_URL } from "../baseUrl";

// Login
export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${BASE_URL}/accounts/admin/login/`, {
        email,
        password
      });

      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Login failed");
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    token: null,
    loading: false,
    error: null,
  },
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      if (typeof window !== "undefined") {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      }
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = {
          id: action.payload.user_id,
          email: action.payload.email,
          is_staff: action.payload.is_staff,
          is_superuser: action.payload.is_superuser,
          role: action.payload.role
        };
        state.token = action.payload.access_token;
        
        if (typeof window !== "undefined") {
          localStorage.setItem("token", action.payload.access_token);
          localStorage.setItem("user", JSON.stringify({
            id: action.payload.user_id,
            email: action.payload.email,
            is_staff: action.payload.is_staff,
            is_superuser: action.payload.is_superuser,
            role: action.payload.role
          }));
        }
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { logout, clearError } = authSlice.actions;
export default authSlice.reducer;