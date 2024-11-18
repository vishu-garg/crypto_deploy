import pairs from './pairs';
import setIntervalFromNow from './setIntervalFromNow';

// type oneCandle = {
// 	name: string;
// 	time: number;
// 	open: number;
// 	close: number;
// 	high: number;
// 	low: number;
// 	pivot: number
// };

// type series = oneCandle[];


let ranOnce = false;

const fetchCandleEngine = async () => {
	if (ranOnce) return;

	const kucoinOHLCV = (ohlcv: any) => {
		const time = parseFloat(ohlcv[0]) / 1000;
		const open = parseFloat(ohlcv[1]) * 1;
		const high = parseFloat(ohlcv[2]) * 1;
		const low = parseFloat(ohlcv[3]) * 1;
		const close = parseFloat(ohlcv[4]) * 1;
		return [time, open, high, low, close];
	}

	const binanceOHLCV = (ohlcv: any) => {
		const time = parseFloat(ohlcv[0]) / 1000;
		const open = parseFloat(ohlcv[1]) * 1;
		const high = parseFloat(ohlcv[2]) * 1;
		const low = parseFloat(ohlcv[3]) * 1;
		const close = parseFloat(ohlcv[4]) * 1;
		return [time, open, high, low, close];
	}

	const calcCPR = (highPrev: number, lowPrev: number, closePrev: number) => {
		const pivot = (highPrev + lowPrev + closePrev) / 3;
		const bc = (highPrev + lowPrev) / 2;
		const tc = pivot - bc + pivot;
		const r1 = 2 * pivot - lowPrev;
		const s1 = 2 * pivot - highPrev;
		const r2 = pivot + (r1 - s1);
		const s2 = pivot - (r1 - s1);
		return { pivot, bc, tc, r1, r2, s1, s2 };
	}
	
	const calcCamarilla = (highPrev: number, lowPrev: number, closePrev: number) => {
		const pivot = (highPrev + lowPrev + closePrev) / 3;
		const range = highPrev - lowPrev;
		const l3 = closePrev - (range * 1.1) / 4;
		const l4 = closePrev - (range * 1.1) / 2;
		const h3 = closePrev + (range * 1.1) / 4;
		const h4 = closePrev + (range * 1.1) / 2;
		return { pivot, l3, l4, h3, h4 };
	};

	
	const kucoin = async () => {
		const fromDate = new Date(new Date().getTime() - 15 * 60 * 60 * 1000).getTime();
		const toDate = new Date().getTime();
		const interval = 60;

		// const fromDate = new Date(new Date().getTime() - 15 * 60 * 1000 * 60  ).getTime();
		// const toDate = new Date().getTime();
		// const interval = 1;

		for (const [pairName, pair] of Object.entries(pairs.kucoin)) {
			// console.log(`fetching ${pairName}`);
	
			const url = `https://api-futures.kucoin.com/api/v1/kline/query?symbol=${pairName}&granularity=${interval}&from=${fromDate}&to=${toDate}`;
			const data: series = await fetch(url)
				.then((res) => res.json())
				.then((res: kucoinres) => {
					// console.log(`some response received from kucoin for ${pairName}`)
					if (res.code !== '200000') {
						console.log(res);
						throw `Data from kucoin not received for ${pairName}`;
					}
					const reversedData = res.data.reverse();
					// console.log(reversedData)
					const r = reversedData.map((ele, index, array) => {
						const [ timeCurr, openCurr, highCurr, lowCurr, closeCurr ] = kucoinOHLCV(array[index]);
						// let pivot;
						let cpr: cpr;
						let camrilla: camrilla;
	
						if (index < array.length - 1) {
							 const [timePrev, openPrev, highPrev, lowPrev, closePrev] = kucoinOHLCV(array[index + 1]);
							//  pivot = (highPrev + lowPrev + closePrev) / 3;
							cpr = calcCPR(highPrev, lowPrev, closePrev);
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
							// pivot,
							cpr,
							camrilla,
						};
					});
					return r;
				});
			pairs.kucoin[pairName].setCandles1Hr(await data);
		}
		await fetch('https://api-futures.kucoin.com/api/v1/contracts/active')
			.then(res => res.json())
			.then(res => {
				if(res.code === '200000'){
					for(let i=0; i<res.data.length; i++){
						const pairName = res.data[i].symbol
						const turnover24Hrs = res.data[i].turnoverOf24h;
						try {
							pairs.kucoin[pairName].setRanking(turnover24Hrs);
						} catch (error) {
							console.log('fetch candle engine 1hr error on -->', pairName)	
						}
					}
				}
				// for (const [pairName, pair] of Object.entries(pairs.kucoin)) {
				// 	// pairs.kucoin[pairName].setRanking()
				// }
			})
	}

	// const binance = async () => {
	// 	const interval = '1d';
	// 	const limit = 5;
	// 	for (let [pairName, pair] of Object.entries(pairs.binance)) {
	// 		const url = `https://fapi.binance.com/fapi/v1/klines?interval=${interval}&symbol=${pairName}&limit=${limit}`;
	// 		const data: series = await fetch(url).then(res => res.json()).then((res: binanceres) => {
	// 			const reversedData = res.reverse();
	// 			// console.log('inside binance');
	// 			// console.log(res);
	// 			const r = reversedData.map((ele, index, array) => {
	// 				const [timeCurr, openCurr, highCurr, lowCurr, closeCurr] = binanceOHLCV(array[index]);
	// 				let cpr: cpr;
	// 				let camrilla: camrilla;

	// 				if (index < array.length - 1) {
	// 					const [timePrev, openPrev, highPrev, lowPrev, closePrev] = binanceOHLCV(array[index + 1]);
	// 					cpr = calcCPR(highPrev, lowPrev, closePrev);
	// 					camrilla = calcCamarilla(highPrev, lowPrev, closePrev);
	// 				} else {
	// 					cpr = {
	// 						pivot: 0,
	// 						bc: 0,
	// 						tc: 0,
	// 						r1: 0,
	// 						r2: 0,
	// 						s1: 0,
	// 						s2: 0,
	// 					};
	// 					camrilla = {
	// 						pivot: 0,
	// 						l3: 0,
	// 						l4: 0,
	// 						h3: 0,
	// 						h4: 0,
	// 					};
	// 				}

	// 				return {
	// 					name: pairName,
	// 					time: timeCurr,
	// 					open: openCurr,
	// 					close: closeCurr,
	// 					high: highCurr,
	// 					low: lowCurr,
	// 					cpr,
	// 					camrilla,
	// 				};
	// 			});
	// 			return r;
	// 		})
	// 		pairs.binance[pairName].setCandles1Day(await data);
	// 	}
	// }

	// If exchange, run that exchange function
	await kucoin();
	// await binance();
	// return {
	// 	kucoin,
	// }
};

export default fetchCandleEngine;
