import { GetServerSideProps } from 'next';
import pairs from '@/components/pairs';
import init from '@/components/init';

import type { NextPage } from 'next';
import Head from 'next/head';
import Table from 'react-bootstrap/Table';
import Link from 'next/link';

const Home: NextPage = ({ returnedPairsList }: any) => {

	return (
		<>
			<Head>
				<Head>
					<meta name='viewport' content='width=device-width, initial-scale=1' />
				</Head>
			</Head>
			<h1>Daily Data</h1>
            <div style={{display: 'flex', flexDirection: 'column'}}>
                <Link href={'api/forceinit1day'}>Force Refresh Data</Link>
                <Link href={'filterpairs/1day/binance'}>Binance</Link>
                <Link href={'filterpairs/1day/kucoin'}>Kucoin</Link>
            </div>
			<h1>Hourly Data</h1>
            <div style={{display: 'flex', flexDirection: 'column'}}>
                <Link href={'api/forceinit1hr'}>Force Refresh Data</Link>
                {/* <Link href={'filterpairs/1hr/binance'}>Binance</Link> */}
                <Link href={'filterpairs/1hr/kucoin'}>Kucoin</Link>
            </div>
		</>
	);
};

export const getServerSideProps: GetServerSideProps = async (ctx) => {
	init.normalRun1Day();
	init.normalRun1Hr();
	return {
		props: {
			// returnedPairsList,
		},
	};
};

export default Home;
