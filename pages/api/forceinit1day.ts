import { NextApiRequest, NextApiResponse } from 'next';
import init from '@/components/init';

export default async function handler(req: NextApiRequest, res: NextApiResponse<any>) {
	init.forceRun1Day();
	// const returnedPairsList: {[index: string]: checkedSeries} = {}

	res.json({message: 'check the filtered pairs after at least 20 seconds'});
}
