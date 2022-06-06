import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Switch, Route, useHistory, useLocation, Redirect } from 'react-router-dom';
import NavLink from './nav-link';
import {
  setUserDetails,
  startGlobalLoading,
  finishGlobalLoading,
  setWithdrawals,
} from '../../store/action';
import { Routes } from '../../routes';
import { SetupWalletAlert, SetupWithdrawalsRemovalAlert } from './alerts';
import { Withdraw } from './withdrawal-request';
import { useContractAbi } from '../../hooks/useContractAbi';
import Profile from '../Profile';
import UserStats from './user-stats';
import Questionnaire from './questionnaire';
import AdminPanel from './admin-panel';
import Withdrawals from './withdrawals';
import Labeling from './labeling';
import { getWithdrawals } from '../../service/withdraw.service';
import { getMyAccount } from '../../service/user.service';
import notifier from '../../service/notify.service';

import './index.scss';

function getPendingWithdrawals(withdrawals = []) {
  return withdrawals.filter(
    (withdrawal) => withdrawal.status === 'pendingOnBC' || withdrawal.status === 'waitsExecution',
  );
}
const WorkSpace = () => {
  const history = useHistory();
  const location = useLocation();
  const dispatch = useDispatch();
  const { user = {}, isAuthed, token } = useSelector((state) => state.auth);
  const { items: withdrawals } = useSelector((state) => state.withdrawal);
  const availableTokens = user ? user.availableTokens || 0 : 0;
  const polygonWalletAddr = user?.polygonWalletAddr || 0;
  const isAdmin = user?.role === 'admin';

  if (!isAuthed) {
    history.push({ pathname: Routes.Home.path });
  }

  const { balance } = useContractAbi({ walletAddr: polygonWalletAddr });
  const [showWithdraw, setShowWithdraw] = useState(false);
  const isQuestionnaireFilled = Boolean(user?.misc && user.misc.questionnaire.length > 0);
  const isWalletFilled = Boolean(user?.polygonWalletAddr);
  const isLabelingEnabled = user?.isKYCed && user?.polygonWalletAddr;
  const defaultRoute = !isQuestionnaireFilled
    ? Routes.Workspace.Questionnaire.path
    : Routes.Workspace.Profile.path;

  if (location.pathname === Routes.Workspace.Questionnaire.path && isQuestionnaireFilled) {
    history.push({ pathname: Routes.Workspace.Profile.path });
  }

  const onSubmitQuestionnaire = (updatedUser) => {
    notifier.success('Questionnaire has been completed');
    history.push({ pathname: Routes.Workspace.Profile.path });
    dispatch(setUserDetails(updatedUser));
  };

  const tryShowWithdrawModal = () => {
    const userHasPendingWithdrawals = getPendingWithdrawals(withdrawals).length > 0;
    const userHasAvailableTokens = availableTokens > 0;

    if (!isQuestionnaireFilled) {
      notifier.warning('Please, fill the questionnaire');
    } else if (!isWalletFilled) {
      notifier.warning('Please, fill the wallet address(Polygon Mainnet) in the profile page.');
    } else if (!userHasAvailableTokens) {
      notifier.warning('You have no available HMTs to withdraw.');
    } else if (userHasPendingWithdrawals) {
      notifier.warning(
        'Your previous withdrawal request has not been processed yet. Please, retry later',
      );
    } else {
      setShowWithdraw(true);
    }
  };
  const updateWithdrawals = () => {
    return getWithdrawals(token)
      .then((result) => dispatch(setWithdrawals(result)))
      .catch((err) => {
        history.push({ pathname: Routes.Login.path });
        notifier.error(err.message);
      });
  };

  const setUserProfile = () => {
    return getMyAccount(user.id, token)
      .then((updatedUser) => dispatch(setUserDetails(updatedUser)))
      .catch((error) => notifier.error(error.message));
  };

  const updateUserAndWithdrawals = () => {
    dispatch(startGlobalLoading());
    Promise.all([updateWithdrawals(), setUserProfile()]).finally(() =>
      dispatch(finishGlobalLoading()),
    );
  };

  useEffect(() => {
    if (!user || Object.entries(user).length === 0) {
      return null;
    }
    dispatch(startGlobalLoading());
    updateWithdrawals().finally(() => dispatch(finishGlobalLoading()));
  }, []);

  return (
    <div id="workspace">
      <div className="blur-bg" />
      <div className="container job__container">
        <div className="row">
          <div className="col-md-3 section-option text-right col-sm-12 job__col__nav">
            <h4 className="title mb-4">More jobs coming soon</h4>
            <ul className="m-0">
              <li>
                <NavLink
                  to={Routes.Workspace.Labeling.path}
                  disabled={!isLabelingEnabled}
                  tooltip={
                    isLabelingEnabled
                      ? ''
                      : 'To access jobs fill the wallet address and pass the verification'
                  }
                >
                  Data Labeling Jobs
                </NavLink>
              </li>
              <li>
                <NavLink to={Routes.Workspace.Questionnaire.path} disabled={isQuestionnaireFilled}>
                  Questionnaire
                </NavLink>
              </li>
              <li>
                <NavLink to={Routes.Workspace.Profile.path}>Profile</NavLink>
              </li>
              {isAdmin && (
                <li>
                  <NavLink to={Routes.Workspace.AdminPanel.path}>Admin Panel</NavLink>
                </li>
              )}
              <li>
                <NavLink to={Routes.Workspace.Withdrawals.path}>Your Withdrawals</NavLink>
              </li>
            </ul>
          </div>
          <div className="col-md-6 section-content col-sm-12 job__col__main">
            <div className="workspace-item">
              <SetupWithdrawalsRemovalAlert />
            </div>
            {!isWalletFilled && (
              <div className="workspace-item">
                <SetupWalletAlert />
              </div>
            )}
            <Switch>
              <Route path={Routes.Workspace.Labeling.path}>
                <div className="workspace-item">
                  <Labeling
                    authToken={token}
                    hcaptchaSiteKey={user?.hcaptchaSiteKey}
                    userId={user?.id}
                    isKYCed={user?.isKYCed}
                  />
                </div>
              </Route>
              <Route path={Routes.Workspace.Questionnaire.path}>
                <div className="workspace-item">
                  <Questionnaire
                    userId={user?.id}
                    authToken={token}
                    onSubmit={onSubmitQuestionnaire}
                  />
                </div>
              </Route>
              <Route path={Routes.Workspace.Profile.path}>
                <div className="workspace-item">
                  <Profile />
                </div>
              </Route>
              <Route path={Routes.Workspace.AdminPanel.path}>
                <div className="workspace-item">
                  <AdminPanel isUserAdmin={isAdmin} authToken={token} />
                </div>
              </Route>
              <Route path={Routes.Workspace.Withdrawals.path}>
                <div className="workspace-item">
                  <Withdrawals withdrawals={withdrawals} authToken={token} />
                </div>
              </Route>
              <Redirect from="*" to={defaultRoute} />
            </Switch>
          </div>
          <div className="col-md-3 section-details text-left d-flex flex-column justify-content-between col-sm-12 stats__container job__col__stats">
            <div className="mb-5">
              <UserStats
                tryShowWithdrawModal={tryShowWithdrawModal}
                earnedTokens={user?.earnedTokens}
                availableTokens={user?.availableTokens}
                pendingTokens={user?.pendingTokens}
                isQuestionnaireFilled={isQuestionnaireFilled}
                isKYCed={user?.isKYCed}
                balance={balance}
              />
            </div>
            {showWithdraw && (
              <Withdraw
                user={user}
                show={showWithdraw}
                toggle={setShowWithdraw}
                onSubmitWithdrawal={updateUserAndWithdrawals}
                authToken={token}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkSpace;
