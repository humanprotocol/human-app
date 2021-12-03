import React from 'react';
import PropTypes from 'prop-types';
import ShareSharpIcon from '@mui/icons-material/ShareSharp';
import { useTheme } from '@mui/styles';
import Button from '../../../ui/button';
import Card from '../../../ui/card';
import notifier from '../../../service/notify.service';
import './index.scss';

function copyToClipBoard(value) {
  if (!navigator.clipboard) {
    return null;
  }

  return navigator.clipboard.writeText(value);
}
export default function ReferralCode({ referralCode }) {
  const theme = useTheme();
  const referralCodeStyles = {
    paddingBottom: '10px',
    paddingTop: '10px',
    borderRadius: '0.5rem',
    borderColor: theme.palette.primary.main,
  };

  return (
    <div className="referral-container">
      <div className="item">
        If you refer a friend you will receive 1 HMT. Note, you will receive the HMT only if your
        referral successfully signs up with their email and wallet address.
      </div>
      <div className="item">Copy the code below & ask your friend to use it while Signing up!</div>
      <div className="item referral-code-card">
        <Card styles={referralCodeStyles}>{referralCode}</Card>
      </div>
      <div className="item">
        <Button
          variant="contained"
          endIcon={<ShareSharpIcon />}
          size="large"
          onClick={() => {
            copyToClipBoard(referralCode).then(() => notifier.success('Copied!'));
          }}
        >
          Copy Referral Code
        </Button>
      </div>
    </div>
  );
}

ReferralCode.propTypes = {
  referralCode: PropTypes.string,
};

ReferralCode.defaultProps = {
  referralCode: '',
};
