// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { log } from 'console';
import type { NextApiRequest, NextApiResponse } from 'next';
const _ = require('lodash');
// const logUpdate = require('log-update');
import logUpdate from 'log-update';
// import API from '@/components/kucoin/kucoin-config-init';
import APILiveData from '@/components/kucoin/kucoin-config-live-data'

type Data = {
	name: string;
};


export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {

    // const getTimestampRl = await API.rest.Others.getTimestamp();
	// 	console.log(getTimestampRl.data);

	// 	const account = await API.rest.User.UserInfo.getSubUsers();
	// 	log(account);

	const datafeed = new APILiveData.websocket.Datafeed();

	const { Level2 } = APILiveData.websocket;

	Level2.setLogger(() => {});

	const l2 = new Level2('BTC-USDT', datafeed);
	l2.listen();

	const interval = setInterval(async () => {
		// read orderbook
		const orderbook = l2.getOrderBook(5);
		log(orderbook)
		// // show Level2
		// let asksStr = '';
		// _.eachRight(orderbook.asks, ([price, size]) => {
		// 	asksStr += `${price} -> ${size}\n`;
		// });

		// let bidsStr = '';
		// _.each(orderbook.bids, ([price, size]) => {
		// 	bidsStr += `${price} -> ${size}\n`;
		// });

		// logUpdate.clear();
		// logUpdate(`------------------------\n` + `l2 ${orderbook.dirty ? 'Dirty Data' : 'Trust Data'}\n` + `l2 seq:  ${orderbook.sequence}\n` + `ping:    ${orderbook.ping} (ms)\n` + `------------------------\n` + `${asksStr}----------sep-----------\n` + `${bidsStr}------------------------`);
	}, 200);

	res.status(200).json({ name: 'John Doe' });
}
