import { NextApiRequest, NextApiResponse } from 'next';
import pairs from '@/components/pairs';
import { log } from 'console';


export default async function handler(req: NextApiRequest, res: NextApiResponse<any>) {

    const data: any = await fetch('https://api-futures.kucoin.com/api/v1/contracts/active').then(res => res.json());
    // log(await data)
    for(let i=0; i< await data.data.length; i++){
        log(await data.data[i].symbol);
    }

    res.json({});
}