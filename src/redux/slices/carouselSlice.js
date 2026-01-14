import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { BASE_URL } from "../baseUrl";

// GET - Fetch all carousel images
export const fetchCarouselImages = createAsyncThunk(
  "carousel/fetchCarouselImages",
  async (_, { rejectWithValue }) => {
    try {
      const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

      const response = await axios.get(`${BASE_URL}/users/carousel-images/`, {
        headers: {
          Authorization: token ? `Bearer ${token}` : undefined,
        },
      });

      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to fetch carousel images");
    }
  }
);

// POST - Create new carousel image
export const createCarouselImage = createAsyncThunk(
  "carousel/createCarouselImage",
  async (imageData, { rejectWithValue }) => {
    try {
      const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

      const response = await axios.post(
        `${BASE_URL}/users/carousel-images/`,
        imageData,
        {
          headers: {
            "Content-Type": "multipart/form-data", // Typically used for file uploads
            Authorization: token ? `Bearer ${token}` : undefined,
          },
        }
      );

      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to create carousel image");
    }
  }
);

// PATCH - Update carousel image
export const updateCarouselImage = createAsyncThunk(
  "carousel/updateCarouselImage",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

      const response = await axios.patch(
        `${BASE_URL}/users/carousel-images/${id}/`,
        data,
        {
          headers: {
            "Content-Type": "multipart/form-data", 
            Authorization: token ? `Bearer ${token}` : undefined,
          },
        }
      );

      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to update carousel image");
    }
  }
);

// DELETE - Delete carousel image
export const deleteCarouselImage = createAsyncThunk(
  "carousel/deleteCarouselImage",
  async (id, { rejectWithValue }) => {
    try {
      const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

      await axios.delete(
        `${BASE_URL}/users/carousel-images/${id}/`,
        {
          headers: {
            Authorization: token ? `Bearer ${token}` : undefined,
          },
        }
      );

      return id; 
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to delete carousel image");
    }
  }
);

// GET - Fetch single carousel image by ID
export const fetchCarouselImageById = createAsyncThunk(
  "carousel/fetchCarouselImageById",
  async (id, { rejectWithValue }) => {
    try {
      const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

      const response = await axios.get(`${BASE_URL}/users/carousel-images/${id}/`, {
        headers: {
          Authorization: token ? `Bearer ${token}` : undefined,
        },
      });

      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to fetch carousel image");
    }
  }
);

const carouselSlice = createSlice({
  name: "carousel",
  initialState: {
    carouselImages: { 
      results: [],
      count: 0
    },
    currentCarouselImage: null,
    
    // Loading states
    loading: false,
    currentCarouselImageLoading: false,
    createCarouselImageLoading: false,
    updateCarouselImageLoading: false,
    deleteCarouselImageLoading: false,
    
    // Error states
    error: null,
    currentCarouselImageError: null,
    createCarouselImageError: null,
    updateCarouselImageError: null,
    deleteCarouselImageError: null,
    
    // Success states
    createCarouselImageSuccess: null,
    updateCarouselImageSuccess: null,
    deleteCarouselImageSuccess: null,
  },
  reducers: {
    clearCarouselError: (state) => {
      state.error = null;
    },
    clearCurrentCarouselImageError: (state) => {
      state.currentCarouselImageError = null;
    },
    clearCurrentCarouselImage: (state) => {
      state.currentCarouselImage = null;
    },
    clearCreateCarouselImageError: (state) => {
      state.createCarouselImageError = null;
    },
    clearCreateCarouselImageSuccess: (state) => {
      state.createCarouselImageSuccess = null;
    },
    clearUpdateCarouselImageError: (state) => {
      state.updateCarouselImageError = null;
    },
    clearUpdateCarouselImageSuccess: (state) => {
      state.updateCarouselImageSuccess = null;
    },
    clearDeleteCarouselImageError: (state) => {
      state.deleteCarouselImageError = null;
    },
    clearDeleteCarouselImageSuccess: (state) => {
      state.deleteCarouselImageSuccess = null;
    },
    clearAllCarouselStates: (state) => {
      state.error = null;
      state.currentCarouselImageError = null;
      state.createCarouselImageError = null;
      state.updateCarouselImageError = null;
      state.deleteCarouselImageError = null;
      state.createCarouselImageSuccess = null;
      state.updateCarouselImageSuccess = null;
      state.deleteCarouselImageSuccess = null;
    },
  },
// In your carouselSlice.js, update the extraReducers for fetchCarouselImages
extraReducers: (builder) => {
  builder
    // Fetch Carousel Images
    .addCase(fetchCarouselImages.pending, (state) => {
      state.loading = true;
      state.error = null;
    })
    .addCase(fetchCarouselImages.fulfilled, (state, action) => {
      state.loading = false;
      // Handle both array response and object with results property
      if (Array.isArray(action.payload)) {
        state.carouselImages = {
          results: action.payload,
          count: action.payload.length
        };
      } else {
        state.carouselImages = action.payload;
      }
    })
    .addCase(fetchCarouselImages.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    })

    // Create Carousel Image
    .addCase(createCarouselImage.fulfilled, (state, action) => {
      state.createCarouselImageLoading = false;
      state.createCarouselImageSuccess = "Carousel image created successfully";
      
      // Add new image to the list
      if (state.carouselImages?.results) {
        state.carouselImages.results.push(action.payload);
        state.carouselImages.count = state.carouselImages.results.length;
      } else {
        // Initialize if doesn't exist
        state.carouselImages = {
          results: [action.payload],
          count: 1
        };
      }
    })

    // Update Carousel Image
    .addCase(updateCarouselImage.fulfilled, (state, action) => {
      state.updateCarouselImageLoading = false;
      state.updateCarouselImageSuccess = "Carousel image updated successfully";
      
      // Update the image in the list
      if (state.carouselImages?.results) {
        const index = state.carouselImages.results.findIndex(
          image => image.id === action.payload.id
        );
        if (index !== -1) {
          state.carouselImages.results[index] = action.payload;
        }
      }
      
      // Update current image if it's the same one
      if (state.currentCarouselImage?.id === action.payload.id) {
        state.currentCarouselImage = action.payload;
      }
    })

    // Delete Carousel Image
    .addCase(deleteCarouselImage.fulfilled, (state, action) => {
      state.deleteCarouselImageLoading = false;
      state.deleteCarouselImageSuccess = "Carousel image deleted successfully";
      
      // Remove image from the list
      if (state.carouselImages?.results) {
        state.carouselImages.results = state.carouselImages.results.filter(
          image => image.id !== action.payload
        );
        state.carouselImages.count = state.carouselImages.results.length;
      }
      
      // Clear current image if it's the deleted one
      if (state.currentCarouselImage?.id === action.payload) {
        state.currentCarouselImage = null;
      }
    });
},
});

export const { 
  clearCarouselError,
  clearCurrentCarouselImageError,
  clearCurrentCarouselImage,
  clearCreateCarouselImageError,
  clearCreateCarouselImageSuccess,
  clearUpdateCarouselImageError,
  clearUpdateCarouselImageSuccess,
  clearDeleteCarouselImageError,
  clearDeleteCarouselImageSuccess,
  clearAllCarouselStates
} = carouselSlice.actions;

export default carouselSlice.reducer;