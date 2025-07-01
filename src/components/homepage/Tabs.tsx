import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import Tabs, { tabsClasses } from '@mui/material/Tabs';
import * as React from 'react';

import IntradayTrends from '@/components/homepage/IntradayTrends';
import PossibleBreakout from '@/components/homepage/PossibleBreakout';
import RecentBreakout from '@/components/homepage/RecentBreakout';
import RecentResults from '@/components/homepage/RecentResults';
import SectorAnalysis from '@/components/homepage/SectorAnalysis';
import StockAnalysis from '@/components/homepage/StockAnalysis';
import TopGainers from '@/components/homepage/TopGainers';
import TopLosers from '@/components/homepage/TopLosers';
import UpcomingResults from '@/components/homepage/UpcomingResults';
import type { TabProps } from '@/types/Homepage';
import { CARD_TYPES } from '@/types/Homepage';

type BasicTabsProps = {
  setSelectedCard: (card: null) => void;
} & TabProps;

const BasicTabs = (props: BasicTabsProps) => {
  const [value, setValue] = React.useState(props.defaultTab);

  const handleChange = (event: React.SyntheticEvent, newTab: string) => {
    setValue(newTab);
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs
          value={value}
          onChange={handleChange}
          scrollButtons
          variant="scrollable"
          sx={{
            [`& .${tabsClasses.scrollButtons}`]: {
              '&.Mui-disabled': { opacity: 0.3 },
            },
          }}
        >
          {
            Object.entries(CARD_TYPES).map(([_, value]) => (
              <Tab key={value} label={value} value={value} />
            ))
          }
        </Tabs>
      </Box>
      {value === CARD_TYPES.POSSIBLE_BREAKOUTS && <PossibleBreakout />}
      {value === CARD_TYPES.TOP_GAINERS && <TopGainers />}
      {value === CARD_TYPES.TOP_LOSERS && <TopLosers />}
      {value === CARD_TYPES.RECENT_BREAKOUT && <RecentBreakout />}
      {value === CARD_TYPES.INTRADAY_TRENDS && <IntradayTrends />}
      {value === CARD_TYPES.SECTOR_ANALYSIS && <SectorAnalysis />}
      {value === CARD_TYPES.STOCK_ANALYSIS && <StockAnalysis setSelectedCard={props.setSelectedCard} />}
      {value === CARD_TYPES.UPCOMING_RESULTS && <UpcomingResults />}
      {value === CARD_TYPES.RECENT_RESULTS && <RecentResults />}
    </Box>
  );
};

export default BasicTabs;
