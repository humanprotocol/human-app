/* eslint-disable jsx-a11y/anchor-is-valid */
import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
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

export const Job = (props) => {
  const dispatch = useDispatch();
  const { history } = props;
  const captchaToken = useSelector((state) => state.hmt.captchaToken);
  const [option, setOptions] = useState(JobOptions.captcha);
  const [captchaCnt, setCaptchaCnt] = useState(0);
  const [referalCnt, setReferalCnt] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [nextable, setNextable] = useState(false);
  const [errorText, setErrorText] = useState("");
  const hmtCounts = useSelector((state) => state.hmt.htmCounts);
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
    setSubmitted(true);
  };

  const handleRefresh = () => {
    setSubmitted(false);
    setQuestions({ ...questions, referal: "" });
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
              <li className="">
                <a
                  className={`opt ${
                    option && option === JobOptions.captcha ? "active" : ""
                  }`}
                  onClick={() => setOptions(JobOptions.captcha)}
                >
                  Data labeling
                </a>
              </li>
              <li className="">
                <a
                  className={`opt ${
                    option && option === JobOptions.referal ? "active" : ""
                  }`}
                  onClick={() => setOptions(JobOptions.referal)}
                >
                  Referal
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
            </ul>
          </div>
          <div className="col-md-6 section-content col-sm-12">
            {option && option === JobOptions.captcha && (
              <div id='hcaptcha'>
                <p>For every hCaptcha puzzle you solve, you will earn around 0.01 - 0.1 HMT.</p>
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
            {option && option === JobOptions.referal && (
              <div id="referal" className="text-center col-md-8 offset-md-2">
                <p>For every friend you refer who successfully signs up, you will receive 1 HMT.</p>
                <URLInput
                  className="text-center mb-3 referal-link"
                  reset={handleRefresh}
                  onChange={handleChange}
                  name="referal"
                  value={questions.referal}
                />
                <FormControl.Feedback
                  type="invalid"
                  className={
                    submitted && !questions.referal ? "d-block text-left" : ""
                  }
                >
                  Referal link required
                </FormControl.Feedback>
                <Button
                  className="mt-4 bg-blue w-100 form-control"
                  onClick={handleRefer}
                >
                  Refer Now <i className="material-icons text-white">share</i>
                </Button>
              </div>
            )}
            {option && option === JobOptions.questionare && (
              <div
                id="questions"
                className="m-auto text-left col-md-8 offset-md-2"
              >
                <p>Complete the questionnaire to receive 1 HMT.</p>
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
          </div>
          <div className="col-md-3 section-details text-left d-flex flex-column justify-content-between col-sm-12">
            <div className="mb-5">
              <p>X HMT</p>
              <p>Captchas solved : XXXX</p>
              <p>Referrals sent : XXXX </p>
              <p>Questionnaire : solved/unsolved</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
