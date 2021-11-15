import React from 'react';
import { Alert } from 'react-bootstrap';

export function SignupInterestAlert() {
  return (
    <>
      <Alert variant="danger">
        <p className="text-left">
          Thanks for registering interest in the HUMAN APP. Due to unprecedented demand, we have
          temporarily stopped new users signups. Once we have processed the existing queue, we will
          be fully committed to contacting you to get you onboarded.
        </p>
      </Alert>
    </>
  );
}
