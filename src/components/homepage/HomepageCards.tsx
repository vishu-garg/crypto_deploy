'use client';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

import {
  Assessment,
  ShowChart,
} from '@mui/icons-material';
import { Box, Card, Grid, Typography, useMediaQuery, useTheme } from '@mui/material';
import type { ReactElement } from 'react';
import React from 'react';
import { Navigation, Pagination } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';

import type { CardItem, HomepageCardProps } from '@/types/Homepage';
import { CARD_TYPES } from '@/types/Homepage';

export const CARD_DATA: CardItem[] = [
  { cardType: CARD_TYPES.POSSIBLE_BREAKOUTS, icon: <ShowChart />, color: '#6a11cb' },
  // { cardType: CARD_TYPES.TOP_GAINERS, icon: <TrendingUp />, color: '#00c9a7' },
  // { cardType: CARD_TYPES.TOP_LOSERS, icon: <TrendingDown />, color: '#ff5e57' },
  // { cardType: CARD_TYPES.RECENT_BREAKOUT, icon: <Star />, color: '#ffc107' },
  // { cardType: CARD_TYPES.INTRADAY_TRENDS, icon: <Insights />, color: '#00bcd4' },
  // { cardType: CARD_TYPES.SECTOR_ANALYSIS, icon: <BarChart />, color: '#8e24aa' },
  { cardType: CARD_TYPES.STOCK_ANALYSIS, icon: <Assessment />, color: '#4caf50' },
  // { cardType: CARD_TYPES.UPCOMING_RESULTS, icon: <Event />, color: '#2196f3' },
  // { cardType: CARD_TYPES.RECENT_RESULTS, icon: <EventNote />, color: '#f44336' },
];

type GradientCardProps = {
  cardType: string;
  icon: ReactElement;
  color: string;
};

const GradientCard: React.FC<GradientCardProps> = ({ cardType, icon, color }) => (
  <Card
    sx={{
      'p': 3,
      'textAlign': 'center',
      'position': 'relative',
      'borderRadius': 3,
      'transition': 'background 0.4s ease',
      'background': color,
      'color': '#fff',
      '&:hover': {
        background: `linear-gradient(135deg, ${color}, #000)`,
        cursor: `pointer`,
      },
      'display': 'flex',
      'alignItems': 'center',
      'justifyContent': 'center',
      'flexDirection': 'column',
      'height': 150,
    }}
  >
    <Box
      sx={{
        position: 'absolute',
        top: 24,
        left: '50%',
        transform: 'translateX(-50%)',
        width: 56,
        height: 56,
        borderRadius: '50%',
        backgroundColor: '#fff',
        color,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: 3,
      }}
    >
      {icon}
    </Box>
    <Typography variant="h6" sx={{ mt: 8 }}>
      {cardType}
    </Typography>
  </Card>
);

const groupIntoChunks = <T,>(arr: T[], chunkSize: number): T[][] =>
  Array.from({ length: Math.ceil(arr.length / chunkSize) }, (_, i) =>
    arr.slice(i * chunkSize, i * chunkSize + chunkSize));

const HomepageCards: React.FC<HomepageCardProps> = ({ setSelectedCard }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const cardChunks = groupIntoChunks(CARD_DATA, 9);

  // eslint-disable-next-line style/multiline-ternary
  return isMobile ? (
    <Grid container spacing={3}>
      {CARD_DATA.map((item, index) => (
        <Grid item xs={12} key={index} onClick={() => setSelectedCard(item)}>
          <GradientCard cardType={item.cardType} icon={item.icon} color={item.color} />
        </Grid>
      ))}
    </Grid>
  ) : (
    <Box
      sx={{
        position: 'relative',
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
      }}
    >
      <Box sx={{ width: '90%' }}>
        <Swiper
          modules={[Navigation, Pagination]}
          pagination={{ clickable: true }}
          navigation={{
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
          }}
          spaceBetween={30}
          slidesPerView={1}
          style={{ paddingBottom: '40px' }}
        >
          {cardChunks.map((chunk, slideIndex) => (
            <SwiperSlide key={slideIndex}>
              <Grid container spacing={3}>
                {chunk.map((item, index) => (
                  <Grid item xs={12} sm={6} md={4} key={index} onClick={() => setSelectedCard(item)}>
                    <GradientCard cardType={item.cardType} icon={item.icon} color={item.color} />
                  </Grid>
                ))}
              </Grid>
            </SwiperSlide>
          ))}
        </Swiper>
      </Box>

      {/* Position navigation arrows outside the Swiper container */}
      <Box
        className="swiper-button-prev"
        sx={{
          position: 'absolute',
          top: '50%',
          left: 'calc(15% - 30px)',
          transform: 'translateY(-50%)',
          zIndex: 10,
          cursor: 'pointer',
        }}
      />
      <Box
        className="swiper-button-next"
        sx={{
          position: 'absolute',
          top: '50%',
          right: 'calc(15% - 30px)',
          transform: 'translateY(-50%)',
          zIndex: 10,
          cursor: 'pointer',
        }}
      />
    </Box>
  );
};

export default HomepageCards;
