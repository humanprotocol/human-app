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

export function VerificationPromotionMessage() {
  return (
    <Alert variant="primary">
      <p>
        Pass the verification in the Civic App before January 17, 05:00 PM GMT and get 1 free HMT!
      </p>
    </Alert>
  );
}
