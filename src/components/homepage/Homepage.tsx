'use client';

import { useState } from 'react';

import HomepageCards from '@/components/homepage/HomepageCards';
import BasicTabs from '@/components/homepage/Tabs';
import type { CardItem } from '@/types/Homepage';
import { CARD_TYPES } from '@/types/Homepage';

const Homepage: React.FC = () => {
  const [selectedCard, setSelectedCard] = useState<CardItem | null>(null);

  return (
    <div>
      {selectedCard == null && <div className="pt-6"><HomepageCards setSelectedCard={setSelectedCard} /></div>}
      {selectedCard?.cardType === CARD_TYPES.POSSIBLE_BREAKOUTS && <BasicTabs defaultTab={CARD_TYPES.POSSIBLE_BREAKOUTS} setSelectedCard={setSelectedCard} />}
      {selectedCard?.cardType === CARD_TYPES.TOP_GAINERS && <BasicTabs defaultTab={CARD_TYPES.TOP_GAINERS} setSelectedCard={setSelectedCard} />}
      {selectedCard?.cardType === CARD_TYPES.TOP_LOSERS && <BasicTabs defaultTab={CARD_TYPES.TOP_LOSERS} setSelectedCard={setSelectedCard} />}
      {selectedCard?.cardType === CARD_TYPES.RECENT_BREAKOUT && <BasicTabs defaultTab={CARD_TYPES.RECENT_BREAKOUT} setSelectedCard={setSelectedCard} />}
      {selectedCard?.cardType === CARD_TYPES.INTRADAY_TRENDS && <BasicTabs defaultTab={CARD_TYPES.INTRADAY_TRENDS} setSelectedCard={setSelectedCard} />}
      {selectedCard?.cardType === CARD_TYPES.SECTOR_ANALYSIS && <BasicTabs defaultTab={CARD_TYPES.SECTOR_ANALYSIS} setSelectedCard={setSelectedCard} />}
      {selectedCard?.cardType === CARD_TYPES.STOCK_ANALYSIS && <BasicTabs defaultTab={CARD_TYPES.STOCK_ANALYSIS} setSelectedCard={setSelectedCard} />}
      {selectedCard?.cardType === CARD_TYPES.UPCOMING_RESULTS && <BasicTabs defaultTab={CARD_TYPES.UPCOMING_RESULTS} setSelectedCard={setSelectedCard} />}
      {selectedCard?.cardType === CARD_TYPES.RECENT_RESULTS && <BasicTabs defaultTab={CARD_TYPES.RECENT_RESULTS} setSelectedCard={setSelectedCard} />}
    </div>
  );
};

export default Homepage;
