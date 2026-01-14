import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { BASE_URL } from "../baseUrl";

// GET - Fetch all redemption options
export const fetchRedemptionOptions = createAsyncThunk(
  "payments/fetchRedemptionOptions",
  async (_, { rejectWithValue }) => {
    try {
      const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

      const response = await axios.get(`${BASE_URL}/payments/redemption-options/`, {
        headers: {
          Authorization: token ? `Bearer ${token}` : undefined,
        },
      });

      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to fetch redemption options");
    }
  }
);

// POST - Create new redemption option
export const createRedemptionOption = createAsyncThunk(
  "payments/createRedemptionOption",
  async (optionData, { rejectWithValue }) => {
    try {
      const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

      const response = await axios.post(
        `${BASE_URL}/payments/redemption-options/`,
        optionData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: token ? `Bearer ${token}` : undefined,
          },
        }
      );

      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to create redemption option");
    }
  }
);

// PATCH - Update redemption option
export const updateRedemptionOption = createAsyncThunk(
  "payments/updateRedemptionOption",
  async ({ id, data }, { rejectWithValue }) => { // Changed from optionData to data
    try {
      const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

      const response = await axios.patch(
        `${BASE_URL}/payments/redemption-options/${id}/`,
        data, // Use data instead of optionData
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: token ? `Bearer ${token}` : undefined,
          },
        }
      );

      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to update redemption option");
    }
  }
);
// DELETE - Delete redemption option
export const deleteRedemptionOption = createAsyncThunk(
  "payments/deleteRedemptionOption",
  async (id, { rejectWithValue }) => {
    try {
      const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

      await axios.delete(
        `${BASE_URL}/payments/redemption-options/${id}/`,
        {
          headers: {
            Authorization: token ? `Bearer ${token}` : undefined,
          },
        }
      );

      return id; // Return the deleted ID
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to delete redemption option");
    }
  }
);

// GET - Fetch single redemption option by ID
export const fetchRedemptionOptionById = createAsyncThunk(
  "payments/fetchRedemptionOptionById",
  async (id, { rejectWithValue }) => {
    try {
      const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

      const response = await axios.get(`${BASE_URL}/redemption-options/${id}/`, {
        headers: {
          Authorization: token ? `Bearer ${token}` : undefined,
        },
      });

      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to fetch redemption option");
    }
  }
);

// GET - Fetch all redeems (admin)
export const fetchRedeems = createAsyncThunk(
  "payments/fetchRedeems",
  async (_, { rejectWithValue }) => {
    try {
      const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

      const response = await axios.get(`${BASE_URL}/admin/redeems/`, {
        headers: {
          Authorization: token ? `Bearer ${token}` : undefined,
        },
      });
      console.log("API Response:", response.data); // Debug log

      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to fetch redeems");
    }
  }
);

// PATCH - Update redeem (admin)
export const updateRedeem = createAsyncThunk(
  "payments/updateRedeem",
  async ({ id, redeemData }, { rejectWithValue }) => {
    try {
      const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

      const response = await axios.patch(
        `${BASE_URL}/admin/redeems/`,
        { id, ...redeemData },
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
        error.response?.data || "Failed to update redeem"
      );
    }
  }
);



