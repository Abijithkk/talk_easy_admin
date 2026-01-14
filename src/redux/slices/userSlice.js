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

// GET - Fetch banned users
export const fetchBannedUsers = createAsyncThunk(
  "users/fetchBannedUsers",
  async (_, { rejectWithValue }) => {
    try {
      const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
      const response = await axios.get(`${BASE_URL}/users/users/banned/`, {
        headers: {
          Authorization: token ? `Bearer ${token}` : undefined,
        },
      });
      console.log('banned users',response)
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to fetch banned users");
    }
  }
);

// GET - Fetch blocked users (for executives)
export const fetchBlockedUsers = createAsyncThunk(
  "users/fetchBlockedUsers",
  async (_, { rejectWithValue }) => {
    try {
      const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
      const response = await axios.get(`${BASE_URL}/executives/blocked-users/`, {
        headers: {
          Authorization: token ? `Bearer ${token}` : undefined,
        },
      });
            console.log('blocked users',response)

      return response.data;

    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to fetch blocked users");
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
      console.log("call",response)
      return { userId, data: response.data };
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to fetch user call history");
    }
  }
);

// GET - Fetch user recharge history
export const fetchUserRechargeHistory = createAsyncThunk(
  "users/fetchUserRechargeHistory",
  async (userId, { rejectWithValue }) => {
    try {
      const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
      const response = await axios.get(`${BASE_URL}/payments/recharge-history/${userId}/`, {
        headers: {
          Authorization: token ? `Bearer ${token}` : undefined,
        },
      });
      console.log("recharge history",response)
      return { userId, data: response.data };
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to fetch user recharge history");
    }
  }
);

