import React from 'react';
import PropTypes from 'prop-types';
import { Modal, FormGroup, Button, FormControl, FormLabel } from 'react-bootstrap';
import { Field, Form, Formik } from 'formik';
import { useSelector, useDispatch } from 'react-redux';
import notifier from '../../service/notify.service';
import { WithdrawSchema } from '../../validationSchema/withdraw.schema';
import { sendWithdraw } from '../../service/withdraw.service';

import './withdraw.scss';
import { getMyAccount } from '../../service/user.service';

export const Withdraw = ({ show, user, toggle }) => {
  const dispatch = useDispatch();
  const { auth } = useSelector((state) => state);

  const updateUserProfile = () => {
    return getMyAccount(auth.user.id, auth.token)
      .then((profile) => {
        dispatch({
          type: 'SET_USER',
          payload: profile,
        });
      })
      .catch((err) => {
        notifier.error(`Failed to update user profile. ${err.message}`);
      });
  };

  const handleSending = ({ amount }, { setSubmitting }) => {
    setSubmitting(true);
    return sendWithdraw(parseFloat(amount), auth.token)
      .then(() => {
        setSubmitting(false);
        toggle(false);
        notifier.success(`Your withdraw request(${amount} HMT) has been accepted for processing`);
        updateUserProfile();
      })
      .catch((err) => {
        setSubmitting(false);
        notifier.error(err.message);
      });
  };

  const initialValues = {
    amount: 0,
    walletAddr: user?.walletAddr || '',
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
        <div className="mark mb-3">Ethereum Mainnet</div>
        <Formik
          initialValues={initialValues}
          validationSchema={WithdrawSchema}
          onSubmit={handleSending}
        >
          {({ errors, touched, values, dirty, isValid, handleSubmit }) => (
            <Form>
              <FormLabel>Amount</FormLabel>
              <FormGroup className="d-inline-flex">
                <div className="col-md-6 p-0">
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
                </div>
                <div className="col-md-6">
                  <p>Balance = {user.availableTokens.toFixed(2)} HMT</p>
                </div>
              </FormGroup>
              <FormLabel>Wallet address</FormLabel>
              <FormGroup>
                <Field
                  className="form-control"
                  placeholder="wallet Address"
                  name="walletAddr"
                  value={values.walletAddr}
                  disabled
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
                  Send
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
  user: PropTypes.shape({
    availableTokens: PropTypes.number.isRequired,
    walletAddr: PropTypes.string.isRequired,
  }).isRequired,
  toggle: PropTypes.func.isRequired,
};