const paymentSlice = createSlice({
  name: "payments",
  initialState: {
    redemptionOptions: { 
      results: [],
      count: 0
    },
    redeems: { 
      results: [],
      count: 0
    },
    currentRedemptionOption: null, 
    loading: false,
    error: null,
    success: null,
    currentRedemptionOptionLoading: false,
    currentRedemptionOptionError: null,
    redeemsLoading: false,
    redeemsError: null,
    updateRedeemLoading: false,
    updateRedeemError: null,
    updateRedeemSuccess: null,
    createRedemptionOptionLoading: false,
    createRedemptionOptionError: null,
    createRedemptionOptionSuccess: null,
    updateRedemptionOptionLoading: false,
    updateRedemptionOptionError: null,
    updateRedemptionOptionSuccess: null,
  },
  reducers: {
    clearPaymentsError: (state) => {
      state.error = null;
    },
    clearPaymentsSuccess: (state) => {
      state.success = null;
    },
    clearCurrentRedemptionOptionError: (state) => {
      state.currentRedemptionOptionError = null;
    },
    clearCurrentRedemptionOption: (state) => {
      state.currentRedemptionOption = null;
    },
    clearRedeemsError: (state) => {
      state.redeemsError = null;
    },
    clearUpdateRedeemError: (state) => {
      state.updateRedeemError = null;
    },
    clearUpdateRedeemSuccess: (state) => {
      state.updateRedeemSuccess = null;
    },
    clearCreateRedemptionOptionError: (state) => {
      state.createRedemptionOptionError = null;
    },
    clearCreateRedemptionOptionSuccess: (state) => {
      state.createRedemptionOptionSuccess = null;
    },
    clearUpdateRedemptionOptionError: (state) => {
      state.updateRedemptionOptionError = null;
    },
    clearUpdateRedemptionOptionSuccess: (state) => {
      state.updateRedemptionOptionSuccess = null;
    },
    clearAllPaymentStates: (state) => {
      state.error = null;
      state.success = null;
      state.currentRedemptionOptionError = null;
      state.redeemsError = null;
      state.updateRedeemError = null;
      state.updateRedeemSuccess = null;
      state.createRedemptionOptionError = null;
      state.createRedemptionOptionSuccess = null;
      state.updateRedemptionOptionError = null;
      state.updateRedemptionOptionSuccess = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Redemption Options
      .addCase(fetchRedemptionOptions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRedemptionOptions.fulfilled, (state, action) => {
        state.loading = false;
        state.redemptionOptions = action.payload;
      })
      .addCase(fetchRedemptionOptions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Create Redemption Option
      .addCase(createRedemptionOption.pending, (state) => {
        state.createRedemptionOptionLoading = true;
        state.createRedemptionOptionError = null;
        state.createRedemptionOptionSuccess = null;
      })
      .addCase(createRedemptionOption.fulfilled, (state, action) => {
        state.createRedemptionOptionLoading = false;
        state.createRedemptionOptionSuccess = "Redemption option created successfully";
        
        // Add new option to the list
        if (state.redemptionOptions?.results) {
          state.redemptionOptions.results.push(action.payload);
          state.redemptionOptions.count += 1;
        }
      })
      .addCase(createRedemptionOption.rejected, (state, action) => {
        state.createRedemptionOptionLoading = false;
        state.createRedemptionOptionError = action.payload;
      })

      // Update Redemption Option
      .addCase(updateRedemptionOption.pending, (state) => {
        state.updateRedemptionOptionLoading = true;
        state.updateRedemptionOptionError = null;
        state.updateRedemptionOptionSuccess = null;
      })
      .addCase(updateRedemptionOption.fulfilled, (state, action) => {
        state.updateRedemptionOptionLoading = false;
        state.updateRedemptionOptionSuccess = "Redemption option updated successfully";
        
        // Update the option in the list
        if (state.redemptionOptions?.results) {
          const index = state.redemptionOptions.results.findIndex(
            option => option.id === action.payload.id
          );
          if (index !== -1) {
            state.redemptionOptions.results[index] = action.payload;
          }
        }
        
        // Update current option if it's the same one
        if (state.currentRedemptionOption?.id === action.payload.id) {
          state.currentRedemptionOption = action.payload;
        }
      })
      .addCase(updateRedemptionOption.rejected, (state, action) => {
        state.updateRedemptionOptionLoading = false;
        state.updateRedemptionOptionError = action.payload;
      })

      // Fetch Single Redemption Option by ID
      .addCase(fetchRedemptionOptionById.pending, (state) => {
        state.currentRedemptionOptionLoading = true;
        state.currentRedemptionOptionError = null;
      })
      .addCase(fetchRedemptionOptionById.fulfilled, (state, action) => {
        state.currentRedemptionOptionLoading = false;
        state.currentRedemptionOption = action.payload;
      })
      .addCase(fetchRedemptionOptionById.rejected, (state, action) => {
        state.currentRedemptionOptionLoading = false;
        state.currentRedemptionOptionError = action.payload;
      })

      // Fetch Redeems (Admin)
      .addCase(fetchRedeems.pending, (state) => {
        state.redeemsLoading = true;
        state.redeemsError = null;
      })
      .addCase(fetchRedeems.fulfilled, (state, action) => {
        state.redeemsLoading = false;
        
        // Handle both array and object responses
        if (Array.isArray(action.payload)) {
          state.redeems = {
            results: action.payload,
            count: action.payload.length
          };
        } else {
          state.redeems = action.payload;
        }
        
        console.log("Stored in Redux - redeems:", state.redeems); // Debug log
      })
      .addCase(fetchRedeems.rejected, (state, action) => {
        state.redeemsLoading = false;
        state.redeemsError = action.payload;
      })

      // Update Redeem (Admin)
      .addCase(updateRedeem.pending, (state) => {
        state.updateRedeemLoading = true;
        state.updateRedeemError = null;
        state.updateRedeemSuccess = null;
      })
      .addCase(updateRedeem.fulfilled, (state, action) => {
        state.updateRedeemLoading = false;
        state.updateRedeemSuccess = "Redeem updated successfully";

        // Update the redeem in the redeems list if it exists
        if (state.redeems?.results) {
          const index = state.redeems.results.findIndex(
            redeem => redeem.id === action.payload.id
          );
          if (index !== -1) {
            state.redeems.results[index] = action.payload;
          }
        }
      })
      .addCase(updateRedeem.rejected, (state, action) => {
        state.updateRedeemLoading = false;
        state.updateRedeemError = action.payload;
      });
  },
});

export const { 
  clearPaymentsError, 
  clearPaymentsSuccess, 
  clearCurrentRedemptionOptionError,
  clearCurrentRedemptionOption,
  clearRedeemsError,
  clearUpdateRedeemError,
  clearUpdateRedeemSuccess,
  clearCreateRedemptionOptionError,
  clearCreateRedemptionOptionSuccess,
  clearUpdateRedemptionOptionError,
  clearUpdateRedemptionOptionSuccess,
  clearAllPaymentStates
} = paymentSlice.actions;

export default paymentSlice.reducer;