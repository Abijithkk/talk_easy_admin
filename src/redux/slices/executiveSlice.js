import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { BASE_URL } from "../baseUrl";

export const fetchExecutives = createAsyncThunk(
  "executives/fetchExecutives",
  async ({ page = 1, limit = 10 } = {}, { rejectWithValue }) => {
    try {
      const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

      const response = await axios.get(`${BASE_URL}/executives/executives/`, {
        headers: {
          Authorization: token ? `Bearer ${token}` : undefined,
        },
        params: {
          page,
          limit
        }
      });

      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to fetch executives");
    }
  }
);

// GET - Fetch unverified executives
export const fetchUnverifiedExecutives = createAsyncThunk(
  "executives/fetchUnverifiedExecutives",
  async (_, { rejectWithValue }) => {
    try {
      const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

      const response = await axios.get(`${BASE_URL}/accounts/executives/unverified/`, {
        headers: {
          Authorization: token ? `Bearer ${token}` : undefined,
        },
      });

      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to fetch unverified executives");
    }
  }
);

// POST - Verify executive by ID
export const verifyExecutive = createAsyncThunk(
  "executives/verifyExecutive",
  async ({ executiveId, is_verified }, { rejectWithValue }) => {
    try {
      const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

      const response = await axios.patch(
        `${BASE_URL}/accounts/executives/verify/${executiveId}/`,
        {
          is_verified: is_verified ? 1 : 0  
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: token ? `Bearer ${token}` : undefined,
          },
        }
      );

      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Failed to verify executive"
      );
    }
  }
);

// GET - Fetch single executive by ID
export const fetchExecutiveById = createAsyncThunk(
  "executives/fetchExecutiveById",
  async (id, { rejectWithValue }) => {
    try {
      const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

      const response = await axios.get(`${BASE_URL}/executives/admin-executive/${id}/update/`, {
        headers: {
          Authorization: token ? `Bearer ${token}` : undefined,
        },
      });
      console.log(response);
      
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to fetch executive");
    }
  }
);

// PATCH - Update executive by ID
export const updateExecutive = createAsyncThunk(
  "executives/updateExecutive",
  async ({ id, executiveData }, { rejectWithValue }) => {
    try {
      const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

      const response = await axios.patch(
        `${BASE_URL}/executives/admin-executive/${id}/update/`,
        executiveData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: token ? `Bearer ${token}` : undefined,
          },
        }
      );

      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Failed to update executive"
      );
    }
  }
);


// GET - Search executives
export const searchExecutives = createAsyncThunk(
  "executives/searchExecutives",
  async ({ query, page = 1, limit = 10 } = {}, { rejectWithValue }) => {
    try {
      const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

      const response = await axios.get(`${BASE_URL}/executives/search/`, {
        headers: {
          Authorization: token ? `Bearer ${token}` : undefined,
        },
        params: {
          query,
          page,
          limit
        }
      });

      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to search executives");
    }
  }
);

// PATCH - Suspend/Unsuspend executive by ID
export const suspendExecutive = createAsyncThunk(
  "executives/suspendExecutive",
  async (id, { rejectWithValue }) => {
    try {
      const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

      const response = await axios.post(
        `${BASE_URL}/executives/suspend-executives/${id}/`,
        {},
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: token ? `Bearer ${token}` : undefined,
          },
        }
      );

      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Failed to suspend/unsuspend executive"
      );
    }
  }
);

// PATCH - Update executive online status
export const updateExecutiveOnlineStatus = createAsyncThunk(
  "executives/updateExecutiveOnlineStatus",
  async ({ executiveId, is_online }, { rejectWithValue }) => {
    try {
      const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

      const response = await axios.patch(
        `${BASE_URL}/executives/executive/${executiveId}/update-online-status/`,
        { is_online }, 
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: token ? `Bearer ${token}` : undefined,
          },
        }
      );

      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Failed to update executive online status"
      );
    }
  }
);

// PATCH - Update executive ban status
export const updateExecutiveBanStatus = createAsyncThunk(
  "executives/updateExecutiveBanStatus",
  async ({ executiveId, is_banned }, { rejectWithValue }) => {
    try {
      const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

      const response = await axios.patch(
        `${BASE_URL}/executives/executive/${executiveId}/update-status/`,
        { is_banned }, // Pass as object with is_banned property
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: token ? `Bearer ${token}` : undefined,
          },
        }
      );

      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Failed to update executive ban status"
      );
    }
  }
);

