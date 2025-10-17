import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { BASE_URL } from "../baseUrl";

// GET - Fetch user referrals
export const fetchUserReferrals = createAsyncThunk(
  "referrals/fetchUserReferrals",
  async (_, { rejectWithValue }) => {
    try {
      const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

      const response = await axios.get(`${BASE_URL}/users/referrals/`, {
        headers: {
          Authorization: token ? `Bearer ${token}` : undefined,
        },
      });

      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to fetch referrals");
    }
  }
);

const referralsSlice = createSlice({
  name: "referrals",
  initialState: {
    referrals: { 
      results: [],
      count: 0
    },
    loading: false,
    error: null,
  },
  reducers: {
    clearReferralsError: (state) => {
      state.error = null;
    },
    clearReferralsData: (state) => {
      state.referrals = { results: [], count: 0 };
    },
    clearAllReferralsStates: (state) => {
      state.error = null;
      state.referrals = { results: [], count: 0 };
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch User Referrals
      .addCase(fetchUserReferrals.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserReferrals.fulfilled, (state, action) => {
        state.loading = false;
        state.referrals = action.payload;
      })
      .addCase(fetchUserReferrals.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { 
  clearReferralsError,
  clearReferralsData,
  clearAllReferralsStates
} = referralsSlice.actions;

export default referralsSlice.reducer;