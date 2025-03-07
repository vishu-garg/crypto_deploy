const engulfing = (series: series) => {

    if(    series[0].high >= series[1].high 
        && series[0].low <= series[1].low
        && series[0].open < series[1].close
        && series[0].close > series[1].open
        && series[0].close - series[0].open > 0.5 * (series[0].high - series[0].low)
        && series[1].close < series[1].open
        ){
            // console.log(series[0])
            // console.log(series[1])
            return true;
        }
    else return false;
	// return pairListKucoin;
};

export default engulfing;
