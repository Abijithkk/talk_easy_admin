"use client";

import { Provider } from "react-redux";
import { store } from "./store";
import { Toaster } from "react-hot-toast";

export function ReduxProvider({ children }) {
  return (
    <Provider store={store}>
      {children}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
         
          success: {
            duration: 3000,
          
          },
          error: {
            duration: 5000,
           
          },
        }}
      />
    </Provider>
  );
}