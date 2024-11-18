import { GetServerSideProps } from 'next';
import pairs from '@/components/pairs';
import init from '@/components/init';

import type { NextPage } from 'next';
import Head from 'next/head';
import Table from 'react-bootstrap/Table';

const Home: NextPage = (props: any) => {

	const kucoinData = props.kucoinData;

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
						<th>Sr. No.</th>
						<th>Time</th>
						<th>Open</th>
						<th>High</th>
						<th>Low</th>
						<th>Close</th>
						{/* <th>Virgin CPR</th> */}
					</tr>
				</thead>
				<tbody>
					{kucoinData.map((data: any, index: any) => {
						// console.log(kucoinData.time);
						return (
							<tr key={kucoinData[index].time}>
								<td>{index+1}</td>
								<td>{`${new Date(kucoinData[index].time * 1000)}`}</td>
								<td>{kucoinData[index].open}</td>
								<td>{kucoinData[index].high}</td>
								<td>{kucoinData[index].low}</td>
								<td>{kucoinData[index].close}</td>
                            </tr>
						);
					})}
				</tbody>
			</Table>
		</>
	);
};

export const getServerSideProps: GetServerSideProps = async (ctx) => {
	// init.normalRun();
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
		const interval = 60;

		const pairName = 'SOLUSDTM';
        const ohlcvArray: ohlcv[] = [];

		for (let t=1; t<=58; t++) {
			// console.log(`fetching ${pairName}`);
			const fromDate = new Date(new Date().getTime() - t * 200 * 60 * 60 * 1000).getTime();
			const toDate = new Date(fromDate + 200 * 60 * 60 * 1000).getTime();
			// console.log(`kucoin fetch date -->> ${fromDate} and toDate -->> ${toDate}`)

			const url = `https://api-futures.kucoin.com/api/v1/kline/query?symbol=${pairName}&granularity=${interval}&from=${fromDate}&to=${toDate}`;
			const d: any = await fetch(url)
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
                        ohlcvArray.push({
						    time:	timeCurr,
						    open:	openCurr,
						    high:	highCurr,
						    low:	lowCurr,
						    close:	closeCurr,
						});
                    })
                })
        }
        const data: series = ohlcvArray.map((ele, index, array) => {
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
            if (index < array.length - 1) {
                // const {time, open, high, low, close} = kucoinOHLCV(array[index + 1]);
                cpr = calcCPR(array[index+1].high, array[index+1].low, array[index+1].close);
                // camrilla = calcCamarilla(array[index+1].high, array[index+1].low, array[index+1].close);
            }
            return {
                name: pairName,
                ...ele,
                cpr,
                camrilla,
            };

        })
    const totalTrades: series = []
	const conditionmet:any = [];
	const unsuccessfulTrades: any = [];

	let totalDiff = 0;
	
	// data.map((ele, index, array) =>{
	for(let index = 0; index < data.length-3; index++){
        if ( data[index + 0].cpr.pivot > data[index + 1].cpr.pivot 
			&& data[index + 1].cpr.pivot > data[index + 2].cpr.pivot 
			&& data[index + 2].cpr.pivot < data[index + 3].cpr.pivot
			) {
				let open = data[index].open;
				let low = data[index].low;
				let high = data[index].high;

				totalTrades.push(data[index]);
				// try {
				// 	while(data[index+2].cpr.pivot > data[index+3].cpr.pivot){
				// 		low = Math.min(low, data[index+1].low);
				// 		high = Math.max(high, data[index+1].high);
				// 		open = data[index+1].open;
				// 		index++;
				// 	}
				// } catch (e) {
				// }
					
				const diff = (high - open) / open * 100;
				if(diff > 0.5){
					// totalDiff += diff;
					totalDiff += 0.5;
					conditionmet.push({
						...data[index],
						diff
					})
				} else if (high < data[index].cpr.r1 && (open * 0.99) > low ) {
					unsuccessfulTrades.push(data[index]);
					totalDiff -= (open -  low) / open * 100;
				} 
				
				// else
				// totalDiff += diff;
			}
    }
	console.log(`Successful trades --> ${conditionmet.length}`)
	console.log(`Unsuccessful trades --> ${unsuccessfulTrades.length}`)
	console.log(`Sideways trades --> ${totalTrades.length - conditionmet.length - unsuccessfulTrades.length}`);
	console.log(`Total trades --> ${totalTrades.length}`)
	console.log(`Total Percent --> ${totalDiff}`)
	
    // return totalTrades;
    return conditionmet;
        }

	const kucoinData:series = await kucoin();
    // console.log(kucoinData[1])
    
	return {
		props: {
			kucoinData,
		},
	};
};

export default Home;
