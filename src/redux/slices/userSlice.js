import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { BASE_URL } from "../baseUrl";

// GET - Fetch all users
export const fetchUsers = createAsyncThunk(
  "users/fetchUsers",
  async (_, { rejectWithValue }) => {
    try {
      const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
      const response = await axios.get(`${BASE_URL}/users/users/`, {
        headers: {
          Authorization: token ? `Bearer ${token}` : undefined,
        },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to fetch users");
    }
  }
);

// DELETE - Delete single user by ID
export const deleteUser = createAsyncThunk(
  "users/deleteUser",
  async (id, { rejectWithValue }) => {
    try {
      const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

      const response = await axios.delete(`${BASE_URL}/users/users/${id}/delete/`, {
        headers: {
          Authorization: token ? `Bearer ${token}` : undefined,
        },
      });

      return { id, data: response.data };
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to delete user");
    }
  }
);

// POST - Bulk delete users
export const bulkDeleteUsers = createAsyncThunk(
  "users/bulkDeleteUsers",
  async (userIds, { rejectWithValue }) => {
    try {
      const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

      const response = await axios.post(
        `${BASE_URL}/users/bulk-delete/`,
        { user_ids: userIds },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: token ? `Bearer ${token}` : undefined,
          },
        }
      );

      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to bulk delete users");
    }
  }
);

// GET - Fetch deleted users
export const fetchDeletedUsers = createAsyncThunk(
  "users/fetchDeletedUsers",
  async (_, { rejectWithValue }) => {
    try {
      const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

      const response = await axios.get(`${BASE_URL}/admin/deleted-users/`, {
        headers: {
          Authorization: token ? `Bearer ${token}` : undefined,
        },
      });

      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to fetch deleted users");
    }
  }
);

// GET - Fetch user deletion statistics
export const fetchDeletionStats = createAsyncThunk(
  "users/fetchDeletionStats",
  async (_, { rejectWithValue }) => {
    try {
      const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

      const response = await axios.get(`${BASE_URL}/admin/users/deletion-stats/`, {
        headers: {
          Authorization: token ? `Bearer ${token}` : undefined,
        },
      });

      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to fetch deletion stats");
    }
  }
);

