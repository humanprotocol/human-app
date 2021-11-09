import React from 'react';
import { Alert } from 'react-bootstrap';
import { exchanges } from '../../constants';

export function WalletExchangeAlert() {
  return (
    <>
      <Alert variant="primary">
        <p className="text-left">
          Please ensure that the withdrawal wallet belongs to an ERC20 deposit address on one of the
          following exchanges: {exchanges.availableExchanges.join(', ')}
        </p>
      </Alert>
    </>
  );
}

export function SetupWalletAlert() {
  return (
    <Alert variant="primary">
      <p>Please setup your wallet address in the Profile page. We’ll need this to send you HMT!</p>
    </Alert>
  );
}
