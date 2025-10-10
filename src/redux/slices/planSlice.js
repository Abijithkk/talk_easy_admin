import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { BASE_URL } from "../baseUrl";

// GET - Fetch all plans
export const fetchPlans = createAsyncThunk(
  "plans/fetchPlans",
  async (_, { rejectWithValue }) => {
    try {
      const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

      const response = await axios.get(`${BASE_URL}/payments/plans/`, {
        headers: {
          Authorization: token ? `Bearer ${token}` : undefined,
        },
      });

      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to fetch plans");
    }
  }
);

// GET - Fetch single plan by ID
export const fetchPlanById = createAsyncThunk(
  "plans/fetchPlanById",
  async (id, { rejectWithValue }) => {
    try {
      const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

      const response = await axios.get(`${BASE_URL}/payments/plans/${id}/`, {
        headers: {
          Authorization: token ? `Bearer ${token}` : undefined,
        },
      });

      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to fetch plan");
    }
  }
);

// POST - Create new plan
export const createPlan = createAsyncThunk(
  "plans/createPlan",
  async (planData, { rejectWithValue }) => {
    try {
      const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

      const response = await axios.post(
        `${BASE_URL}/payments/plans/`,
        planData,
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
        error.response?.data || "Failed to create plan"
      );
    }
  }
);

// PATCH - Update plan by ID
export const updatePlan = createAsyncThunk(
  "plans/updatePlan",
  async ({ id, planData }, { rejectWithValue }) => {
    try {
      const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

      const response = await axios.patch(
        `${BASE_URL}/payments/plans/${id}/`,
        planData,
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
        error.response?.data || "Failed to update plan"
      );
    }
  }
);

// DELETE - Delete plan by ID
export const deletePlan = createAsyncThunk(
  "plans/deletePlan",
  async (id, { rejectWithValue }) => {
    try {
      const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

      const response = await axios.delete(
        `${BASE_URL}/payments/plans/${id}/delete/`,
        {
          headers: {
            Authorization: token ? `Bearer ${token}` : undefined,
          },
        }
      );

      return { id, message: response.data?.message || "Plan deleted successfully" };
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Failed to delete plan"
      );
    }
  }
);

const planSlice = createSlice({
  name: "plans",
  initialState: {
    plans: { 
      results: [],
      count: 0
    },
    currentPlan: null, 
    loading: false,
    error: null,
    success: null,
    currentPlanLoading: false,
    currentPlanError: null,
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
    clearPlansError: (state) => {
      state.error = null;
    },
    clearPlansSuccess: (state) => {
      state.success = null;
    },
    clearCurrentPlanError: (state) => {
      state.currentPlanError = null;
    },
    clearCurrentPlan: (state) => {
      state.currentPlan = null;
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
    clearAllPlanStates: (state) => {
      state.error = null;
      state.success = null;
      state.currentPlanError = null;
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
      // Fetch Plans
      .addCase(fetchPlans.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPlans.fulfilled, (state, action) => {
        state.loading = false;
        state.plans = action.payload;
      })
      .addCase(fetchPlans.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch Single Plan by ID
      .addCase(fetchPlanById.pending, (state) => {
        state.currentPlanLoading = true;
        state.currentPlanError = null;
      })
      .addCase(fetchPlanById.fulfilled, (state, action) => {
        state.currentPlanLoading = false;
        state.currentPlan = action.payload;
      })
      .addCase(fetchPlanById.rejected, (state, action) => {
        state.currentPlanLoading = false;
        state.currentPlanError = action.payload;
      })

      // Create Plan
      .addCase(createPlan.pending, (state) => {
        state.createLoading = true;
        state.createError = null;
        state.createSuccess = null;
      })
      .addCase(createPlan.fulfilled, (state, action) => {
        state.createLoading = false;
        state.createSuccess = "Plan created successfully";

        // Add the new plan to the plans list
        if (state.plans?.results) {
          state.plans.results.push(action.payload);
          state.plans.count += 1;
        }
      })
      .addCase(createPlan.rejected, (state, action) => {
        state.createLoading = false;
        state.createError = action.payload;
      })

      // Update Plan
      .addCase(updatePlan.pending, (state) => {
        state.updateLoading = true;
        state.updateError = null;
        state.updateSuccess = null;
      })
      .addCase(updatePlan.fulfilled, (state, action) => {
        state.updateLoading = false;
        state.updateSuccess = "Plan updated successfully";
        state.currentPlan = action.payload;

        // Update the plan in the plans list if it exists
        if (state.plans?.results) {
          const index = state.plans.results.findIndex(
            plan => plan.id === action.payload.id
          );
          if (index !== -1) {
            state.plans.results[index] = action.payload;
          }
        }
      })
      .addCase(updatePlan.rejected, (state, action) => {
        state.updateLoading = false;
        state.updateError = action.payload;
      })

      // Delete Plan
      .addCase(deletePlan.pending, (state) => {
        state.deleteLoading = true;
        state.deleteError = null;
        state.deleteSuccess = null;
      })
      .addCase(deletePlan.fulfilled, (state, action) => {
        state.deleteLoading = false;
        state.deleteSuccess = action.payload.message;

        // Remove the plan from the plans list
        if (state.plans?.results) {
          state.plans.results = state.plans.results.filter(
            plan => plan.id !== action.payload.id
          );
          state.plans.count -= 1;
        }

        // Clear current plan if it's the one being deleted
        if (state.currentPlan && state.currentPlan.id === action.payload.id) {
          state.currentPlan = null;
        }
      })
      .addCase(deletePlan.rejected, (state, action) => {
        state.deleteLoading = false;
        state.deleteError = action.payload;
      });
  },
});

export const { 
  clearPlansError, 
  clearPlansSuccess, 
  clearCurrentPlanError,
  clearCurrentPlan,
  clearCreateError,
  clearCreateSuccess,
  clearUpdateError,
  clearUpdateSuccess,
  clearDeleteError,
  clearDeleteSuccess,
  clearAllPlanStates
} = planSlice.actions;

export default planSlice.reducer;