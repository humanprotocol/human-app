import React, { useRef, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import HCaptcha from '@hcaptcha/react-hcaptcha';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import AutorenewIcon from '@mui/icons-material/Autorenew';
import IconButton from '@mui/material/IconButton';
import Divider from '@mui/material/Divider';
import Box from '@mui/material/Box';

import Button from '../../../../ui/button';
import { Routes } from '../../../../routes';
import { verifyToken, connect, getStats } from '../../../../service/labelingHcaptcha.service';
import { startGlobalLoading, finishGlobalLoading, setUserDetails } from '../../../../store/action';
import notifier from '../../../../service/notify.service';
import { getMyAccount } from '../../../../service/user.service';
import { config } from '../../../../config';

import './index.scss';

const FoundationHcaptcha = ({ siteKey, authToken, userId, isKYCed }) => {
  const captchaRef = useRef(null);
  const dispatch = useDispatch();
  const history = useHistory();
  const { isAuthed } = useSelector((state) => state.auth);
  const [servedCaptchas, setServedCaptchas] = useState(0);
  const [solvedCaptchas, setSolvedCaptchas] = useState(0);
  const [walletTokens, setWalletTokens] = useState(0);

  const getCaptchaStats = () => {
    dispatch(startGlobalLoading());

    getStats(authToken)
      .then((stats) => {
        setServedCaptchas(stats.served);
        setSolvedCaptchas(stats.solved);
        setWalletTokens(stats?.balance?.available || 0);
      })
      .catch((error) => {
        if (error.message) {
          notifier.error(error.message);
        } else {
          notifier.error('Unable to fetch captcha statistics. Please, try again later');
        }
      })
      .finally(() => dispatch(finishGlobalLoading()));
  };

  useEffect(() => {
    if (siteKey) {
      getCaptchaStats(authToken);
    }
  }, []);

  if (!isAuthed || !isKYCed) {
    history.push({ pathname: Routes.Home.path });
  }
  const onVerifyToken = (hcaptchaToken) => {
    dispatch(startGlobalLoading());
    verifyToken(hcaptchaToken, authToken)
      .then(() => notifier.success('Your input has been verified'))
      .catch((error) => {
        if (error.message) {
          notifier.error(error.message);
        } else {
          notifier.error('Something went wrong, please try again');
        }
      })
      .finally(() => {
        dispatch(finishGlobalLoading());
        captchaRef.current.resetCaptcha();
      });
  };
  const onCaptchaWidgetError = (error) => notifier.error(error);

  const connectUserToHcaptchaJobsPool = () => {
    dispatch(startGlobalLoading());

    connect(authToken)
      .then(() => notifier.success('Your account has been connected to HCaptcha jobs pool'))
      .then(() => getMyAccount(userId, authToken))
      .then((user) => dispatch(setUserDetails(user)))
      .catch((error) => {
        if (error.message) {
          notifier.error(error.message);
        } else {
          notifier.error('Something went wrong, please try again');
        }
      })
      .finally(dispatch(finishGlobalLoading()));
  };
  return (
    <div className="hcaptcha-labeling-container">
      <div className="labeling-item">
        <Card>
          <CardContent>
            <form>
              <Typography variant="h5">hCaptcha Labeling</Typography>
              <Typography sx={{ fontSize: '14px', lineHeight: 2 }}>
                To earn HMT, you must complete data-labeling tasks. Rewards will be automatically
                sent to your wallet according to a predefined schedule.
              </Typography>
              {siteKey && (
                <HCaptcha
                  endpoint={config.hcaptchaExchangeUrl}
                  reportapi={config.hcaptchaLabelingBaseUrl}
                  custom
                  className="hcaptcha-labeling-item"
                  sitekey={siteKey}
                  ref={captchaRef}
                  onVerify={onVerifyToken}
                  onError={onCaptchaWidgetError}
                />
              )}
              {!siteKey && <Button onClick={connectUserToHcaptchaJobsPool}>Connect</Button>}
              <Typography variant="subtitle2" sx={{ marginTop: '20px' }}>
                Important note: not all data-labeling tasks are billed. You can find relevant
                information in the section below.
              </Typography>
            </form>
          </CardContent>
        </Card>
      </div>
      <div className="labeling-item">
        <Card>
          <CardContent className="hcaptcha-labeling-stats">
            <div className="stats-header">
              <Typography variant="h5">Challenges statistics</Typography>
              <IconButton aria-label="Refresh" onClick={getCaptchaStats}>
                <AutorenewIcon />
              </IconButton>
            </div>
            <Box sx={{ margin: 1, wordBreak: 'break-all', textAlign: 'center' }}>
              <div className="withdrawal-item">
                <Divider> Served Tasks </Divider>
                <div> {servedCaptchas} </div>
              </div>
              <div className="withdrawal-item">
                <Divider> Completed Tasks </Divider>
                <div>{solvedCaptchas}</div>
              </div>
              <div className="withdrawal-item">
                <Divider> Wallet HMT Balance </Divider>
                <div> {walletTokens} </div>
              </div>
            </Box>
            <Typography variant="subtitle2">
              Please note that these statistics are not live, and there may be a delay between your
              submissions and the numbers shown here.
            </Typography>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

FoundationHcaptcha.propTypes = {
  siteKey: PropTypes.string,
  authToken: PropTypes.string.isRequired,
  userId: PropTypes.string,
  isKYCed: PropTypes.bool,
};

FoundationHcaptcha.defaultProps = {
  siteKey: '10000000-ffff-ffff-ffff-000000000001',
  userId: '',
  isKYCed: false,
};

export default FoundationHcaptcha;
