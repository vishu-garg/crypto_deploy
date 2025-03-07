//@ts-nocheck
'use client';

import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Paper from '@mui/material/Paper';
import Select from '@mui/material/Select';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Head from 'next/head';
import { useState } from 'react';

type CryptoIndicatorsProps = {
  returnedPairsList1Day: any[];
  returnedPairsList1Week: any[];
};

const CryptoIndicators = ({
  returnedPairsList1Day,
  returnedPairsList1Week,
}: CryptoIndicatorsProps) => {
  const options = { day: 'Day-Wise', week: 'Week-Wise' };
  const [selectedValue, setSelectedValue] = useState(options.day);

  const handleChange = (
    event: React.ChangeEvent<{ value: unknown }>,
  ) => {
    setSelectedValue(event.target.value as string);
  };

  const render1DayTable = () => (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Sr.</TableCell>
            <TableCell>Coin Name</TableCell>
            <TableCell>Higher Third Zone</TableCell>
            <TableCell>Lower Third Zone</TableCell>
            <TableCell>Inside Camarilla</TableCell>
            <TableCell>Virgin CPR</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {returnedPairsList1Day.map((data: any, index: number) => (
            <TableRow key={data.name}>
              <TableCell>{index + 1}</TableCell>
              <TableCell>
                {`${data.name} : ${new Date(data.time1Day).getDate()}/${
                  new Date(data.time1Day).getMonth() + 1
                } - ${new Date(data.time1Day).getHours()}:${new Date(
                  data.time1Day,
                ).getMinutes()}`}
              </TableCell>
              <TableCell
                sx={{
                  background: data.isHigherThirdZone1Day ? 'green' : undefined,
                }}
              >
                {data.isHigherThirdZone1Day?.toString()}
              </TableCell>
              <TableCell
                sx={{
                  background: data.isLowerThirdZone1Day ? 'red' : undefined,
                }}
              >
                {data.isLowerThirdZone1Day?.toString()}
              </TableCell>
              <TableCell
                sx={{
                  background: data.isInsideCamrilla1Day ? 'blue' : undefined,
                }}
              >
                {data.isInsideCamrilla1Day?.toString()}
              </TableCell>
              <TableCell>{data.virginCPR1Day}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );

  const render1WeekTable = () => (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Sr.</TableCell>
            <TableCell>Coin Name</TableCell>
            <TableCell>Higher Third Zone</TableCell>
            <TableCell>Lower Third Zone</TableCell>
            <TableCell>Inside Camarilla</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {returnedPairsList1Week.map((data: any, index: number) => (
            <TableRow key={data.name}>
              <TableCell>{index + 1}</TableCell>
              <TableCell>
                {`${data.name} : ${new Date(data.time1Week).getDate()}/${
                  new Date(data.time1Week).getMonth() + 1
                } - ${new Date(data.time1Week).getHours()}:${new Date(
                  data.time1Week,
                ).getMinutes()}`}
              </TableCell>
              <TableCell
                sx={{
                  background: data.isHigherThirdZone1Week ? 'green' : undefined,
                }}
              >
                {data.isHigherThirdZone1Week?.toString()}
              </TableCell>
              <TableCell
                sx={{
                  background: data.isLowerThirdZone1Week ? 'red' : undefined,
                }}
              >
                {data.isLowerThirdZone1Week?.toString()}
              </TableCell>
              <TableCell
                sx={{
                  background: data.isInsideCamrilla1Week ? 'blue' : undefined,
                }}
              >
                {data.isInsideCamrilla1Week?.toString()}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );

  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>Crypto Indicators</title>
      </Head>
      <div style={{ padding: '20px' }}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '20px',
          }}
        >
          <h1>Crypto-Indicators 🚀</h1>
          <FormControl variant="outlined" size="small">
            <InputLabel id="view-selector-label">Select View</InputLabel>
            <Select
              labelId="view-selector-label"
              id="view-selector"
              value={selectedValue}
              onChange={handleChange}
              label="Select View"
            >
              <MenuItem value={options.day}>{options.day}</MenuItem>
              <MenuItem value={options.week}>{options.week}</MenuItem>
            </Select>
          </FormControl>
        </div>
        {selectedValue === options.day ? render1DayTable() : render1WeekTable()}
      </div>
    </>
  );
};

export default CryptoIndicators;
