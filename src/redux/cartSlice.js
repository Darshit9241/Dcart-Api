import { createSlice } from '@reduxjs/toolkit';
const savedCart = JSON.parse(localStorage.getItem('cartItems')) || {
  items: [],
  totalPrice: 0,
};
const cartSlice = createSlice({
  name: 'cart',
  initialState: savedCart,
  reducers: {
    addItem: (state, action) => {
      const { id, price, quantity } = action.payload;
      const existingItemIndex = state.items.findIndex(item => item.id === id);
    
      if (existingItemIndex >= 0) {
        const existingItem = state.items[existingItemIndex];
        state.totalPrice += (quantity - existingItem.quantity) * existingItem.price;
        existingItem.quantity = quantity;
      } else {
        state.items.push(action.payload);
        state.totalPrice += price * quantity;
      }
    
      localStorage.setItem('cartItems', JSON.stringify(state));
    },
    
    removeItem: (state, action) => {
      const { index } = action.payload;
      const item = state.items[index];
      if (item) {
        state.totalPrice -= item.price * item.quantity;
        state.items.splice(index, 1);
      }
      localStorage.setItem('cartItems', JSON.stringify(state));
    },
    
    updateQuantity: (state, action) => {
      const { index, quantity } = action.payload;
      const item = state.items[index];
      if (item && quantity > 0) {
        state.totalPrice += (quantity - item.quantity) * item.price;
        item.quantity = quantity;
      }
      localStorage.setItem('cartItems', JSON.stringify(state));
    },
    
    incrementQuantity: (state, action) => {
      const { index } = action.payload;
      const item = state.items[index];
      if (item) {
        item.quantity += 1;
        state.totalPrice += item.price;
      }
      localStorage.setItem('cartItems', JSON.stringify(state));
    },
    
    decrementQuantity: (state, action) => {
      const { index } = action.payload;
      const item = state.items[index];
      if (item && item.quantity > 1) {
        item.quantity -= 1;
        state.totalPrice -= item.price;
      }
      localStorage.setItem('cartItems', JSON.stringify(state));
    },
    
    clearCart: (state) => {
      state.items = [];
      state.totalPrice = 0;
      localStorage.setItem('cartItems', JSON.stringify(state));
    },
    
  },
});

export const { addItem, removeItem, updateQuantity, incrementQuantity, decrementQuantity,clearCart } = cartSlice.actions;

export default cartSlice.reducer;
