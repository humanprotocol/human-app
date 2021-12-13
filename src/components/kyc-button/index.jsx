import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import Fab from '@mui/material/Fab';
import { useTheme } from '@mui/styles';
import civicSip from '../../utils/civic';
import { ReactComponent as CivicLogo } from './logo.svg';

export default function KYCButton({ active, onPassedKyc, onVerificationError }) {
  const theme = useTheme();
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
      variant="circular"
      onClick={onKycClick}
      disabled={!active}
      sx={{
        backgroundColor: theme.palette.kyc.main,
        ':hover': {
          backgroundColor: theme.palette.kyc.secondary,
        },
      }}
    >
      <CivicLogo />
    </Fab>
  );
}

KYCButton.propTypes = {
  active: PropTypes.bool,
  onPassedKyc: PropTypes.func,
  onVerificationError: PropTypes.func,
};

KYCButton.defaultProps = {
  active: false,
  onPassedKyc: () => {},
  onVerificationError: () => {},
};
