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

// GET - Fetch ongoing calls
export const fetchOngoingCalls = createAsyncThunk(
  "calls/fetchOngoingCalls",
  async (_, { rejectWithValue }) => {
    try {
      const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

      const response = await axios.get(`${BASE_URL}/calls/ongoing/`, {
        headers: {
          Authorization: token ? `Bearer ${token}` : undefined,
        },
      });
console.log(response)
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to fetch ongoing calls");
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
    ongoingCalls: [], 
    loading: false,
    error: null,
    currentCallLoading: false,
    currentCallError: null,
    ongoingCallsLoading: false,
    ongoingCallsError: null,
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
    clearOngoingCallsError: (state) => {
      state.ongoingCallsError = null;
    },
    clearOngoingCalls: (state) => {
      state.ongoingCalls = []; // Update this
    },
    clearAllCallStates: (state) => {
      state.error = null;
      state.currentCallError = null;
      state.ongoingCallsError = null;
    },
    // Optional: Add a reducer to manually add/remove ongoing calls in real-time
    addOngoingCall: (state, action) => {
      state.ongoingCalls.push(action.payload); // Update this
    },
    removeOngoingCall: (state, action) => {
      state.ongoingCalls = state.ongoingCalls.filter(
        call => call.id !== action.payload
      ); // Update this
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
      })

      // Fetch Ongoing Calls - UPDATED
      .addCase(fetchOngoingCalls.pending, (state) => {
        state.ongoingCallsLoading = true;
        state.ongoingCallsError = null;
      })
      .addCase(fetchOngoingCalls.fulfilled, (state, action) => {
        state.ongoingCallsLoading = false;
        state.ongoingCalls = action.payload; // This is now the array directly
      })
      .addCase(fetchOngoingCalls.rejected, (state, action) => {
        state.ongoingCallsLoading = false;
        state.ongoingCallsError = action.payload;
      });
  },
});
export const { 
  clearCallsError, 
  clearCurrentCallError,
  clearCurrentCall,
  clearOngoingCallsError,
  clearOngoingCalls,
  clearAllCallStates,
  addOngoingCall,
  removeOngoingCall
} = callSlice.actions;

export default callSlice.reducer;