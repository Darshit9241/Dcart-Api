// redux/compareSlice.js
import { createSlice } from "@reduxjs/toolkit";

const getCompareKey = () => {
  const userEmail = localStorage.getItem('userEmail');
  return userEmail ? `compareItems_${userEmail}` : 'compareItems_guest';
};

const getInitialState = () => {
  if (typeof window !== "undefined") {
    const compareKey = getCompareKey();
    const stored = localStorage.getItem(compareKey);
    return stored ? JSON.parse(stored) : [];
  }
  return [];
};

const compareSlice = createSlice({
  name: "compare",
  initialState: getInitialState(),
  reducers: {
    addToCompare: (state, action) => {
      const exists = state.find((item) => item.id === action.payload.id);
      if (!exists && state.length < 4) {
        state.push(action.payload);
        localStorage.setItem(getCompareKey(), JSON.stringify(state));
      }
    },
    removeFromCompare: (state, action) => {
      const updated = state.filter((item) => item.id !== action.payload.id);
      localStorage.setItem(getCompareKey(), JSON.stringify(updated));
      return updated;
    },
    clearCompare: () => {
      localStorage.removeItem(getCompareKey());
      return [];
    },
    refreshCompare: () => {
      return getInitialState();
    }
  },
});

// Export these actions
export const { 
  addToCompare, 
  removeFromCompare, 
  clearCompare,
  refreshCompare 
} = compareSlice.actions;

// Export the reducer
export default compareSlice.reducer;
