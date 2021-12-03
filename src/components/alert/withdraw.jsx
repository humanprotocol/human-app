import React from 'react';
import { Alert } from 'react-bootstrap';

export function DisabledWithdrawAlert() {
  return (
    <>
      <Alert variant="danger">
        <p className="text-left">
          Due to unprecedented demand, we have temporarily stopped withdrawal. Once we have
          processed the existing queue, we will be making the functionality active again.
        </p>
      </Alert>
    </>
  );
}
