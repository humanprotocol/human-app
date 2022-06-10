import React from 'react';
import { Alert } from 'react-bootstrap';

export function SetupWalletAlert() {
  return (
    <Alert variant="primary">
      <p>
        We have switched to the Polygon network. You'll need to replace your Ethereum wallet address
        with one connected to Polygon.
      </p>
    </Alert>
  );
}

export function SetupIdentityVerificationIssueAlert() {
  return (
    <Alert variant="danger">
      <p>
        Currently HUMAN App is having issues with its identity verification system. Our team is
        working on the solution, so it should be fixed soon.
      </p>
    </Alert>
  );
}
