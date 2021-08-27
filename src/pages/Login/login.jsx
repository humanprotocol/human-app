import { useState } from 'react'
import { Button, FormControl, FormGroup, Alert } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import { Link, withRouter } from 'react-router-dom';
import * as EmailValidator from 'email-validator';
import HCaptcha from "@hcaptcha/react-hcaptcha";
import { Password } from '../../components/inputs/password/password';
import { signIn } from '../../service/user.service';
import { Routes } from '../../routes';
import './login.scss';
import { ErrorType, ErrorMessage, SignUpOpt } from '../../constants';

const LoginPage = (props) => {
  const dispatch = useDispatch();
  const { history } = props;
  const [inputs, setInputs] = useState({
    email: '',
    password: ''
  }); 
  const [alertMsg, setAlertMsg] = useState('')
  const [submitted, setSubmitted] = useState(false);
  const [captchaPassed, setCaptchaPassed] = useState(false);
  const [hcaptchaToken, setHcaptchaToken] = useState('');
  const { email, password } = inputs;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setInputs(inputs => ({ ...inputs, [name]: value }));
  }

  const handleVerificationSuccess = (token, ekey) => {
    if(token) { 
      setCaptchaPassed(true);
      setHcaptchaToken(token);
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    if (email && password && EmailValidator.validate(email) && captchaPassed) {
      signIn({ email, password, hcaptchaToken }).then((res) => {
        if (res) {
          let { user } = res;
          dispatch({
            type: 'AUTH_SUCCESS',
            payload: res,
          })
          dispatch({
            type: 'AUTH_SIGN_IN',
            payload: user.isEmailVerified,
          });
          setCaptchaPassed(false);
          setHcaptchaToken('');
          if(user.isEmailVerified) history.push({ pathname: Routes.Job.path });
          else history.push({ pathname: Routes.VerifyEmail.path });
        }
      }).catch((err) => {
        setAlertMsg(err.message);
      });
    } 
  }


  return (
    <div id='login' className='col-md-4 offset-md-4 d-flex flex-column justify-content-center h-100'>
      <div className='container'>
        <div className='page-title d-flex justify-content-between mb-4'>
          <h2>Log in</h2>
        </div>
        { alertMsg && alertMsg.length &&
          <Alert variant="danger" onClose={() => setAlertMsg('')} dismissible>
            <Alert.Heading>Login failed!</Alert.Heading>
            <p>{alertMsg}</p>
          </Alert>
        }
        <div>
          <form name='form' onSubmit={handleSubmit}>
            <FormGroup>
              <FormControl placeholder='Email' type='email' name='email' value={email} onChange={handleChange}></FormControl>
              {submitted && !email &&
                <FormControl.Feedback type='invalid' className='d-block'>{ErrorMessage.requireEmail}</FormControl.Feedback>
              }
              {submitted && email && !EmailValidator.validate(email) &&
                <FormControl.Feedback type='invalid' className='d-block'>{ErrorMessage.invalidEmail}</FormControl.Feedback>
              }
            </FormGroup>
            <Password onChange={handleChange} value={password} submitted={submitted} name='password' confirm={true} placeholder="Password"></Password>
            <FormGroup className='text-center'>
              <HCaptcha
                sitekey={process.env.REACT_APP_HCAPTCHA_SITE_KEY}
                onVerify={(token, ekey) =>
                  handleVerificationSuccess(token, ekey)
                }
              />
              {submitted && !captchaPassed &&
                <FormControl.Feedback type='invalid' className='d-block'>{ErrorMessage.captchPassRequired}</FormControl.Feedback>
              }
            </FormGroup>
            <FormGroup className='actions d-flex justify-content-between m-0'>
              <Link className='btn' to={Routes.Home.path}>Back</Link>
              <Button className='form-control bg-blue' onClick={handleSubmit} disabled={!captchaPassed}>Log in</Button>
            </FormGroup>
          </form>
        </div>
      </div>
    </div>
  )
}

export default withRouter(LoginPage);