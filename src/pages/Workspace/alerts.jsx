import React from 'react';
import { Alert } from 'react-bootstrap';

export function SetupWalletAlert() {
  return (
    <Alert variant="primary">
      <p>
        We have switched to the Polygon network. You'll need to replace your Ethereum wallet address
        with one connected to Polygon. Any pending withdrawals will be automatically converted once
        the wallet address is updated.
      </p>
    </Alert>
  );
}
