import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

export const fetchPossibleBreakouts = createAsyncThunk('screener/fetchPossibleBreakouts', async () => {
  const response = await axios.get('http://localhost:5000/api/possible-breakouts');
  return response.data.data;
});

const screenersSlice = createSlice({
  name: 'screeners',
  initialState: {
    possibleBreakouts: [],
    possibleBreakoutsStatus: '',
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPossibleBreakouts.pending, (state) => {
        state.possibleBreakoutsStatus = 'loading';
      })
      .addCase(fetchPossibleBreakouts.fulfilled, (state, action) => {
        state.possibleBreakoutsStatus = 'succeeded';
        state.possibleBreakouts = action.payload;
      })
      .addCase(fetchPossibleBreakouts.rejected, (state) => {
        state.possibleBreakoutsStatus = 'failed';
      });
  },
});

export default screenersSlice.reducer;