export const registerExecutive = createAsyncThunk(
  "executives/registerExecutive",
  async (executiveData, { rejectWithValue }) => {
    try {
      const token =
        typeof window !== "undefined" ? localStorage.getItem("token") : null;

      const response = await axios.post(
        `${BASE_URL}/executives/register-executives/`,
        executiveData, 
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: token ? `Bearer ${token}` : undefined,
          },
        }
      );
      console.log("register",response);

      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Failed to register executive"
      );
    }
  }
);

// GET - Fetch executive languages
export const fetchExecutiveLanguages = createAsyncThunk(
  "executives/fetchExecutiveLanguages",
  async (_, { rejectWithValue }) => {
    try {
      const token =
        typeof window !== "undefined" ? localStorage.getItem("token") : null;

      const response = await axios.get(
        `${BASE_URL}/executives/languages/`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: token ? `Bearer ${token}` : undefined,
          },
        }
      );
      console.log(response)
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Failed to fetch executive languages"
      );
    }
  }
);

// POST - Create executive language
export const createExecutiveLanguage = createAsyncThunk(
  "executives/createExecutiveLanguage",
  async (languageData, { rejectWithValue }) => {
    try {
      const token =
        typeof window !== "undefined" ? localStorage.getItem("token") : null;

      const response = await axios.post(
        `${BASE_URL}/executives/languages/`,
        languageData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: token ? `Bearer ${token}` : undefined,
          },
        }
      );

      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Failed to create executive language"
      );
    }
  }
);

export const fetchBlockedUsers = createAsyncThunk(
  "executives/fetchBlockedUsers",
  async (executiveId, { rejectWithValue }) => {
    try {
      const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

      const response = await axios.get(
        `${BASE_URL}/executives/executives-blocked-users/${executiveId}/`,
        {
          headers: {
            Authorization: token ? `Bearer ${token}` : undefined,
          },
        }
      );

      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to fetch blocked users");
    }
  }
);

export const fetchExecutiveCallHistory = createAsyncThunk(
  "executives/fetchExecutiveCallHistory", // Fixed: Changed thunk name to be unique
  async (executiveId, { rejectWithValue }) => {
    try {
      const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

      const response = await axios.get(
        `${BASE_URL}/calls/admin/executive-call-history/${executiveId}/`,
        {
          headers: {
            Authorization: token ? `Bearer ${token}` : undefined,
          },
        }
      );
console.log(response);

      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to fetch executive call history");
    }
  }
);

// DELETE - Unblock a user for an executive
export const unblockUser = createAsyncThunk(
  "executives/unblockUser",
  async ({ executiveId, blockedUserId }, { rejectWithValue }) => {
    try {
      const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

      const response = await axios.delete(
        `${BASE_URL}/executives/executives-blocked-users/${executiveId}/`,
        {
          data: { blocked_user_id: blockedUserId },
          headers: {
            "Content-Type": "application/json",
            Authorization: token ? `Bearer ${token}` : undefined,
          },
        }
      );

      return { ...response.data, unblockedUserId: blockedUserId };
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Failed to unblock user"
      );
    }
  }
);

