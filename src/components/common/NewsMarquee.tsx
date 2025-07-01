'use client';

import { keyframes } from '@emotion/react';
import { Box, Typography, useTheme } from '@mui/material';
import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import type { AppDispatch, RootState } from '@/store';
import { fetchNewsLine } from '@/store/newsSlice';

const scroll = keyframes`
    0% { transform: translateX(0%); }
    100% { transform: translateX(-50%); }
`;

type NewsItem = {
  text: string;
  news_type: 'gain' | 'loss' | 'neutral' | string;
};

const NiftyMarquee: React.FC = () => {
  const theme = useTheme();
  const dispatch = useDispatch<AppDispatch>();
  const { headlines } = useSelector((state: RootState) => state.news);

  const marqueeRef = useRef<HTMLDivElement>(null);
  const [duration, setDuration] = useState('30s'); // default fallback

  useEffect(() => {
    dispatch(fetchNewsLine());
  }, [dispatch]);

  useEffect(() => {
    if (marqueeRef.current) {
      const totalWidth = marqueeRef.current.scrollWidth / 2; // because content is repeated
      const speedFactor = 80; // pixels per second — adjust this
      const calculatedDuration = totalWidth / speedFactor;
      setDuration(`${calculatedDuration}s`);
    }
  }, [headlines]);

  const getColor = (type: string): string => {
    switch (type) {
      case 'gain':
        return theme.palette.success.main;
      case 'loss':
        return theme.palette.error.main;
      case 'neutral':
        return theme.palette.text.secondary;
      default:
        return theme.palette.text.primary;
    }
  };

  const repeatedHeadlines = [...headlines, ...headlines];

  return (
    <Box
      sx={{
        overflow: 'hidden',
        backgroundColor: theme.palette.background.paper,
        border: `1px solid ${theme.palette.divider}`,
      }}
    >
      <Box
        ref={marqueeRef}
        sx={{
          display: 'inline-flex',
          animation: `${scroll} ${duration} linear infinite`,
        }}
      >
        {repeatedHeadlines.map((item: NewsItem, idx: number) => (
          <Typography
            key={idx}
            component="span"
            sx={{
              color: getColor(item.news_type),
              marginRight: 8,
              fontWeight: 600,
              fontSize: '0.95rem',
              whiteSpace: 'nowrap',
            }}
          >
            {item.text}
          </Typography>
        ))}
      </Box>
    </Box>
  );
};

export default NiftyMarquee;
