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
  const kycClasses = ['stats'];
  if (!isKYCed) {
    kycClasses.push('stats--stretch');
  }

  const kycClassString = kycClasses.join(' ');

  return (
    <>
      <p className="stats">
        <span className="stats__item--bold">Total HMT earned: </span>
        <span> {earnedTokens} </span>
      </p>
      <p className="stats">
        <span className="stats__item--bold">Available HMT to withdraw: </span>
        <span> {availableTokens} </span>
      </p>
      <p className="stats">
        <span className="stats__item--bold">HMT pending: </span>
        <span> {pendingTokens} </span>
      </p>
      <p className="stats">
        <span className="stats__item--bold">Successful referrals: </span>
        <span> {referredUsersAmount} </span>
      </p>
      <p className="stats">
        <span className="stats__item--bold">Questionnaire: </span>
        <span> {isQuestionnaireFilled ? 'Completed' : 'Incomplete'} </span>
      </p>
      <p className={kycClassString}>
        <span>
          <span className="stats__item--bold"> Verification status: </span>{' '}
          <span> {isKYCed ? 'passed' : 'N/A'} </span>
        </span>
        {!isKYCed && (
          <KYCButton onPassedKyc={onPassedKyc} onVerificationError={onVerificationError} />
        )}
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
