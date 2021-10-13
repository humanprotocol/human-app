import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { withRouter } from 'react-router';
import PropTypes from 'prop-types';
import { FormGroup, FormControl, Button, Form, Alert } from 'react-bootstrap';
import HCaptcha from '@hcaptcha/react-hcaptcha';
import { PopupButton } from '@typeform/embed-react';
import { URLInput } from '../../components/inputs/url';
import { Withdraw } from '../../components/withdraw/withdraw';
import { JobOptions, ReferOptions, TaskOptions, Questions } from '../../utils/constants';
import { Routes } from '../../routes';
import Profile from '../Profile/profile';
import './job.scss';
import { updateMisc } from '../../service/user.service';

const typeFormStyles = {
  all: 'unset',
  'font-family': 'Helvetica,Arial,sans-serif',
  display: 'inline-block',
  'max-width': '100%',
  'white-space': 'nowrap',
  overflow: 'hidden',
  'text-overflow': 'ellipsis',
  'background-color': '#0445AF',
  color: '#FFFFFF',
  'font-size': '20px',
  'border-radius': '25px',
  padding: '0 33px',
  'font-weight': 'bold',
  height: '50px',
  cursor: 'pointer',
  'line-height': '50px',
  'text-align': 'center',
  margin: '0',
  'text-decoration': 'none',
};
const Job = (props) => {
  const { history } = props;
  const dispatch = useDispatch();
  const { user, isAuthed, token } = useSelector((state) => state.auth);

  if (!isAuthed) {
    history.push({ pathname: Routes.Home.path });
  }
  const [option, setOptions] = useState(JobOptions.questionare);
  const [referralCode, setReferralCode] = useState(user ? user.referralCode || '' : '');
  const [errorText, setErrorText] = useState('');
  const [currentQuestion, setCurrentQuestion] = useState('task');
  const [taskOptions, setTaskOptions] = useState([]);
  const [referOptions, setReferOptions] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [refers, setRefers] = useState('');
  const [otherQuestion, setOtherQuestion] = useState('');
  const [showWithdraw, setShowWithdraw] = useState(false);

  useEffect(() => {
    if (history.location.state && history.location.state.jobOption) {
      setOptions(history.location.state.jobOption);
    }

    if (user && user.misc && user.misc.questionnaire) {
      setOptions(JobOptions.profile);
    }

    const taskOpts = TaskOptions.map((taskOpt) => ({ checked: false, ...taskOpt }));
    setTaskOptions(taskOpts);

    const referOpts = ReferOptions.map((refereOpt) => ({ checked: false, ...refereOpt }));
    setReferOptions(referOpts);
  }, [history.location.state, user]);

  const submitQuestions = (e) => {
    e.preventDefault();
    if (!refers) {
      return setErrorText('Answer required');
    }

    const questions = [
      {
        q: Questions.task,
        a: tasks,
      },
      {
        q: Questions.refer,
        a: refers,
      },
    ];
    return updateMisc(user.id, token, questions)
      .then((response) => {
        if (response) {
          dispatch({ type: 'SET_USER', payload: response });
          setErrorText('');
          setOptions(JobOptions.profile);
        } else {
          setErrorText('Failed to submit questions');
        }
      })
      .catch((err) => setErrorText(err.message));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    switch (name) {
      case 'referral':
        setReferralCode(value);
        break;
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
      case JobOptions.questionare:
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
    // if (captchaToken && captchaToken.length > 0) {
    //   setErrorText("");
    //   setNextable(true);
    // } else {
    //   setErrorText("You need to pass captCha.");
    //   setNextable(false);
    // }
  };

  return (
    <div id="job" className="text-center">
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
                    className={`opt ${option && option === JobOptions.questionare ? 'active' : ''}`}
                    onClick={() => setOptions(JobOptions.questionare)}
                  >
                    Questionnaire
                  </span>
                )}
              </li>
              <li className="">
                <span
                  className={`opt ${option && option === JobOptions.profile ? 'active' : ''}`}
                  onClick={() => setOptions(JobOptions.profile)}
                >
                  Profile
                </span>
              </li>
              <li className="">
                <span
                  className={`opt ${option && option === JobOptions.referral ? 'active' : ''}`}
                  onClick={() => setOptions(JobOptions.referral)}
                >
                  Referral
                </span>
              </li>
            </ul>
          </div>
          <div className="col-md-6 section-content col-sm-12 job__col__main">
            {user && !user.walletAddr && (
              <Alert variant="primary">
                <p>
                  Please setup your wallet address in the Profile page. We’ll need this to send you
                  HMT!
                </p>
              </Alert>
            )}
            {user && user.walletAddr && !user.isKYCed && (
              <>
                <Alert variant="primary">
                  <p className="text-left">
                    Please ensure that the withdrawal wallet belongs to an ERC20 deposit address on
                    one of the following exchanges: Gate.io, FTX, BitFinex, Coinlist Pro & Bitmart
                  </p>
                </Alert>
              </>
            )}
            {option && option === JobOptions.captcha && (
              <div id="hcaptcha">
                <p className="d-md-block">
                  For every hCaptcha puzzle you solve, you will earn around 0.01 - 0.1 HMT.
                </p>
                <HCaptcha
                  sitekey={process.env.REACT_APP_HCAPTCHA_SITE_KEY}
                  onVerify={(captchToken) => handleVerificationSuccess(captchToken)}
                />
                {/* {!nextable && errorText.length > 0 && <p className="dangerText">{errorText}</p>} */}
                <FormGroup>
                  <Button className="btn-custom mt-5" onClick={handleNext}>
                    Next
                  </Button>
                </FormGroup>
              </div>
            )}
            {option && option === JobOptions.referral && (
              <div id="referral" className="text-center col-md-8 offset-md-2">
                <p className="d-md-block">
                  If you refer a friend you will receive 1 HMT. Note, you will receive the HMT only
                  if your referral successfully signs up with their email and wallet address.
                </p>
                <p className="d-md-block">
                  Copy the code below & ask your friend to use it while Signing up!
                </p>
                <URLInput
                  className="text-center mb-3 referral-link"
                  onChange={handleChange}
                  name="referral"
                  value={referralCode}
                />
                {
                  // <FormControl.Feedback
                  //   type="invalid"
                  //   className={
                  //     submitted && !referralCode ? "d-block text-left" : ""
                  //   }
                  // >
                  //   Referral link required
                  // </FormControl.Feedback>
                }
                <Button className="mt-4 bg-blue w-100 form-control">
                  Copy Referral Code
                  <i className="material-icons text-white">share</i>
                </Button>
              </div>
            )}
            {option && option === JobOptions.questionare && (
              <div id="questions" className="m-auto text-left col-md-8 offset-md-2">
                <p className="d-md-block">Complete the questionnaire to receive 1 HMT.</p>
                <div className="question-list">
                  <p>{Questions[currentQuestion]}</p>
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
            {option && option === JobOptions.profile && <Profile />}
          </div>
          <div className="col-md-3 section-details text-left d-flex flex-column justify-content-between col-sm-12 stats__container job__col__stats">
            <div className="mb-5">
              <p className="stats stats__secondary">
                <span>Total HMT earned: </span>
                {user ? user.earnedTokens : 0}
              </p>
              <p className="stats stats__secondary">
                <span>Available HMT to withdraw: </span>
                {user ? user.availableTokens : 0}
              </p>
              <p className="stats stats__secondary">
                <span>HMT Pending: </span>
                {user ? user.pendingTokens : 0}
              </p>
              <p className="stats stats__secondary">
                <span>Successful Referrals: </span>
                {user ? user.referredUsers.length : 0}
              </p>
              <p className="stats stats__secondary">
                {/* eslint-disable-next-line */}
                <span>Questionnaire: </span>{' '}
                {user && user.misc.questionnaire ? 'Completed' : 'Incomplete'}
              </p>
              { /* prettier-ignore */ }
              {!user?.isKYCed && (
                <PopupButton id="O5HysSYE" style={typeFormStyles}>
                  Withdraw
                </PopupButton>
              )}
              {user?.isKYCed && user?.earnedTokens > 0 && (
                <Button
                  className="bg-white stats__withdraw"
                  onClick={() => setShowWithdraw(true)}
                  disabled={user?.pendingTokens > 0}
                  style={typeFormStyles}
                >
                  Withdraw
                </Button>
              )}
            </div>
          </div>
          {showWithdraw && <Withdraw user={user} show={showWithdraw} toggle={setShowWithdraw} />}
        </div>
      </div>
    </div>
  );
};
Job.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
    location: PropTypes.shape({
      state: PropTypes.shape({
        jobOption: PropTypes.string,
      }).isRequired,
    }).isRequired,
  }).isRequired,
};

export default withRouter(Job);
