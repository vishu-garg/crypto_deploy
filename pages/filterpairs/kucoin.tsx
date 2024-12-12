// ts 
import { GetServerSideProps } from 'next';
import pairs from '@/components/pairs';
import init from '@/components/init';

import type { NextPage } from 'next';
import Head from 'next/head';
import Table from 'react-bootstrap/Table';
import { interval } from '@/types/enums';
import { useState } from 'react';

const Home: NextPage = ({ returnedPairsList1Day, returnedPairsList1Week }: any) => {
    const options = { day: "Day-Wise", week: "Week-Wise" };
    const [selectedValue, setSelectedValue] = useState(options.day);

    const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedValue(event.target.value);
    };

    const get1DayChart = () => {
        return (
            <>
                <Head>
                    <meta name='viewport' content='width=device-width, initial-scale=1' />
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
                        {returnedPairsList1Day.map((data: any, index: any) => (
                            <tr key={data.name}>
                                <td>{index + 1}</td>
                                <td>{`${data.name} : ${new Date(data.time1Day).getDate()}/${new Date(data.time1Day).getMonth() + 1} - ${new Date(data.time1Day).getHours()}:${new Date(data.time1Day).getMinutes()}`}</td>
                                <td style={{ background: data.isHigherThirdZone1Day ? 'green' : '' }}>{data.isHigherThirdZone1Day?.toString()}</td>
                                <td style={{ background: data.isLowerThirdZone1Day ? 'red' : '' }}>{data.isLowerThirdZone1Day?.toString()}</td>
                                <td style={{ background: data.isInsideCamrilla1Day ? 'blue' : '' }}>{data.isInsideCamrilla1Day?.toString()}</td>
                                <td>{data.virginCPR1Day}</td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            </>
        );
    };

    const get1WeekChart = () => {
        return (
            <>
                <Head>
                    <meta name='viewport' content='width=device-width, initial-scale=1' />
                </Head>
                <Table striped bordered hover responsive>
                    <thead>
                        <tr>
                            <th>Sr.</th>
                            <th>Coin Name</th>
                            <th>Higher Third Zone</th>
                            <th>Lower Third Zone</th>
                            <th>Inside Camarilla</th>
                        </tr>
                    </thead>
                    <tbody>
                        {returnedPairsList1Week.map((data: any, index: any) => (
                            <tr key={data.name}>
                                <td>{index + 1}</td>
                                <td>{`${data.name} : ${new Date(data.time1Week).getDate()}/${new Date(data.time1Week).getMonth() + 1} - ${new Date(data.time1Week).getHours()}:${new Date(data.time1Week).getMinutes()}`}</td>
                                <td style={{ background: data.isHigherThirdZone1Week ? 'green' : '' }}>{data.isHigherThirdZone1Week?.toString()}</td>
                                <td style={{ background: data.isLowerThirdZone1Week ? 'red' : '' }}>{data.isLowerThirdZone1Week?.toString()}</td>
                                <td style={{ background: data.isInsideCamrilla1Week ? 'blue' : '' }}>{data.isInsideCamrilla1Week?.toString()}</td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            </>
        );
    };

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 20px', backgroundColor: '#f8f9fa', borderBottom: '1px solid #ddd' }}>
                <h1 style={{ margin: 0 }}>Crypto-Indicators 🚀</h1>
                <div>
                    <label htmlFor="view-selector" style={{ marginRight: '10px' }}>Select View:</label>
                    <select id="view-selector" value={selectedValue} onChange={handleChange} style={{ padding: '5px' }}>
                        <option value={options.day}>{options.day}</option>
                        <option value={options.week}>{options.week}</option>
                    </select>
                </div>
            </div>
            <div style={{ padding: '20px' }}>
                {selectedValue === options.day ? get1DayChart() : get1WeekChart()}
            </div>
        </div>
    );
};

export const getServerSideProps: GetServerSideProps = async (ctx) => {
    await init.normalRun1Day();
    const returnedPairsList1Day: any = [];
    for (let pair of Object.keys(pairs.kucoin)) {
        try {
            returnedPairsList1Day.push(pairs.kucoin[pair].sentData(interval.D1));
        } catch (e) {
            // Handle error
        }
    }
    const sortedPairsList1Day = returnedPairsList1Day.sort((a: any, b: any) => {
        if (a?.ranking < b?.ranking) return 1;
        else if (a.ranking > b.ranking) return -1;
        else return 0;
    });

    await init.normalRun1Week();
    const returnedPairsList1Week: any = [];
    for (let pair of Object.keys(pairs.kucoin)) {
        try {
            returnedPairsList1Week.push(pairs.kucoin[pair].sentData(interval.D1));
        } catch (e) {
            // Handle error
        }
    }
    const sortedPairsList1Week = returnedPairsList1Week.sort((a: any, b: any) => {
        if (a?.ranking < b?.ranking) return 1;
        else if (a.ranking > b.ranking) return -1;
        else return 0;
    });

    return {
        props: {
            returnedPairsList1Day: sortedPairsList1Day,
            returnedPairsList1Week: sortedPairsList1Week,
        },
    };
};

export default Home;
