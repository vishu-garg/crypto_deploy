// @ts-nocheck
import CryptoIndicators from '@/components/crypto-ind/CryptoIndicators';
import init from '@/components/crypto-ind/init';
import pairs from '@/components/crypto-ind/pairs';
import { interval } from '@/types/crypto-ind/enums';

export default async function Page() {
  // Fetch data for 1 Day
  await init.normalRun1Day();
  const returnedPairsList1Day: any[] = [];
  for (const pair of Object.keys(pairs.kucoin)) {
    try {
      returnedPairsList1Day.push(pairs.kucoin[pair].sentData(interval.D1));
    } catch (e) {
      // Handle error if needed
    }
  }
  const sortedPairsList1Day = returnedPairsList1Day.sort((a: any, b: any) => {
    if (a?.ranking < b?.ranking) {
      return 1;
    } else if (a.ranking > b.ranking) {
      return -1;
    } else {
      return 0;
    }
  });

  // Fetch data for 1 Week
  await init.normalRun1Week();
  const returnedPairsList1Week: any[] = [];
  for (const pair of Object.keys(pairs.kucoin)) {
    try {
      returnedPairsList1Week.push(pairs.kucoin[pair].sentData(interval.D1));
    } catch (e) {
      // Handle error if needed
    }
  }
  const sortedPairsList1Week = returnedPairsList1Week.sort((a: any, b: any) => {
    if (a?.ranking < b?.ranking) {
      return 1;
    } else if (a.ranking > b.ranking) {
      return -1;
    } else {
      return 0;
    }
  });

  return (
    <CryptoIndicators
      returnedPairsList1Day={sortedPairsList1Day}
      returnedPairsList1Week={sortedPairsList1Week}
    />
  );
}
