import { useState } from 'react'
import { useSelector } from 'react-redux';
import { FormGroup, FormControl, Button, FormLabel, Dropdown } from 'react-bootstrap';

import { URLInput } from '../../components/inputs/url';
import { JobOptions, PrimaryColor, SecondaryColor } from '../../constants';
import { Password } from '../../components/inputs/password/password';

export const Job = (props) => {
  const [option, setOptions] = useState(JobOptions.captcha);
  const [captchaCnt, setCaptchaCnt] = useState(0);
  const [referalCnt, setReferalCnt] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const hmtCounts = useSelector((state) => state.hmt.htmCounts);
  const [radios, setRadios] = useState([
    { checked: true, value: 'opt_1', label: 'Option 1', name: 'question_4' },
    { checked: false, value: 'opt_2', label: 'Option 2', name: 'question_4' },
    { checked: false, value: 'opt_3', label: 'Option 3', name: 'question_4' },
  ])
  const [optItems, setOptItems] = useState([
    { value: 'Option 1', checked: false },
    { value: 'Option 1', checked: false },
    { value: 'Option 1', checked: false },
  ])
  const [ questions, setQuestions ] = useState({
    question_1: '',
    question_2: '',
    question_3: '',
    question_4: '',
    referal: '',
  });
  const changeOpt = (opt) => {
    setOptions(opt);
  }
  const submitQuestions = (e) => {
    e.preventDefault();
    setSubmitted(true);
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
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

  const handleSubmit = (e) => {
    console.group()
  }

  return (
    <div id='job' className='text-center'>
      <div className='container w-100 mw-100'>
        <div className='row h-100'>
          <div className='col-md-2'></div>
          <div className='col-md-2 section-option text-right'>
            <h4 className='title mb-4'>Job List</h4>
            <ul className='m-0'>
              <li className='mb-4'>
                <a className={`opt ${option && option === JobOptions.captcha ? 'active' :  ''}`} onClick={() => setOptions(JobOptions.captcha)}>
                  Data labeling
                </a>
              </li>
              <li className='mb-4'>
                <a className={`opt ${option && option === JobOptions.referal ? 'active' :  ''}`} onClick={() => setOptions(JobOptions.referal)}>
                  Referal
                </a>
              </li>
              <li className='mb-4'>
                <a className={`opt ${option && option === JobOptions.questionare ? 'active' :  ''}`} onClick={() => setOptions(JobOptions.questionare)}>
                  Questionare
                </a>
              </li>
            </ul> 
          </div>
          <div className='col-md-4 section-content'>
            { option && option === JobOptions.captcha &&
              <div>hCaptcha Component</div>
            }
            { option && option === JobOptions.referal &&
              <div className='text-center'>
                <URLInput className='text-center mb-3 referal-link'></URLInput>
                <div className='row'>
                  <div className='input-group'>
                    <Button className='form-control py-2 border-right-0 btn text-white referal-btn' title='Refer now' bgColor={SecondaryColor.blue}></Button>
                    <span className='input-group-append' style={{color: '#ffffff', backgroundColor:SecondaryColor.blue}}>
                        <button className='btn' type='button'>
                            <i className='material-icons text-white'>share</i>
                        </button>
                    </span>
                  </div>
              </div>
              </div>
            }
            { option && option === JobOptions.questionare &&
              <div id='questions' className='m-auto text-left col-md-8 offset-md-2'>
                <form name='form' onSubmit={handleSubmit}>
                  <FormGroup>
                    <FormLabel>Question 1</FormLabel>
                    <FormControl placeholder='' type='text' name='question_1' value={questions.question_1} onChange={handleChange}></FormControl>
                    { submitted && !questions.question_1 &&
                      <FormControl.Feedback className='d-block' type='invalid'>Question 1 required</FormControl.Feedback>
                    }
                  </FormGroup>
                  <FormGroup>
                    <FormLabel>Question 2</FormLabel>
                    <FormControl placeholder='' type='text' name='question_2' value={questions.question_2} onChange={handleChange}></FormControl>
                    { submitted && !questions.question_2 &&
                      <FormControl.Feedback className='d-block' type='invalid'>Question 2 required</FormControl.Feedback>
                    }
                  </FormGroup>
                  <FormGroup>
                    <FormLabel>Question 3</FormLabel>
                    <Dropdown drop='down'>
                      <Dropdown.Menu>
                        { optItems && optItems.length && optItems.map((optItem, index) => {
                          return (
                            <Dropdown.Item>{optItem.value}</Dropdown.Item>
                          );
                        }) }
                      </Dropdown.Menu>
                    </Dropdown>
                    <FormControl placeholder='' as='select' name='question_3' value={questions.question_3} onChange={handleChange}>
                      <option className='optionItem' value='option_1'>Option 1</option>
                      <option className='optionItem' value='option_2'>Option 2</option>
                      <option className='optionItem' value='option_3'>Option 3</option>
                    </FormControl>
                    { submitted && !questions.question_3 &&
                      <FormControl.Feedback className='d-block' type='invalid'>Question 3 required</FormControl.Feedback>
                    }
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
                  </FormGroup>
                  <FormGroup>
                    <Button className='form-control' onClick={submitQuestions}>Submit</Button>
                  </FormGroup>
                  <div className='form-group'>
                  </div>
                </form>
              </div>
            }
          </div>
          <div className='col-md-2 section-details text-left d-flex flex-column justify-content-between'>
            <div className='mb-5'>
              { option && option === JobOptions.captcha &&
              <p>Upon successful completion of hCaptcha, user receives an assigned HMT amount.</p>
              }
              { option && option === JobOptions.referal &&
              <p>If you refer a friend you will receive 1 HMT. Note, you will receive the HMT only if your referral successfully signs up with their email and wallet address. Each logged-in user will receive a shareable, unique URL (code) for their profile.</p>
              }
              { option && option === JobOptions.questionare &&
              <p>Upon successful referral (account created/verified), the inviter receives 1 HMT</p>
              }
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
  )
}
