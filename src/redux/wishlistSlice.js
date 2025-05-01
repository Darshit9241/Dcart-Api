import { createSlice } from '@reduxjs/toolkit';

const savedWishlist = JSON.parse(localStorage.getItem('wishlistItems')) || [];

// const savedWishlist = JSON.parse(localStorage.getItem('wishlistItems')) || {
//   items: [],
// };

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState: savedWishlist,
  reducers: {
    addToWishlist: (state, action) => {
      const exists = state.find(item => item.id === action.payload.id);
      if (!exists) {
        state.push(action.payload);
        localStorage.setItem('wishlistItems', JSON.stringify(state));
      }
    },
    removeFromWishlist: (state, action) => {
      const updated = state.filter(item => item.id !== action.payload.id);
      localStorage.setItem('wishlistItems', JSON.stringify(updated));
      return updated; // return updated array
    },
    clearWishlist: () => {
      localStorage.setItem('wishlistItems', JSON.stringify([]));
      return []; // return empty array
    }
  }
});

export const { addToWishlist, removeFromWishlist, clearWishlist } = wishlistSlice.actions;
export default wishlistSlice.reducer;
