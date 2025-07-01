import { configureStore } from '@reduxjs/toolkit';

import chatReducer from './chatSlice';
import newsReducer from './newsSlice';
import screenReducer from './screenersSlice';
import stockReducer from './stockSlice';

export const store = configureStore({
  reducer: {
    news: newsReducer,
    screeners: screenReducer,
    stock: stockReducer,
    chat: chatReducer,
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
