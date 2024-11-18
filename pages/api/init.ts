import { NextApiRequest, NextApiResponse } from 'next';
import init from '@/components/init';
import setIntervalFromNow from '@/components/setIntervalFromNow';

export default async function handler(req: NextApiRequest, res: NextApiResponse<any>) {
	init();

	// setIntervalFromNow(async () => {
	// 	await init(true);
	// }, 15000);

	res.json({message: 'INIT function has been run'});
}
