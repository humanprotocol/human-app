import React, { useRef } from 'react';
import PropTypes from 'prop-types';
import { Modal, FormGroup, Button, FormControl, FormLabel } from 'react-bootstrap';
import { Field, Form, Formik } from 'formik';
import HCaptcha from '@hcaptcha/react-hcaptcha';
import notifier from '../../../service/notify.service';
import { WithdrawSchema } from './schema';
import { sendWithdraw } from '../../../service/withdraw.service';
import NetworkBadge from '../../../components/network-badge';
import { hcaptchaConstants } from '../../../constants';

import './index.scss';

export const Withdraw = ({ show, user, toggle, onSubmitWithdrawal, authToken }) => {
  const captchaRef = useRef(null);

  const onSubmit = async ({ amount, hcaptchaToken }, { setSubmitting }) => {
    setSubmitting(true);
    try {
      await sendWithdraw(parseFloat(amount), hcaptchaToken, authToken);
      captchaRef.current.resetCaptcha();
      setSubmitting(false);
      toggle(false);
      notifier.success(`Your withdraw request(${amount} HMT) has been accepted for processing`);
      onSubmitWithdrawal();
    } catch (err) {
      setSubmitting(false);
      notifier.error(err.message);
      captchaRef.current.resetCaptcha();
    }
  };

  const initialValues = {
    amount: 0,
    walletAddr: user?.polygonWalletAddr || '',
  };

  const validateForm = (values) => {
    const errors = {};
    const availableTokens = user ? user.availableTokens || 0 : 0;

    if (values.amount > availableTokens) {
      errors.amount = `Maximum amount is ${availableTokens} HMTs`;
    }

    return errors;
  };
  const onHcaptchaError = () => {
    captchaRef.current.resetCaptcha();
    notifier.error(
      'HCaptcha error appeard during interaction with servers. Please, retry your attempt',
    );
  };

  return (
    <Modal
      id="modal__withdraw"
      show={show}
      onHide={() => toggle(false)}
      onExit={() => toggle(false)}
      centered
    >
      <Modal.Header>
        <Modal.Title>Withdraw HMT</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <NetworkBadge title="Polygon Mainnet" />
        <Formik
          initialValues={initialValues}
          validationSchema={WithdrawSchema}
          validate={validateForm}
          onSubmit={onSubmit}
        >
          {({ errors, touched, values, dirty, isValid, handleSubmit, setFieldValue }) => (
            <Form>
              <FormGroup>
                <FormLabel>Amount. Balance = {user.availableTokens.toFixed(2)} HMT</FormLabel>
                <Field
                  className="form-control"
                  placeholder="Amount"
                  name="amount"
                  type="text"
                  value={values.amount}
                />
                {errors.amount && touched.amount && (
                  <FormControl.Feedback type="invalid" className="d-block">
                    {errors.amount}
                  </FormControl.Feedback>
                )}
              </FormGroup>
              <FormGroup>
                <FormLabel>Wallet address</FormLabel>
                <Field
                  className="form-control"
                  placeholder="wallet Address"
                  name="walletAddr"
                  value={values.walletAddr}
                  disabled
                />
              </FormGroup>
              <FormGroup className="hcaptcha-container">
                <HCaptcha
                  sitekey={process.env.REACT_APP_HCAPTCHA_SITE_KEY}
                  endpoint={hcaptchaConstants.endpoint}
                  reportapi={hcaptchaConstants.reportapi}
                  custom
                  onVerify={(token) => setFieldValue('hcaptchaToken', token)}
                  onError={onHcaptchaError}
                  onExpire={onHcaptchaError}
                  ref={captchaRef}
                />
              </FormGroup>
              <FormGroup className="actions d-flex justify-content-between m-0">
                <Button className="btn mr-2 bg-white" onClick={() => toggle(false)}>
                  Back
                </Button>
                <Button
                  className="form-control bg-blue"
                  onClick={handleSubmit}
                  disabled={!(isValid && dirty)}
                >
                  Request
                </Button>
              </FormGroup>
            </Form>
          )}
        </Formik>
        <FormGroup placeholder="Amount" type="" name="email" />
      </Modal.Body>
    </Modal>
  );
};

Withdraw.propTypes = {
  show: PropTypes.bool.isRequired,
  authToken: PropTypes.string.isRequired,
  user: PropTypes.shape({
    availableTokens: PropTypes.number.isRequired,
    polygonWalletAddr: PropTypes.string.isRequired,
  }).isRequired,
  toggle: PropTypes.func.isRequired,
  onSubmitWithdrawal: PropTypes.func,
};

Withdraw.defaultProps = {
  onSubmitWithdrawal: () => {},
};
