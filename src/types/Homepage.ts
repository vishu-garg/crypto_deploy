import type { ReactElement } from 'react';

export type CardItem = {
  cardType: string;
  icon: ReactElement;
  color: string;
};

export type HomepageCardProps = {
  setSelectedCard: (card: CardItem) => void;
};

export const CARD_TYPES = {
  POSSIBLE_BREAKOUTS: 'Possible Breakouts',
  TOP_GAINERS: 'Top Gainers',
  TOP_LOSERS: 'Top Losers',
  RECENT_BREAKOUT: 'Recent Breakout',
  INTRADAY_TRENDS: 'Intraday Trends',
  SECTOR_ANALYSIS: 'Sector Analysis',
  STOCK_ANALYSIS: 'Stock Analysis',
  UPCOMING_RESULTS: 'Upcoming Results',
  RECENT_RESULTS: 'Recent Results',
};

export type TabProps = {
  defaultTab: string;
}