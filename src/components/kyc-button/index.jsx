import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import Fab from '@mui/material/Fab';
import civicSip from '../../utils/civic';
import { ReactComponent as CivicLogo } from './logo.svg';

import './index.scss';

export default function KYCButton({ onPassedKyc, onVerificationError }) {
  useEffect(() => {
    civicSip.on('auth-code-received', (event) => onPassedKyc(event.response));
    civicSip.on('civic-sip-error', () => onVerificationError());
  }, []);
  const onKycClick = () => {
    return civicSip.signup({
      style: 'popup',
      scopeRequest: civicSip.ScopeRequests.PROOF_OF_IDENTITY,
    });
  };
  return (
    <Fab
      size="small"
      onClick={onKycClick}
      className="civic-button civic-button-white civic-button-black-text"
      sx={{ backgroundColor: '#FFFFFF', boxShadow: 'none' }}
    >
      <CivicLogo />
    </Fab>
  );
}

KYCButton.propTypes = {
  onPassedKyc: PropTypes.func,
  onVerificationError: PropTypes.func,
};

KYCButton.defaultProps = {
  onPassedKyc: () => {},
  onVerificationError: () => {},
};
