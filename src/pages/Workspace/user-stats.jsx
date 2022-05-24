import React from 'react';
import PropTypes from 'prop-types';
import { Button } from 'react-bootstrap';
import VeriffButton from '../../components/veriff';

export default function UserStats({
  balance,
  isKYCed,
  earnedTokens,
  availableTokens,
  tryShowWithdrawModal,
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
        <span className="stats__item--bold">Total HMT Earned: </span>
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
        <span className="stats__item--bold">Questionnaire: </span>
        <span> {isQuestionnaireFilled ? 'Completed' : 'Incomplete'} </span>
      </p>
      <p className={kycClassString}>
        <span>
          <span className="stats__item--bold"> Verification status: </span>{' '}
          <span> {isKYCed ? 'passed' : 'N/A'} </span>
        </span>
      </p>
      {isKYCed ? (
        <Button className="form-control bg-blue btn btn-primary" onClick={tryShowWithdrawModal}>
          Withdraw
        </Button>
      ) : (
        <VeriffButton />
      )}
    </>
  );
}

UserStats.propTypes = {
  tryShowWithdrawModal: PropTypes.func,
  balance: PropTypes.string,
  earnedTokens: PropTypes.number,
  availableTokens: PropTypes.number,
  isQuestionnaireFilled: PropTypes.bool,
  isKYCed: PropTypes.bool,
};

UserStats.defaultProps = {
  balance: '0',
  earnedTokens: 0,
  availableTokens: 0,
  isQuestionnaireFilled: false,
  isKYCed: false,
  tryShowWithdrawModal: () => {},
};
