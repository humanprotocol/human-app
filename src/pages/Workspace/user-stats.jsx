import React from 'react';
import PropTypes from 'prop-types';

export default function UserStats(props) {
  const {
    earnedTokens,
    availableTokens,
    pendingTokens,
    referredUsersAmount,
    isQuestionnaireFilled,
  } = props;

  return (
    <>
      <p className="stats stats__secondary">
        <span>Total HMT earned: </span>
        {earnedTokens}
      </p>
      <p className="stats stats__secondary">
        <span>Available HMT to withdraw: </span>
        {availableTokens}
      </p>
      <p className="stats stats__secondary">
        <span>HMT Pending: </span>
        {pendingTokens}
      </p>
      <p className="stats stats__secondary">
        <span>Successful Referrals: </span>
        {referredUsersAmount}
      </p>
      <p className="stats stats__secondary">
        <span>Questionnaire: </span> {isQuestionnaireFilled ? 'Completed' : 'Incomplete'}
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
};

UserStats.defaultProps = {
  earnedTokens: 0,
  availableTokens: 0,
  pendingTokens: 0,
  referredUsersAmount: 0,
  isQuestionnaireFilled: false,
};
