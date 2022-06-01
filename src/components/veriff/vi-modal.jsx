import React from 'react';
import PropTypes from 'prop-types';
import { Modal } from 'react-bootstrap';

export const VIModal = ({ show, toggle }) => (
  <Modal
    id="modal__withdraw"
    show={show}
    onHide={() => toggle(false)}
    onExit={() => toggle(false)}
    centered
  >
    <Modal.Header />
    <Modal.Body>
      <div id="veriff-root" />
    </Modal.Body>
  </Modal>
);

VIModal.propTypes = {
  show: PropTypes.bool.isRequired,
  toggle: PropTypes.func.isRequired,
};

VIModal.defaultProps = {};
