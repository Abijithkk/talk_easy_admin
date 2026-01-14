import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { BASE_URL } from "../baseUrl";

// GET - Fetch all executive profile pictures
export const fetchExecutiveProfilePictures = createAsyncThunk(
  "executiveProfile/fetchExecutiveProfilePictures",
  async (_, { rejectWithValue }) => {
    try {
      const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

      const response = await axios.get(`${BASE_URL}/executives/admin/profile-pictures/`, {
        headers: {
          Authorization: token ? `Bearer ${token}` : undefined,
        },
      });

      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to fetch profile pictures");
    }
  }
);

// GET - Fetch single executive profile picture by ID
export const fetchExecutiveProfilePictureById = createAsyncThunk(
  "executiveProfile/fetchExecutiveProfilePictureById",
  async (pictureId, { rejectWithValue }) => {
    try {
      const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

      const response = await axios.get(`${BASE_URL}/executives/admin/profile-pictures/${pictureId}/`, {
        headers: {
          Authorization: token ? `Bearer ${token}` : undefined,
        },
      });

      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to fetch profile picture");
    }
  }
);

// DELETE - Delete executive profile picture by ID
export const deleteExecutiveProfilePicture = createAsyncThunk(
  "executiveProfile/deleteExecutiveProfilePicture",
  async (pictureId, { rejectWithValue }) => {
    try {
      const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

      const response = await axios.delete(`${BASE_URL}/executives/admin/profile-pictures/${pictureId}/`, {
        headers: {
          Authorization: token ? `Bearer ${token}` : undefined,
        },
      });

      return { ...response.data, deletedPictureId: pictureId };
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to delete profile picture");
    }
  }
);

