// redux/productSlice.js
import { createSlice } from '@reduxjs/toolkit';

const productSlice = createSlice({
  name: 'products',
  initialState: [],
  reducers: {
    addProduct: (state, action) => {
      state.push(action.payload);
    },
    removeProduct: (state, action) => {
      return state.filter(product => product.id !== action.payload);
    },
    updateProduct: (state, action) => {
      const index = state.findIndex(product => product.id === action.payload.id);
      if (index !== -1) {
        state[index] = action.payload;
      }
    },
  },
});

export const { addProduct, removeProduct, updateProduct } = productSlice.actions;
export default productSlice.reducer;
