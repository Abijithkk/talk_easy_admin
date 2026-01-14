import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { BASE_URL } from "../baseUrl";

// GET - Fetch all call history
export const fetchCallHistory = createAsyncThunk(
  "calls/fetchCallHistory",
  async (_, { rejectWithValue }) => {
    try {
      const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

      const response = await axios.get(`${BASE_URL}/calls/call-History/`, {
        headers: {
          Authorization: token ? `Bearer ${token}` : undefined,
        },
      });
      console.log(response);
      

      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to fetch call history");
    }
  }
);

// GET - Fetch single call by ID
export const fetchCallById = createAsyncThunk(
  "calls/fetchCallById",
  async (id, { rejectWithValue }) => {
    try {
      const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

      const response = await axios.get(`${BASE_URL}/calls/call-history/${id}/`, {
        headers: {
          Authorization: token ? `Bearer ${token}` : undefined,
        },
      });

      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to fetch call");
    }
  }
);

const callSlice = createSlice({
  name: "calls",
  initialState: {
    calls: { 
      results: [],
      count: 0
    },
    currentCall: null, 
    loading: false,
    error: null,
    currentCallLoading: false,
    currentCallError: null,
  },
  reducers: {
    clearCallsError: (state) => {
      state.error = null;
    },
    clearCurrentCallError: (state) => {
      state.currentCallError = null;
    },
    clearCurrentCall: (state) => {
      state.currentCall = null;
    },
    clearAllCallStates: (state) => {
      state.error = null;
      state.currentCallError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Call History
      .addCase(fetchCallHistory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCallHistory.fulfilled, (state, action) => {
        state.loading = false;
        state.calls = action.payload;
      })
      .addCase(fetchCallHistory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch Single Call by ID
      .addCase(fetchCallById.pending, (state) => {
        state.currentCallLoading = true;
        state.currentCallError = null;
      })
      .addCase(fetchCallById.fulfilled, (state, action) => {
        state.currentCallLoading = false;
        state.currentCall = action.payload;
      })
      .addCase(fetchCallById.rejected, (state, action) => {
        state.currentCallLoading = false;
        state.currentCallError = action.payload;
      });
  },
});

export const { 
  clearCallsError, 
  clearCurrentCallError,
  clearCurrentCall,
  clearAllCallStates
} = callSlice.actions;

export default callSlice.reducer;