const executivesSlice = createSlice({
  name: "executives",
  initialState: {
    executives: { 
      results: [],
      count: 0
    },
    blockedUsers: {
      results: [],
      count: 0
    },
    callHistory: {
      results: [],
      count: 0
    },
    unverifiedExecutives: {
      results: [],
      count: 0
    },
    currentExecutive: null, 
    languages: {
      results: [],
      count: 0
    },
        searchResults: {
      results: [],
      count: 0
    },
    searchLoading: false,
    searchError: null,
    searchSuccess: null,

    loading: false,
    error: null,
    success: null,
    unverifiedLoading: false,
    unverifiedError: null,
    verifyLoading: false,
    verifyError: null,
    verifySuccess: null,
    currentExecutiveLoading: false,
    currentExecutiveError: null,
    updateLoading: false,
    updateError: null,
    updateSuccess: null,
    suspendLoading: false,
    suspendError: null,
    suspendSuccess: null,
    onlineStatusLoading: false,
    onlineStatusError: null,
    onlineStatusSuccess: null,
    banStatusLoading: false,
    banStatusError: null,
    banStatusSuccess: null,
    languagesLoading: false,
    languagesError: null,
    languagesSuccess: null,
    blockedUsersLoading: false,
    blockedUsersError: null,
    callHistoryLoading: false,
    callHistoryError: null,
    unblockUserLoading: false,
    unblockUserError: null,
    unblockUserSuccess: null,
  },
  reducers: {
    clearExecutivesError: (state) => {
      state.error = null;
    },
    clearExecutivesSuccess: (state) => {
      state.success = null;
    },
    clearUnverifiedError: (state) => {
      state.unverifiedError = null;
    },
    clearVerifyError: (state) => {
      state.verifyError = null;
    },
    clearVerifySuccess: (state) => {
      state.verifySuccess = null;
    },
    clearCurrentExecutiveError: (state) => {
      state.currentExecutiveError = null;
    },
    clearCurrentExecutive: (state) => {
      state.currentExecutive = null;
    },
    clearUpdateError: (state) => {
      state.updateError = null;
    },
    clearUpdateSuccess: (state) => {
      state.updateSuccess = null;
    },
    clearSuspendError: (state) => {
      state.suspendError = null;
    },
    clearSuspendSuccess: (state) => {
      state.suspendSuccess = null;
    },
    clearOnlineStatusError: (state) => {
      state.onlineStatusError = null;
    },
    clearOnlineStatusSuccess: (state) => {
      state.onlineStatusSuccess = null;
    },
    clearBanStatusError: (state) => {
      state.banStatusError = null;
    },
    clearBanStatusSuccess: (state) => {
      state.banStatusSuccess = null;
    },
    clearLanguagesError: (state) => {
      state.languagesError = null;
    },
    clearLanguagesSuccess: (state) => {
      state.languagesSuccess = null;
    },
    clearBlockedUsersError: (state) => {
      state.blockedUsersError = null;
    },
    clearBlockedUsers: (state) => {
      state.blockedUsers = {
        results: [],
        count: 0
      };
    },
    clearCallHistoryError: (state) => {
      state.callHistoryError = null;
    },
    clearCallHistory: (state) => { // Fixed: Added missing clearCallHistory action
      state.callHistory = {
        results: [],
        count: 0
      };
    },
    clearUnblockUserError: (state) => {
      state.unblockUserError = null;
    },
    clearUnblockUserSuccess: (state) => {
      state.unblockUserSuccess = null;
    },
    clearSearchError: (state) => {
    state.searchError = null;
  },
  clearSearchSuccess: (state) => {
    state.searchSuccess = null;
  },
  clearSearchResults: (state) => {
    state.searchResults = {
      results: [],
      count: 0
    };
  },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Executives
      .addCase(fetchExecutives.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchExecutives.fulfilled, (state, action) => {
        state.loading = false;
        state.executives = action.payload;
      })
      .addCase(fetchExecutives.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch Unverified Executives
      .addCase(fetchUnverifiedExecutives.pending, (state) => {
        state.unverifiedLoading = true;
        state.unverifiedError = null;
      })
      .addCase(fetchUnverifiedExecutives.fulfilled, (state, action) => {
        state.unverifiedLoading = false;
        state.unverifiedExecutives = action.payload;
      })
      .addCase(fetchUnverifiedExecutives.rejected, (state, action) => {
        state.unverifiedLoading = false;
        state.unverifiedError = action.payload;
      })

      // Verify Executive
      .addCase(verifyExecutive.pending, (state) => {
        state.verifyLoading = true;
        state.verifyError = null;
        state.verifySuccess = null;
      })
      .addCase(verifyExecutive.fulfilled, (state, action) => {
        state.verifyLoading = false;
        state.verifySuccess = "Executive verified successfully";
        
        // Remove the verified executive from unverified list
        if (state.unverifiedExecutives?.results) {
          state.unverifiedExecutives.results = state.unverifiedExecutives.results.filter(
            exec => exec.id !== action.payload.id
          );
          state.unverifiedExecutives.count = state.unverifiedExecutives.results.length;
        }

        // Add to main executives list
        if (state.executives?.results && !state.executives.results.find(exec => exec.id === action.payload.id)) {
          state.executives.results.push(action.payload);
          state.executives.count += 1;
        }
      })
      .addCase(verifyExecutive.rejected, (state, action) => {
        state.verifyLoading = false;
        state.verifyError = action.payload;
      })

      // Fetch Single Executive by ID
      .addCase(fetchExecutiveById.pending, (state) => {
        state.currentExecutiveLoading = true;
        state.currentExecutiveError = null;
      })
      .addCase(fetchExecutiveById.fulfilled, (state, action) => {
        state.currentExecutiveLoading = false;
        state.currentExecutive = action.payload;
      })
      .addCase(fetchExecutiveById.rejected, (state, action) => {
        state.currentExecutiveLoading = false;
        state.currentExecutiveError = action.payload;
      })

      // Update Executive
      .addCase(updateExecutive.pending, (state) => {
        state.updateLoading = true;
        state.updateError = null;
        state.updateSuccess = null;
      })
      .addCase(updateExecutive.fulfilled, (state, action) => {
        state.updateLoading = false;
        state.updateSuccess = "Executive updated successfully";
        state.currentExecutive = action.payload;

        // Update the executive in the executives list if it exists
        if (state.executives?.results) {
          const index = state.executives.results.findIndex(
            exec => exec.id === action.payload.id
          );
          if (index !== -1) {
            state.executives.results[index] = action.payload;
          }
        }
      })
      .addCase(updateExecutive.rejected, (state, action) => {
        state.updateLoading = false;
        state.updateError = action.payload;
      })

      // Suspend Executive
      .addCase(suspendExecutive.pending, (state) => {
        state.suspendLoading = true;
        state.suspendError = null;
        state.suspendSuccess = null;
      })
      .addCase(suspendExecutive.fulfilled, (state, action) => {
        state.suspendLoading = false;
        state.suspendSuccess = "Executive status updated successfully";
        
        // Update the executive in the current executive if it matches
        if (state.currentExecutive && state.currentExecutive.id === action.payload.id) {
          state.currentExecutive = action.payload;
        }

        // Update the executive in the executives list if it exists
        if (state.executives?.results) {
          const index = state.executives.results.findIndex(
            exec => exec.id === action.payload.id
          );
          if (index !== -1) {
            state.executives.results[index] = action.payload;
          }
        }
      })
      .addCase(suspendExecutive.rejected, (state, action) => {
        state.suspendLoading = false;
        state.suspendError = action.payload;
      })

      // Update Executive Online Status
      .addCase(updateExecutiveOnlineStatus.pending, (state) => {
        state.onlineStatusLoading = true;
        state.onlineStatusError = null;
        state.onlineStatusSuccess = null;
      })
      .addCase(updateExecutiveOnlineStatus.fulfilled, (state, action) => {
        state.onlineStatusLoading = false;
        state.onlineStatusSuccess = "Executive online status updated successfully";
        
        // Update the executive in the current executive if it matches
        if (state.currentExecutive && state.currentExecutive.id === action.payload.id) {
          state.currentExecutive = action.payload;
        }

        // Update the executive in the executives list if it exists
        if (state.executives?.results) {
          const index = state.executives.results.findIndex(
            exec => exec.id === action.payload.id
          );
          if (index !== -1) {
            state.executives.results[index] = action.payload;
          }
        }
      })
      .addCase(updateExecutiveOnlineStatus.rejected, (state, action) => {
        state.onlineStatusLoading = false;
        state.onlineStatusError = action.payload;
      })

      // Update Executive Ban Status
      .addCase(updateExecutiveBanStatus.pending, (state) => {
        state.banStatusLoading = true;
        state.banStatusError = null;
        state.banStatusSuccess = null;
      })
      .addCase(updateExecutiveBanStatus.fulfilled, (state, action) => {
        state.banStatusLoading = false;
        state.banStatusSuccess = "Executive ban status updated successfully";
        
        // Update the executive in the current executive if it matches
        if (state.currentExecutive && state.currentExecutive.id === action.payload.id) {
          state.currentExecutive = action.payload;
        }

        // Update the executive in the executives list if it exists
        if (state.executives?.results) {
          const index = state.executives.results.findIndex(
            exec => exec.id === action.payload.id
          );
          if (index !== -1) {
            state.executives.results[index] = action.payload;
          }
        }
      })
      .addCase(updateExecutiveBanStatus.rejected, (state, action) => {
        state.banStatusLoading = false;
        state.banStatusError = action.payload;
      })

      // Register Executive
      .addCase(registerExecutive.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = null;
      })
      .addCase(registerExecutive.fulfilled, (state, action) => {
        state.loading = false;
        state.success = "Executive registered successfully";

        if (state.executives?.results) {
          state.executives.results.push(action.payload);
          state.executives.count += 1;
        }
      })
      .addCase(registerExecutive.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch Executive Languages
      .addCase(fetchExecutiveLanguages.pending, (state) => {
        state.languagesLoading = true;
        state.languagesError = null;
      })
      .addCase(fetchExecutiveLanguages.fulfilled, (state, action) => {
        state.languagesLoading = false;
        state.languages = action.payload;
      })
      .addCase(fetchExecutiveLanguages.rejected, (state, action) => {
        state.languagesLoading = false;
        state.languagesError = action.payload;
      })

      // Create Executive Language
      .addCase(createExecutiveLanguage.pending, (state) => {
        state.languagesLoading = true;
        state.languagesError = null;
        state.languagesSuccess = null;
      })
      .addCase(createExecutiveLanguage.fulfilled, (state, action) => {
        state.languagesLoading = false;
        state.languagesSuccess = "Language created successfully";

        if (state.languages?.results) {
          state.languages.results.push(action.payload);
          state.languages.count += 1;
        }
      })
      .addCase(createExecutiveLanguage.rejected, (state, action) => {
        state.languagesLoading = false;
        state.languagesError = action.payload;
      })

      // Fetch Blocked Users
      .addCase(fetchBlockedUsers.pending, (state) => {
        state.blockedUsersLoading = true;
        state.blockedUsersError = null;
      })
      .addCase(fetchBlockedUsers.fulfilled, (state, action) => {
        state.blockedUsersLoading = false;
        state.blockedUsers = action.payload;
      })
      .addCase(fetchBlockedUsers.rejected, (state, action) => {
        state.blockedUsersLoading = false;
        state.blockedUsersError = action.payload;
      })
  .addCase(searchExecutives.pending, (state) => {
      state.searchLoading = true;
      state.searchError = null;
      state.searchSuccess = null;
    })
    .addCase(searchExecutives.fulfilled, (state, action) => {
      state.searchLoading = false;
      state.searchResults = action.payload;
      state.searchSuccess = "Search completed successfully";
    })
    .addCase(searchExecutives.rejected, (state, action) => {
      state.searchLoading = false;
      state.searchError = action.payload;
    })
      // Fetch Executive Call History
      .addCase(fetchExecutiveCallHistory.pending, (state) => {
        state.callHistoryLoading = true;
        state.callHistoryError = null;
      })
      .addCase(fetchExecutiveCallHistory.fulfilled, (state, action) => {
        state.callHistoryLoading = false;
        state.callHistory = action.payload;
      })
      .addCase(fetchExecutiveCallHistory.rejected, (state, action) => {
        state.callHistoryLoading = false;
        state.callHistoryError = action.payload;
      })

      // Unblock User
      .addCase(unblockUser.pending, (state) => {
        state.unblockUserLoading = true;
        state.unblockUserError = null;
        state.unblockUserSuccess = null;
      })
      .addCase(unblockUser.fulfilled, (state, action) => {
        state.unblockUserLoading = false;
        state.unblockUserSuccess = "User unblocked successfully";
        
        // Remove the unblocked user from the blocked users list
        if (state.blockedUsers?.results) {
          state.blockedUsers.results = state.blockedUsers.results.filter(
            user => user.id !== action.payload.unblockedUserId
          );
          state.blockedUsers.count = state.blockedUsers.results.length;
        }
      })
      .addCase(unblockUser.rejected, (state, action) => {
        state.unblockUserLoading = false;
        state.unblockUserError = action.payload;
      });
      
  },
});

export const { 
  clearExecutivesError, 
  clearExecutivesSuccess, 
  clearUnverifiedError,
  clearVerifyError,
  clearVerifySuccess,
  clearCurrentExecutiveError,
  clearCurrentExecutive,
  clearUpdateError,
  clearUpdateSuccess,
  clearSuspendError,
  clearSuspendSuccess,
  clearOnlineStatusError,
  clearOnlineStatusSuccess,
  clearBanStatusError,
  clearBanStatusSuccess,
  clearLanguagesError, 
  clearLanguagesSuccess,
  clearBlockedUsersError,
  clearBlockedUsers,
  clearCallHistoryError,
  clearCallHistory, 
  clearUnblockUserError,
  clearUnblockUserSuccess,
  clearSearchError,
  clearSearchSuccess,
  clearSearchResults
} = executivesSlice.actions;

export default executivesSlice.reducer;