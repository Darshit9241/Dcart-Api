import { createSlice } from '@reduxjs/toolkit';

const getWishlistKey = () => {
  const userEmail = localStorage.getItem('userEmail');
  return userEmail ? `wishlistItems_${userEmail}` : 'wishlistItems_guest';
};

const getInitialState = () => {
  const wishlistKey = getWishlistKey();
  return JSON.parse(localStorage.getItem(wishlistKey)) || [];
};

// const savedWishlist = JSON.parse(localStorage.getItem('wishlistItems')) || {
//   items: [],
// };

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState: getInitialState(),
  reducers: {
    addToWishlist: (state, action) => {
      const exists = state.find(item => item.id === action.payload.id);
      if (!exists) {
        state.push(action.payload);
        localStorage.setItem(getWishlistKey(), JSON.stringify(state));
      }
    },
    removeFromWishlist: (state, action) => {
      const updated = state.filter(item => item.id !== action.payload.id);
      localStorage.setItem(getWishlistKey(), JSON.stringify(updated));
      return updated; // return updated array
    },
    clearWishlist: () => {
      localStorage.setItem(getWishlistKey(), JSON.stringify([]));
      return []; // return empty array
    },
    refreshWishlist: () => {
      return getInitialState();
    }
  }
});

export const { 
  addToWishlist, 
  removeFromWishlist, 
  clearWishlist,
  refreshWishlist 
} = wishlistSlice.actions;

export default wishlistSlice.reducer;