// GET - Fetch user ratings
export const fetchUserRatings = createAsyncThunk(
  "users/fetchUserRatings",
  async (userId, { rejectWithValue }) => {
    try {
      const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
      const response = await axios.get(`${BASE_URL}/users/ratings/user/${userId}/`, {
        headers: {
          Authorization: token ? `Bearer ${token}` : undefined,
        },
      });
      console.log("user-ratings",response)
      return { userId, data: response.data };
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to fetch user ratings");
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


// GET - Search users
export const searchUsers = createAsyncThunk(
  "users/searchUsers",
  async (searchParams, { rejectWithValue }) => {
    try {
      const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
      const response = await axios.get(`${BASE_URL}/users/search/`, {
        params: searchParams,
        headers: {
          Authorization: token ? `Bearer ${token}` : undefined,
        },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to search users");
    }
  }
);

// GET - Filter users by status (suspended, banned)
export const filterUsersByStatus = createAsyncThunk(
  "users/filterUsersByStatus",
  async (status, { rejectWithValue }) => {
    try {
      const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
      const response = await axios.get(`${BASE_URL}/users/users/filter/`, {
        params: { status },
        headers: {
          Authorization: token ? `Bearer ${token}` : undefined,
        },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to filter users by status");
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
    bannedUsers: {
      results: [],
      count: 0
    },
    blockedUsers: {
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
    userRechargeHistory: {
      results: [],
      count: 0
    },
    userRatings: {
      results: [],
      count: 0
    },
    searchedUsers: {
      results: [],
      count: 0
    },
    filteredUsers: {
      results: [],
      count: 0
    },
    loading: false,
    error: null,
    success: null,
    bannedUsersLoading: false,
    bannedUsersError: null,
    blockedUsersLoading: false,
    blockedUsersError: null,
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
    rechargeHistoryLoading: false,
    rechargeHistoryError: null,
    ratingsLoading: false,
    ratingsError: null,
    searchLoading: false,
    searchError: null,
    filterLoading: false,
    filterError: null,
  },
  reducers: {
    clearUsersError: (state) => {
      state.error = null;
    },
    clearUsersSuccess: (state) => {
      state.success = null;
    },
    clearBannedUsersError: (state) => {
      state.bannedUsersError = null;
    },
    clearBlockedUsersError: (state) => {
      state.blockedUsersError = null;
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
    clearRechargeHistoryError: (state) => {
      state.rechargeHistoryError = null;
    },
    clearRatingsError: (state) => {
      state.ratingsError = null;
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
    clearUserRechargeHistory: (state) => {
      state.userRechargeHistory = {
        results: [],
        count: 0
      };
    },
    clearUserRatings: (state) => {
      state.userRatings = {
        results: [],
        count: 0
      };
    },
    clearBannedUsers: (state) => {
      state.bannedUsers = {
        results: [],
        count: 0
      };
    },
    clearBlockedUsers: (state) => {
      state.blockedUsers = {
        results: [],
        count: 0
      };
    },
     clearSearchError: (state) => {
      state.searchError = null;
    },
    clearFilterError: (state) => {
      state.filterError = null;
    },
    clearSearchedUsers: (state) => {
      state.searchedUsers = {
        results: [],
        count: 0
      };
    },
    clearFilteredUsers: (state) => {
      state.filteredUsers = {
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

    // Fetch Banned Users
    .addCase(fetchBannedUsers.pending, (state) => {
      state.bannedUsersLoading = true;
      state.bannedUsersError = null;
    })
    .addCase(fetchBannedUsers.fulfilled, (state, action) => {
      state.bannedUsersLoading = false;
      state.bannedUsers = action.payload;
    })
    .addCase(fetchBannedUsers.rejected, (state, action) => {
      state.bannedUsersLoading = false;
      state.bannedUsersError = action.payload;
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

    // Fetch User Recharge History
    .addCase(fetchUserRechargeHistory.pending, (state) => {
      state.rechargeHistoryLoading = true;
      state.rechargeHistoryError = null;
    })
    .addCase(fetchUserRechargeHistory.fulfilled, (state, action) => {
      state.rechargeHistoryLoading = false;
      state.userRechargeHistory = action.payload.data;
    })
    .addCase(fetchUserRechargeHistory.rejected, (state, action) => {
      state.rechargeHistoryLoading = false;
      state.rechargeHistoryError = action.payload;
    })

    // Fetch User Ratings
    .addCase(fetchUserRatings.pending, (state) => {
      state.ratingsLoading = true;
      state.ratingsError = null;
    })
    .addCase(fetchUserRatings.fulfilled, (state, action) => {
      state.ratingsLoading = false;
      state.userRatings = action.payload.data;
    })
    .addCase(fetchUserRatings.rejected, (state, action) => {
      state.ratingsLoading = false;
      state.ratingsError = action.payload;
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

      // Also remove from banned users list if present
      if (state.bannedUsers?.results) {
        state.bannedUsers.results = state.bannedUsers.results.filter(
          user => user.id !== action.payload.id
        );
        state.bannedUsers.count = Math.max(0, state.bannedUsers.count - 1);
      }

      // Also remove from blocked users list if present
      if (state.blockedUsers?.results) {
        state.blockedUsers.results = state.blockedUsers.results.filter(
          user => user.id !== action.payload.id
        );
        state.blockedUsers.count = Math.max(0, state.blockedUsers.count - 1);
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

      // Also remove from banned users list
      if (state.bannedUsers?.results && action.meta.arg) {
        const deletedIds = action.meta.arg;
        state.bannedUsers.results = state.bannedUsers.results.filter(
          user => !deletedIds.includes(user.id)
        );
        state.bannedUsers.count = Math.max(0, state.bannedUsers.count - deletedIds.length);
      }

      // Also remove from blocked users list
      if (state.blockedUsers?.results && action.meta.arg) {
        const deletedIds = action.meta.arg;
        state.blockedUsers.results = state.blockedUsers.results.filter(
          user => !deletedIds.includes(user.id)
        );
        state.blockedUsers.count = Math.max(0, state.blockedUsers.count - deletedIds.length);
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

      // Update in banned users list if applicable
      if (state.bannedUsers?.results) {
        const bannedIndex = state.bannedUsers.results.findIndex(
          user => user.id === action.payload.id
        );
        if (bannedIndex !== -1) {
          state.bannedUsers.results[bannedIndex] = action.payload;
        }
      }

      // Update in blocked users list if applicable
      if (state.blockedUsers?.results) {
        const blockedIndex = state.blockedUsers.results.findIndex(
          user => user.id === action.payload.id
        );
        if (blockedIndex !== -1) {
          state.blockedUsers.results[blockedIndex] = action.payload;
        }
      }
    })
    .addCase(updateUserStatus.rejected, (state, action) => {
      state.statusUpdateLoading = false;
      state.statusUpdateError = action.payload;
    })

    // Search Users
    .addCase(searchUsers.pending, (state) => {
      state.searchLoading = true;
      state.searchError = null;
    })
    .addCase(searchUsers.fulfilled, (state, action) => {
      state.searchLoading = false;
      state.searchedUsers = action.payload;
    })
    .addCase(searchUsers.rejected, (state, action) => {
      state.searchLoading = false;
      state.searchError = action.payload;
    })

    // Filter Users by Status
    .addCase(filterUsersByStatus.pending, (state) => {
      state.filterLoading = true;
      state.filterError = null;
    })
    .addCase(filterUsersByStatus.fulfilled, (state, action) => {
      state.filterLoading = false;
      state.filteredUsers = action.payload;
    })
    .addCase(filterUsersByStatus.rejected, (state, action) => {
      state.filterLoading = false;
      state.filterError = action.payload;
    });
},
});


export const { 
  clearUsersError, 
  clearUsersSuccess, 
  clearBannedUsersError,
  clearBlockedUsersError,
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
  clearRechargeHistoryError,
  clearRatingsError,
  clearUserCallHistory,
  clearUserRechargeHistory,
  clearUserRatings,
  clearBannedUsers,
  clearBlockedUsers,
  clearSearchError,
  clearFilterError,
  clearSearchedUsers,
  clearFilteredUsers,
} = usersSlice.actions;

export default usersSlice.reducer;