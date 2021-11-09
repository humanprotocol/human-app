import React from 'react';
import { Alert } from 'react-bootstrap';

export function WalletAlert() {
  return (
    <>
      <Alert variant="primary">
        <p className="text-left">
          Please ensure that the withdrawal wallet belongs to an ERC20 deposit address on one of the
          following exchanges: Gate.io, FTX, BitFinex, Coinlist Pro & Bitmart
        </p>
      </Alert>
    </>
  );
}