// PATCH - Approve executive profile picture by ID
export const approveExecutiveProfilePicture = createAsyncThunk(
  "executiveProfile/approveExecutiveProfilePicture",
  async (pictureId, { rejectWithValue }) => {
    try {
      const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

      const response = await axios.post(
        `${BASE_URL}/executives/admin/profile-pictures/${pictureId}/approve/`,
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
      return rejectWithValue(error.response?.data || "Failed to approve profile picture");
    }
  }
);

// PATCH - Reject executive profile picture by ID
export const rejectExecutiveProfilePicture = createAsyncThunk(
  "executiveProfile/rejectExecutiveProfilePicture",
  async (pictureId, { rejectWithValue }) => {
    try {
      const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

      const response = await axios.post(
        `${BASE_URL}/executives/admin/profile-pictures/${pictureId}/reject/`,
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
      return rejectWithValue(error.response?.data || "Failed to reject profile picture");
    }
  }
);

const executiveProfileSlice = createSlice({
  name: "executiveProfile",
  initialState: {
    profilePictures: {
      results: [],
      count: 0,
      page: 1,
      page_size: 20,
      total_pages: 1
    },
    currentProfilePicture: null,
    loading: false,
    error: null,
    success: null,
    currentPictureLoading: false,
    currentPictureError: null,
    deleteLoading: false,
    deleteError: null,
    deleteSuccess: null,
    approveLoading: false,
    approveError: null,
    approveSuccess: null,
    rejectLoading: false,
    rejectError: null,
    rejectSuccess: null,
  },
  reducers: {
    clearExecutiveProfileError: (state) => {
      state.error = null;
    },
    clearExecutiveProfileSuccess: (state) => {
      state.success = null;
    },
    clearCurrentPictureError: (state) => {
      state.currentPictureError = null;
    },
    clearCurrentProfilePicture: (state) => {
      state.currentProfilePicture = null;
    },
    clearDeleteError: (state) => {
      state.deleteError = null;
    },
    clearDeleteSuccess: (state) => {
      state.deleteSuccess = null;
    },
    clearApproveError: (state) => {
      state.approveError = null;
    },
    clearApproveSuccess: (state) => {
      state.approveSuccess = null;
    },
    clearRejectError: (state) => {
      state.rejectError = null;
    },
    clearRejectSuccess: (state) => {
      state.rejectSuccess = null;
    },
  },
extraReducers: (builder) => {
  builder
    // Fetch Executive Profile Pictures
    .addCase(fetchExecutiveProfilePictures.pending, (state) => {
      state.loading = true;
      state.error = null;
    })
    .addCase(fetchExecutiveProfilePictures.fulfilled, (state, action) => {
      state.loading = false;
      // Store the entire API response structure
      state.profilePictures = {
        results: action.payload.results || [],
        count: action.payload.count || 0,
        page: action.payload.page || 1,
        page_size: action.payload.page_size || 20,
        total_pages: action.payload.total_pages || 1
      };
    })
    .addCase(fetchExecutiveProfilePictures.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    })

    // Fetch Single Executive Profile Picture by ID
    .addCase(fetchExecutiveProfilePictureById.pending, (state) => {
      state.currentPictureLoading = true;
      state.currentPictureError = null;
    })
    .addCase(fetchExecutiveProfilePictureById.fulfilled, (state, action) => {
      state.currentPictureLoading = false;
      state.currentProfilePicture = action.payload;
    })
    .addCase(fetchExecutiveProfilePictureById.rejected, (state, action) => {
      state.currentPictureLoading = false;
      state.currentPictureError = action.payload;
    })

    // Delete Executive Profile Picture - FIXED
    .addCase(deleteExecutiveProfilePicture.pending, (state) => {
      state.deleteLoading = true;
      state.deleteError = null;
      state.deleteSuccess = null;
    })
    .addCase(deleteExecutiveProfilePicture.fulfilled, (state, action) => {
      state.deleteLoading = false;
      state.deleteSuccess = "Profile picture deleted successfully";
      
      // Remove the deleted picture from the profile pictures list
      if (state.profilePictures?.results) {
        state.profilePictures.results = state.profilePictures.results.filter(
          picture => picture.id !== action.payload.deletedPictureId
        );
        state.profilePictures.count = state.profilePictures.count - 1;
      }

      // Clear current profile picture if it matches the deleted one
      if (state.currentProfilePicture && state.currentProfilePicture.id === action.payload.deletedPictureId) {
        state.currentProfilePicture = null;
      }
    })
    .addCase(deleteExecutiveProfilePicture.rejected, (state, action) => {
      state.deleteLoading = false;
      state.deleteError = action.payload;
    })

    // Approve Executive Profile Picture - FIXED
    .addCase(approveExecutiveProfilePicture.pending, (state) => {
      state.approveLoading = true;
      state.approveError = null;
      state.approveSuccess = null;
    })
    .addCase(approveExecutiveProfilePicture.fulfilled, (state, action) => {
      state.approveLoading = false;
      state.approveSuccess = "Profile picture approved successfully";
      
      // Update the picture in the profile pictures list
      if (state.profilePictures?.results) {
        const index = state.profilePictures.results.findIndex(
          picture => picture.id === action.payload.id
        );
        if (index !== -1) {
          state.profilePictures.results[index] = action.payload;
        }
      }

      // Update current profile picture if it matches
      if (state.currentProfilePicture && state.currentProfilePicture.id === action.payload.id) {
        state.currentProfilePicture = action.payload;
      }
    })
    .addCase(approveExecutiveProfilePicture.rejected, (state, action) => {
      state.approveLoading = false;
      state.approveError = action.payload;
    })

    // Reject Executive Profile Picture - FIXED
    .addCase(rejectExecutiveProfilePicture.pending, (state) => {
      state.rejectLoading = true;
      state.rejectError = null;
      state.rejectSuccess = null;
    })
    .addCase(rejectExecutiveProfilePicture.fulfilled, (state, action) => {
      state.rejectLoading = false;
      state.rejectSuccess = "Profile picture rejected successfully";
      
      // Update the picture in the profile pictures list
      if (state.profilePictures?.results) {
        const index = state.profilePictures.results.findIndex(
          picture => picture.id === action.payload.id
        );
        if (index !== -1) {
          state.profilePictures.results[index] = action.payload;
        }
      }

      // Update current profile picture if it matches
      if (state.currentProfilePicture && state.currentProfilePicture.id === action.payload.id) {
        state.currentProfilePicture = action.payload;
      }
    })
    .addCase(rejectExecutiveProfilePicture.rejected, (state, action) => {
      state.rejectLoading = false;
      state.rejectError = action.payload;
    });
},
});

export const { 
  clearExecutiveProfileError,
  clearExecutiveProfileSuccess,
  clearCurrentPictureError,
  clearCurrentProfilePicture,
  clearDeleteError,
  clearDeleteSuccess,
  clearApproveError,
  clearApproveSuccess,
  clearRejectError,
  clearRejectSuccess,
} = executiveProfileSlice.actions;

export default executiveProfileSlice.reducer;