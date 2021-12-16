import React from 'react';
import PropTypes from 'prop-types';
import KYCButton from '../../components/kyc-button';

export default function UserStats(props) {
  const {
    earnedTokens,
    availableTokens,
    pendingTokens,
    referredUsersAmount,
    isQuestionnaireFilled,
    isKYCed,
    onPassedKyc,
    onVerificationError,
  } = props;

  return (
    <>
      <p className="stats">
        <span>Total HMT earned: </span>
        {earnedTokens}
      </p>
      <p className="stats">
        <span>Available HMT to withdraw: </span>
        {availableTokens}
      </p>
      <p className="stats">
        <span>HMT pending: </span>
        {pendingTokens}
      </p>
      <p className="stats">
        <span>Successful referrals: </span>
        {referredUsersAmount}
      </p>
      <p className="stats">
        <span>Questionnaire: </span> {isQuestionnaireFilled ? 'Completed' : 'Incomplete'}
      </p>
      <p className="stats stats__kyc">
        <span> Verification status: {isKYCed ? 'passed' : 'N/A'} </span>
        <KYCButton
          active={!isKYCed}
          onPassedKyc={onPassedKyc}
          onVerificationError={onVerificationError}
        />
      </p>
    </>
  );
}

UserStats.propTypes = {
  earnedTokens: PropTypes.number,
  availableTokens: PropTypes.number,
  pendingTokens: PropTypes.number,
  referredUsersAmount: PropTypes.number,
  isQuestionnaireFilled: PropTypes.bool,
  isKYCed: PropTypes.bool,
  onPassedKyc: PropTypes.func,
  onVerificationError: PropTypes.func,
};

UserStats.defaultProps = {
  earnedTokens: 0,
  availableTokens: 0,
  pendingTokens: 0,
  referredUsersAmount: 0,
  isQuestionnaireFilled: false,
  isKYCed: false,
  onPassedKyc: () => {},
  onVerificationError: () => {},
};
