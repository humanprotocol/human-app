import React, { useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import { FormGroup, FormControl, Button, Alert, Dropdown } from 'react-bootstrap';
import HCaptcha from '@hcaptcha/react-hcaptcha';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import { Field, Form, Formik } from 'formik';
import { config } from '../../config';
import { Password } from '../../ui/password';
import './index.scss';
import { register, resendEmailVerification } from '../../service/user.service';
import { Routes } from '../../routes';
import { RegisterValidationSchema } from './schema';
import { countries } from '../../constants';

const RegisterPage = (props) => {
  const { history } = props;
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  if (!user || !user?.email) {
    history.push({ pathname: Routes.Home.path });
  }
  const captchaRef = useRef(null);
  const initialValues = {
    email: user ? user.email : '',
    userName: '',
    password: '',
    repeatPassword: '',
    country: '',
    hcaptchaToken: '',
    areTermsAndConditionsAccepted: false,
  };
  const [alertMsg, setAlertMsg] = useState('');
  const [countryName, setCountryName] = useState('');

  const handleRegister = (
    { userName, email, password, country, hcaptchaToken, areTermsAndConditionsAccepted },
    { setSubmitting, setFieldValue },
  ) => {
    setSubmitting(true);
    const newUser = {
      name: userName,
      email,
      password,
      country,
      hcaptchaToken,
      areTermsAndConditionsAccepted,
    };

    return register(newUser)
      .then((response) => {
        dispatch({
          type: 'AUTH_SIGN_IN',
          payload: response.isEmailVerified,
        });
        dispatch({
          type: 'AUTH_SUCCESS',
          payload: response,
        });
        return response.token;
      })
      .then((token) => resendEmailVerification(token))
      .then(() => {
        setAlertMsg('');
        setSubmitting(false);
        history.push({ pathname: Routes.VerifyEmail.path });
      })
      .catch((err) => {
        setAlertMsg(err.message);
        setSubmitting(false);
        setFieldValue('hcaptchaToken', '');
        captchaRef.current.resetCaptcha();
      });
  };

  const handleChangeCountry = (countryCode) => {
    const countryData = countries.countryList.filter((item) => item.Code === countryCode);
    setCountryName(countryData[0].Name);
  };

  return (
    <div
      id="register"
      className="col-md-4 offset-md-4 d-flex flex-column justify-content-center h-100"
    >
      <div className="container">
        <div className="page-title d-flex justify-content-between mb-4">
          <h2>Create account</h2>
        </div>
        {alertMsg && alertMsg.length && (
          <Alert variant="danger" onClose={() => setAlertMsg('')} dismissible>
            <Alert.Heading>Register failed!</Alert.Heading>
            <p>{alertMsg}</p>
          </Alert>
        )}
        <Formik
          initialValues={initialValues}
          validationSchema={RegisterValidationSchema}
          onSubmit={handleRegister}
        >
          {({
            errors,
            touched,
            values,
            dirty,
            isValid,
            handleSubmit,
            handleBlur,
            setFieldValue,
            setFieldTouched,
          }) => (
            <Form>
              <FormGroup>
                <Field
                  className="form-control"
                  placeholder="Full name"
                  name="userName"
                  value={values.userName}
                />
                {errors.userName && touched.userName && (
                  <FormControl.Feedback type="invalid" className="d-block">
                    {errors.userName}
                  </FormControl.Feedback>
                )}
              </FormGroup>
              <FormGroup>
                <Dropdown
                  drop="down"
                  onToggle={(isOpen) => {
                    if (isOpen) setFieldTouched('country', isOpen);
                  }}
                >
                  <Dropdown.Toggle className="form-control text-left bg-white">
                    {values.country ? countryName : 'Select country'}
                    <i className="fa fa-angle-down text-right" />
                  </Dropdown.Toggle>
                  <Dropdown.Menu className="w-100">
                    <Dropdown.Item
                      className="w-100"
                      onClick={(e) => {
                        e.preventDefault();
                        setFieldTouched('country', true);
                        setFieldValue('country', '');
                        setCountryName('');
                      }}
                    >
                      ...
                    </Dropdown.Item>
                    {countries.countryList &&
                      countries.countryList.length &&
                      countries.countryList.map((optItem) => (
                        <Dropdown.Item
                          className="w-100"
                          key={optItem.Code}
                          // eslint-disable-next-line no-unused-vars
                          onClick={(e) => {
                            setFieldValue('country', optItem.Code);
                            handleChangeCountry(optItem.Code);
                          }}
                          active={values.country === optItem.Code}
                        >
                          {optItem.Name}
                        </Dropdown.Item>
                      ))}
                  </Dropdown.Menu>
                </Dropdown>
                {touched.country && errors.country && (
                  <FormControl.Feedback type="invalid" className="d-block text-left">
                    {errors.country}
                  </FormControl.Feedback>
                )}
              </FormGroup>
              <FormGroup className="password">
                <Password
                  onChange={(e) => setFieldValue('password', e.target.value)}
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
                  onChange={(e) => setFieldValue('repeatPassword', e.target.value)}
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
              <FormGroup className="d-flex align-items-center mb-3">
                <Checkbox
                  id="terms-and-conditions"
                  size="small"
                  checked={values.areTermsAndConditionsAccepted}
                  onChange={() =>
                    setFieldValue(
                      'areTermsAndConditionsAccepted',
                      !values.areTermsAndConditionsAccepted,
                    )
                  }
                />
                <span>
                  I agree to the&nbsp;
                  <Link
                    href="https://humanprotocol.org/app/terms-and-conditions"
                    target="_blank"
                    rel="noopener"
                  >
                    terms and conditions
                  </Link>
                </span>
              </FormGroup>
              <FormGroup className="text-center">
                <HCaptcha
                  sitekey={config.hcaptchaSiteKey}
                  endpoint={config.hcaptchaExchangeUrl}
                  reportapi={config.hcaptchaLabelingBaseUrl}
                  custom
                  onVerify={(token) => setFieldValue('hcaptchaToken', token)}
                  ref={captchaRef}
                />
                {errors.hcaptchaToken && (
                  <FormControl.Feedback type="invalid" className="d-block">
                    {errors.captchPassRequired}
                  </FormControl.Feedback>
                )}
              </FormGroup>

              <FormGroup className="actions d-flex justify-content-between m-0">
                <Button
                  className="form-control btn mr-2 bg-white"
                  onClick={() => history.push({ pathname: Routes.Home.path })}
                >
                  Back
                </Button>
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
      </div>
    </div>
  );
};
RegisterPage.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
};

export default withRouter(RegisterPage);
