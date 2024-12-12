import redisClient from 'pages/api/redis';
import pairs from './pairs';
import setIntervalFromNow from './setIntervalFromNow';

let ranOnce = false;

const fetchCandleEngine = async (type?: string) => {
	if (ranOnce) return;

	// go fetch candles data for every one of the pairs but in a deferred way.
	// 1day vale fetch first with 1day interval
	// 1hr vale fetch later with 1hr time interval
	// make sure that they dont overlap at all
	// error handling bhi yahi karni hai

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

	const fetchPairData = async (pairName: string) => {
		let fromDate = new Date(new Date().getTime() - 15 * 60 * 1000 * 60* 24).getTime();
		const toDate = new Date().getTime();
		let interval = 1440;

		if(type == "week") {
			// from date is 15 weeks from now
			fromDate = new Date(new Date().getTime() - 4 * 7 * 60 * 1000 * 60* 24).getTime();
			interval = 7 * 1440;
		}

		// const fromDate = new Date(new Date().getTime() - 15 * 60 * 1000 * 60  ).getTime();
		// const toDate = new Date().getTime();
		// const interval = 1;
		// const cachedData = await redisClient.get(pairName + ":"+ type);
		// 	if(cachedData != null) {
		// 		console.log("Fetched data from cache for: ", pairName + ":" + type);
		// 		const parsedData = JSON.parse(cachedData) as series;
		// 		return parsedData;
		// 	}

			console.log("Fetching from API for: ", pairName + ":" + type);
	
			const url = `https://api-futures.kucoin.com/api/v1/kline/query?symbol=${pairName}&granularity=${interval}&from=${fromDate}&to=${toDate}`;
			const data: series = await fetch(url)
				.then((res) => res.json())
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
						const [ timeCurr, openCurr, highCurr, lowCurr, closeCurr ] = kucoinOHLCV(array[index]);
						let cpr: cpr;
						let camrilla: camrilla;
	
						if (index < array.length - 1) {
							 const [timePrev, openPrev, highPrev, lowPrev, closePrev] = kucoinOHLCV(array[index + 1]);
							
							if(type !== "week"){
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
			redisClient.set(pairName + ":"+ type, JSON.stringify(data));
			return data;
	}

	
	const kucoin = async () => {
		const pairEntries = Object.entries(pairs.kucoin);
		const maxThreads = 30; // Limit of simultaneous threads
		const maxRequestsPerMinute = 150;
		const interval = 60000 / maxRequestsPerMinute; // Time interval between API requests in milliseconds
		let lastRequestTime = 0;
		const queue: Promise<void>[] = [];

		for (const [pairName, pair] of pairEntries) {
			// Check Redis first
			const cachedData = await redisClient.get(pairName + ":" + type);
			if (cachedData) {
				console.log("Using cached data for:", pairName);
				const parsedData = JSON.parse(cachedData);
				if (type === "day") {
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
				await new Promise((resolve) => setTimeout(resolve, delay));
			}
			lastRequestTime = Date.now();

			if (queue.length >= maxThreads) {
				console.log("Thread Queue Full. Current Pair: ", pairName);
				// Wait for one promise to resolve or reject
				await Promise.race(queue);
			}

			const task = fetchPairData(pairName)
				.then((data) => {
					if (type === "day") {
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

			console.log("Adding Pair: ", pairName);
			queue.push(task);
		}

		// Wait for remaining promises to complete
		await Promise.all(queue);
	};
	// const kucoin = async () => {
		

	// 	for (const [pairName, pair] of Object.entries(pairs.kucoin)) {
	// 	}

	// 	// get all tradable pairs on koocoin
	// 	// Cant remember why I had included this in the original code

	// 	// await fetch('https://api-futures.kucoin.com/api/v1/contracts/active')
	// 	// 	.then((res) => res.json())
	// 	// 	.then((res) => {
	// 	// 		if (res.code === '200000') {
	// 	// 			for (let i = 0; i < res.data.length; i++) {
	// 	// 				const pairName = res.data[i].symbol;
	// 	// 				const turnover24Hrs = res.data[i].turnoverOf24h;
	// 	// 				try {
	// 	// 					pairs.kucoin[pairName].setRanking(turnover24Hrs);
	// 	// 				} catch (error) {
	// 	// 					console.log('fetch candleengine kookoin error on -->', pairName);
	// 	// 				}
	// 	// 			}
	// 	// 		}
	// 	// 		// for (const [pairName, pair] of Object.entries(pairs.kucoin)) {
	// 	// 		// 	// pairs.kucoin[pairName].setRanking()
	// 	// 		// }
	// 	// 	});
	// }

	const binance = async () => {
		const interval = '1d';
		const limit = 5;
		for (let [pairName, pair] of Object.entries(pairs.binance)) {
			const url = `https://fapi.binance.com/fapi/v1/klines?interval=${interval}&symbol=${pairName}&limit=${limit}`;
			const data: series = await fetch(url).then(res => res.json()).then((res: binanceres) => {
				const reversedData = res.reverse();
				// console.log('inside binance');
				// console.log(res);
				const r = reversedData.map((ele, index, array) => {
					const [timeCurr, openCurr, highCurr, lowCurr, closeCurr] = binanceOHLCV(array[index]);
					let cpr: cpr;
					let camrilla: camrilla;

					if (index < array.length - 1) {
						const [timePrev, openPrev, highPrev, lowPrev, closePrev] = binanceOHLCV(array[index + 1]);
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
						cpr,
						camrilla,
					};
				});
				return r;
			})
			pairs.binance[pairName].setCandles1Day(await data);
		}
	}

	// If exchange, run that exchange function
	await kucoin();
	// await binance();
	// return {
	// 	kucoin,
	// }
};

export default fetchCandleEngine;
