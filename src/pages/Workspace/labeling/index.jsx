import React from 'react';
import PropTypes from 'prop-types';
import FoundationHcaptcha from './hcaptcha';

export default function LabelingHub({ authToken, hcaptchaSiteKey, userId, isKYCed }) {
  // A dummy component which will be used for different jobs in future
  return (
    <div>
      <FoundationHcaptcha
        authToken={authToken}
        siteKey={hcaptchaSiteKey}
        userId={userId}
        isKYCed={isKYCed}
      />
    </div>
  );
}

LabelingHub.propTypes = {
  authToken: PropTypes.string.isRequired,
  hcaptchaSiteKey: PropTypes.string,
  userId: PropTypes.string,
  isKYCed: PropTypes.bool,
};

LabelingHub.defaultProps = {
  hcaptchaSiteKey: '',
  userId: '',
  isKYCed: false,
};
