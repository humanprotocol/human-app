import React from 'react';
import PropTypes from 'prop-types';
import KYCButton from '../../components/kyc-button';

export default function UserStats({
  balance,
  isKYCed,
  onPassedKyc,
  earnedTokens,
  availableTokens,
  onVerificationError,
  referredUsersAmount,
  isQuestionnaireFilled,
}) {
  const kycClasses = ['stats'];
  if (!isKYCed) {
    kycClasses.push('stats--stretch');
  }
  const kycClassString = kycClasses.join(' ');

  return (
    <>
      <p className="stats">
        <span className="stats__item--bold">Referral HMT Earned: </span>
        <span> {earnedTokens} </span>
      </p>
      <p className="stats">
        <span className="stats__item--bold">HMT available to withdraw: </span>
        <span> {availableTokens} </span>
      </p>
      <p className="stats">
        <span className="stats__item--bold">Wallet HMT Balance: </span>
        <span> {balance} </span>
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
  balance: PropTypes.number,
  earnedTokens: PropTypes.number,
  availableTokens: PropTypes.number,
  referredUsersAmount: PropTypes.number,
  isQuestionnaireFilled: PropTypes.bool,
  isKYCed: PropTypes.bool,
  onPassedKyc: PropTypes.func,
  onVerificationError: PropTypes.func,
};

UserStats.defaultProps = {
  balance: 0,
  earnedTokens: 0,
  availableTokens: 0,
  referredUsersAmount: 0,
  isQuestionnaireFilled: false,
  isKYCed: false,
  onPassedKyc: () => {},
  onVerificationError: () => {},
};
