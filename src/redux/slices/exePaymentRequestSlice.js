import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { BASE_URL } from "../baseUrl";

// GET - Fetch all executive payment requests
export const fetchExecutivePaymentRequests = createAsyncThunk(
  "executivePaymentRequest/fetchExecutivePaymentRequests",
  async (_, { rejectWithValue }) => {
    try {
      const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
      const response = await axios.get(`${BASE_URL}/payments/admin/redeems/`, {
        headers: {
          Authorization: token ? `Bearer ${token}` : undefined,
        },
      });
      console.log("API Response:", response.data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to fetch executive payment requests");
    }
  }
);

// PATCH - Update executive payment request status
export const updateExecutivePaymentRequest = createAsyncThunk(
  "executivePaymentRequest/updateExecutivePaymentRequest",
  async ({ id, status }, { rejectWithValue }) => {
    try {
      const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
      const response = await axios.patch(
        `${BASE_URL}/payments/admin/redeems/${id}/`,
        { status },
        {
          headers: {
            Authorization: token ? `Bearer ${token}` : undefined,
            "Content-Type": "application/json",
          },
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to update executive payment request");
    }
  }
);

const executivePaymentSlice = createSlice({
  name: "executivePaymentRequest",
  initialState: {
    executivePaymentRequests: [], // Change this to array instead of object
    loading: false,
    error: null,
    updateLoading: false,
    updateError: null,
  },
  reducers: {
    clearExecutivePaymentsError: (state) => {
      state.error = null;
    },
    clearExecutiveUpdateError: (state) => {
      state.updateError = null;
    },
    clearAllExecutivePaymentStates: (state) => {
      state.error = null;
      state.updateError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Executive Payment Requests
      .addCase(fetchExecutivePaymentRequests.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchExecutivePaymentRequests.fulfilled, (state, action) => {
        state.loading = false;
        // Handle both array and object responses
        if (Array.isArray(action.payload)) {
          state.executivePaymentRequests = action.payload;
        } else if (action.payload.results) {
          state.executivePaymentRequests = action.payload.results;
        } else {
          state.executivePaymentRequests = action.payload;
        }
      })
      .addCase(fetchExecutivePaymentRequests.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update Executive Payment Request
      .addCase(updateExecutivePaymentRequest.pending, (state) => {
        state.updateLoading = true;
        state.updateError = null;
      })
      .addCase(updateExecutivePaymentRequest.fulfilled, (state, action) => {
        state.updateLoading = false;
        
        // Update the specific payment request in the list
        const updatedRequest = action.payload;
        const index = state.executivePaymentRequests.findIndex(
          request => request.id === updatedRequest.id
        );
        
        if (index !== -1) {
          state.executivePaymentRequests[index] = updatedRequest;
        }
      })
      .addCase(updateExecutivePaymentRequest.rejected, (state, action) => {
        state.updateLoading = false;
        state.updateError = action.payload;
      });
  },
});

export const { 
  clearExecutivePaymentsError, 
  clearExecutiveUpdateError,
  clearAllExecutivePaymentStates
} = executivePaymentSlice.actions;

export default executivePaymentSlice.reducer;