import { createSlice } from '@reduxjs/toolkit';

const getCartKey = () => {
  const userEmail = localStorage.getItem('userEmail');
  return userEmail ? `cartItems_${userEmail}` : 'cartItems_guest';
};

const getInitialState = () => {
  const cartKey = getCartKey();
  return JSON.parse(localStorage.getItem(cartKey)) || {
    items: [],
    totalPrice: 0,
  };
};

const cartSlice = createSlice({
  name: 'cart',
  initialState: getInitialState(),
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
    
      localStorage.setItem(getCartKey(), JSON.stringify(state));
    },
    
    removeItem: (state, action) => {
      const { index } = action.payload;
      const item = state.items[index];
      if (item) {
        state.totalPrice -= item.price * item.quantity;
        state.items.splice(index, 1);
      }
      localStorage.setItem(getCartKey(), JSON.stringify(state));
    },
    
    updateQuantity: (state, action) => {
      const { index, quantity } = action.payload;
      const item = state.items[index];
      if (item && quantity > 0) {
        state.totalPrice += (quantity - item.quantity) * item.price;
        item.quantity = quantity;
      }
      localStorage.setItem(getCartKey(), JSON.stringify(state));
    },
    
    incrementQuantity: (state, action) => {
      const { index } = action.payload;
      const item = state.items[index];
      if (item) {
        item.quantity += 1;
        state.totalPrice += item.price;
      }
      localStorage.setItem(getCartKey(), JSON.stringify(state));
    },
    
    decrementQuantity: (state, action) => {
      const { index } = action.payload;
      const item = state.items[index];
      if (item && item.quantity > 1) {
        item.quantity -= 1;
        state.totalPrice -= item.price;
      }
      localStorage.setItem(getCartKey(), JSON.stringify(state));
    },
    
    clearCart: (state) => {
      state.items = [];
      state.totalPrice = 0;
      localStorage.setItem(getCartKey(), JSON.stringify(state));
    },
    
    refreshCart: (state) => {
      const newState = getInitialState();
      state.items = newState.items;
      state.totalPrice = newState.totalPrice;
    }
  },
});

export const { 
  addItem, 
  removeItem, 
  updateQuantity, 
  incrementQuantity, 
  decrementQuantity, 
  clearCart,
  refreshCart 
} = cartSlice.actions;

export default cartSlice.reducer;
