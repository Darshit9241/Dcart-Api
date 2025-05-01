// redux/compareSlice.js
import { createSlice } from "@reduxjs/toolkit";

const getInitialCompare = () => {
  if (typeof window !== "undefined") {
    const stored = localStorage.getItem("compareItems");
    return stored ? JSON.parse(stored) : [];
  }
  return [];
};

const compareSlice = createSlice({
  name: "compare",
  initialState: getInitialCompare(),
  reducers: {
    addToCompare: (state, action) => {
      const exists = state.find((item) => item.id === action.payload.id);
      if (!exists && state.length < 4) {
        state.push(action.payload);
        localStorage.setItem("compareItems", JSON.stringify(state));
      }
    },
    removeFromCompare: (state, action) => {
      const updated = state.filter((item) => item.id !== action.payload.id);
      localStorage.setItem("compareItems", JSON.stringify(updated));
      return updated;
    },
    clearCompare: () => {
      localStorage.removeItem("compareItems");
      return [];
    },
  },
});

// ✅ Export these actions
export const { addToCompare, removeFromCompare, clearCompare } = compareSlice.actions;

// ✅ Export the reducer
export default compareSlice.reducer;
