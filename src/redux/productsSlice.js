import { createSlice } from '@reduxjs/toolkit';
import products from '../component/ProductData';
// import products from '../../components/ProductData';

const productSlice = createSlice({
  name: 'products',
  initialState: products,
  reducers: {
    addProduct: (state, action) => {
      state.push(action.payload);
    },
    removeProduct: (state, action) => {
      return state.filter(product => product.id !== action.payload.id);
    }
  },
});

export const { addProduct, removeProduct } = productSlice.actions;
export default productSlice.reducer;
