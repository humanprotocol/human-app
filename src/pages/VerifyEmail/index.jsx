import React, { useState } from 'react';
import { FormGroup, Button, Alert } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';
import { Routes } from '../../routes';
import { startGlobalLoading, finishGlobalLoading } from '../../store/action';
import { resendEmailVerification, verifyEmail } from '../../service/user.service';
import './index.scss';

const VerifyEmail = ({ history }) => {
  const dispatch = useDispatch();
  const { search } = useLocation();
  const token = search.replace('?token=', '');
  const auth = useSelector((state) => state.auth);
  const accessToken = auth.token;
  const { user } = auth;
  const [verified, setVerified] = useState(false);
  const [resentVerification, setResentVerification] = useState(false);
  const [alertMsg, setAlertMsg] = useState('');
  const handleVerification = (e) => {
    e.preventDefault();
    if (!token) setAlertMsg('token requried');
    else {
      dispatch(startGlobalLoading());
      return verifyEmail(token)
        .then(() => {
          setAlertMsg('');
          dispatch({ type: 'AUTH_SIGN_IN', payload: true });
          dispatch({ type: 'SET_USER', payload: { ...user, isEmailVerified: true } });
          setVerified(true);
          setTimeout(() => {
            history.push({ pathname: Routes.Login.path });
          }, 3000);
        })
        .catch((err) => setAlertMsg(err.message))
        .finally(() => dispatch(finishGlobalLoading()));
    }
  };

  const resendVerification = (e) => {
    e.preventDefault();
    dispatch(startGlobalLoading());
    return resendEmailVerification(accessToken)
      .then(() => {
        setAlertMsg('');
        setResentVerification(true);
      })
      .catch((err) => setAlertMsg(err.message))
      .finally(() => dispatch(finishGlobalLoading()));
  };
  return (
    <div
      id="verifyEmail"
      className="col-md-4 offset-md-4 d-flex flex-column justify-content-center h-100"
    >
      <div className="container">
        <div className="page-title d-flex justify-content-between mb-4">
          <h2>{verified ? 'Email verified' : 'Verify email'}</h2>
        </div>
        {alertMsg && alertMsg.length && (
          <Alert variant="danger" onClose={() => setAlertMsg('')} dismissible>
            <Alert.Heading>Email verification failed!</Alert.Heading>
            <p>{alertMsg}</p>
          </Alert>
        )}
        <div>
          {verified && <p>Redirecting you to login.</p>}
          {!verified && !resentVerification && !token && accessToken && (
            <p>Verification email is sent. Please check your email.</p>
          )}
          {!verified && resentVerification && !token && accessToken && (
            <p>Verification email is resent. Please check your email.</p>
          )}
          {!verified && token && <p> Please click below to continue </p>}
          <form name="form">
            {!verified && (
              <FormGroup className="actions d-flex justify-content-between m-0">
                {!token && accessToken && (
                  <Button className="link highlight-text" onClick={resendVerification}>
                    Re-send
                  </Button>
                )}
                {token && (
                  <Button className="form-control bg-blue" onClick={handleVerification}>
                    Verify email
                  </Button>
                )}
              </FormGroup>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};
VerifyEmail.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
};

export default VerifyEmail;
