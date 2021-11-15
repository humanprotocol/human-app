import React, { useRef } from 'react';
import PropTypes from 'prop-types';
import { Modal } from 'react-bootstrap';
import HCaptcha from '@hcaptcha/react-hcaptcha';
import { SignupInterestAlert } from '../alert/signupInterest';
import notifier from '../../service/notify.service';
import { registerSignupRequest } from '../../service/user.service';

import './index.scss';

export const SignupRequest = ({ show, email, toggle }) => {
  const captchaRef = useRef(null);

  const onVerifyToken = (hcaptchaToken) => {
    return registerSignupRequest(email, hcaptchaToken)
      .then(() => {
        captchaRef.current.resetCaptcha();
        toggle(false);
        notifier.success(`Your signup request has been accepted for processing`);
      })
      .catch((err) => {
        notifier.error(err.message);
        toggle(false);
      });
  };

  const onHcaptchaError = () => {
    toggle(false);
    notifier.error(
      'HCaptcha error appeard during interaction with servers. Please, retry your attempt',
    );
  };

  return (
    <Modal
      id="modal__signup-interest"
      show={show}
      onHide={() => toggle(false)}
      onExit={() => toggle(false)}
      centered
    >
      <Modal.Header>
        <Modal.Title>Register Your Interest To Us</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <SignupInterestAlert />
        <div className="hcaptcha-container">
          <HCaptcha
            sitekey={process.env.REACT_APP_HCAPTCHA_SITE_KEY}
            onVerify={onVerifyToken}
            onError={onHcaptchaError}
            onExpire={onHcaptchaError}
            ref={captchaRef}
          />
        </div>
      </Modal.Body>
    </Modal>
  );
};

SignupRequest.propTypes = {
  show: PropTypes.bool.isRequired,
  email: PropTypes.string.isRequired,
  toggle: PropTypes.func.isRequired,
};
