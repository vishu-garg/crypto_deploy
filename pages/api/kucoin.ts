// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { log } from 'console';
import type { NextApiRequest, NextApiResponse } from 'next'

type Data = {
  name: string
}

// const API = require('kucoin-node-sdk');
// API.init(require('../../components/kucoin-config'));



export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  log("getting timestamp")
  // const getTimestampRl = await API.rest.Others.getTimestamp();
  // console.log(getTimestampRl.data);

  // const account = await API.rest.User.UserInfo.getSubUsers();
  // log(account);

  // const res1 = await API.rest.User.Deposit.getDepositAddressV2('BTC');
  // console.log(res1);
  res.status(200).json({ name: 'John Doe' })
}
