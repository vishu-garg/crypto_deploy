import pair from './pair';
import pairsList from './pairsList';

export type pairsList = {
  [index: string]: {
    [index: string]: typeof pair;
  };
};

const pairs: () => { [index: string]: { [index: string]: ReturnType<typeof pair> } } = () => {
  const pairListKucoin: { [index: string]: ReturnType<typeof pair> } = {};
  pairsList.kucoinPairsList.forEach((pairVal: string) => {
    pairListKucoin[pairVal] = pair(pairVal);
  });

  const pairListBinance: { [index: string]: ReturnType<typeof pair> } = {};
  pairsList.binancePairsList.forEach((pairVal: string) => {
    pairListBinance[pairVal] = pair(pairVal);
  });

  // console.log('printing pairsListKucoin', pairListKucoin);

  return {
    kucoin: pairListKucoin,
    binance: pairListBinance,
  };

  // return pairListKucoin;
};

export default pairs();
