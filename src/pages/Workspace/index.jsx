import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Switch, Route, useHistory, useLocation, Redirect } from 'react-router-dom';
import NavLink from './nav-link';
import { setUserDetails } from '../../store/action';
import { Routes } from '../../routes';
import { SetupIdentityVerificationIssueAlert, SetupWalletAlert } from './alerts';
import { useContractAbi } from '../../hooks/useContractAbi';
import Profile from '../Profile';
import UserStats from './user-stats';
import Questionnaire from './questionnaire';
import AdminPanel from './admin-panel';
import Labeling from './labeling';
import notifier from '../../service/notify.service';

import './index.scss';

const WorkSpace = () => {
  const history = useHistory();
  const location = useLocation();
  const dispatch = useDispatch();
  const { user = {}, isAuthed, token } = useSelector((state) => state.auth);
  const polygonWalletAddr = user?.polygonWalletAddr || 0;
  const isAdmin = user?.role === 'admin';

  if (!isAuthed) {
    history.push({ pathname: Routes.Home.path });
  }

  const { balance } = useContractAbi({ walletAddr: polygonWalletAddr });
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
            </ul>
          </div>
          <div className="col-md-6 section-content col-sm-12 job__col__main">
            {!user?.isKYCed && (
              <div className="workspace-item">
                <SetupIdentityVerificationIssueAlert />
              </div>
            )}
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
              <Redirect from="*" to={defaultRoute} />
            </Switch>
          </div>
          <div className="col-md-3 section-details text-left d-flex flex-column justify-content-between col-sm-12 stats__container job__col__stats">
            <div className="mb-5">
              <UserStats
                isQuestionnaireFilled={isQuestionnaireFilled}
                isKYCed={user?.isKYCed}
                balance={balance}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkSpace;
