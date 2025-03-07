// @ts-nocheck
import { interval } from '@/types/crypto-ind/enums';

const pair = (name = 'BTC/USDT') => {
  const testing = true;

  // Dipesh's code from here on

  let ranking = 0;

  let candles1Day: series;
  let isHigherThirdZone1Day: boolean = false;
  let isLowerThirdZone1Day: boolean = false;
  let isInsideCamrilla1Day: boolean = false;
  let virginCPR1Day: string = '';
  let numberOfAscendindCPR1Day = 0;

  let candles1Week: series;
  let isHigherThirdZone1Week: boolean = false;
  let isLowerThirdZone1Week: boolean = false;
  let isInsideCamrilla1Week: boolean = false;

  let candles1Hr: series;
  let isHigherThirdZone1Hr: boolean = false;
  let isLowerThirdZone1Hr: boolean = false;
  let isInsideCamrilla1Hr: boolean = false;
  let virginCPR1Hr: string = '';
  let numberOfAscendindCPR1Hr = 0;

  const setCandles1Day = (data: series) => {
    candles1Day = data;
  };
  const setCandles1Week = (data: series) => {
    candles1Week = data;
  };
  const setCandles1Hr = (data: series) => {
    candles1Hr = data;
  };
  const setRanking = (rank: number) => {
    ranking = rank;
  };

  const isThirdZone: (series: series) => { isHigherThirdZone: boolean; isLowerThirdZone: boolean } = (series: series) => {
    let isHigherThirdZone = false;
    let isLowerThirdZone = false;
    // console.log(series[0].camrilla, name);
    try {
      if (series[0]?.camrilla.l3 > series[1]?.camrilla.h3) {
        isHigherThirdZone = true;
      }
    } catch (w) {
      console.log(`pair.ts error on ${name}`);
      console.log(series[0]);
    }
    // console.log(series[0].camrilla.h3, series[1].camrilla.l3, name);
    if (series[0]?.camrilla.h3 < series[1]?.camrilla.l3) {
      isLowerThirdZone = true;
    }
    return {
      isHigherThirdZone,
      isLowerThirdZone,
    };
  };
  const isVirginCPR = (series: series) => {
    let virginCPRDays = '';
    series.map((data, index) => {
      if (Math.min(data.cpr.bc, data.cpr.tc) > data.high || Math.max(data.cpr.bc, data.cpr.tc) < data.low) {
        if (virginCPRDays === '') {
          virginCPRDays = virginCPRDays.concat(index.toString());
        } else {
          virginCPRDays = virginCPRDays.concat(', ', index.toString());
        }
      }
    });
    if (virginCPRDays === '') {
      virginCPRDays = '0';
      return ('Virgin CPR was not formed in the last few days');
    } else {
      return ('Virgin CPR was formed '.concat(virginCPRDays, ' days ago'));
    }
  };
  const isInsideCamrilla = (series: series) => {
    const prevDay = series[1];
    const today = series[0];
    if (prevDay && today && prevDay.camrilla.h3 > today.camrilla.h3 && prevDay.camrilla.l3 < today.camrilla.l3) {
      return true;
    } else {
      return false;
    }
  };
  const seriesOfAscendingCPR = (series: series) => {
    let numberOfCPR = 0;
    for (let i = 1; i < series.length; i++) {
      if (series[i - 1].cpr.pivot > series[i].cpr.pivot) {
        numberOfCPR++;
      } else {
        break;
      }
    }
    return numberOfCPR;
  };

  const checkCondition1Day = () => {
    // console.log("inside checkCondition 1Day")
    const { isHigherThirdZone, isLowerThirdZone } = isThirdZone(getCandles1Day());
    isHigherThirdZone1Day = isHigherThirdZone;
    isLowerThirdZone1Day = isLowerThirdZone;

    virginCPR1Day = isVirginCPR(getCandles1Day());
    numberOfAscendindCPR1Day = seriesOfAscendingCPR(getCandles1Day());
    isInsideCamrilla1Day = isInsideCamrilla(getCandles1Day());
  };

  const checkCondition1Week = () => {
    // console.log("inside checkCondition 1Week")
    const { isHigherThirdZone, isLowerThirdZone } = isThirdZone(getCandles1Week());
    isHigherThirdZone1Week = isHigherThirdZone;
    isLowerThirdZone1Week = isLowerThirdZone;
    isInsideCamrilla1Week = isInsideCamrilla(getCandles1Week());
  };

  const checkCondition1Hr = () => {
    const { isHigherThirdZone, isLowerThirdZone } = isThirdZone(getCandles1Hr());
    isHigherThirdZone1Hr = isHigherThirdZone;
    isLowerThirdZone1Hr = isLowerThirdZone;
    virginCPR1Hr = isVirginCPR(getCandles1Hr());
    numberOfAscendindCPR1Hr = seriesOfAscendingCPR(getCandles1Hr());
    isInsideCamrilla1Hr = isInsideCamrilla(getCandles1Hr());
  };

  const sentData = (duration: interval) => {
    let data;
    // console.log("inside send data")
    if (duration === interval.D1) {
      data = {
        name,
        ranking,
        isHigherThirdZone1Day,
        isLowerThirdZone1Day,
        isInsideCamrilla1Day,
        virginCPR1Day,
        ascendingCPR1Day: numberOfAscendindCPR1Day,
        time1Day: (getCandles1Day()?.slice(0, 1)[0].time) * 1000,
        isHigherThirdZone1Week,
        isLowerThirdZone1Week,
        isInsideCamrilla1Week,
        time1Week: (getCandles1Week()?.slice(0, 1)[0].time) * 1000,
      };
    }
    if (duration === interval.H1) {
      data = {
        name,
        ranking,
        isHigherThirdZone: isHigherThirdZone1Hr,
        isLowerThirdZone: isLowerThirdZone1Hr,
        isInsideCamrilla: isInsideCamrilla1Hr,
        virginCPR: virginCPR1Hr,
        ascendingCPR: numberOfAscendindCPR1Hr,
        time: getCandles1Hr().slice(0, 1)[0].time * 1000,
      };
    }
    return data;
  };

  const testArbitrage = () => {
    return getCandles1Day();
  };

  const getCandles1Day = () => candles1Day;
  const getCandles1Week = () => candles1Week;
  const getCandles1Hr = () => candles1Hr;
  const getIsHigherThirdZone1Day = () => isHigherThirdZone1Day;

  return {
    setCandles1Day,
    setCandles1Week,
    setCandles1Hr,
    setRanking,
    // isThirdZone,

    checkCondition1Day,
    checkCondition1Week,
    checkCondition1Hr,
    sentData,
    testArbitrage,
    seriesOfAscendingCPR,

    getCandles1Day,
    getCandles1Hr,
    getCandles1Week,
    getIsHigherThirdZone1Day,
  };
};

export default pair;
