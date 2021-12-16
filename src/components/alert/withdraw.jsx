import React from 'react';
import { Alert } from 'react-bootstrap';

export function DisabledWithdrawAlert() {
  return (
    <>
      <Alert variant="danger">
        <p className="text-left">
          Due to unprecedented demand, we have temporarily stopped withdrawals. We will reactivate
          them once we have processed the existing queue.
        </p>
      </Alert>
    </>
  );
}
