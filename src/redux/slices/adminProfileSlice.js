import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { BASE_URL } from "../baseUrl";

// GET - Fetch all user sessions (admin only)
export const fetchAllSessions = createAsyncThunk(
  "adminProfile/fetchAllSessions",
  async (_, { rejectWithValue }) => {
    try {
      const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

      const response = await axios.get(`${BASE_URL}/accounts/sessions/superusers/`, {
        headers: {
          Authorization: token ? `Bearer ${token}` : undefined,
        },
      });
console.log(response)
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to fetch all sessions");
    }
  }
);

// GET - Fetch my sessions
export const fetchMySessions = createAsyncThunk(
  "adminProfile/fetchMySessions",
  async (_, { rejectWithValue }) => {
    try {
      const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

      const response = await axios.get(`${BASE_URL}/accounts/sessions/my-sessions/`, {
        headers: {
          Authorization: token ? `Bearer ${token}` : undefined,
        },
      });

      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to fetch my sessions");
    }
  }
);

// DELETE - Revoke specific session (FIXED)
export const revokeSession = createAsyncThunk(
  "adminProfile/revokeSession",
  async (sessionId, { rejectWithValue }) => {
    try {
      const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

      const response = await axios.post(
        `${BASE_URL}/accounts/sessions/${sessionId}/revoke/`,
        {}, // Empty body
        {
          headers: {
            Authorization: token ? `Bearer ${token}` : undefined,
          },
        }
      );

      return { sessionId, message: response.data?.message || "Session revoked successfully" };
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to revoke session");
    }
  }
);

// DELETE - Revoke all other sessions except current one (FIXED)
export const revokeAllOtherSessions = createAsyncThunk(
  "adminProfile/revokeAllOtherSessions",
  async (_, { rejectWithValue }) => {
    try {
      const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

      const response = await axios.post(
        `${BASE_URL}/accounts/sessions/revoke-all-others/`,
        {}, // Empty body
        {
          headers: {
            Authorization: token ? `Bearer ${token}` : undefined,
          },
        }
      );

      return { message: response.data?.message || "All other sessions revoked successfully" };
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to revoke other sessions");
    }
  }
);

const adminProfileSlice = createSlice({
  name: "adminProfile",
  initialState: {
    // All sessions data (admin view)
    allSessions: {
      results: [],
      count: 0
    },
    // My sessions data
    mySessions: {
      results: [],
      count: 0
    },
    
    // Loading states
    allSessionsLoading: false,
    mySessionsLoading: false,
    revokeLoading: false,
    revokeAllLoading: false,
    
    // Error states
    allSessionsError: null,
    mySessionsError: null,
    revokeError: null,
    revokeAllError: null,
    
    // Success states
    revokeSuccess: null,
    revokeAllSuccess: null,
  },
  reducers: {
    // Clear errors
    clearAllSessionsError: (state) => {
      state.allSessionsError = null;
    },
    clearMySessionsError: (state) => {
      state.mySessionsError = null;
    },
    clearRevokeError: (state) => {
      state.revokeError = null;
    },
    clearRevokeAllError: (state) => {
      state.revokeAllError = null;
    },
    
    // Clear success messages
    clearRevokeSuccess: (state) => {
      state.revokeSuccess = null;
    },
    clearRevokeAllSuccess: (state) => {
      state.revokeAllSuccess = null;
    },
    
    // Clear all states
    clearAllAdminProfileStates: (state) => {
      state.allSessionsError = null;
      state.mySessionsError = null;
      state.revokeError = null;
      state.revokeAllError = null;
      state.revokeSuccess = null;
      state.revokeAllSuccess = null;
    },
    
    // Clear all sessions data
    clearAllSessions: (state) => {
      state.allSessions = {
        results: [],
        count: 0
      };
    },
    
    // Clear my sessions data
    clearMySessions: (state) => {
      state.mySessions = {
        results: [],
        count: 0
      };
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch All Sessions (Admin)
      .addCase(fetchAllSessions.pending, (state) => {
        state.allSessionsLoading = true;
        state.allSessionsError = null;
      })
      .addCase(fetchAllSessions.fulfilled, (state, action) => {
        state.allSessionsLoading = false;
        state.allSessions = action.payload;
      })
      .addCase(fetchAllSessions.rejected, (state, action) => {
        state.allSessionsLoading = false;
        state.allSessionsError = action.payload;
      })

      // Fetch My Sessions
      .addCase(fetchMySessions.pending, (state) => {
        state.mySessionsLoading = true;
        state.mySessionsError = null;
      })
      .addCase(fetchMySessions.fulfilled, (state, action) => {
        state.mySessionsLoading = false;
        state.mySessions = action.payload;
      })
      .addCase(fetchMySessions.rejected, (state, action) => {
        state.mySessionsLoading = false;
        state.mySessionsError = action.payload;
      })

      // Revoke Specific Session
      .addCase(revokeSession.pending, (state) => {
        state.revokeLoading = true;
        state.revokeError = null;
        state.revokeSuccess = null;
      })
      .addCase(revokeSession.fulfilled, (state, action) => {
        state.revokeLoading = false;
        state.revokeSuccess = action.payload.message;

        // Remove the revoked session from all sessions list
        if (state.allSessions?.results) {
          state.allSessions.results = state.allSessions.results.filter(
            session => session.id !== action.payload.sessionId
          );
          state.allSessions.count = Math.max(0, state.allSessions.count - 1);
        }

        // Remove the revoked session from my sessions list
        if (state.mySessions?.results) {
          state.mySessions.results = state.mySessions.results.filter(
            session => session.id !== action.payload.sessionId
          );
          state.mySessions.count = Math.max(0, state.mySessions.count - 1);
        }
      })
      .addCase(revokeSession.rejected, (state, action) => {
        state.revokeLoading = false;
        state.revokeError = action.payload;
      })

      // Revoke All Other Sessions
      .addCase(revokeAllOtherSessions.pending, (state) => {
        state.revokeAllLoading = true;
        state.revokeAllError = null;
        state.revokeAllSuccess = null;
      })
      .addCase(revokeAllOtherSessions.fulfilled, (state, action) => {
        state.revokeAllLoading = false;
        state.revokeAllSuccess = action.payload.message;

        // Keep only the current session in my sessions
        if (state.mySessions?.results) {
          const currentSession = state.mySessions.results.find(session => session.is_current);
          state.mySessions.results = currentSession ? [currentSession] : [];
          state.mySessions.count = currentSession ? 1 : 0;
        }

        // Update all sessions list - refetch needed for accurate data
        // You can dispatch fetchAllSessions here if needed
      })
      .addCase(revokeAllOtherSessions.rejected, (state, action) => {
        state.revokeAllLoading = false;
        state.revokeAllError = action.payload;
      });
  },
});

export const { 
  clearAllSessionsError,
  clearMySessionsError,
  clearRevokeError,
  clearRevokeAllError,
  clearRevokeSuccess,
  clearRevokeAllSuccess,
  clearAllAdminProfileStates,
  clearAllSessions,
  clearMySessions
} = adminProfileSlice.actions;

export default adminProfileSlice.reducer;