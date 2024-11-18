import { GetServerSideProps } from 'next';
import pairs from '@/components/pairs';
import init from '@/components/init';

import type { NextPage } from 'next';
import Head from 'next/head';
import Table from 'react-bootstrap/Table';

const Home: NextPage = (props: any) => {

	const kucoinData = props.kucoinData;
	const binanceData = props.binanceData;
	const difference = props.difference;

	return (
		<>
			<Head>
				<Head>
					<meta name='viewport' content='width=device-width, initial-scale=1' />
				</Head>
			</Head>
			<Table striped bordered hover>
				<thead>
					<tr>
						<th>Time</th>
						<th>Kucoin Open</th>
						<th>Binance Open</th>
						<th>Difference Open</th>
						<th>Kucoin High</th>
						<th>Binance High</th>
						<th>Difference High</th>
						<th>Kucoin Low</th>
						<th>Binance Low</th>
						<th>Difference Low</th>
						<th>Kucoin Close</th>
						<th>Binance Close</th>
						<th>Difference Close</th>
						{/* <th>Virgin CPR</th> */}
					</tr>
				</thead>
				<tbody>
					{difference.map((data: any, index: any) => {
						// console.log(kucoinData.time);
						return (
							<tr key={kucoinData[index].time}>
								<td>{`${new Date(kucoinData[index].time * 1000)}`}</td>

								<td>{kucoinData[index].open}</td>
								<td>{binanceData[index].open}</td>
								<td style={{background: parseFloat(difference[index].open) > 0.08 ? 'red': 'gdfs'}}>{`${difference[index].open}%`}</td>

								<td>{kucoinData[index].high}</td>
								<td>{binanceData[index].high}</td>
								<td style={{background: parseFloat(difference[index].high) > 0.08 ? 'red': 'gdfs'}}>{`${difference[index].high}%`}</td>

								<td>{kucoinData[index].low}</td>
								<td>{binanceData[index].low}</td>
								<td style={{background: parseFloat(difference[index].low) > 0.08 ? 'red': 'gdfs'}}>{`${difference[index].low}%`}</td>

								<td>{kucoinData[index].close}</td>
								<td>{binanceData[index].close}</td>
								<td style={{background: parseFloat(difference[index].close) > 0.08 ? 'red': 'gdfs'}}>{`${difference[index].close}%`}</td>
							</tr>
						);
					})}
				</tbody>
			</Table>
		</>
	);
};

