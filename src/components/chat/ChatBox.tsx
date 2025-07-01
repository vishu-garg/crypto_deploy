import {
  Close as CloseIcon,
  Minimize as MinimizeIcon,
  Send as SendIcon,
} from '@mui/icons-material';
import {
  Box,
  CircularProgress,
  IconButton,
  Paper,
  TextField,
  Typography,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import type { AppDispatch, RootState } from '@/store';
import { addMessage, closeChat, getSocket, setChatOpen } from '@/store/chatSlice';

const ChatBox: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const chatState = useSelector((state: RootState) => state.chat);
  const [message, setMessage] = useState('');

  useEffect(() => {
    return () => {
      dispatch(closeChat());
    };
  }, [dispatch]);

  if (!chatState.currentSession) {
    return null;
  }

  const { currentSession } = chatState;
  const socket = getSocket();

  const handleSendMessage = () => {
    if (!message.trim() || !socket) {
      return;
    }

    const newMessage = {
      id: Date.now().toString(),
      content: message,
      sender: 'user' as const,
      timestamp: new Date().toISOString(),
    };

    dispatch(addMessage(newMessage));
    socket.emit('send_message', {
      session_id: currentSession.sessionId,
      message,
    });
    setMessage('');
  };

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <Paper
      sx={{
        position: 'fixed',
        right: 20,
        bottom: 20,
        width: 350,
        height: currentSession.isOpen ? 500 : 50,
        transition: 'height 0.3s ease-in-out',
        display: 'flex',
        flexDirection: 'column',
        zIndex: 1000,
      }}
      elevation={3}
    >
      <Box
        sx={{
          p: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: '1px solid #e0e0e0',
          cursor: 'pointer',
        }}
        onClick={() => dispatch(setChatOpen(!currentSession.isOpen))}
      >
        <Typography variant="subtitle1">
          Chat -
          {' '}
          {currentSession.ticker}
          {' '}
          (
          {new Date(currentSession.date).toLocaleDateString()}
          )
        </Typography>
        <Box>
          <IconButton
            size="small"
            onClick={(e) => {
              e.stopPropagation();
              dispatch(setChatOpen(!currentSession.isOpen));
            }}
          >
            <MinimizeIcon />
          </IconButton>
          <IconButton size="small" onClick={() => dispatch(closeChat())}>
            <CloseIcon />
          </IconButton>
        </Box>
      </Box>

      {currentSession.isOpen && (
        <>
          <Box
            sx={{
              flex: 1,
              overflowY: 'auto',
              p: 2,
              display: 'flex',
              flexDirection: 'column',
              gap: 1,
            }}
          >
            {currentSession.messages.map(msg => (
              <Box
                key={msg.id}
                sx={{
                  alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                  maxWidth: '80%',
                }}
              >
                <Paper
                  sx={{
                    p: 1,
                    backgroundColor: msg.sender === 'user' ? '#e3f2fd' : '#f5f5f5',
                  }}
                >
                  <Typography variant="body2">{msg.content}</Typography>
                  <Typography variant="caption" color="text.secondary">
                    {new Date(msg.timestamp).toLocaleTimeString()}
                  </Typography>
                </Paper>
              </Box>
            ))}
            {currentSession.isLoading && (
              <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
                <CircularProgress size={24} />
              </Box>
            )}
          </Box>

          <Box sx={{ p: 1, borderTop: '1px solid #e0e0e0' }}>
            <TextField
              fullWidth
              size="small"
              placeholder="Type a message..."
              value={message}
              onChange={e => setMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              InputProps={{
                endAdornment: (
                  <IconButton onClick={handleSendMessage} disabled={!message.trim()}>
                    <SendIcon />
                  </IconButton>
                ),
              }}
            />
          </Box>
        </>
      )}
    </Paper>
  );
};

export default ChatBox;
