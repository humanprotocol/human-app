import { useEffect, useState } from 'react';
import { Alert, FormGroup, FormControl, Button } from 'react-bootstrap';
import { Link, withRouter } from 'react-router-dom';
import * as EmailValidator from 'email-validator';
import { useSelector } from 'react-redux';
import './login.scss';
import { ResetPasswordStep } from '../../constants';
import { Routes } from '../../routes';
import { forgotPassword } from '../../service/user.service';

const ForgotPasswordPage = (props) => {
  const { user, isAuthed, token, refreshToken } = useSelector((state) => state.auth);
  const [alertMsg, setAlertMsg] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [submittable, setSubmittable] = useState(false)
  const [step, setStep] = useState(ResetPasswordStep.verifyEmail);
  const [inputs, setInputs] = useState({
    email: '',
    password: '',
    repeatPassword: '',
  })
  const { email, password, repeatPassword } = inputs;

  const handleSubmit = (e) => {
    e.preventDefault();
    switch (step) {
      case ResetPasswordStep.verifyEmail:
        if(email && EmailValidator.validate(email)) {
          forgotPassword(email, token)
            .then(() => setStep(ResetPasswordStep.pending))
            .catch((err) => setAlertMsg(err.message));
        }
        break;
      default:
        break;
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    console.log('>>>>>>>>>>>>>>>>', { name, value })

    setInputs(inputs => ({ ...inputs, [name]: value }));
  }

  const resendEmail = (e) => {
    e.preventDefault();
  }

  useEffect(() => {
    switch (step) {
      case ResetPasswordStep.verifyEmail:
          if(email && EmailValidator.validate(email)) setSubmittable(true);
          else setSubmittable(false);        
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
                <FormControl placeholder='Email' type='email' name='email' value={email} onChange={handleChange}></FormControl>
                {submitted && !email &&
                  <FormControl.Feedback type='invalid' className='d-block'>{}</FormControl.Feedback>
                }
                {submitted && email && !EmailValidator.validate(email) &&
                  <FormControl.Feedback type='invalid' className='d-block'>{}</FormControl.Feedback>
                }
              </FormGroup>
              <FormGroup className='actions d-flex justify-content-end m-0'>
                <Button className='form-control bg-blue' onClick={handleSubmit} disabled={!submittable}>Next</Button>
              </FormGroup>
            </>
            }
            { step === ResetPasswordStep.pending &&
            <FormGroup>
              <p>Did not recieve mail? <a href='' onClick={resendEmail}>Re-send.</a></p>
            </FormGroup>
            }
            { step === ResetPasswordStep.resetPassword  &&
            <FormGroup className='actions d-flex justify-content-between m-0'>
              <Link className='btn' to={Routes.Login.path}>Cancel</Link>
              <Button className='form-control bg-blue' onClick={handleSubmit} disabled={true}>Save</Button>
            </FormGroup>
            }
          </form>
        </div>
      </div>
    </div>
  )
}

export default ForgotPasswordPage;