export const getServerSideProps: GetServerSideProps = async (ctx) => {
	init.normalRun();
	const returnedPairsList: any = [];
	// returnedPairsList.push(pairs.kucoin['ETHUSDTM'].sentData());
	
	const kucoinOHLCV = (ohlcv: any) => {
		const time = parseFloat(ohlcv[0]) / 1000;
		const open = parseFloat(ohlcv[1]) * 1;
		const high = parseFloat(ohlcv[2]) * 1;
		const low = parseFloat(ohlcv[3]) * 1;
		const close = parseFloat(ohlcv[4]) * 1;
		return [time, open, high, low, close];
	};

	const binanceOHLCV = (ohlcv: any) => {
		const time = parseFloat(ohlcv[0]) / 1000;
		const open = parseFloat(ohlcv[1]) * 1;
		const high = parseFloat(ohlcv[2]) * 1;
		const low = parseFloat(ohlcv[3]) * 1;
		const close = parseFloat(ohlcv[4]) * 1;
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
	
	const kucoin = async () => {
		const interval = 1;

		const data: series = []
		
		const pairName = 'APEUSDTM';
		for (let t=1; t<=8; t++) {
			// console.log(`fetching ${pairName}`);
			const fromDate = new Date(new Date().getTime() - t * 200 * 60 * 1000).getTime();
			const toDate = new Date(fromDate + (200 * 60 * 1000)).getTime();
			// console.log(`kucoin fetch date -->> ${fromDate} and toDate -->> ${toDate}`)

			const url = `https://api-futures.kucoin.com/api/v1/kline/query?symbol=${pairName}&granularity=${interval}&from=${fromDate}&to=${toDate}`;
			const d: series = await fetch(url)
				.then((res) => res.json())
				.then((res: kucoinres) => {
					// console.log(`some response received from kucoin for ${pairName}`)
					if (res.code !== '200000') {
						console.log(res);
						throw `Data from kucoin not received for ${pairName}`;
					}
					const reversedData = res.data.reverse();
					// console.log(`reverse kucoin data --> ${reversedData[0]}`)
					const r = reversedData.map((ele, index, array) => {
						const [timeCurr, openCurr, highCurr, lowCurr, closeCurr] = kucoinOHLCV(array[index]);
						let cpr: cpr = {
							pivot: 0,
							bc: 0,
							tc: 0,
							r1: 0,
							r2: 0,
							s1: 0,
							s2: 0,
						};
						let camrilla: camrilla = {
							pivot: 0,
							l3: 0,
							l4: 0,
							h3: 0,
							h4: 0,
						};
	
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
				data.push(...d);
			}
		return data;
	}

	const binance = async () => {
		const interval = '1m';
		const limit = 1440;
		const pairName = 'APEUSDT';
		// for (let [, pair] of Object.entries(pairs.binance)) {
			const url = `https://fapi.binance.com/fapi/v1/klines?interval=${interval}&symbol=${pairName}&limit=${limit}`;
			const data: series = await fetch(url)
				.then((res) => res.json())
				.then((res: binanceres) => {
					const reversedData = res.reverse();
					// console.log('inside binance');
					// console.log(res);
					const r = reversedData.map((ele, index, array) => {
						const [timeCurr, openCurr, highCurr, lowCurr, closeCurr] = binanceOHLCV(array[index]);
						let cpr: cpr = {
							pivot: 0,
							bc: 0,
							tc: 0,
							r1: 0,
							r2: 0,
							s1: 0,
							s2: 0,
						};
						let camrilla: camrilla = {
							pivot: 0,
							l3: 0,
							l4: 0,
							h3: 0,
							h4: 0,
						};

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
			return data;
	};

	const kucoinData:series = await kucoin();
	const binanceData = await binance();
	// console.log(binanceData[0]);

	const difference = []
	// let toBeSent: [index: string] :  = {
		const sentdifference = [];
		const sentkucoinData = [];
		const sentbinanceData =  [];
	// };
	
	for(let i=0; i<1440; i++){
		try {
			// if(kucoinData[i].time !== binanceData[i].time) {
			// 	console.log(`time mismatch for index -->> ${i}`);
			// }
			const opendiff = `${Math.floor(Math.abs((kucoinData[i].open - binanceData[i].open) / binanceData[i].open * 10000))/100 }`;
			const highdiff = `${Math.floor(Math.abs((kucoinData[i].high - binanceData[i].high) / binanceData[i].high * 10000))/100 }`;
			const lowdiff = `${Math.floor(Math.abs((kucoinData[i].low - binanceData[i].low) / binanceData[i].low * 10000))/100 }`;
			const closediff = `${Math.floor(Math.abs((kucoinData[i].close - binanceData[i].close) / binanceData[i].close * 10000))/100 }`;
			const diff = {
				open: opendiff,
				high: highdiff,
				low: lowdiff,
				close: closediff
			};
			difference.push(diff);

			const pDiff = 0.1;
			if(parseFloat(opendiff) > pDiff || parseFloat(highdiff) > pDiff || parseFloat(lowdiff) > pDiff || parseFloat(closediff) > pDiff){
				sentdifference.push(diff);
				sentkucoinData.push(kucoinData[i]);
				sentbinanceData.push(binanceData[i]);
			}
		} catch (e) {
			console.log(`time mismatch for index -->> ${i}`);
			
		}
	}

	// console.log(difference)

	return {
		props: {
			difference: sentdifference,
			kucoinData: sentkucoinData,
			binanceData: sentbinanceData,
			// difference,
			// kucoinData,
			// binanceData,
		},
	};
};

export default Home;
