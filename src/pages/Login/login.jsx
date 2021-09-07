import { useState, useRef } from 'react'
import { Button, FormControl, FormGroup, Alert } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import { Link, withRouter } from 'react-router-dom';
import HCaptcha from "@hcaptcha/react-hcaptcha";
import { Password } from '../../components/inputs/password/password';
import { signIn } from '../../service/user.service';
import { Routes } from '../../routes';
import './login.scss';
import { EmailSchema, LoginSchema, PasswordSchema, validate } from '../../util/validation';

const LoginPage = (props) => {
  const dispatch = useDispatch();
  const { history } = props;
  const [inputs, setInputs] = useState({
    email: '',
    password: ''
  }); 
  const [alertMsg, setAlertMsg] = useState('')
  const [validationErrors, setValidationErrors] = useState({
    email: '',
    password: '',
  })
  const [submittable, setsubmittable] = useState(false);
  const [hcaptchaToken, setHcaptchaToken] = useState('');
  const { email, password } = inputs;
  const captchaRef = useRef(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setInputs(inputs => ({ ...inputs, [name]: value }));
  }

  const handleVerificationSuccess = (token) => {
    if(token) { 
      setHcaptchaToken(token);
      const validationError = validate(LoginSchema, inputs);  
      if(validationError) {
        let newErrors = validationErrors;
        validationError.map((error) => {
          newErrors = { ...newErrors, [error.key]: error.message };
        });
        setValidationErrors({ ...validationErrors, ...newErrors });
        setsubmittable(false);
      } else {
        setValidationErrors({ email: '', password: '' });
        setsubmittable(true);
      }
    } else {
      setsubmittable(false);
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault();
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
        setHcaptchaToken('');
        if(user.isEmailVerified) history.push({ pathname: Routes.Job.path });
        else history.push({ pathname: Routes.VerifyEmail.path });
      }
    }).catch((err) => {
      setAlertMsg(err.message);
      setsubmittable(false)
      setHcaptchaToken('');
      captchaRef.current.resetCaptcha();
    });
  }

  const handleBlur = (e) => {
    e.preventDefault();
    const { name } = e.target;
    let validationError;

    switch (name) {
      case 'email':
        validationError = validate(EmailSchema, inputs.email);
        break;
      default:
        validationError = validate(PasswordSchema, inputs.password);
        break;
    }

    if(validationError) {
      validationError.map((error) => {
        setValidationErrors({ ...validationErrors, [name]: error.message });
      });
      setsubmittable(false);
    } else if (hcaptchaToken) {
      setsubmittable(true);
      setValidationErrors({ email: '', password: '' });
    } else {
      setsubmittable(false);
      setValidationErrors({ ...validationErrors, [name]: '' })
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
              <FormControl placeholder='Email' type='email' name='email' value={email} onChange={handleChange} onBlur={handleBlur}></FormControl>
              { validationErrors.email && 
              <FormControl.Feedback type='invalid' className='d-block'>{validationErrors.email}</FormControl.Feedback>
              }
            </FormGroup>
            <FormGroup className='password'>
              <Password onChange={handleChange} onBlur={handleBlur} value={password} name='password' placeholder="Password"></Password>
              { validationErrors.password && 
              <FormControl.Feedback type='invalid' className='d-block'>{validationErrors.password}</FormControl.Feedback>
              }
            </FormGroup>
            <FormGroup className='text-center'>
              <HCaptcha
                sitekey={process.env.REACT_APP_HCAPTCHA_SITE_KEY}
                onVerify={(token) =>
                  handleVerificationSuccess(token)
                }
                ref={captchaRef}
              />
            </FormGroup>
            <div className='d-flex justify-content-between mb-2'>
              <Link to='/reset-password' className='btn btn-link'>Forgot Password?</Link>
            </div>
            <FormGroup className='actions d-flex justify-content-between m-0'>
              <Link className='btn' to={Routes.Home.path}>Back</Link>
              <Button className='form-control bg-blue' onClick={handleSubmit} disabled={!submittable}>Log in</Button>
            </FormGroup>
          </form>
        </div>
      </div>
    </div>
  )
}

export default withRouter(LoginPage);