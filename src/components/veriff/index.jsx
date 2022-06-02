import React, { useState } from 'react';
import { Button } from 'react-bootstrap';
import { useVeriff } from './useVeriff';
import { VIModal } from './vi-modal';

export default function VeriffButton() {
  const [show, setShow] = useState(false);
  const onVIClick = () => setShow((prev) => !prev);

  useVeriff({ show, setShow });

  return (
    <>
      <Button className="form-control bg-blue btn btn-primary" onClick={onVIClick}>
        Verify Identity
      </Button>
      <VIModal show={show} toggle={setShow} />
    </>
  );
}
