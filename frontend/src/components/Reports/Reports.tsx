import React, { useEffect, useState } from 'react';
import Axios from 'axios';
import {
  Box,
  makeStyles,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@material-ui/core';

const useStyles = makeStyles({
  boldFont: {
    fontWeight: 'bold',
  },
});
interface AverageBySellerType {
  private?: number;
  dealer?: number;
  other?: number;
}
const Reports = () => {
  const classes = useStyles();
  const [
    averageBySellerType,
    setAverageBySellerType,
  ] = useState<AverageBySellerType>({});

  const [percentualDistribution, setPercentualDistribution] = useState<{
    [key: string]: number;
  }>({});

  const [
    topFivePerMonthCollection,
    setTopFivePerMonthCollection,
  ] = useState<any>([]);

  const getAverageBySellerType = async () => {
    const response = await Axios.get(
      'http://localhost:3005/listing/average/sellertype',
    );
    setAverageBySellerType(response.data.averageSellings);
  };

  const getPercentualDistribution = async () => {
    const response = await Axios.get(
      'http://localhost:3005/listing/percentual',
    );
    setPercentualDistribution(response.data.percentual);
  };

  const getTopFivePerMonthCollection = async () => {
    const response = await Axios.get('http://localhost:3005/contact/top/month');
    setTopFivePerMonthCollection(response.data.topFivePerMonthRecords);
  };
  useEffect(() => {
    setTimeout(() => {
      getAverageBySellerType();
      getPercentualDistribution();
      getTopFivePerMonthCollection();
    }, 1000);
  }, []);
  console.log(percentualDistribution);
  return (
    <Box padding={'50px 300px'}>
      <Box mb={10}>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell className={classes.boldFont} align="center">
                  Seller Type
                </TableCell>
                <TableCell className={classes.boldFont} align="center">
                  Average in Euro
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <TableCell align="center">private</TableCell>
                <TableCell align="center">
                  € {averageBySellerType.private},-
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell align="center">dealer</TableCell>
                <TableCell align="center">
                  € {averageBySellerType.dealer},-
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell align="center">other</TableCell>
                <TableCell align="center">
                  € {averageBySellerType.other},-
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </Box>

      <Box>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell className={classes.boldFont} align="center">
                  Make
                </TableCell>
                <TableCell className={classes.boldFont} align="center">
                  Distribution
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {Object.keys(percentualDistribution).map((key, index) => (
                <TableRow key={index}>
                  <TableCell align="center">{key}</TableCell>
                  <TableCell align="center">
                    {percentualDistribution[key].toFixed(2)}%
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
      {topFivePerMonthCollection.map((monthCollection: any, index: number) => (
        <Box key={index} mt={5}>
          Month: {monthCollection.fullDate}
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell className={classes.boldFont} align="center">
                    Ranking
                  </TableCell>
                  <TableCell className={classes.boldFont} align="center">
                    Listing Id
                  </TableCell>
                  <TableCell className={classes.boldFont} align="center">
                    Make
                  </TableCell>
                  <TableCell className={classes.boldFont} align="center">
                    Selling Price
                  </TableCell>
                  <TableCell className={classes.boldFont} align="center">
                    Mileage
                  </TableCell>
                  <TableCell className={classes.boldFont} align="center">
                    Total Amount of Contacts
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {monthCollection.topFive.map((record: any, index: any) => (
                  <TableRow key={index}>
                    <TableCell align="center">{index + 1}</TableCell>
                    <TableCell align="center">{record[0]}</TableCell>
                    <TableCell align="center">{record[1]}</TableCell>
                    <TableCell align="center">€ {record[2]},-</TableCell>
                    <TableCell align="center">{record[3]} KM</TableCell>
                    <TableCell align="center">{record[5]}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      ))}
    </Box>
  );
};

export default Reports;
