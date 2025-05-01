import { configureStore, combineReducers } from '@reduxjs/toolkit';
import cartReducer from "../redux/cartSlice";
import wishlistReducer from '../redux/wishlistSlice';
import compareReducer from '../redux/compareSlice';
import productReducer from '../redux/productSlice';
import currencyReducer from './currencySlice';
import storage from 'redux-persist/lib/storage';

import { persistStore, persistReducer } from 'redux-persist';

const persistConfig = {
  key: 'root',
  storage,
};

const rootReducer = combineReducers({
  cart: cartReducer,
  wishlist: wishlistReducer,
  compare: compareReducer,
  products: productReducer,
  currency: currencyReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  // No need to import thunk manually, it's already included
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // Optional: useful if redux-persist causes warnings
    }),
});

export const persistor = persistStore(store);
