import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { BASE_URL } from "../baseUrl";

// GET - Fetch all categories
export const fetchCategories = createAsyncThunk(
  "categories/fetchCategories",
  async (_, { rejectWithValue }) => {
    try {
      const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

      const response = await axios.get(`${BASE_URL}/payments/categories/`, {
        headers: {
          Authorization: token ? `Bearer ${token}` : undefined,
        },
      });

      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to fetch categories");
    }
  }
);

// GET - Fetch single category by ID
export const fetchCategoryById = createAsyncThunk(
  "categories/fetchCategoryById",
  async (id, { rejectWithValue }) => {
    try {
      const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

      const response = await axios.get(`${BASE_URL}/payments/categories/${id}/`, {
        headers: {
          Authorization: token ? `Bearer ${token}` : undefined,
        },
      });

      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to fetch category");
    }
  }
);

// POST - Create new category
export const createCategory = createAsyncThunk(
  "categories/createCategory",
  async (categoryData, { rejectWithValue }) => {
    try {
      const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

      const response = await axios.post(
        `${BASE_URL}/payments/categories/`,
        categoryData,
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
        error.response?.data || "Failed to create category"
      );
    }
  }
);

// PATCH - Update category by ID
export const updateCategory = createAsyncThunk(
  "categories/updateCategory",
  async ({ id, categoryData }, { rejectWithValue }) => {
    try {
      const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
      
      console.log("🔄 updateCategory thunk called with:", { id, categoryData, token: !!token });

      const response = await axios.patch(
        `${BASE_URL}/payments/categories/${id}/`,
        categoryData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: token ? `Bearer ${token}` : undefined,
          },
        }
      );

      return response.data;

    } catch (error) {
      console.error("❌ updateCategory API error:", {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });
      
      return rejectWithValue(
        error.response?.data || "Failed to update category"
      );
    }
  }
);

// DELETE - Delete category by ID
export const deleteCategory = createAsyncThunk(
  "categories/deleteCategory",
  async (id, { rejectWithValue }) => {
    try {
      const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

      const response = await axios.delete(
        `${BASE_URL}/payments/categories/${id}/delete/`,
        {
          headers: {
            Authorization: token ? `Bearer ${token}` : undefined,
          },
        }
      );

      return { id, message: response.data?.message || "Category deleted successfully" };
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Failed to delete category"
      );
    }
  }
);

const categorySlice = createSlice({
  name: "categories",
  initialState: {
    categories: { 
      results: [],
      count: 0
    },
    currentCategory: null, 
    loading: false,
    error: null,
    success: null,
    currentCategoryLoading: false,
    currentCategoryError: null,
    createLoading: false,
    createError: null,
    createSuccess: null,
    updateLoading: false,
    updateError: null,
    updateSuccess: null,
    deleteLoading: false,
    deleteError: null,
    deleteSuccess: null,
  },
  reducers: {
    clearCategoriesError: (state) => {
      state.error = null;
    },
    clearCategoriesSuccess: (state) => {
      state.success = null;
    },
    clearCurrentCategoryError: (state) => {
      state.currentCategoryError = null;
    },
    clearCurrentCategory: (state) => {
      state.currentCategory = null;
    },
    clearCreateError: (state) => {
      state.createError = null;
    },
    clearCreateSuccess: (state) => {
      state.createSuccess = null;
    },
    clearUpdateError: (state) => {
      state.updateError = null;
    },
    clearUpdateSuccess: (state) => {
      state.updateSuccess = null;
    },
    clearDeleteError: (state) => {
      state.deleteError = null;
    },
    clearDeleteSuccess: (state) => {
      state.deleteSuccess = null;
    },
    clearAllCategoryStates: (state) => {
      state.error = null;
      state.success = null;
      state.currentCategoryError = null;
      state.createError = null;
      state.createSuccess = null;
      state.updateError = null;
      state.updateSuccess = null;
      state.deleteError = null;
      state.deleteSuccess = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Categories
      .addCase(fetchCategories.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.categories = action.payload;
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch Single Category by ID
      .addCase(fetchCategoryById.pending, (state) => {
        state.currentCategoryLoading = true;
        state.currentCategoryError = null;
      })
      .addCase(fetchCategoryById.fulfilled, (state, action) => {
        state.currentCategoryLoading = false;
        state.currentCategory = action.payload;
      })
      .addCase(fetchCategoryById.rejected, (state, action) => {
        state.currentCategoryLoading = false;
        state.currentCategoryError = action.payload;
      })

      // Create Category
      .addCase(createCategory.pending, (state) => {
        state.createLoading = true;
        state.createError = null;
        state.createSuccess = null;
      })
      .addCase(createCategory.fulfilled, (state, action) => {
        state.createLoading = false;
        state.createSuccess = "Category created successfully";

        // Add the new category to the categories list
        if (state.categories?.results) {
          state.categories.results.push(action.payload);
          state.categories.count += 1;
        }
      })
      .addCase(createCategory.rejected, (state, action) => {
        state.createLoading = false;
        state.createError = action.payload;
      })

      // Update Category
      .addCase(updateCategory.pending, (state) => {
        state.updateLoading = true;
        state.updateError = null;
        state.updateSuccess = null;
      })
      .addCase(updateCategory.fulfilled, (state, action) => {
        state.updateLoading = false;
        state.updateSuccess = "Category updated successfully";
        state.currentCategory = action.payload;

        // Update the category in the categories list if it exists
        if (state.categories?.results) {
          const index = state.categories.results.findIndex(
            category => category.id === action.payload.id
          );
          if (index !== -1) {
            state.categories.results[index] = action.payload;
          }
        }
      })
      .addCase(updateCategory.rejected, (state, action) => {
        state.updateLoading = false;
        state.updateError = action.payload;
      })

      // Delete Category
      .addCase(deleteCategory.pending, (state) => {
        state.deleteLoading = true;
        state.deleteError = null;
        state.deleteSuccess = null;
      })
      .addCase(deleteCategory.fulfilled, (state, action) => {
        state.deleteLoading = false;
        state.deleteSuccess = action.payload.message;

        // Remove the category from the categories list
        if (state.categories?.results) {
          state.categories.results = state.categories.results.filter(
            category => category.id !== action.payload.id
          );
          state.categories.count -= 1;
        }

        // Clear current category if it's the one being deleted
        if (state.currentCategory && state.currentCategory.id === action.payload.id) {
          state.currentCategory = null;
        }
      })
      .addCase(deleteCategory.rejected, (state, action) => {
        state.deleteLoading = false;
        state.deleteError = action.payload;
      });
  },
});

export const { 
  clearCategoriesError, 
  clearCategoriesSuccess, 
  clearCurrentCategoryError,
  clearCurrentCategory,
  clearCreateError,
  clearCreateSuccess,
  clearUpdateError,
  clearUpdateSuccess,
  clearDeleteError,
  clearDeleteSuccess,
  clearAllCategoryStates
} = categorySlice.actions;

export default categorySlice.reducer;