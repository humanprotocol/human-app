import { useState } from 'react'
import { useSelector } from 'react-redux';
import { Button } from '../../components/button';
import { URLInput } from '../../components/inputs/url';
import { JobOptions, PrimaryColor, SecondaryColor } from '../../constants';

export const Job = (props) => {
  const [option, setOptions] = useState(JobOptions.captcha);
  const [captchaCnt, setCaptchaCnt] = useState(0);
  const [referalCnt, setReferalCnt] = useState(0);
  const hmtCounts = useSelector((state) => state.hmt.htmCounts);

  const changeOpt = (opt) => {
    setOptions(opt);
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
              <div className='text-center'><h1>Questionare</h1></div>
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
