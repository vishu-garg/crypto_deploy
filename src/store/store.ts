import { configureStore } from '@reduxjs/toolkit';

import newsReducer from './newsSlice';
import screenerReducer from './screenersSlice';
import stockReducer from './stockSlice';

export const store = configureStore({
  reducer: {
    news: newsReducer,
    screener: screenerReducer,
    stock: stockReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
