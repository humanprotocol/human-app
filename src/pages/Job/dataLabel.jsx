import React, { useState, useRef } from 'react';
import { useSelector } from 'react-redux';
import { FormGroup, Alert, Button } from 'react-bootstrap';
import HCaptcha from '@hcaptcha/react-hcaptcha';
import './job.scss';
import { Routes } from '../../routes';
import { verifyHcaptchaToken } from '../../service/job.service';
import { ErrorMessage } from '../../constants';

const DataLabel = props => {
  const { history } = props;
  const { isAuthed, token } = useSelector(state => state.auth);
  if (!isAuthed) {
    history.push({ pathname: Routes.Home.path });
  }
  const captchaRef = useRef(null);
  const [alertMsg, setAlertMsg] = useState('');
  const [captchaVerified, setCaptchaVerified] = useState(false);

  const handleVerificationSuccess = hcaptchaToken => {
    if (hcaptchaToken) {
      return verifyHcaptchaToken(hcaptchaToken, token)
        .then(() => {
          setAlertMsg('');
          captchaRef.current.resetCaptcha();
          setCaptchaVerified(true);
        })
        .catch(err => {
          setAlertMsg(err.message);
          captchaRef.current.resetCaptcha();
        });
    }
    setAlertMsg(ErrorMessage.captchaPassRequired);
  };
  return (
    <div id="dataLabel" className="d-flex flex-column justify-content-center">
      <div className="container">
        <div className="page-title d-flex justify-content-between mb-4">
          <h2>{!captchaVerified ? 'Data Labelling' : 'Help'}</h2>
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
                  sitekey={process.env.REACT_APP_HCAPTCHA_SITE_KEY}
                  onVerify={token => handleVerificationSuccess(token)}
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

export default DataLabel;
