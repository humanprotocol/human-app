/* eslint-disable jsx-a11y/anchor-is-valid */
import { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux';
import { FormGroup, FormControl, Button, FormLabel, Dropdown } from 'react-bootstrap';
import { URLInput } from '../../components/inputs/url';
import { JobOptions, PrimaryColor, SecondaryColor } from '../../constants';
import HCaptcha from '@hcaptcha/react-hcaptcha';
import { Routes } from '../../routes';
import { queries } from '@testing-library/react';

export const Job = (props) => {
  const dispatch = useDispatch();
  const { history } = props;
  const captchaToken = useSelector((state) => state.hmt.captchaToken);
  const [option, setOptions] = useState(JobOptions.captcha);
  const [captchaCnt, setCaptchaCnt] = useState(0);
  const [referalCnt, setReferalCnt] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const hmtCounts = useSelector((state) => state.hmt.htmCounts);
  const [radios, setRadios] = useState([
    { checked: false, value: 'opt_1', label: 'Option 1', name: 'question_4' },
    { checked: false, value: 'opt_2', label: 'Option 2', name: 'question_4' },
    { checked: false, value: 'opt_3', label: 'Option 3', name: 'question_4' },
  ])
  const [optItems, setOptItems] = useState([
    { value: 'Option 1', checked: false },
    { value: 'Option 2', checked: false },
    { value: 'Option 3', checked: false },
  ])
  const [ questions, setQuestions ] = useState({
    question_1: '',
    question_2: '',
    question_3: '',
    question_4: '',
    referal: '',
  });

  const submitQuestions = (e) => {
    e.preventDefault();
    setSubmitted(true);
    if(questions.question_1 && questions.question_2 && questions.question_3 && questions.question_4) {
      history.push({ pathname: Routes.Profile.path });
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    console.log('>>>>>>>>>>>>>>>>>>>>>>', { target: e.target})
    if(name === 'question_4') {
      const newRadios = radios.map((radio) => {
        if(radio.value === value) {
          radio.checked = true;
          setQuestions(questions => ({ ...questions, [name]: radio.label }));
        }
        return radio;
      });
      setRadios(newRadios);
    } else {
      setQuestions(questions => ({ ...questions, [name]: value }));
    }
  }
  const handleRefer = (e) => {
    e.preventDefault();
    setSubmitted(true);
    console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>', { questions: questions.referal })
  }

  const [nextable, setNextable] = useState(false);
  const [errorText, setErrorText] = useState('');

  const changeOpt = (opt) => {
    setOptions(opt);
  };

  const handleSelect = (value) => {
    const newOptItems= optItems.map((item) => {
      item.checked = item.value === value ? true : false;
      return item;
    });
    setQuestions(questions => ({ ...questions, question_3: value }));
    setOptItems(newOptItems);
  }

  const handleVerificationSuccess = (token, eKey) => {
    dispatch({
      type: 'SET_CAPTCHA_TOKEN',
      payload: token,
    });
  };

  const handleNext = () => {
    if (captchaToken && captchaToken.length > 0) {
      setErrorText('');
      setNextable(true);
    } else {
      setErrorText('You need to pass captCha.');
      setNextable(false);
    }
  };

  return (
    <div id='job' className='text-center'>
      <div className='container w-100 mw-100'>
        <div className='row h-100'>
          <div className='col-md-2'></div>
          <div className='col-md-2 section-option text-right'>
            <h4 className='title mb-4'>Job List</h4>
            <ul className='m-0'>
              <li className='mb-4'>
                <a
                  className={`opt ${
                    option && option === JobOptions.captcha ? 'active' : ''
                  }`}
                  onClick={() => setOptions(JobOptions.captcha)}
                >
                  Data labeling
                </a>
              </li>
              <li className='mb-4'>
                <a
                  className={`opt ${
                    option && option === JobOptions.referal ? 'active' : ''
                  }`}
                  onClick={() => setOptions(JobOptions.referal)}
                >
                  Referal
                </a>
              </li>
              <li className='mb-4'>
                <a
                  className={`opt ${
                    option && option === JobOptions.questionare ? 'active' : ''
                  }`}
                  onClick={() => setOptions(JobOptions.questionare)}
                >
                  Questionare
                </a>
              </li>
            </ul>
          </div>
          <div className='col-md-4 section-content'>
            { option && option === JobOptions.captcha &&
              <div>
                <HCaptcha
                  sitekey='64fd34e8-c20f-4312-ab15-9b28a2ff3343'
                  onVerify={(token, ekey) =>
                    handleVerificationSuccess(token, ekey)
                  }
                />
                {!nextable && errorText.length > 0 &&
                  <p className='dangerText'>{errorText}</p>
                }
                <Button className='btn-cutom mt-5' onClick={handleNext}>Next</Button>
              </div>
            }
            {option && option === JobOptions.referal &&
              <div id='referal' className='text-center col-md-8 offset-md-2'>
                <URLInput className='text-center mb-3 referal-link' onChange={handleChange} name='referal' value={questions.referal} />
                <FormControl.Feedback type='invalid' className={ submitted && !questions.referal ? 'd-block' : '' }>Referal link required</FormControl.Feedback>
                <Button className='mt-4 bg-blue w-100 form-control' onClick={handleRefer}>Refer Now <i className='material-icons text-white'>share</i></Button>
              </div>
            }
            { option && option === JobOptions.questionare &&
              <div id='questions' className='m-auto text-left col-md-8 offset-md-2'>
                <form name='form'>
                  <FormGroup>
                    <FormLabel>Question 1</FormLabel>
                    <FormControl placeholder='' type='text' name='question_1' value={questions.question_1} onChange={handleChange}></FormControl>
                    <FormControl.Feedback type='invalid' className={ submitted && !questions.question_1 ? 'd-block' : '' }>Question 1 required</FormControl.Feedback>
                  </FormGroup>
                  <FormGroup>
                    <FormLabel>Question 2</FormLabel>
                    <FormControl placeholder='' type='text' name='question_2' value={questions.question_2} onChange={handleChange}></FormControl>
                    <FormControl.Feedback type='invalid' className={ submitted && !questions.question_2 ? 'd-block' : '' }>Question 2 required</FormControl.Feedback>
                  </FormGroup>
                  <FormGroup>
                    <FormLabel>Question 3</FormLabel>
                    <Dropdown drop='down'>
                      <Dropdown.Toggle className='form-control text-left bg-white'>{ questions.question_3 || 'Select' }<i className='fa fa-angle-down text-right'/></Dropdown.Toggle>
                      <Dropdown.Menu className='w-100'>
                        <Dropdown.Item className='w-100' onClick={(e) => { handleSelect('') }}>Select</Dropdown.Item>
                      { optItems && optItems.length && optItems.map((optItem, index) => {
                        return (
                          <Dropdown.Item key={index} className='w-100' onClick={(e) => { handleSelect(optItem.value) }} active={optItem.checked}>{optItem.value}</Dropdown.Item>
                        );
                      }) }
                      </Dropdown.Menu>
                    </Dropdown>
                    <FormControl.Feedback type='invalid' className={ submitted && !questions.question_3 ? 'd-block' : '' }>Question 3 required</FormControl.Feedback>
                  </FormGroup>
                  <FormGroup className='d-flex flex-column'>
                    <FormLabel className=''>Qquestion 4</FormLabel>
                    <div className='row m-0 justify-content-between'>
                      { radios && radios.length && radios.map((radio, index) => {
                        return (
                        <div className='radio d-flex flex-column' key={index}>
                          <FormLabel>{radio.label}</FormLabel>
                          { radio.checked && 
                          <input type='radio' name={radio.name} className='m-auto' value={radio.value} checked onChange={handleChange}></input>
                          }
                          { !radio.checked && 
                          <input type='radio' name={radio.name} className='m-auto' value={radio.value} onChange={handleChange}></input>
                          }
                        </div>
                        )
                      })}
                    </div>
                    <FormControl.Feedback type='invalid' className={ submitted && !questions.question_4 ? 'd-block' : '' }>Question 4 required</FormControl.Feedback>
                  </FormGroup>
                  <FormGroup>
                    <Button className='form-control bg-blue' onClick={submitQuestions}>Submit</Button>
                  </FormGroup>
                  <div className='form-group'>
                  </div>
                </form>
              </div>
            }
          </div>
          <div className='col-md-2 section-details text-left d-flex flex-column justify-content-between'>
            <div className='mb-5'>
              {option && option === JobOptions.captcha && (
                <p>
                  Upon successful completion of hCaptcha, user receives an
                  assigned HMT amount.
                </p>
              )}
              {option && option === JobOptions.referal && (
                <p>
                  If you refer a friend you will receive 1 HMT. Note, you will
                  receive the HMT only if your referral successfully signs up
                  with their email and wallet address. Each logged-in user will
                  receive a shareable, unique URL (code) for their profile.
                </p>
              )}
              {option && option === JobOptions.questionare && (
                <p>
                  Upon successful referral (account created/verified), the
                  inviter receives 1 HMT
                </p>
              )}
            </div>
            <div>
              <h4 className='title d-flex justify-content-between'>
                <span>HMT earned</span>
                <span>{hmtCounts}</span>
              </h4>
            </div>
            <div className='job-status'>
              <h4 className='title mb-4'>Jobs Completed</h4>
              <ul className='m-0'>
                <li className='d-flex justify-content-between mb-4'>
                  <p>Captchas</p>
                  <p>{captchaCnt}</p>
                </li>
                <li className='d-flex justify-content-between'>
                  <p>Referlas</p>
                  <p>{referalCnt}</p>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};