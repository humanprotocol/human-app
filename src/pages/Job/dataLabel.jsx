import React, { useState, useRef } from 'react';
import { useSelector } from 'react-redux';
import { FormGroup, Alert } from 'react-bootstrap';
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
    <div id="profile" className="col-md-4 offset-md-4 d-flex flex-column justify-content-center">
      <div className="container">
        <div className="page-title d-flex justify-content-between mb-4">
          <h2>Data Labelling</h2>
        </div>
        {alertMsg && (
          <Alert variant="danger" onClose={() => setAlertMsg('')} dismissible>
            <Alert.Heading>Verify Hcatcha failed!</Alert.Heading>
            <p>{alertMsg}</p>
          </Alert>
        )}
        <div>
          <form name="form">
            <FormGroup className="text-center">
              <HCaptcha
                sitekey={process.env.REACT_APP_HCAPTCHA_SITE_KEY}
                onVerify={token => handleVerificationSuccess(token)}
                ref={captchaRef}
              />
            </FormGroup>
          </form>
        </div>
      </div>
    </div>
  );
};

export default DataLabel;
