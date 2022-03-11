import React from 'react';
import PropTypes from 'prop-types';
import {
  Paper,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from '@mui/material';
import WithdrawalRow from './row';

export default function Withdrawals({ withdrawals, authToken }) {
  const requestsLength = withdrawals.length;
  const sortedWithdrawals = [...withdrawals].sort((w1, w2) => w2.createdAt - w1.createdAt);
  return (
    <>
      {requestsLength === 0 && <span>You don't have any withdrawal requests yet</span>}
      {requestsLength > 0 && (
        <TableContainer component={Paper} elevation={2}>
          <Table size="small" aria-label="collapsible table" sx={{ maxWidth: '400px' }}>
            <TableHead>
              <TableRow>
                <TableCell sx={{ maxWidth: '10px' }} />
                <TableCell>HMT</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Date</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {sortedWithdrawals.map((withdraw) => (
                <WithdrawalRow
                  key={withdraw.id}
                  id={withdraw.id}
                  createdAt={withdraw.createdAt}
                  network={withdraw.network}
                  status={withdraw.status}
                  txId={withdraw.txId}
                  walletAddr={withdraw.walletAddr}
                  amount={withdraw.amount}
                  authToken={authToken}
                />
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </>
  );
}

Withdrawals.propTypes = {
  withdrawals: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      createdAt: PropTypes.instanceOf(Date).isRequired,
      amount: PropTypes.number.isRequired,
      status: PropTypes.string.isRequired,
      walletAddr: PropTypes.string.isRequired,
      txId: PropTypes.string,
    }),
  ),
  authToken: PropTypes.string.isRequired,
};

Withdrawals.defaultProps = {
  withdrawals: [],
};
