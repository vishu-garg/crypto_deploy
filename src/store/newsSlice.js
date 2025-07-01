import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

export const fetchNewsLine = createAsyncThunk('news/fetchNewsLine', async () => {
  const response = await axios.get('http://localhost:5000/api/news');
  return response.data.data;
});

const newsSlice = createSlice({
  name: 'news',
  initialState: {
    headlines: [],
    status: 'idle',
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchNewsLine.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchNewsLine.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.headlines = action.payload;
      })
      .addCase(fetchNewsLine.rejected, (state) => {
        state.status = 'failed';
      });
  },
});

export default newsSlice.reducer;
