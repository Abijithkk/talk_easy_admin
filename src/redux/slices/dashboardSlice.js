import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { BASE_URL } from "../baseUrl";

// GET - Fetch executives analytics
export const fetchExecutivesAnalytics = createAsyncThunk(
  "dashboard/fetchExecutivesAnalytics",
  async (_, { rejectWithValue }) => {
    try {
      const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

      const response = await axios.get(`${BASE_URL}/executives/analytics/`, {
        headers: {
          Authorization: token ? `Bearer ${token}` : undefined,
        },
      });

      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to fetch executives analytics");
    }
  }
);

// GET - Fetch users analytics
export const fetchUsersAnalytics = createAsyncThunk(
  "dashboard/fetchUsersAnalytics",
  async (_, { rejectWithValue }) => {
    try {
      const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

      const response = await axios.get(`${BASE_URL}/users/analytics/`, {
        headers: {
          Authorization: token ? `Bearer ${token}` : undefined,
        },
      });

      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to fetch users analytics");
    }
  }
);

// GET - Fetch calls analytics
export const fetchCallsAnalytics = createAsyncThunk(
  "dashboard/fetchCallsAnalytics",
  async (_, { rejectWithValue }) => {
    try {
      const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

      const response = await axios.get(`${BASE_URL}/calls/analytics/`, {
        headers: {
          Authorization: token ? `Bearer ${token}` : undefined,
        },
      });

      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to fetch calls analytics");
    }
  }
);

// GET - Fetch payments analytics
export const fetchPaymentsAnalytics = createAsyncThunk(
  "dashboard/fetchPaymentsAnalytics",
  async (_, { rejectWithValue }) => {
    try {
      const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

      const response = await axios.get(`${BASE_URL}/payments/analytics/`, {
        headers: {
          Authorization: token ? `Bearer ${token}` : undefined,
        },
      });

      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to fetch payments analytics");
    }
  }
);

const dashboardSlice = createSlice({
  name: "dashboard",
  initialState: {
    executivesAnalytics: null,
    usersAnalytics: null,
    callsAnalytics: null,
    paymentsAnalytics: null,
    
    // Loading states
    executivesAnalyticsLoading: false,
    usersAnalyticsLoading: false,
    callsAnalyticsLoading: false,
    paymentsAnalyticsLoading: false,
    
    // Error states
    executivesAnalyticsError: null,
    usersAnalyticsError: null,
    callsAnalyticsError: null,
    paymentsAnalyticsError: null,
    
    // Overall loading state (if any analytics is loading)
    loading: false,
    // Overall error state
    error: null,
  },
  reducers: {
    clearExecutivesAnalyticsError: (state) => {
      state.executivesAnalyticsError = null;
    },
    clearUsersAnalyticsError: (state) => {
      state.usersAnalyticsError = null;
    },
    clearCallsAnalyticsError: (state) => {
      state.callsAnalyticsError = null;
    },
    clearPaymentsAnalyticsError: (state) => {
      state.paymentsAnalyticsError = null;
    },
    clearDashboardError: (state) => {
      state.error = null;
      state.executivesAnalyticsError = null;
      state.usersAnalyticsError = null;
      state.callsAnalyticsError = null;
      state.paymentsAnalyticsError = null;
    },
    clearAllDashboardData: (state) => {
      state.executivesAnalytics = null;
      state.usersAnalytics = null;
      state.callsAnalytics = null;
      state.paymentsAnalytics = null;
      state.executivesAnalyticsError = null;
      state.usersAnalyticsError = null;
      state.callsAnalyticsError = null;
      state.paymentsAnalyticsError = null;
      state.error = null;
    },
    clearAllDashboardStates: (state) => {
      state.executivesAnalyticsError = null;
      state.usersAnalyticsError = null;
      state.callsAnalyticsError = null;
      state.paymentsAnalyticsError = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Executives Analytics
      .addCase(fetchExecutivesAnalytics.pending, (state) => {
        state.executivesAnalyticsLoading = true;
        state.executivesAnalyticsError = null;
        state.loading = true;
      })
      .addCase(fetchExecutivesAnalytics.fulfilled, (state, action) => {
        state.executivesAnalyticsLoading = false;
        state.loading = false;
        state.executivesAnalytics = action.payload;
      })
      .addCase(fetchExecutivesAnalytics.rejected, (state, action) => {
        state.executivesAnalyticsLoading = false;
        state.loading = false;
        state.executivesAnalyticsError = action.payload;
      })

      // Fetch Users Analytics
      .addCase(fetchUsersAnalytics.pending, (state) => {
        state.usersAnalyticsLoading = true;
        state.usersAnalyticsError = null;
        state.loading = true;
      })
      .addCase(fetchUsersAnalytics.fulfilled, (state, action) => {
        state.usersAnalyticsLoading = false;
        state.loading = false;
        state.usersAnalytics = action.payload;
      })
      .addCase(fetchUsersAnalytics.rejected, (state, action) => {
        state.usersAnalyticsLoading = false;
        state.loading = false;
        state.usersAnalyticsError = action.payload;
      })

      // Fetch Calls Analytics
      .addCase(fetchCallsAnalytics.pending, (state) => {
        state.callsAnalyticsLoading = true;
        state.callsAnalyticsError = null;
        state.loading = true;
      })
      .addCase(fetchCallsAnalytics.fulfilled, (state, action) => {
        state.callsAnalyticsLoading = false;
        state.loading = false;
        state.callsAnalytics = action.payload;
      })
      .addCase(fetchCallsAnalytics.rejected, (state, action) => {
        state.callsAnalyticsLoading = false;
        state.loading = false;
        state.callsAnalyticsError = action.payload;
      })

      // Fetch Payments Analytics
      .addCase(fetchPaymentsAnalytics.pending, (state) => {
        state.paymentsAnalyticsLoading = true;
        state.paymentsAnalyticsError = null;
        state.loading = true;
      })
      .addCase(fetchPaymentsAnalytics.fulfilled, (state, action) => {
        state.paymentsAnalyticsLoading = false;
        state.loading = false;
        state.paymentsAnalytics = action.payload;
      })
      .addCase(fetchPaymentsAnalytics.rejected, (state, action) => {
        state.paymentsAnalyticsLoading = false;
        state.loading = false;
        state.paymentsAnalyticsError = action.payload;
      });
  },
});

export const { 
  clearExecutivesAnalyticsError,
  clearUsersAnalyticsError,
  clearCallsAnalyticsError,
  clearPaymentsAnalyticsError,
  clearDashboardError,
  clearAllDashboardData,
  clearAllDashboardStates
} = dashboardSlice.actions;

export default dashboardSlice.reducer;