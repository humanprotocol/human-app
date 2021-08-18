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
} from "react-bootstrap";
import { URLInput } from "../../components/inputs/url";
import { JobOptions } from "../../constants";
import HCaptcha from "@hcaptcha/react-hcaptcha";
import { Routes } from "../../routes";
import Profile from '../Profile/profile';
import './job.scss';

const Job = (props) => {
  const { history } = props;
  const dispatch = useDispatch();
  const { user, isAuthed, token, refreshToken} = useSelector((state) => state.auth);

  if(!isAuthed) {
    history.push({ pathname: Routes.Home.path });
  }
  const captchaToken = useSelector((state) => state.hmt.captchaToken);
  const [option, setOptions] = useState(JobOptions.referral);
  const [referralCode, setReferralCode] = useState(user ? user.referralCode || '' : '');
  // const [captchaCnt, setCaptchaCnt] = useState(0);
  // const [referralCnt, setReferralCnt] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [nextable, setNextable] = useState(false);
  const [errorText, setErrorText] = useState("");
  const [radios, setRadios] = useState([
    { checked: false, value: "opt_1", label: "Option 1", name: "question_4" },
    { checked: false, value: "opt_2", label: "Option 2", name: "question_4" },
    { checked: false, value: "opt_3", label: "Option 3", name: "question_4" },
  ]);
  const [optItems, setOptItems] = useState([
    { value: "Option 1", checked: false },
    { value: "Option 2", checked: false },
    { value: "Option 3", checked: false },
  ]);
  const [questions, setQuestions] = useState({
    question_1: true
  });

  useEffect(() => {
    if(history.location.state && history.location.state.jobOption) {
      setOptions(history.location.state.jobOption);
    }
  }, [])

  const submitQuestions = (e) => {
    e.preventDefault();
    setSubmitted(true);
    if (
      questions.question_1 &&
      questions.question_2 &&
      questions.question_3 &&
      questions.question_4
    ) {
      history.push({ pathname: Routes.Profile.path });
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    switch (name) {
      case 'referral':
        setReferralCode(value);
        break;
      default:
        break;
    }
    if (name === "question_4") {
      const newRadios = radios.map((radio) => {
        if (radio.value === value) {
          radio.checked = true;
          setQuestions((questions) => ({ ...questions, [name]: radio.label }));
        }
        return radio;
      });
      setRadios(newRadios);
    } else {
      setQuestions((questions) => ({ ...questions, [name]: value }));
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

  const handleQuestions = (e) => {
    e.preventDefault();
    console.log({ name: e.target.name, value: e.target.value });
  }

  const handleNext = () => {
    if (captchaToken && captchaToken.length > 0) {
      setErrorText("");
      setNextable(true);
    } else {
      setErrorText("You need to pass captCha.");
      setNextable(false);
    }
  };

  return (
    <div id="job" className="text-center">
      <div className='blur-bg'></div>
      <div className="container w-100 mw-100">
        <div className="row">
          <div className="col-md-3 section-option text-right col-sm-12">
            <h4 className="title mb-4">Job list</h4>
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
                <a
                  className={`opt ${
                    option && option === JobOptions.referral ? "active" : ""
                  }`}
                  onClick={() => setOptions(JobOptions.referral)}
                >
                  Referral
                </a>
              </li>
              <li className="">
                <a
                  className={`opt ${
                    option && option === JobOptions.questionare ? "active" : ""
                  }`}
                  onClick={() => setOptions(JobOptions.questionare)}
                >
                  Questionare
                </a>
              </li>
              <li className="">
                <a
                  className={`opt ${
                    option && option === JobOptions.profile ? "active" : ""
                  }`}
                  onClick={() => setOptions(JobOptions.profile)}
                >
                  profile
                </a>
              </li>
            </ul>
          </div>
          <div className="col-md-6 section-content col-sm-12">
            {option && option === JobOptions.captcha && (
              <div id='hcaptcha'>
                <p className='d-md-block'>For every hCaptcha puzzle you solve, you will earn around 0.01 - 0.1 HMT.</p>
                <HCaptcha
                  sitekey="64fd34e8-c20f-4312-ab15-9b28a2ff3343"
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
                <p className='d-md-block'>For every friend you refer who successfully signs up, you will receive 1 HMT.</p>
                <p className='d-md-block'>Copy the cody below & ask your friend to use it while Signing up!</p>
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
                //     submitted && !questions.referral ? "d-block text-left" : ""
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
                  <p>What tasks would you prefer to do on the HUMAN App?</p>
                  <Form name="form">
                    <FormGroup>
                      <Form.Check type="checkbox" label="Solve captchas" />
                      <Form.Check type="checkbox" label="Provide feedback on A/B tests." />
                      <Form.Check type="checkbox" label="Code review and Bug bounties." />
                      <Form.Check type="checkbox" label="Market research surveys." />
                      <Form.Check type="checkbox" label="Data labelling on video and/or text." />
                      <Form.Check type="checkbox" label="Partake in predictions markets." />
                    </FormGroup>
                    <FormGroup className='other-question'>
                        <FormControl className='m-0'></FormControl>
                    </FormGroup>
                  </Form>
                </div>
                <FormGroup>
                  <Button className='form-control'>Next</Button>
                </FormGroup>
              </div>
            )}
            {option && option === JobOptions.profile && 
            <Profile />
            }
          </div>
          <div className="col-md-3 section-details text-left d-flex flex-column justify-content-between col-sm-12 stats__container">
            <div className="mb-5">
              <p class="stats stats__main">{user.earnedTokens} <span>HMT earned</span></p>
              <p class="stats stats__secondary"><span>HMT Pending transfer: </span> {user.pendingTokens}</p>
              <p class="stats stats__secondary"><span>Successful Referrals: </span>{user.referredUsers.length} </p>
              <p class="stats stats__secondary"><span>Questionnaire: </span> {user.misc.questionnaire? `Completed` : `Incomplete`}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default withRouter(Job);