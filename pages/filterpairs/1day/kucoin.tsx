import { GetServerSideProps } from 'next';
import pairs from '@/components/pairs';
import init from '@/components/init';

import type { NextPage } from 'next';
import Head from 'next/head';
import Table from 'react-bootstrap/Table';
import { interval } from '@/types/enums';

const Home: NextPage = ({ returnedPairsList }: any) => {

	return (
		<>
			<Head>
				<Head>
					<meta name='viewport' content='width=device-width, initial-scale=1' />
				</Head>
			</Head>
			<Table striped bordered hover responsive>
				<thead>
					<tr>
						<th>Sr.</th>
						<th>Coin Name</th>
						<th>Higher Third Zone</th>
						<th>Lower Third Zone</th>
						<th>Inside Camarilla</th>
						<th>Virgin CPR</th>
					</tr>
				</thead>
				<tbody>
					{returnedPairsList.map((data: any, index: any) => {
						return (
							<tr key={data.name}>
								<td>{index+1}</td>
								<td>{`${data.name} : ${new Date(data.time).getDate()}/${new Date(data.time).getMonth() + 1} - ${new Date(data.time).getHours()}:${new Date(data.time).getMinutes()}`}</td>
								<td style={{ background: data.isHigherThirdZone ? 'green' : '' }}>{data.isHigherThirdZone.toString()}</td>
								<td style={{ background: data.isLowerThirdZone ? 'red' : '' }}>{data.isLowerThirdZone.toString()}</td>
								<td style={{ background: data.isInsideCamrilla ? 'blue' : '' }}>{data.isInsideCamrilla.toString()}</td>
								<td>{data.virginCPR}</td>
							</tr>
						);
					})}
				</tbody>
			</Table>
		</>
	);
};

export const getServerSideProps: GetServerSideProps = async (ctx) => {
	await init.normalRun1Day();
	const returnedPairsList: any = [];
	for (let pair of Object.keys(pairs.kucoin)) {
		try {
			returnedPairsList.push(pairs.kucoin[pair].sentData(interval.D1));
		} catch (e) {
			// console.log(`error on ${pair}`);
			// console.log(e);
		}
	}
	const sortedPairsList = returnedPairsList.sort((a: any, b: any) => {
		if (a?.ranking < b?.ranking) return 1;
		else if (a.ranking > b.ranking) return -1;
		else return 0;
	});
	return {
		props: {
			returnedPairsList: sortedPairsList,
		},
	};
};

export default Home;
