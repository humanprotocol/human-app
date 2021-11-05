import React, { useState, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import { FormGroup, Alert, Button } from 'react-bootstrap';
import HCaptcha from '@hcaptcha/react-hcaptcha';
import './job.scss';
import { Routes } from '../../routes';
import { verifyHcaptchaToken } from '../../service/job.service';
import { errors } from '../../constants';
import { DATA_LABEL_CAPTCHA_SOLVED } from '../../store/actionType';

const hcaptchaTheme = {
  palette: {
    primary: {
      main: '#800080',
    },
  },
};
const DataLabel = (props) => {
  const dispatch = useDispatch();
  const { history } = props;
  const { isAuthed, token: authToken } = useSelector((state) => state.auth);
  if (!isAuthed) {
    history.push({ pathname: Routes.Home.path });
  }
  const captchaRef = useRef(null);
  const [alertMsg, setAlertMsg] = useState('');
  const [captchaVerified, setCaptchaVerified] = useState(false);

  const handleVerificationSuccess = (hcaptchaToken) => {
    if (hcaptchaToken) {
      return verifyHcaptchaToken(hcaptchaToken, authToken)
        .then((responseData) => {
          setAlertMsg('');
          captchaRef.current.resetCaptcha();
          dispatch({
            type: DATA_LABEL_CAPTCHA_SOLVED,
            payload: {
              servedCaptchas: responseData.servedCaptchas,
              solvedCaptchas: responseData.solvedCaptchas,
            },
          });
        })
        .catch((err) => {
          setAlertMsg(err.message);
          captchaRef.current.resetCaptcha();
        });
    }
    setAlertMsg(errors.errorMessage.captchaPassRequired);
  };
  return (
    <div id="profile" className="col-md-4 offset-md-4 d-flex flex-column justify-content-center">
      <div className="container">
        <div className="page-title d-flex justify-content-between mb-4">
          <h2>Data Labelling</h2>
        </div>
        <div className="page-title d-flex justify-content-between mb-4">
          <p> For every hCaptcha puzzle you solve, you will earn around 0.01 - 0.1 HMT. </p>
        </div>
        {alertMsg && (
          <Alert variant="danger" onClose={() => setAlertMsg('')} dismissible>
            <Alert.Heading>Verify Hcatcha failed!</Alert.Heading>
            <p>{alertMsg}</p>
          </Alert>
        )}
        <div>
          <form name="form">
            {!captchaVerified && (
              <FormGroup className="text-center">
                <HCaptcha
                  custom
                  endpoint="https://foundation-exchange.hmt.ai"
                  host="vkomodey.com"
                  sitekey={process.env.REACT_APP_HCAPTCHA_ANNOTATION_SITE_KEY}
                  onVerify={(token) => handleVerificationSuccess(token)}
                  size="normal"
                  theme={hcaptchaTheme}
                  ref={captchaRef}
                />
              </FormGroup>
            )}
            {captchaVerified && (
              <FormGroup className="text-left">
                <p>For every hCaptcha puzzle you solve, you will earn around 0.01 - 0.1 HMT.</p>
                <p>For every friend you refer who successfully signs up, you will receive 1 HMT.</p>
                <p>Complete the questionnaire to receive 1 HMT.</p>
              </FormGroup>
            )}
            {captchaVerified && (
              <FormGroup className="text-center">
                <Button className="form-control" onClick={() => setCaptchaVerified(false)}>
                  Back
                </Button>
              </FormGroup>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};
DataLabel.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
};

DataLabel.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
};

export default DataLabel;
