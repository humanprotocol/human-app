import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Alert, FormGroup, FormControl, Button } from 'react-bootstrap';
import { Link, useLocation } from 'react-router-dom';
import { Formik, Form, Field } from 'formik';
import './login.scss';
import { ErrorMessage, ResetPasswordStep } from '../../constants';
import { Routes } from '../../routes';
import { forgotPassword, resetPassword } from '../../service/user.service';
import { Password } from '../../components/inputs/password/password';
import {
  EmailValidationSchema,
  ResetPasswordValidationSchema,
} from '../../validationSchema/login.schema';

const ForgotPasswordPage = props => {
  const { history } = props;
  const { search } = useLocation();
  const verificationToken = search.replace('?token=', '');
  // const { token } = useSelector(state => state.auth);
  const [alertMsg, setAlertMsg] = useState('');
  // const [submittable, setSubmittable] = useState(false);
  const [step, setStep] = useState(
    verificationToken ? ResetPasswordStep.resetPassword : ResetPasswordStep.verifyEmail,
  );
  const [email, setEmail] = useState('');

  const sendForgotPasswordRequest = toEmail => {
    if (!toEmail) {
      return setAlertMsg(ErrorMessage.requireEmail);
    }

    return forgotPassword(toEmail)
      .then(() => {
        setAlertMsg('');
        setEmail(toEmail);
        setStep(ResetPasswordStep.pending);
      })
      .catch(err => {
        setAlertMsg(err.message);
      });
  };

  const handleForgotPassword = (data, { setSubmitting }) => {
    setSubmitting(true);
    sendForgotPasswordRequest(data.email);
    setSubmitting(false);
  };

  const handleResendForgotPassword = e => {
    e.preventDefault();
    if (!email) sendForgotPasswordRequest(email);
    else setStep(ResetPasswordStep.verifyEmail);
  };

  const handleResetPassword = (data, { setSubmitting }) => {
    setSubmitting(true);
    resetPassword(data.password, data.verificationToken)
      .then(() => {
        setSubmitting(false);
        setAlertMsg('');
        history.push({ pathname: Routes.Login.path });
      })
      .catch(err => {
        setSubmitting(false);
        setAlertMsg(err.message);
      });
  };

  return (
    <div
      id="resetPassword"
      className="col-md-4 offset-md-4 d-flex flex-column justify-content-center h-100"
    >
      <div className="container">
        <div className="page-title d-flex justify-content-between mb-4">
          {step === ResetPasswordStep.verifyEmail && <h2>Forgot your password?</h2>}
          {step === ResetPasswordStep.pending && <h2>Check your email</h2>}
          {step === ResetPasswordStep.resetPassword && <h2>Create new password</h2>}
          <Link to="/login">
            <i className="material-icons close">clear</i>
          </Link>
        </div>
        {alertMsg && alertMsg.length && (
          <Alert variant="danger" onClose={() => setAlertMsg('')} dismissible>
            <Alert.Heading>Failed to reset password!</Alert.Heading>
            <p>{alertMsg}</p>
          </Alert>
        )}
        {step === ResetPasswordStep.verifyEmail && (
          <p>
            A link will be sent to your registered email address. Go to the link and create a new
            password.
          </p>
        )}
        {step === ResetPasswordStep.pending && (
          <p>Please check your email and follow instructions to change your password.</p>
        )}
        {step === ResetPasswordStep.resetPassword && (
          <p>Your password should be different form the previously created password</p>
        )}
        <div>
          {step === ResetPasswordStep.verifyEmail && (
            <Formik
              initialValues={{ email: '' }}
              validationSchema={EmailValidationSchema}
              onSubmit={handleForgotPassword}
            >
              {({ errors, touched, handleSubmit, isValid, dirty }) => (
                <Form>
                  <FormGroup>
                    <Field name="email" className="form-control" placeholder="Email" type="email" />
                    {touched.email && errors.email && (
                      <FormControl.Feedback type="invalid" className="d-block">
                        {errors.email}
                      </FormControl.Feedback>
                    )}
                  </FormGroup>
                  <FormGroup className="actions d-flex justify-content-end m-0">
                    <Button
                      className="form-control bg-blue"
                      onClick={handleSubmit}
                      disabled={!(isValid && dirty)}
                    >
                      Next
                    </Button>
                  </FormGroup>
                </Form>
              )}
            </Formik>
          )}
          {step === ResetPasswordStep.pending && (
            <form name="form">
              <FormGroup>
                <p>
                  Did not recieve mail?
                  <span className="highlight-text" onClick={handleResendForgotPassword}>
                    Re-send.
                  </span>
                </p>
              </FormGroup>
            </form>
          )}
          {step === ResetPasswordStep.resetPassword && (
            <Formik
              initialValues={{ password: '', repeatPassword: '' }}
              validationSchema={ResetPasswordValidationSchema}
              onSubmit={handleResetPassword}
            >
              {({
                errors,
                touched,
                handleChange,
                handleBlur,
                handleSubmit,
                isValid,
                dirty,
                values,
              }) => (
                <Form>
                  <FormGroup className="password">
                    <Password
                      onChange={handleChange}
                      onBlur={handleBlur}
                      name="password"
                      value={values.password}
                      placeholder="Create password"
                      className="mb-5"
                    />
                    {touched.password && errors.password && (
                      <FormControl.Feedback type="invalid" className="d-block">
                        {errors.password}
                      </FormControl.Feedback>
                    )}
                  </FormGroup>
                  <FormGroup className="password">
                    <Password
                      onChange={handleChange}
                      onBlur={handleBlur}
                      name="repeatPassword"
                      value={values.repeatPassword}
                      placeholder="Confirm password"
                      className="mb-5"
                    />
                    {touched.repeatPassword && errors.repeatPassword && (
                      <FormControl.Feedback type="invalid" className="d-block">
                        {errors.repeatPassword}
                      </FormControl.Feedback>
                    )}
                  </FormGroup>
                  <FormGroup className="actions d-flex justify-content-between m-0">
                    <Link className="btn" to={Routes.Login.path}>
                      Cancel
                    </Link>
                    <Button
                      className="form-control bg-blue"
                      onClick={handleSubmit}
                      disabled={!(isValid && dirty)}
                    >
                      Save
                    </Button>
                  </FormGroup>
                </Form>
              )}
            </Formik>
          )}
        </div>
      </div>
    </div>
  );
};
ForgotPasswordPage.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
};
export default ForgotPasswordPage;
