import { GetServerSideProps } from 'next';
import pairs from '@/components/pairs';
import init from '@/components/init';

import type { NextPage } from 'next';
import Head from 'next/head';
import Table from 'react-bootstrap/Table';
import { interval } from '@/types/enums';
import redisClient, { clearRedisKeys } from './api/redis';

const Home: NextPage = ({ returnedPairsList }: any) => {

	return (
		<>
			<Head>
				<Head>
					<meta name='viewport' content='width=device-width, initial-scale=1' />
				</Head>
			</Head>
			<div>
                Cache Cleared Successfully!
            </div>
		</>
	);
};

export const getServerSideProps: GetServerSideProps = async (ctx) => {
	clearRedisKeys();
	return {
		props: {},
	};
};

export default Home;
