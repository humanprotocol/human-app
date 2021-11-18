import React from 'react';
import { Alert } from 'react-bootstrap';

export function SetupWalletAlert() {
  return (
    <Alert variant="primary">
      <p>
        We switched to the Polygon network. Please, provide your wallet address in the Polygon
        Mainnet. If you have any pending withdrawals in the Ethereum Mainnet, they will be
        automatically converted to the Polygon with updated wallet address.
      </p>
    </Alert>
  );
}
