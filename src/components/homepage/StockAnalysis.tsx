import { Chat as ChatIcon } from '@mui/icons-material';
import { Box, IconButton } from '@mui/material';
import type {
  GridColDef,
} from '@mui/x-data-grid';
import {
  DataGrid,
} from '@mui/x-data-grid';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import ChatBox from '@/components/chat/ChatBox';
import BackButton from '@/components/common/BackButton';
import type { AppDispatch, RootState } from '@/store';
import { startChatSession } from '@/store/chatSlice';
import { fetchTranscriptList } from '@/store/stockSlice';

type StockAnalysisProps = {
  setSelectedCard: (card: null) => void;
};

const StockAnalysis: React.FC<StockAnalysisProps> = ({ setSelectedCard }) => {
  const dispatch = useDispatch<AppDispatch>();
  const stockState = useSelector((state: RootState) => state.stock);
  const { transcriptList = [], status = 'idle', error = null } = stockState || {};

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchTranscriptList());
    }
  }, [status, dispatch]);

  const handleChatClick = (ticker: string, date: string) => {
    try {
      // Ensure we have a valid date string in ISO format
      const dateObj = new Date(date);
      if (Number.isNaN(dateObj.getTime())) {
        console.error('Invalid date format:', date);
        return;
      }
      const formattedDate = dateObj.toISOString();
      dispatch(startChatSession({ ticker, date: formattedDate }));
    } catch (error) {
      console.error('Error formatting date:', error);
    }
  };

  const columns: GridColDef[] = [
    {
      field: 'ticker',
      headerName: 'Ticker',
      width: 130,
      sortable: true,
      filterable: true,
    },
    {
      field: 'date',
      headerName: 'Date',
      width: 200,
      sortable: true,
      filterable: true,
      valueGetter: (params) => {
        const date = params;
        if (!date) {
          return '';
        }
        try {
          // Ensure we're working with a proper date string
          const dateObj = new Date(date);
          if (Number.isNaN(dateObj.getTime())) {
            return date;
          }
          return dateObj.toISOString();
        } catch {
          return date;
        }
      },
    },
    {
      field: 'actions',
      headerName: 'Chat',
      width: 100,
      sortable: false,
      filterable: false,
      renderCell: params => (
        <IconButton
          onClick={() => handleChatClick(params.row.ticker, params.row.date)}
          size="small"
        >
          <ChatIcon />
        </IconButton>
      ),
    },
  ];

  return (
    <Box sx={{ p: 2 }}>
      <BackButton onClick={() => setSelectedCard(null)} />
      <Box sx={{ height: 400, width: '100%', mt: 2 }}>
        {status === 'loading' && <div>Loading...</div>}
        {status === 'failed' && (
          <div>
            Error:
            {error}
          </div>
        )}
        {status === 'succeeded' && transcriptList.length > 0 && (
          <DataGrid
            rows={transcriptList.map((item, index) => ({
              id: index,
              ...item,
            }))}
            columns={columns}
            pageSizeOptions={[5, 10, 25]}
            initialState={{
              pagination: { paginationModel: { pageSize: 10 } },
              sorting: {
                sortModel: [{ field: 'date', sort: 'desc' }],
              },
            }}
            disableRowSelectionOnClick
          />
        )}
        {status === 'succeeded' && transcriptList.length === 0 && (
          <div>No data available</div>
        )}
      </Box>
      <ChatBox />
    </Box>
  );
};

export default StockAnalysis;
