import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isAuthenticated: !!localStorage.getItem('token'),
  userEmail: localStorage.getItem('userEmail') || null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login: (state, action) => {
      const { token, userEmail } = action.payload;
      localStorage.setItem('token', token);
      localStorage.setItem('userEmail', userEmail);
      state.isAuthenticated = true;
      state.userEmail = userEmail;
    },
    logout: (state) => {
      localStorage.removeItem('token');
      localStorage.removeItem('userEmail');
      state.isAuthenticated = false;
      state.userEmail = null;
    }
  }
});

export const { login, logout } = authSlice.actions;

export default authSlice.reducer; 