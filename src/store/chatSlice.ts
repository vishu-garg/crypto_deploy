import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import type { Socket } from 'socket.io-client';
import { io } from 'socket.io-client';

type Message = {
  id: string;
  content: string;
  sender: 'user' | 'server';
  timestamp: string;
};

type ChatSession = {
  sessionId: string;
  ticker: string;
  date: string;
  messages: Message[];
  isOpen: boolean;
  isLoading: boolean;
  error: string | null;
};

type ChatState = {
  currentSession: ChatSession | null;
};

// Store socket at module level
let socket: Socket | null = null;

// Function to get socket
export const getSocket = () => socket;

const initialState: ChatState = {
  currentSession: null,
};

export const startChatSession = createAsyncThunk(
  'chat/startSession',
  async ({ ticker, date }: { ticker: string; date: string }, { dispatch }) => {
    const response = await axios.post('http://localhost:5000/api/chat/start', { ticker, date });

    // Setup socket after successful session creation
    socket = io(`http://localhost:5000`, {
      withCredentials: true,
      transports: ['websocket'],
    })

    socket.on('connect', () => {
      // Connection established
    });

    socket.on('connection_established', (_data) => {
      // Connection data received
    });

    socket.on('joined_chat', (_data) => {
      // Chat joined
    });

    socket.on('error', (error) => {
      dispatch(setError(error.message));
    });

    socket.emit('join_chat', { session_id: response.data.session_id });

    // Add connection message
    dispatch(addMessage({
      id: Date.now().toString(),
      content: 'Connected to chat session',
      sender: 'server',
      timestamp: new Date().toISOString(),
    }));

    socket.on('message_response', (message) => {
      dispatch(addMessage({
        id: Date.now().toString(),
        content: message.content,
        sender: 'server',
        timestamp: new Date().toISOString(),
      }));
    });

    return response.data;
  },
);

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    setChatOpen: (state, action) => {
      if (state.currentSession) {
        state.currentSession.isOpen = action.payload;
      }
    },
    addMessage: (state, action) => {
      if (state.currentSession) {
        state.currentSession.messages.push(action.payload);
      }
    },
    setError: (state, action) => {
      if (state.currentSession) {
        state.currentSession.error = action.payload;
      }
    },
    closeChat: (state) => {
      if (socket) {
        socket.disconnect();
        socket = null;
      }
      state.currentSession = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(startChatSession.pending, (state) => {
        state.currentSession = {
          sessionId: '',
          ticker: '',
          date: '',
          messages: [],
          isOpen: true,
          isLoading: true,
          error: null,
        };
      })
      .addCase(startChatSession.fulfilled, (state, action) => {
        state.currentSession = {
          sessionId: action.payload.session_id,
          ticker: action.payload.ticker,
          date: action.payload.date,
          messages: [],
          isOpen: true,
          isLoading: false,
          error: null,
        };
      })
      .addCase(startChatSession.rejected, (state, action) => {
        if (state.currentSession) {
          state.currentSession.isLoading = false;
          state.currentSession.error = action.error.message || 'Failed to start chat session';
        }
      });
  },
});

export const { setChatOpen, addMessage, setError, closeChat } = chatSlice.actions;
export default chatSlice.reducer;
