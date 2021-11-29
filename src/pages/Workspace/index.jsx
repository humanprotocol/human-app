import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { withRouter } from 'react-router';
import PropTypes from 'prop-types';
import { FormGroup, FormControl, Button, Form, Alert } from 'react-bootstrap';
import HCaptcha from '@hcaptcha/react-hcaptcha';
import { SetupWalletAlert } from '../../components/alert/wallet';
import { DisabledWithdrawAlert } from '../../components/alert/withdraw';
import { Withdraw } from '../../components/withdraw';
import { options, textMessages } from '../../constants';
import { Routes } from '../../routes';
import Profile from '../Profile';
import UserStats from './user-stats';
import ReferralCode from './referral-code';
import { updateMisc } from '../../service/user.service';
import { getWithdraws } from '../../service/withdraw.service';
import notifier from '../../service/notify.service';

import './index.scss';

const withdrawalStatus = {
  PENDING: 'pending',
  SUCCEDED: 'succeded',
};

const WorkSpace = (props) => {
  const { history } = props;
  const dispatch = useDispatch();
  const { user = {}, isAuthed, token } = useSelector((state) => state.auth);
  const availableTokens = user ? user.availableTokens || 0 : 0;

  if (!isAuthed) {
    history.push({ pathname: Routes.Home.path });
  }
  const [option, setOptions] = useState(options.jobOptions.questionare);
  const [errorText, setErrorText] = useState('');
  const [currentQuestion, setCurrentQuestion] = useState('task');
  const [taskOptions, setTaskOptions] = useState([]);
  const [referOptions, setReferOptions] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [refers, setRefers] = useState('');
  const [otherQuestion, setOtherQuestion] = useState('');
  const [pendingWithdrawals, setPendingWithdrawals] = useState([]);
  const [showWithdraw, setShowWithdraw] = useState(false);
  const isQuestionnaireFilled = Boolean(user?.misc && user.misc.questionnaire);
  const isWalletFilled = Boolean(user?.polygonWalletAddr);

  const tryShowWithdrawModal = () => {
    const userHasPendingWithdrawals = pendingWithdrawals.length > 0;
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
    getWithdraws(withdrawalStatus.PENDING, token)
      .then((result) => setPendingWithdrawals(result))
      .catch((err) => notifier.error(err.message));
  }, [user]);

  useEffect(() => {
    if (history.location.state && history.location.state.jobOption) {
      setOptions(history.location.state.jobOption);
    }

    if (user && user.misc && user.misc.questionnaire) {
      setOptions(options.jobOptions.profile);
    }

    const taskOpts = options.taskOptions.map((taskOpt) => ({ checked: false, ...taskOpt }));
    setTaskOptions(taskOpts);

    const referOpts = options.referOptions.map((refereOpt) => ({ checked: false, ...refereOpt }));
    setReferOptions(referOpts);
  }, [history.location.state, user]);

  const submitQuestions = (e) => {
    e.preventDefault();
    if (!refers) {
      return setErrorText('Answer required');
    }

    const questions = [
      {
        q: textMessages.questions.task,
        a: tasks,
      },
      {
        q: textMessages.questions.refer,
        a: refers,
      },
    ];
    return updateMisc(user.id, token, questions)
      .then((response) => {
        if (response) {
          dispatch({ type: 'SET_USER', payload: response });
          setErrorText('');
          setOptions(options.jobOptions.profile);
        } else {
          setErrorText('Failed to submit questions');
        }
      })
      .catch((err) => setErrorText(err.message));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    switch (name) {
      case 'otherQuestion':
        setOtherQuestion(value);
        if (currentQuestion === 'refer') {
          const newReferOpts = referOptions.map((Opt) => {
            return { ...Opt, checked: false };
          });
          setReferOptions(newReferOpts);
          setRefers(value);
        }
        break;
      case 'task':
        const newTaskOpts = taskOptions.map((taskOpt) => {
          if (taskOpt.value === value) return { ...taskOpt, checked: true };
          return taskOpt;
        });
        setTaskOptions(newTaskOpts);
        break;
      case 'refer':
        const newReferOpts = referOptions.map((Opt) => {
          if (Opt.value === value) return { ...Opt, checked: true };
          return { ...Opt, checked: false };
        });
        setReferOptions(newReferOpts);
        setRefers(value);
        break;
      default:
        break;
    }
  };

  const handleVerificationSuccess = (verifiedCaptchaToken) => {
    dispatch({
      type: 'SET_CAPTCHA_TOKEN',
      payload: verifiedCaptchaToken,
    });
  };

  const handleNext = (e) => {
    e.preventDefault();
    switch (option) {
      case options.jobOptions.questionare:
        const taskItems = otherQuestion ? [otherQuestion] : [];
        taskOptions.map((taskOption) => {
          if (taskOption.checked) taskItems.push(taskOption.value);
          return null;
        });
        if (taskItems.length) {
          setErrorText('');
          setOtherQuestion('');
          setTasks(taskItems);
          setCurrentQuestion('refer');
        } else {
          setErrorText('Answer required');
        }
        break;
      default:
        break;
    }
  };

  return (
    <div id="job">
      <div className="blur-bg" />
      <div className="container job__container">
        <div className="row">
          <div className="col-md-3 section-option text-right col-sm-12 job__col__nav">
            <h4 className="title mb-4">More jobs coming soon</h4>
            <ul className="m-0">
              <li className="">
                {user && user.misc && user.misc.questionnaire ? (
                  <span className="opt disabled">Questionnaire</span>
                ) : (
                  <span
                    className={`opt ${
                      option && option === options.jobOptions.questionare ? 'active' : ''
                    }`}
                    onClick={() => setOptions(options.jobOptions.questionare)}
                  >
                    Questionnaire
                  </span>
                )}
              </li>
              <li className="">
                <span
                  className={`opt ${
                    option && option === options.jobOptions.profile ? 'active' : ''
                  }`}
                  onClick={() => setOptions(options.jobOptions.profile)}
                >
                  Profile
                </span>
              </li>
              <li className="">
                <span
                  className={`opt ${
                    option && option === options.jobOptions.referral ? 'active' : ''
                  }`}
                  onClick={() => setOptions(options.jobOptions.referral)}
                >
                  Referral
                </span>
              </li>
            </ul>
          </div>
          <div className="col-md-6 section-content col-sm-12 job__col__main">
            {!isWalletFilled && <SetupWalletAlert />}
            <DisabledWithdrawAlert />
            {option && option === options.jobOptions.captcha && (
              <div id="hcaptcha">
                <p className="d-md-block">
                  For every hCaptcha puzzle you solve, you will earn around 0.01 - 0.1 HMT.
                </p>
                <HCaptcha
                  sitekey={process.env.REACT_APP_HCAPTCHA_SITE_KEY}
                  onVerify={(captchToken) => handleVerificationSuccess(captchToken)}
                />
                <FormGroup>
                  <Button className="btn-custom mt-5" onClick={handleNext}>
                    Next
                  </Button>
                </FormGroup>
              </div>
            )}
            {option && option === options.jobOptions.referral && (
              <ReferralCode referralCode={user?.referralCode} />
            )}
            {option && option === options.jobOptions.questionare && (
              <div id="questions" className="m-auto text-left col-md-8 offset-md-2">
                <p className="d-md-block">Complete the questionnaire to receive 1 HMT.</p>
                <div className="question-list">
                  <p>{textMessages.questions[currentQuestion]}</p>
                  {errorText && (
                    <Alert variant="danger" onClose={() => setErrorText('')} dismissible>
                      <p>{errorText}</p>
                    </Alert>
                  )}
                  {currentQuestion === 'task' && (
                    <Form name="form">
                      <FormGroup>
                        {taskOptions &&
                          taskOptions.length &&
                          taskOptions.map((taskOpt) => (
                            <Form.Check
                              name="task"
                              type="checkbox"
                              key={taskOpt.value}
                              label={taskOpt.label}
                              checked={taskOpt.checked}
                              value={taskOpt.value}
                              onChange={handleChange}
                            />
                          ))}
                      </FormGroup>
                      <FormGroup className="other-question">
                        <FormControl
                          className="m-0"
                          name="otherQuestion"
                          value={otherQuestion}
                          type="text"
                          onChange={handleChange}
                        />
                      </FormGroup>
                    </Form>
                  )}
                  {currentQuestion === 'refer' && (
                    <Form name="form">
                      <FormGroup>
                        {referOptions &&
                          referOptions.length &&
                          referOptions.map((referOpt) => (
                            <Form.Check
                              name="refer"
                              type="radio"
                              key={referOpt.value}
                              label={referOpt.label}
                              checked={referOpt.checked}
                              value={referOpt.value}
                              onChange={handleChange}
                            />
                          ))}
                      </FormGroup>
                      <FormGroup className="other-question">
                        <FormControl
                          className="m-0"
                          name="otherQuestion"
                          value={otherQuestion}
                          type="text"
                          onChange={handleChange}
                          placeholder="Something else"
                        />
                      </FormGroup>
                    </Form>
                  )}
                </div>
                {currentQuestion === 'task' && (
                  <FormGroup>
                    <Button className="form-control" onClick={handleNext}>
                      Next
                    </Button>
                  </FormGroup>
                )}
                {currentQuestion === 'refer' && (
                  <FormGroup>
                    <Button className="form-control" onClick={submitQuestions}>
                      Submit
                    </Button>
                    <Button
                      className="form-control bg-white"
                      onClick={() => {
                        setOtherQuestion('');
                        setCurrentQuestion('task');
                      }}
                    >
                      Back
                    </Button>
                  </FormGroup>
                )}
              </div>
            )}
            {option && option === options.jobOptions.profile && <Profile />}
          </div>
          <div className="col-md-3 section-details text-left d-flex flex-column justify-content-between col-sm-12 stats__container job__col__stats">
            <div className="mb-5">
              <UserStats
                earnedTokens={user?.earnedTokens}
                availableTokens={user?.availableTokens}
                pendingTokens={user?.pendingTokens}
                referredUsersAmount={user?.referredUsers?.length}
                isQuestionnaireFilled={isQuestionnaireFilled}
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
WorkSpace.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
    location: PropTypes.shape({
      state: PropTypes.shape({
        jobOption: PropTypes.string,
      }),
    }),
  }),
};

WorkSpace.defaultProps = {
  history: { push: () => {}, location: { state: { jobOption: '' } } },
};

export default withRouter(WorkSpace);