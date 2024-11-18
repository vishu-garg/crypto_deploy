import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse<any>) {
	const fromDate = new Date().setDate(new Date().getDate() - 15);
	const toDate = new Date().setDate(new Date().getDate());
	const url = `https://api-futures.kucoin.com/api/v1/kline/query?symbol=XBTUSDTM&granularity=1440&from=${fromDate}&to=${toDate}`;
	let d; 
    await fetch(url).then((res) => res.json()).then(data => {
        console.log(data)
        d = data
        res.json(d);
    });

}
