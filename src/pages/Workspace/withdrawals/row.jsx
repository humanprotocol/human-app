import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Collapse, IconButton, TableCell, TableRow, Box, Button } from '@mui/material';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import Divider from '@mui/material/Divider';
import Link from '@mui/material/Link';
import { useDispatch } from 'react-redux';
import { humanNetworkName, blockchainScanner, withdrawalStatusToTitle } from './constants';
import notifier from '../../../service/notify.service';

import './index.scss';
import { finishGlobalLoading, startGlobalLoading } from '../../../store/action';
import { updateWithdrawal } from '../../../service/withdraw.service';

export default function WithdrawalRow(props) {
  const dispatch = useDispatch();
  const { id, amount, status, walletAddr, network, createdAt, txId, authToken } = props;
  const [withdrawalStatus, setWithdrawalStatus] = useState(status);
  const [open, setOpen] = useState(false);
  const txUrl = `${blockchainScanner[network]}/tx/${txId}`;
  const walletUrl = `${blockchainScanner[network]}/address/${walletAddr}`;
  const humanStatus = withdrawalStatusToTitle[withdrawalStatus] || 'N/A';

  const cancelWithdrawal = () => {
    dispatch(startGlobalLoading());
    updateWithdrawal(authToken, id, 'cancelled')
      .then((data) => {
        notifier.success(data.message);
        setWithdrawalStatus('cancelled');
      })
      .catch((error) => notifier.error(error.message))
      .finally(() => dispatch(finishGlobalLoading()));
  };
  return (
    <>
      <TableRow sx={{ '& > *': { borderBottom: 'unset' } }} hover onClick={() => setOpen(!open)}>
        <TableCell>
          <IconButton aria-label="expand row" size="small" onClick={() => setOpen(!open)}>
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell>{amount}</TableCell>
        <TableCell>{humanStatus}</TableCell>
        <TableCell>{createdAt.toLocaleDateString()}</TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={4}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1, wordBreak: 'break-all', textAlign: 'center' }}>
              <div className="withdrawal-item">
                <Divider> Withdrawal ID </Divider>
                <div> {id} </div>
              </div>
              <div className="withdrawal-item">
                <Divider> Created At </Divider>
                <div>{createdAt.toLocaleString()}</div>
              </div>
              <div className="withdrawal-item">
                <Divider> Wallet Address </Divider>
                <Link className="withdrawal-url" href={walletUrl} target="_blank" rel="noopener">
                  {walletAddr}
                </Link>
              </div>
              <div className="withdrawal-item">
                <Divider> Network </Divider>
                <div>{humanNetworkName[network]}</div>
              </div>
              {txId && (
                <div className="withdrawal-item">
                  <Divider> Transaction Hash </Divider>
                  <div>
                    <Link className="withdrawal-url" href={txUrl} target="_blank" rel="noopener">
                      {txId}
                    </Link>
                  </div>
                </div>
              )}
              {withdrawalStatus === 'waitsExecution' && (
                <div>
                  <Divider />
                  <Button onClick={cancelWithdrawal}>cancel</Button>
                </div>
              )}
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
}

WithdrawalRow.propTypes = {
  id: PropTypes.string.isRequired,
  amount: PropTypes.number.isRequired,
  status: PropTypes.string.isRequired,
  walletAddr: PropTypes.string.isRequired,
  network: PropTypes.string.isRequired,
  createdAt: PropTypes.instanceOf(Date).isRequired,
  txId: PropTypes.string,
  authToken: PropTypes.string.isRequired,
};

WithdrawalRow.defaultProps = {
  txId: '',
};
