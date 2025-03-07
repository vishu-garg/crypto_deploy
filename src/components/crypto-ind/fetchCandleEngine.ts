// @ts-nocheck
import redisClient from '@/app/api/redis/route';

import pairs from './pairs';

const ranOnce = false;

const fetchCandleEngine = async (type?: string) => {
  if (ranOnce) {
    return;
  }

  // go fetch candles data for every one of the pairs but in a deferred way.
  // 1day vale fetch first with 1day interval
  // 1hr vale fetch later with 1hr time interval
  // make sure that they dont overlap at all
  // error handling bhi yahi karni hai

  const kucoinOHLCV = (ohlcv: any) => {
    const time = Number.parseFloat(ohlcv[0]) / 1000;
    const open = Number.parseFloat(ohlcv[1]) * 1;
    const high = Number.parseFloat(ohlcv[2]) * 1;
    const low = Number.parseFloat(ohlcv[3]) * 1;
    const close = Number.parseFloat(ohlcv[4]) * 1;
    return [time, open, high, low, close];
  };

  const binanceOHLCV = (ohlcv: any) => {
    const time = Number.parseFloat(ohlcv[0]) / 1000;
    const open = Number.parseFloat(ohlcv[1]) * 1;
    const high = Number.parseFloat(ohlcv[2]) * 1;
    const low = Number.parseFloat(ohlcv[3]) * 1;
    const close = Number.parseFloat(ohlcv[4]) * 1;
    return [time, open, high, low, close];
  };

  const calcCPR = (highPrev: number, lowPrev: number, closePrev: number) => {
    const pivot = (highPrev + lowPrev + closePrev) / 3;
    const bc = (highPrev + lowPrev) / 2;
    const tc = pivot - bc + pivot;
    const r1 = 2 * pivot - lowPrev;
    const s1 = 2 * pivot - highPrev;
    const r2 = pivot + (r1 - s1);
    const s2 = pivot - (r1 - s1);
    return { pivot, bc, tc, r1, r2, s1, s2 };
  };

  const calcCamarilla = (highPrev: number, lowPrev: number, closePrev: number) => {
    const pivot = (highPrev + lowPrev + closePrev) / 3;
    const range = highPrev - lowPrev;
    const l3 = closePrev - (range * 1.1) / 4;
    const l4 = closePrev - (range * 1.1) / 2;
    const h3 = closePrev + (range * 1.1) / 4;
    const h4 = closePrev + (range * 1.1) / 2;
    return { pivot, l3, l4, h3, h4 };
  };

  const fetchPairData = async (pairName: string) => {
    let fromDate = new Date(new Date().getTime() - 15 * 60 * 1000 * 60 * 24).getTime();
    const toDate = new Date().getTime();
    let interval = 1440;

    if (type == 'week') {
      // from date is 15 weeks from now
      fromDate = new Date(new Date().getTime() - 4 * 7 * 60 * 1000 * 60 * 24).getTime();
      interval = 7 * 1440;
    }

    console.log('Fetching from API for: ', `${pairName}:${type}`);

    const url = `https://api-futures.kucoin.com/api/v1/kline/query?symbol=${pairName}&granularity=${interval}&from=${fromDate}&to=${toDate}`;
    const data: series = await fetch(url)
      .then(res => res.json())
      .then((res: kucoinres) => {
        // console.log("res", res);
        // console.log(`some response received from kucoin for ${pairName}`)
        if (res.code !== '200000') {
          console.log(res);
          throw `Data from kucoin not received for ${pairName}`;
        }
        const reversedData = res.data.reverse();
        // console.log(reversedData)
        const r = reversedData.map((ele, index, array) => {
          const [timeCurr, openCurr, highCurr, lowCurr, closeCurr] = kucoinOHLCV(array[index]);
          let cpr: cpr;
          let camrilla: camrilla;

          if (index < array.length - 1) {
            const [timePrev, openPrev, highPrev, lowPrev, closePrev] = kucoinOHLCV(array[index + 1]);

            if (type !== 'week') {
              cpr = calcCPR(highPrev, lowPrev, closePrev);
            } else {
              cpr = {
                pivot: 0,
                bc: 0,
                tc: 0,
                r1: 0,
                r2: 0,
                s1: 0,
                s2: 0,
              };
            }
            camrilla = calcCamarilla(highPrev, lowPrev, closePrev);
          } else {
            cpr = {
              pivot: 0,
              bc: 0,
              tc: 0,
              r1: 0,
              r2: 0,
              s1: 0,
              s2: 0,
            };
            camrilla = {
              pivot: 0,
              l3: 0,
              l4: 0,
              h3: 0,
              h4: 0,
            };
          }

          return {
            name: pairName,
            time: timeCurr,
            open: openCurr,
            close: closeCurr,
            high: highCurr,
            low: lowCurr,
            cpr,
            camrilla,
          };
        });
        return r;
      });

    // store the data in redis DB for caching purpose
    // we store on the pairName basis
    redisClient.set(`${pairName}:${type}`, JSON.stringify(data));
    return data;
  };

  const kucoin = async () => {
    const pairEntries = Object.entries(pairs.kucoin);
    const maxThreads = 30; // Limit of simultaneous threads
    const maxRequestsPerMinute = 1000;
    const interval = 60000 / maxRequestsPerMinute; // Time interval between API requests in milliseconds
    let lastRequestTime = 0;
    const queue: Promise<void>[] = [];

    for (const [pairName, pair] of pairEntries) {
      // Check Redis first
      const cachedData = await redisClient.get(`${pairName}:${type}`);
      if (cachedData) {
        console.log('Using cached data for:', pairName);
        const parsedData = JSON.parse(cachedData);
        if (type === 'day') {
          pairs.kucoin[pairName].setCandles1Day(parsedData);
        } else {
          pairs.kucoin[pairName].setCandles1Week(parsedData);
        }
        continue;
      }

      // Rate limit only API requests
      const now = Date.now();
      const delay = Math.max(0, interval - (now - lastRequestTime));
      if (delay > 0) {
        await new Promise(resolve => setTimeout(resolve, delay));
      }
      lastRequestTime = Date.now();

      if (queue.length >= maxThreads) {
        console.log('Thread Queue Full. Current Pair: ', pairName);
        // Wait for one promise to resolve or reject
        await Promise.race(queue);
      }

      const task = fetchPairData(pairName)
        .then((data) => {
          if (type === 'day') {
            pairs.kucoin[pairName].setCandles1Day(data);
          } else {
            pairs.kucoin[pairName].setCandles1Week(data);
          }
          // Remove resolved promise from the queue
          queue.splice(queue.indexOf(task), 1);
        })
        .catch((err: any) => {
          console.error(`Error fetching data for ${pairName}:`, err);
          // Remove failed promise from the queue
          queue.splice(queue.indexOf(task), 1);
        });

      console.log('Adding Pair: ', pairName);
      queue.push(task);
    }

    // Wait for remaining promises to complete
    await Promise.all(queue);
  };
  // If exchange, run that exchange function
  await kucoin();
};

export default fetchCandleEngine;
