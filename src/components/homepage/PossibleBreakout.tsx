// @ts-nocheck
'use client';

import { Box, Link, Typography } from '@mui/material';
import type { GridColDef } from '@mui/x-data-grid';
import { DataGrid } from '@mui/x-data-grid';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import type { AppDispatch, RootState } from '@/store';
import { fetchPossibleBreakouts } from '@/store/screenersSlice';

const PossibleBreakout: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const possibleBreakouts = useSelector((state: RootState) => state.screeners.possibleBreakouts);
  const possibleBreakoutsStatus = useSelector((state: RootState) => state.screeners.possibleBreakoutsStatus);

  useEffect(() => {
    dispatch(fetchPossibleBreakouts());
  }, [dispatch]);

  const columns: GridColDef[] = [
    {
      field: 'ticker',
      headerName: 'Symbol',
      renderHeader: (params: GridColumnHeaderParams) => (
        <strong>
          Symbol
        </strong>
      ),
      flex: 1,
      renderCell: params => (
        <Link
          href={`https://finance.yahoo.com/quote/${params.value}`}
          target="_blank"
          rel="noopener"
          fontWeight="bold"
          underline="hover"
        >
          {params.value}
        </Link>
      ),
    },
    {
      field: 'close',
      headerName: 'Close Price',
      renderHeader: (params: GridColumnHeaderParams) => (
        <strong>
          Close Price
        </strong>
      ),
      type: 'number',
      flex: 1,
    },
    {
      field: 'resistance',
      headerName: 'Resistance',
      renderHeader: (params: GridColumnHeaderParams) => (
        <strong>
          Resistance
        </strong>
      ),
      type: 'number',
      flex: 1,
    },
  ];

  const rows = possibleBreakouts.map((item, index) => ({
    id: index,
    ...item,
  }));

  return (
    <Box sx={{ height: 400, width: '100%' }}>
      <Typography variant="subtitle1" gutterBottom sx={{ mt: 2, mb: 2}}>
        Possible Breakouts:
      </Typography>
      <DataGrid
        rows={rows}
        columns={columns}
        disableRowSelectionOnClick
        loading={possibleBreakoutsStatus === 'loading'}
        pageSizeOptions={[5, 10]}
        filterModel={{
          items: [],
        }}
        sx={{
          '& .MuiDataGrid-columnHeaders': {
            fontWeight: 'bold',
          },
        }}
      />
    </Box>
  );
};

export default PossibleBreakout;