// GET - Fetch user by ID
export const fetchUserById = createAsyncThunk(
  "users/fetchUserById",
  async (userId, { rejectWithValue }) => {
    try {
      const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
      const response = await axios.get(`${BASE_URL}/users/admin-user/${userId}/`, {
        headers: {
          Authorization: token ? `Bearer ${token}` : undefined,
        },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to fetch user");
    }
  }
);

// GET - Fetch user call history
export const fetchUserCallHistory = createAsyncThunk(
  "users/fetchUserCallHistory",
  async (userId, { rejectWithValue }) => {
    try {
      const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
      const response = await axios.get(`${BASE_URL}/calls/admin/user-call-history/${userId}/`, {
        headers: {
          Authorization: token ? `Bearer ${token}` : undefined,
        },
      });
      console.log(response)
      return { userId, data: response.data };
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to fetch user call history");
    }
  }
);

// PATCH - Update user status (ban/suspend)
export const updateUserStatus = createAsyncThunk(
  "users/updateUserStatus",
  async ({ id, statusData }, { rejectWithValue }) => {
    try {
      const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

      const response = await axios.patch(
        `${BASE_URL}/users/admin/${id}/update-status/`,
        statusData,
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
        error.response?.data || "Failed to update user status"
      );
    }
  }
);

const usersSlice = createSlice({
  name: "users",
  initialState: {
    users: { 
      results: [],
      count: 0
    },
    deletedUsers: {
      results: [],
      count: 0
    },
    deletionStats: null,
    currentUser: null,
    userCallHistory: {
      results: [],
      count: 0
    },
    loading: false,
    error: null,
    success: null,
    deleteLoading: false,
    deleteError: null,
    deleteSuccess: null,
    bulkDeleteLoading: false,
    bulkDeleteError: null,
    bulkDeleteSuccess: null,
    deletedUsersLoading: false,
    deletedUsersError: null,
    statusUpdateLoading: false,
    statusUpdateError: null,
    statusUpdateSuccess: null,
    deletionStatsLoading: false,
    deletionStatsError: null,
    userByIdLoading: false,
    userByIdError: null,
    callHistoryLoading: false,
    callHistoryError: null,
  },
  reducers: {
    clearUsersError: (state) => {
      state.error = null;
    },
    clearUsersSuccess: (state) => {
      state.success = null;
    },
    clearDeleteError: (state) => {
      state.deleteError = null;
    },
    clearDeleteSuccess: (state) => {
      state.deleteSuccess = null;
    },
    clearBulkDeleteError: (state) => {
      state.bulkDeleteError = null;
    },
    clearBulkDeleteSuccess: (state) => {
      state.bulkDeleteSuccess = null;
    },
    clearDeletedUsersError: (state) => {
      state.deletedUsersError = null;
    },
    clearStatusUpdateError: (state) => {
      state.statusUpdateError = null;
    },
    clearStatusUpdateSuccess: (state) => {
      state.statusUpdateSuccess = null;
    },
    clearDeletionStatsError: (state) => {
      state.deletionStatsError = null;
    },
    clearUserByIdError: (state) => {
      state.userByIdError = null;
    },
    clearCallHistoryError: (state) => {
      state.callHistoryError = null;
    },
    clearCurrentUser: (state) => {
      state.currentUser = null;
    },
    clearUserCallHistory: (state) => {
      state.userCallHistory = {
        results: [],
        count: 0
      };
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Users
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch User By ID
      .addCase(fetchUserById.pending, (state) => {
        state.userByIdLoading = true;
        state.userByIdError = null;
        state.currentUser = null;
      })
      .addCase(fetchUserById.fulfilled, (state, action) => {
        state.userByIdLoading = false;
        state.currentUser = action.payload;
      })
      .addCase(fetchUserById.rejected, (state, action) => {
        state.userByIdLoading = false;
        state.userByIdError = action.payload;
        state.currentUser = null;
      })

      // Fetch User Call History
      .addCase(fetchUserCallHistory.pending, (state) => {
        state.callHistoryLoading = true;
        state.callHistoryError = null;
      })
      .addCase(fetchUserCallHistory.fulfilled, (state, action) => {
        state.callHistoryLoading = false;
        state.userCallHistory = action.payload.data;
      })
      .addCase(fetchUserCallHistory.rejected, (state, action) => {
        state.callHistoryLoading = false;
        state.callHistoryError = action.payload;
      })

      // Delete Single User
      .addCase(deleteUser.pending, (state) => {
        state.deleteLoading = true;
        state.deleteError = null;
        state.deleteSuccess = null;
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.deleteLoading = false;
        state.deleteSuccess = "User deleted successfully";
        
        // Remove user from users list
        if (state.users?.results) {
          state.users.results = state.users.results.filter(
            user => user.id !== action.payload.id
          );
          state.users.count -= 1;
        }
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.deleteLoading = false;
        state.deleteError = action.payload;
      })

      // Bulk Delete Users
      .addCase(bulkDeleteUsers.pending, (state) => {
        state.bulkDeleteLoading = true;
        state.bulkDeleteError = null;
        state.bulkDeleteSuccess = null;
      })
      .addCase(bulkDeleteUsers.fulfilled, (state, action) => {
        state.bulkDeleteLoading = false;
        state.bulkDeleteSuccess = "Users deleted successfully";
        
        // Update users list by removing deleted users
        if (state.users?.results && action.meta.arg) {
          const deletedIds = action.meta.arg;
          state.users.results = state.users.results.filter(
            user => !deletedIds.includes(user.id)
          );
          state.users.count -= deletedIds.length;
        }
      })
      .addCase(bulkDeleteUsers.rejected, (state, action) => {
        state.bulkDeleteLoading = false;
        state.bulkDeleteError = action.payload;
      })

      // Fetch Deleted Users
      .addCase(fetchDeletedUsers.pending, (state) => {
        state.deletedUsersLoading = true;
        state.deletedUsersError = null;
      })
      .addCase(fetchDeletedUsers.fulfilled, (state, action) => {
        state.deletedUsersLoading = false;
        state.deletedUsers = action.payload;
      })
      .addCase(fetchDeletedUsers.rejected, (state, action) => {
        state.deletedUsersLoading = false;
        state.deletedUsersError = action.payload;
      })

      // Fetch Deletion Stats
      .addCase(fetchDeletionStats.pending, (state) => {
        state.deletionStatsLoading = true;
        state.deletionStatsError = null;
      })
      .addCase(fetchDeletionStats.fulfilled, (state, action) => {
        state.deletionStatsLoading = false;
        state.deletionStats = action.payload;
      })
      .addCase(fetchDeletionStats.rejected, (state, action) => {
        state.deletionStatsLoading = false;
        state.deletionStatsError = action.payload;
      })

      // Update User Status
      .addCase(updateUserStatus.pending, (state) => {
        state.statusUpdateLoading = true;
        state.statusUpdateError = null;
        state.statusUpdateSuccess = null;
      })
      .addCase(updateUserStatus.fulfilled, (state, action) => {
        state.statusUpdateLoading = false;
        state.statusUpdateSuccess = "User status updated successfully";

        // Update the user in the users list if it exists
        if (state.users?.results) {
          const index = state.users.results.findIndex(
            user => user.id === action.payload.id
          );
          if (index !== -1) {
            state.users.results[index] = action.payload;
          }
        }
        
        // Also update currentUser if it's the same user
        if (state.currentUser && state.currentUser.id === action.payload.id) {
          state.currentUser = action.payload;
        }
      })
      .addCase(updateUserStatus.rejected, (state, action) => {
        state.statusUpdateLoading = false;
        state.statusUpdateError = action.payload;
      });
  },
});

export const { 
  clearUsersError, 
  clearUsersSuccess, 
  clearDeleteError,
  clearDeleteSuccess,
  clearBulkDeleteError,
  clearBulkDeleteSuccess,
  clearDeletedUsersError,
  clearCurrentUser,
  clearStatusUpdateError,
  clearStatusUpdateSuccess,
  clearDeletionStatsError,
  clearUserByIdError,
  clearCallHistoryError,
  clearUserCallHistory,
} = usersSlice.actions;

export default usersSlice.reducer;