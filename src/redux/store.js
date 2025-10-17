
import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice.js";
import executivesReducer from "./slices/executiveSlice";
import usersReducer from "./slices/userSlice"
import categoriesReducer from "./slices/categorySlice.js";
import plansReducer from "./slices/planSlice.js"
import callReducer from "./slices/callSlice.js"
import executiveProfileSlice from "./slices/executiveProfileSlice.js"
import paymentReducer from "./slices/paymentSlice.js"
import adminProfileReducer from "./slices/adminProfileSlice.js";
import dashboardReducer from "./slices/dashboardSlice.js"
import carouselReducer from "./slices/carouselSlice.js"
import referralReducer from "./slices/referralSlice.js"
export const store = configureStore({
  reducer: {
    auth: authReducer,
    executives: executivesReducer,
    users: usersReducer,
    categories: categoriesReducer,
    plans: plansReducer,
    calls: callReducer,
    executiveProfile: executiveProfileSlice,
    payments: paymentReducer,
    adminProfile: adminProfileReducer,
    dashboard: dashboardReducer,
    carousel: carouselReducer,
    referrals: referralReducer

    



  },
});