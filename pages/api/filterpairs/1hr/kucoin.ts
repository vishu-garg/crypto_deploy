import { NextApiRequest, NextApiResponse } from 'next';
import init from '@/components/init';
import pairs from '@/components/pairs';
import setIntervalFromNow from '@/components/setIntervalFromNow';
import { interval } from '@/types/enums';

export default async function handler(req: NextApiRequest, res: NextApiResponse<any>) {

    init.forceRun1Hr();
    const returnedPairsList: any = [];
    for (let pair of Object.keys(pairs.kucoin)) {
        try {
            returnedPairsList.push(pairs.kucoin[pair].sentData(interval.H1));
        } catch (e) {
            res.json({message: 'preparing values', code: 300})
            return;
        }
    }
	res.json({ returnedPairsList, code: 200 });
}
