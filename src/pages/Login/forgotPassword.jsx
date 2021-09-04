import { useEffect, useState } from 'react';
import { Alert, FormGroup, FormControl, Button } from 'react-bootstrap';
import { Link, useLocation, withRouter } from 'react-router-dom';
import * as EmailValidator from 'email-validator';
import { useSelector } from 'react-redux';
import './login.scss';
import { ResetPasswordStep } from '../../constants';
import { Routes } from '../../routes';
import { forgotPassword } from '../../service/user.service';
import { Password } from '../../components/inputs/password/password';
import { validatePassword } from '../../service/base.service';
import { ResetPasswordSchema, validate } from '../../util/validation';

const ForgotPasswordPage = (props) => {
  const { search } = useLocation();
  const verificationToken = search.replace('?token=', '');
  const { token } = useSelector((state) => state.auth);
  const [alertMsg, setAlertMsg] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [submittable, setSubmittable] = useState(false)
  const [confirm, setConfirm] = useState(false);
  const [step, setStep] = useState(ResetPasswordStep.verifyEmail);
  const [inputs, setInputs] = useState({
    email: '',
    password: '',
    repeatPassword: '',
  })
  const [validationErrors, setValidationErrors] = useState({
    email: '',
    password: '',
    repeatPassword: '',
  })
  const { email, password, repeatPassword } = inputs;

  const handleSubmit = (e) => {
    e.preventDefault();
    switch (step) {
      case ResetPasswordStep.resetPassword:
        if(email && EmailValidator.validate(email)) {
          forgotPassword(email, token)
            .then(() => setStep(ResetPasswordStep.pending))
            .catch((err) => setAlertMsg(err.message));
        }
        break;
      default:
        if(email && EmailValidator.validate(email)) {
          forgotPassword(email, token)
            .then(() => {
              setStep(ResetPasswordStep.pending);
              setAlertMsg('');
              setSubmittable(false);
            })
            .catch((err) => setAlertMsg(err.message));
        }
        break;
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setInputs(inputs => ({ ...inputs, [name]: value }));
  }

  const handleBlur = (e) => {
    e.preventDefault();
    let newErrors = {
      email: '',
      password: '',
      repeatPassword: '',
    }

    const validationError = validate(ResetPasswordSchema, inputs);
    if(validationError) {
      validationError.map((error) => newErrors[error.key] = error.message);
      switch (step) {
        case ResetPasswordStep.verifyEmail:
          if(newErrors.email) setSubmittable(false)
          else setSubmittable(true);
          break;
        case ResetPasswordStep.resetPassword:
          if(newErrors.password || newErrors.resetPassword) setSubmittable(false)
          else setSubmittable(true);
          break;
        default:
          break;
      }
    } else {
      setSubmittable(true);
    }
    setValidationErrors(newErrors);
  }

  const resendEmail = (e) => {
    e.preventDefault();
    if(step === ResetPasswordStep.pending && email && EmailValidator.validate(email)) {

    }
  }

  useEffect(() => {
    if(verificationToken) setStep(ResetPasswordStep.resetPassword);
  }, [])
  useEffect(() => {
    switch (step) {
      case ResetPasswordStep.verifyEmail:
          if(email && EmailValidator.validate(email)) setSubmittable(true);
          else setSubmittable(false);        
        break;
      case ResetPasswordStep.resetPassword:
        if(password || repeatPassword) setSubmitted(true)
        else setSubmitted(false);
        
        if(password && repeatPassword && password === repeatPassword && validatePassword(password)) {
          setConfirm(true);
          setSubmittable(true);
        } else if(password && repeatPassword && password === repeatPassword) {
          setConfirm(true);
          setSubmittable(false);
        } else {
          setConfirm(false);
          setSubmittable(false);
        }
        break;
      default:
        break;
    }
  }, [inputs])

  return (
    <div id='resetPassword' className='col-md-4 offset-md-4 d-flex flex-column justify-content-center h-100'>
      <div className='container'>
        <div className='page-title d-flex justify-content-between mb-4'>
          { step === ResetPasswordStep.verifyEmail  &&
          <h2>Forgot your password?</h2>
          }
          { step === ResetPasswordStep.pending  &&
          <h2>Check your email</h2>
          }
          { step === ResetPasswordStep.resetPassword  &&
          <h2>Create new password</h2>
          }
          <Link to='/login'><i className='material-icons close'>clear</i></Link>
        </div>
        { alertMsg && alertMsg.length &&
          <Alert variant="danger" onClose={() => setAlertMsg('')} dismissible>
            <Alert.Heading>Failed to reset password!</Alert.Heading>
            <p>{alertMsg}</p>
          </Alert>
        }
        { step === ResetPasswordStep.verifyEmail &&
        <p>A link will be sent to your registered email address. Go to the link and create a new password.</p>
        }
        { step === ResetPasswordStep.pending &&
        <p>Please check your email and follow instructions to change your password.</p>
        }
        { step === ResetPasswordStep.resetPassword &&
        <p>Your password should be different form the previously created password</p>
        }
        <div>
          <form name='form' onSubmit={handleSubmit}>
            { step === ResetPasswordStep.verifyEmail &&
            <>
              <FormGroup>
                <FormControl placeholder='Email' type='email' name='email' value={email} onChange={handleChange} onBlur={handleBlur}></FormControl>
                {validationErrors.email &&
                  <FormControl.Feedback type='invalid' className='d-block'>{validationErrors.email}</FormControl.Feedback>
                }
              </FormGroup>
              <FormGroup className='actions d-flex justify-content-end m-0'>
                <Button className='form-control bg-blue' onClick={handleSubmit} disabled={!submittable}>Next</Button>
              </FormGroup>
            </>
            }
            { step === ResetPasswordStep.pending &&
            <FormGroup>
              <p>Did not recieve mail? <a href='' onClick={handleSubmit}>Re-send.</a></p>
            </FormGroup>
            }
            { step === ResetPasswordStep.resetPassword  &&
            <>
              <Password onChange={handleChange} name='password' value={password} placeholder='New password' submitted={submitted} className='mb-5' confirm={confirm}></Password>
              <Password onChange={handleChange} name='repeatPassword' value={repeatPassword} placeholder='Confirm password' submitted={submitted} className='mb-5' confirm={confirm}></Password>
              <FormGroup className='actions d-flex justify-content-between m-0'>
                <Link className='btn' to={Routes.Login.path}>Cancel</Link>
                <Button className='form-control bg-blue' onClick={handleSubmit} disabled={!submittable}>Save</Button>
              </FormGroup>
            </>
            }
          </form>
        </div>
      </div>
    </div>
  )
}

export default ForgotPasswordPage;