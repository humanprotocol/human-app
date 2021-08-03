import { useState, useSelector } from 'react'
import { Button } from '../../components/button';
import { URLInput } from '../../components/inputs/url';
import { JobOptions, PrimaryColor, SecondaryColor } from '../../constants';

export const Job = (props) => {
  const [option, setOptions] = useState(JobOptions.captcha);
  const [captchaCnt, setCaptchaCnt] = useState(0);
  const [referalCnt, setReferalCnt] = useState(0);
  // const hmtCounts = useSelector((state) => state.hmt.htmCounts);

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
                <a href='#' className={`opt ${option && option === JobOptions.captcha ? 'active' :  ''}`} onClick={() => setOptions(JobOptions.captcha)}>
                  hCaptcha
                </a>
              </li>
              <li className='mb-4'>
                <a href='#' className={`opt ${option && option === JobOptions.referal ? 'active' :  ''}`} onClick={() => setOptions(JobOptions.referal)}>
                  Referal
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
                <div class='row'>
                  <div class='input-group'>
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
          </div>
          <div className='col-md-2 section-details text-left d-flex flex-column justify-content-between'>
            <div className='mb-5'>
              <p className='mb-4'>Get 1 HMT for completing 1 hCaptcha job.</p>
              <p>
                Send the referral code to your friend and earn HMT<br/>
                0.4 HMT when your friend subscribes to HUMAN.<br/>
                0.6 HMT when your friend links their wallet to the HUMAN app.
              </p>
            </div>
            {/* <div className='job-status'>
              <h4 className='title d-flex justify-content-between'>
                <span>HMT earned</span>
                <span>{hmtCounts}</span>
              </h4>
            </div> */}
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
