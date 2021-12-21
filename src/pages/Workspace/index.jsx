import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Switch, Route, useHistory, useLocation, Redirect } from 'react-router-dom';
import { Button } from 'react-bootstrap';
import NavLink from './nav-link';
import { setUserDetails, startGlobalLoading, finishGlobalLoading } from '../../store/action';
import { Routes } from '../../routes';
import { SetupWalletAlert } from '../../components/alert/wallet';
import { DisabledWithdrawAlert } from '../../components/alert/withdraw';
import { Withdraw } from '../../components/withdraw';
import Profile from '../Profile';
import UserStats from './user-stats';
import ReferralCode from './referral-code';
import Questionnaire from './questionnaire';
import AdminPanel from './admin-panel';
import Withdrawals from './withdrawals';
import { getWithdrawals } from '../../service/withdraw.service';
import { verifyKyc, getMyAccount } from '../../service/user.service';
import notifier from '../../service/notify.service';

import './index.scss';

function getPendingWithdrawals(withdrawals = []) {
  return withdrawals.map((withdraw) => withdraw.status === 'pending');
}
const WorkSpace = () => {
  const history = useHistory();
  const location = useLocation();
  const dispatch = useDispatch();
  const { user = {}, isAuthed, token } = useSelector((state) => state.auth);
  const availableTokens = user ? user.availableTokens || 0 : 0;
  const isAdmin = user?.role === 'admin';

  if (!isAuthed) {
    history.push({ pathname: Routes.Home.path });
  }
  const [withdrawals, setWithdrawals] = useState([]);
  const [showWithdraw, setShowWithdraw] = useState(false);
  const isQuestionnaireFilled = Boolean(user?.misc && user.misc.questionnaire.length > 0);
  const isWalletFilled = Boolean(user?.polygonWalletAddr);
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
      notifier.warning('Your previous withdrawal request has not been processed yet.');
    } else {
      setShowWithdraw(true);
    }
  };

  useEffect(() => {
    if (!user || Object.entries(user).length === 0) {
      return null;
    }
    dispatch(startGlobalLoading());
    getWithdrawals(token)
      .then((result) => setWithdrawals(result))
      .catch((err) => notifier.error(err.message))
      .finally(() => dispatch(finishGlobalLoading()));
  }, []);

  const onPassedKyc = (kycToken) => {
    dispatch(startGlobalLoading());
    verifyKyc(kycToken, token)
      .then((response) => {
        if (response.isKYCed) {
          notifier.success('Your identity successfuly verified');
          getMyAccount(user.id, token).then((updatedUser) => dispatch(setUserDetails(updatedUser)));
        }
      })
      .catch((err) => {
        if (err.message) {
          notifier.error(err.message);
        } else {
          notifier.error(
            'Failed to verify your identity. Please, try again or contact the support app@humanprotocol.org',
          );
        }
      })
      .finally(() => dispatch(finishGlobalLoading()));
  };

  const onVerificationError = () => {
    notifier.error('Something went wrong during your verification. Please, try again');
  };

  return (
    <div id="workspace">
      <div className="blur-bg" />
      <div className="container job__container">
        <div className="row">
          <div className="col-md-3 section-option text-right col-sm-12 job__col__nav">
            <h4 className="title mb-4">More jobs coming soon</h4>
            <ul className="m-0">
              <li>
                <NavLink to={Routes.Workspace.Questionnaire.path} disabled={isQuestionnaireFilled}>
                  Questionnaire
                </NavLink>
              </li>
              <li>
                <NavLink to={Routes.Workspace.Profile.path}>Profile</NavLink>
              </li>
              <li>
                <NavLink to={Routes.Workspace.Referral.path}>Referral</NavLink>
              </li>
              {isAdmin && (
                <li>
                  <NavLink to={Routes.Workspace.AdminPanel.path}>Admin Panel</NavLink>
                </li>
              )}
              <li>
                <NavLink to={Routes.Workspace.Withdrawals.path}>Your withdrawals</NavLink>
              </li>
            </ul>
          </div>
          <div className="col-md-6 section-content col-sm-12 job__col__main">
            {!isWalletFilled && (
              <div className="workspace-item">
                <SetupWalletAlert />
              </div>
            )}
            <div className="workspace-item">
              <DisabledWithdrawAlert />
            </div>
            <Switch>
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
              <Route path={Routes.Workspace.Referral.path}>
                <div className="workspace-item">
                  <ReferralCode referralCode={user?.referralCode} />
                </div>
              </Route>
              <Route path={Routes.Workspace.AdminPanel.path}>
                <div className="workspace-item">
                  <AdminPanel isUserAdmin={isAdmin} authToken={token} />
                </div>
              </Route>
              <Route path={Routes.Workspace.Withdrawals.path}>
                <div className="workspace-item">
                  <Withdrawals withdrawals={withdrawals} />
                </div>
              </Route>
              <Redirect from="*" to={defaultRoute} />
            </Switch>
          </div>
          <div className="col-md-3 section-details text-left d-flex flex-column justify-content-between col-sm-12 stats__container job__col__stats">
            <div className="mb-5">
              <UserStats
                earnedTokens={user?.earnedTokens}
                availableTokens={user?.availableTokens}
                pendingTokens={user?.pendingTokens}
                referredUsersAmount={user?.referredUsers?.length}
                isQuestionnaireFilled={isQuestionnaireFilled}
                isKYCed={user?.isKYCed}
                onPassedKyc={onPassedKyc}
                onVerificationError={onVerificationError}
              />
              <p>
                <Button
                  className="form-control bg-blue btn btn-primary"
                  onClick={tryShowWithdrawModal}
                  disabled
                >
                  Withdraw
                </Button>
              </p>
            </div>
            {showWithdraw && <Withdraw user={user} show={showWithdraw} toggle={setShowWithdraw} />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkSpace;
