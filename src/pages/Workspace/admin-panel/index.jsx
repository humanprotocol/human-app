import React from 'react';
import PropTypes from 'prop-types';
import { useHistory } from 'react-router-dom';
import { Routes } from '../../../routes';
import ExecuteWithdrawals from './withdraw-execution';
import SuspendUsers from './suspend-users';
import UnsuspendUsers from './unsuspend-users';
import DeleteUsersByEmail from './delete-users-by-email';

export default function AdminPanel({ isUserAdmin, authToken }) {
  const history = useHistory();
  if (!isUserAdmin) {
    history.push(Routes.Workspace.path);
  }
  return (
    <>
      <h2> Admin Panel </h2>
      <div>
        <ExecuteWithdrawals authToken={authToken} />
      </div>
      <div>
        <SuspendUsers authToken={authToken} />
      </div>
      <div>
        <UnsuspendUsers authToken={authToken} />
      </div>
      <div>
        <DeleteUsersByEmail authToken={authToken} />
      </div>
    </>
  );
}

AdminPanel.propTypes = {
  isUserAdmin: PropTypes.bool,
  authToken: PropTypes.string,
};

AdminPanel.defaultProps = {
  isUserAdmin: false,
  authToken: '',
};
