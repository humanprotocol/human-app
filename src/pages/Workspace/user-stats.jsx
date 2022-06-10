import React from 'react';
import PropTypes from 'prop-types';
import VeriffButton from '../../components/veriff';

export default function UserStats({ balance, isKYCed, isQuestionnaireFilled }) {
  const kycClasses = ['stats'];
  if (!isKYCed) {
    kycClasses.push('stats--stretch');
  }
  const kycClassString = kycClasses.join(' ');

  return (
    <>
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
      {!isKYCed && <VeriffButton />}
    </>
  );
}

UserStats.propTypes = {
  balance: PropTypes.string,
  isQuestionnaireFilled: PropTypes.bool,
  isKYCed: PropTypes.bool,
};

UserStats.defaultProps = {
  balance: '0',
  isQuestionnaireFilled: false,
  isKYCed: false,
};
