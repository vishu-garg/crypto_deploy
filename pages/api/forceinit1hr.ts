import { NextApiRequest, NextApiResponse } from 'next';
import init from '@/components/init';

export default async function handler(req: NextApiRequest, res: NextApiResponse<any>) {
	init.forceRun1Hr();
	// const returnedPairsList: {[index: string]: checkedSeries} = {}

	res.json({message: 'check the filtered pairs after at least 20 seconds'});
}
