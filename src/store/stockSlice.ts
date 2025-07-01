import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

type TranscriptItem = {
  date: string;
  ticker: string;
};

type StockState = {
  transcriptList: TranscriptItem[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
};

const initialState: StockState = {
  transcriptList: [],
  status: 'idle',
  error: null,
};

export const fetchTranscriptList = createAsyncThunk(
  'stock/fetchTranscriptList',
  async () => {
    const response = await axios.get('http://localhost:5000/api/transcript-analysis/list');
    return response.data.data;
  },
);

const stockSlice = createSlice({
  name: 'stock',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTranscriptList.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchTranscriptList.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.transcriptList = action.payload;
      })
      .addCase(fetchTranscriptList.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Failed to fetch transcript list';
      });
  },
});

export default stockSlice.reducer;
