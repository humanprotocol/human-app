/* eslint-disable jsx-a11y/anchor-is-valid */
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { withRouter } from "react-router";
import {
  FormGroup,
  FormControl,
  Button,
  FormLabel,
  Dropdown,
  Form,
  Alert
} from "react-bootstrap";
import { URLInput } from "../../components/inputs/url";
import { JobOptions, ReferOptions, TaskOptions, Questions } from "../../constants";
import HCaptcha from "@hcaptcha/react-hcaptcha";
import { Routes } from "../../routes";
import Profile from '../Profile/profile';
import './job.scss';
import { updateMisc } from "../../service/user.service";

const Job = (props) => {
  const { history } = props;
  const dispatch = useDispatch();
  const { user, isAuthed, token, refreshToken} = useSelector((state) => state.auth);

  if(!isAuthed) {
    history.push({ pathname: Routes.Home.path });
  }
  const captchaToken = useSelector((state) => state.hmt.captchaToken);
  const [option, setOptions] = useState(JobOptions.questionare);
  const [referralCode, setReferralCode] = useState(user ? user.referralCode || '' : '');
  // const [captchaCnt, setCaptchaCnt] = useState(0);
  // const [referralCnt, setReferralCnt] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [nextable, setNextable] = useState(false);
  const [errorText, setErrorText] = useState("");
  const [currentQuestion, setCurrentQuestion] = useState('task');
  // const hmtCounts = useSelector((state) => state.hmt.htmCounts);
  const [taskOptions, setTaskOptions] = useState([]);
  const [referOptions, setReferOptions] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [refers, setRefers] = useState('');
  const [ otherQuestion, setOtherQuestion ] = useState('');
  const [questions, setQuestions] = useState({
    question_1: true
  });

  useEffect(() => {
    if(history.location.state && history.location.state.jobOption) {
      setOptions(history.location.state.jobOption);
    }

    if(user && user.misc && user.misc.questionnaire) {
      setOptions(JobOptions.profile);
    }

    let taskOptions = TaskOptions.map((taskOpt) => ({ checked: false, ...taskOpt }));
    setTaskOptions(taskOptions);

    let referOptions = ReferOptions.map((refereOpt) => ({ checked: false, ...refereOpt }));
    setReferOptions(referOptions);
  }, [])

  const submitQuestions = (e) => {
    e.preventDefault();
    if(!refers) 
      return setErrorText('Answer required');
    else {
      const questions = [
        {
          q: Questions.task,
          a: tasks
        },
        {
          q: Questions.refer,
          a: refers
        }
      ];
      return updateMisc(user.id, token, questions)
        .then((response) => {
          if(response) {
            dispatch({ type: 'SET_USER', payload: response });
            setErrorText('');
            setOptions(JobOptions.profile);
          } else {
            setErrorText('Failed to submit questions');
          }
        }).catch((err) => setErrorText(err.message));
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    switch (name) {
      case 'referral':
        setReferralCode(value);
        break;
      case 'otherQuestion':
        setOtherQuestion(value);
        if(currentQuestion === 'refer') {
          let newReferOpts = referOptions.map((Opt) => {
            Opt.checked = false;
            return Opt;
          });
          setReferOptions(newReferOpts);
          setRefers(value);
        }
        break;
      case 'task':
        const newTaskOpts = taskOptions.map((taskOpt) => {
          if(taskOpt.value === value) taskOpt.checked = true;
          return taskOpt;
        })
        setTaskOptions(newTaskOpts);
        break;
      case 'refer':
        let newReferOpts = referOptions.map((Opt) => {
          if(Opt.value === value) Opt.checked = true;
          else Opt.checked = false;
          return Opt;
        });
        setReferOptions(newReferOpts);
        setRefers(value);
        break;
      default:
        break;
    }
  };

  const handleRefer = (e) => {
    e.preventDefault();
    // setSubmitted(true);
    navigator.clipboard.writeText(referralCode);
    alert(`Copied code: ${referralCode}.`);
  };

  const handleRefresh = () => {
    setSubmitted(false);
    setReferralCode(user ? user.referralCode || '' : '');
  };

  const handleVerificationSuccess = (token, eKey) => {
    dispatch({
      type: "SET_CAPTCHA_TOKEN",
      payload: token,
    });
  };

  const handleNext = (e) => {
    e.preventDefault();
    switch (option) {
      case JobOptions.questionare:
        const tasks = otherQuestion ? [otherQuestion] : [];
        taskOptions.map((taskOption) => {
          if(taskOption.checked) tasks.push(taskOption.value);
        });
        if(tasks.length) {
          setErrorText('');
          setOtherQuestion('');
          setTasks(tasks);
          setCurrentQuestion('refer');
        } else {
          setErrorText('Answer required')
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
      <div className='blur-bg'></div>
      <div className="container job__container">
        <div className="row">
          <div className="col-md-3 section-option text-right col-sm-12 job__col__nav">
            <h4 className="title mb-4">More jobs coming soon</h4>
            <ul className="m-0">
              {/* <li className="">
                <a
                  className={`opt ${
                    option && option === JobOptions.captcha ? "active" : ""
                  }`}
                  onClick={() => setOptions(JobOptions.captcha)}
                >
                  Data labeling
                </a>
              </li> */}
              <li className="">
                { user && user.misc && user.misc.questionnaire ?
                <a className='opt disabled'>Questionnaire</a> :
                <a className={`opt ${ option && option === JobOptions.questionare ? "active" : "" }`} onClick={() => setOptions(JobOptions.questionare)}>Questionnaire</a>
                }
              </li>
              <li className="">
                <a className={`opt ${ option && option === JobOptions.profile ? "active" : "" }`} onClick={() => setOptions(JobOptions.profile)}>Profile</a>
              </li>
              <li className="">
                <a className={`opt ${ option && option === JobOptions.referral ? "active" : "" }`} onClick={() => setOptions(JobOptions.referral)}>Referral</a>
              </li>
            </ul>
          </div>
          <div className="col-md-6 section-content col-sm-12 job__col__main">
            { user && !user.walletAddr &&
            <Alert variant="primary">
              <p>Please setup your wallet address in the Profile page. We’ll need this to send you HMT!</p>
            </Alert>
            }
            { user && user.walletAddr && !user.isKYCed &&
            <Alert variant="primary">
              <p>Pending KYC. Note: You won't be able to receive HMT until our KYC-verification are completed.</p>
            </Alert>
            }
            {option && option === JobOptions.captcha && (
              <div id='hcaptcha'>
                <p className='d-md-block'>For every hCaptcha puzzle you solve, you will earn around 0.01 - 0.1 HMT.</p>
                <HCaptcha
                  sitekey={process.env.REACT_APP_HCAPTCHA_SITE_KEY}
                  onVerify={(token, ekey) =>
                    handleVerificationSuccess(token, ekey)
                  }
                />
                {!nextable && errorText.length > 0 && (
                  <p className="dangerText">{errorText}</p>
                )}
                <FormGroup>
                  <Button className='btn-custom mt-5' onClick={handleNext}>Next</Button>
                </FormGroup>
              </div>
            )}
            {option && option === JobOptions.referral && (
              <div id="referral" className="text-center col-md-8 offset-md-2">
                <p className='d-md-block'>If you refer a friend you will receive 1 HMT. Note, you will receive the HMT only if your referral successfully signs up with their email and wallet address.</p>
                <p className='d-md-block'>Copy the code below & ask your friend to use it while Signing up!</p>
                <URLInput
                  className="text-center mb-3 referral-link"
                  reset={handleRefresh}
                  onChange={handleChange}
                  name="referral"
                  value={referralCode}
                />
                { // <FormControl.Feedback
                //   type="invalid"
                //   className={
                //     submitted && !referralCode ? "d-block text-left" : ""
                //   }
                // >
                //   Referral link required
                // </FormControl.Feedback>
                }
                <Button
                  className="mt-4 bg-blue w-100 form-control"
                  onClick={handleRefer}
                >
                  Copy Referral Code<i className="material-icons text-white">share</i>
                </Button>
              </div>
            )}
            {option && option === JobOptions.questionare && (
              <div
                id="questions"
                className="m-auto text-left col-md-8 offset-md-2"
              >
                <p className='d-md-block'>Complete the questionnaire to receive 1 HMT.</p>
                <div className='question-list'>
                  <p>{Questions[currentQuestion]}</p>
                  { errorText && 
                  <Alert variant="danger" onClose={() => setErrorText('')} dismissible>
                    <p>{errorText}</p>
                  </Alert>
                  }
                  { currentQuestion === 'task' &&
                  <Form name="form">
                    <FormGroup>
                      { taskOptions && taskOptions.length && taskOptions.map((taskOpt, index) => 
                        <Form.Check name='task' key={index} type="checkbox" label={taskOpt.label} checked={taskOpt.checked} value={taskOpt.value} onChange={handleChange}/>
                      )}
                    </FormGroup>
                    <FormGroup className='other-question'>
                        <FormControl className='m-0' name='otherQuestion' value={otherQuestion} type='text' onChange={handleChange} />
                    </FormGroup>
                  </Form>
                  }
                  { currentQuestion === 'refer' &&
                  <Form name="form">
                    <FormGroup>
                      { referOptions && referOptions.length && referOptions.map((referOpt, index) => 
                        <Form.Check name='refer' key={index} type="radio" label={referOpt.label} checked={referOpt.checked} value={referOpt.value} onChange={handleChange}/>
                      )}
                    </FormGroup>
                    <FormGroup className='other-question'>
                        <FormControl className='m-0' name='otherQuestion' value={otherQuestion} type='text' onChange={handleChange} placeholder='Something else'/>
                    </FormGroup>
                  </Form>
                  }
                </div>
                { currentQuestion === 'task' &&
                <FormGroup>
                  <Button className='form-control' onClick={handleNext}>Next</Button>
                </FormGroup>
                }
                { currentQuestion === 'refer' &&
                <FormGroup>
                  <Button className='form-control' onClick={submitQuestions}>Submit</Button>
                  <Button className='form-control bg-white' onClick={() => { setOtherQuestion(''); setCurrentQuestion('task');}}>Back</Button>
                </FormGroup>
                }
              </div>
            )}
            {option && option === JobOptions.profile && 
            <Profile />
            }
          </div>
          <div className="col-md-3 section-details text-left d-flex flex-column justify-content-between col-sm-12 stats__container job__col__stats">
            <div className="mb-5">
              <p className="stats stats__secondary"><span>Total HMT earned: </span>{user? user.earnedTokens : 0} </p>
              <p className="stats stats__secondary"><span>HMT Pending withdrawal: </span> {user? user.pendingTokens : 0}</p>
              <p className="stats stats__secondary"><span>Successful Referrals: </span>{user? user.referredUsers.length : 0} </p>
              <p className="stats stats__secondary"><span>Questionnaire: </span> {user && user.misc.questionnaire? `Completed` : `Incomplete`}</p>
              <Button className='bg-white stats__withdraw' onClick={() => alert("Cannot withdraw until KYC Process is complete")}>Withdraw</Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default withRouter(Job);