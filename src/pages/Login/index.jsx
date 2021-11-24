import React, { useState, useRef } from 'react';
import PropTypes from 'prop-types';
import { Button, FormControl, FormGroup, Alert } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import { Link, withRouter } from 'react-router-dom';
import HCaptcha from '@hcaptcha/react-hcaptcha';
import { useFormik } from 'formik';
import { Password } from '../../ui/password';
import { signIn } from '../../service/user.service';
import { Routes } from '../../routes';
import { LoginValidationSchema } from './schema';
import './index.scss';

const LoginPage = (props) => {
  const dispatch = useDispatch();
  const captchaRef = useRef(null);
  const { history } = props;
  const [hcaptchaToken, setHcaptchaToken] = useState('');
  const [alertMsg, setAlertMsg] = useState('');
  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
      token: '',
    },
    validationSchema: LoginValidationSchema,
    onSubmit: (values, { setSubmitting }) => {
      setSubmitting(true);
      signIn({ ...values, hcaptchaToken })
        .then((res) => {
          if (res) {
            const { user } = res;
            dispatch({
              type: 'AUTH_SUCCESS',
              payload: res,
            });
            dispatch({
              type: 'AUTH_SIGN_IN',
              payload: user.isEmailVerified,
            });
            setHcaptchaToken('');
            setSubmitting(false);
            if (user.isEmailVerified) history.push({ pathname: Routes.Workspace.path });
            else history.push({ pathname: Routes.VerifyEmail.path });
          } else {
            setHcaptchaToken('');
            setSubmitting(false);
            captchaRef.current.resetCaptcha();
          }
        })
        .catch((err) => {
          setAlertMsg(err.message);
          setHcaptchaToken('');
          setSubmitting(false);
          captchaRef.current.resetCaptcha();
        });
    },
  });

  const handleVerificationToken = (token) => {
    setHcaptchaToken(token);
    formik.setFieldValue('token', token);
  };

  return (
    <div
      id="login"
      className="col-md-4 offset-md-4 d-flex flex-column justify-content-center h-100"
    >
      <div className="container">
        <div className="page-title d-flex justify-content-between mb-4">
          <h2>Log in</h2>
        </div>
        {alertMsg && alertMsg.length && (
          <Alert variant="danger" onClose={() => setAlertMsg('')} dismissible>
            <Alert.Heading>Login failed!</Alert.Heading>
            <p>{alertMsg}</p>
          </Alert>
        )}
        <form name="form" onSubmit={formik.handleSubmit}>
          <FormGroup>
            <FormControl
              placeholder="Email"
              type="email"
              name="email"
              value={formik.values.email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched.email && formik.errors.email && (
              <FormControl.Feedback type="invalid" className="d-block">
                {formik.errors.email}
              </FormControl.Feedback>
            )}
          </FormGroup>
          <FormGroup className="password">
            <Password
              placeholder="Password"
              type="password"
              name="password"
              value={formik.values.password}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched.password && formik.errors.password && (
              <FormControl.Feedback type="invalid" className="d-block">
                {formik.errors.password}
              </FormControl.Feedback>
            )}
          </FormGroup>
          <FormGroup className="text-center">
            <HCaptcha
              sitekey={process.env.REACT_APP_HCAPTCHA_SITE_KEY}
              onVerify={(token) => handleVerificationToken(token)}
              ref={captchaRef}
            />
          </FormGroup>
          {formik.isSubmitting && formik.errors.token && (
            <FormControl.Feedback type="invalid" className="d-block">
              {formik.errors.token}
            </FormControl.Feedback>
          )}
          <div className="d-flex justify-content-between mb-2">
            <Link to="/reset-password" className="btn btn-link">
              Forgot Password?
            </Link>
          </div>
          <FormGroup className="actions d-flex justify-content-between m-0">
            <Button
              className="form-control btn mr-2 bg-white"
              onClick={() => history.push({ pathname: Routes.Home.path })}
            >
              Back
            </Button>
            <Button
              className="form-control bg-blue"
              onClick={formik.handleSubmit}
              disabled={!(formik.isValid && formik.dirty && hcaptchaToken)}
            >
              Log in
            </Button>
          </FormGroup>
        </form>
      </div>
    </div>
  );
};
LoginPage.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
};

export default withRouter(LoginPage);
