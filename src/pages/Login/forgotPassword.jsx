import { useState } from 'react';
import {
  Alert, FormGroup, FormControl, Button,
} from 'react-bootstrap';
import { Link, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import './login.scss';
import { ErrorMessage, ResetPasswordStep } from '../../constants';
import { Routes } from '../../routes';
import { forgotPassword, resetPassword } from '../../service/user.service';
import { Password } from '../../components/inputs/password/password';

const ForgotPasswordPage = (props) => {
  const { history } = props;
  const { search } = useLocation();
  const verificationToken = search.replace('?token=', '');
  const { token } = useSelector((state) => state.auth);
  const [alertMsg, setAlertMsg] = useState('');
  const [submittable, setSubmittable] = useState(false);
  const [step, setStep] = useState(verificationToken ? ResetPasswordStep.resetPassword : ResetPasswordStep.verifyEmail);
  const [inputs, setInputs] = useState({
    email: '',
    password: '',
    repeatPassword: '',
  });
  const [validationErrors, setValidationErrors] = useState({
    email: '',
    password: '',
    repeatPassword: '',
  });
  const { email, password, repeatPassword } = inputs;

  const handleSubmit = (e) => {
    e.preventDefault();
    switch (step) {
      case ResetPasswordStep.resetPassword:
        if (!verificationToken) {
          setAlertMsg(ErrorMessage.requireRestPasswordToken);
        } else {
          resetPassword(password, verificationToken)
            .then(() => {
              setAlertMsg('');
              history.push({ pathname: Routes.Login.path });
            })
            .catch((err) => {
              setAlertMsg(err.message);
            });
        }
        break;
      default:
        forgotPassword(email)
          .then(() => {
            setAlertMsg('');
            setSubmittable(false);
            setStep(ResetPasswordStep.pending);
          })
          .catch((err) => setAlertMsg(err.message));
        break;
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setInputs((inputs) => ({ ...inputs, [name]: value }));
  };

  return (
    <div id="resetPassword" className="col-md-4 offset-md-4 d-flex flex-column justify-content-center h-100">
      <div className="container">
        <div className="page-title d-flex justify-content-between mb-4">
          { step === ResetPasswordStep.verifyEmail
          && <h2>Forgot your password?</h2>}
          { step === ResetPasswordStep.pending
          && <h2>Check your email</h2>}
          { step === ResetPasswordStep.resetPassword
          && <h2>Create new password</h2>}
          <Link to="/login"><i className="material-icons close">clear</i></Link>
        </div>
        { alertMsg && alertMsg.length
          && (
          <Alert variant="danger" onClose={() => setAlertMsg('')} dismissible>
            <Alert.Heading>Failed to reset password!</Alert.Heading>
            <p>{alertMsg}</p>
          </Alert>
          )}
        { step === ResetPasswordStep.verifyEmail
        && <p>A link will be sent to your registered email address. Go to the link and create a new password.</p>}
        { step === ResetPasswordStep.pending
        && <p>Please check your email and follow instructions to change your password.</p>}
        { step === ResetPasswordStep.resetPassword
        && <p>Your password should be different form the previously created password</p>}
        <div>
          <form name="form" onSubmit={handleSubmit}>
            { step === ResetPasswordStep.verifyEmail
            && (
            <>
              <FormGroup>
                <FormControl placeholder="Email" type="email" name="email" value={email} onChange={handleChange} />
                {validationErrors.email
                  && <FormControl.Feedback type="invalid" className="d-block">{validationErrors.email}</FormControl.Feedback>}
              </FormGroup>
              <FormGroup className="actions d-flex justify-content-end m-0">
                <Button className="form-control bg-blue" onClick={handleSubmit} disabled={false}>Next</Button>
              </FormGroup>
            </>
            )}
            { step === ResetPasswordStep.pending
            && (
            <FormGroup>
              <p>
                Did not recieve mail?
                <a href="" onClick={handleSubmit}>Re-send.</a>
              </p>
            </FormGroup>
            )}
            { step === ResetPasswordStep.resetPassword
            && (
            <>
              <FormGroup className="password">
                <Password onChange={handleChange} name="password" value={password} placeholder="Create password" className="mb-5" />
                {validationErrors.password
                && <FormControl.Feedback type="invalid" className="d-block">{validationErrors.password}</FormControl.Feedback>}
              </FormGroup>
              <FormGroup className="password">
                <Password onChange={handleChange} name="repeatPassword" value={repeatPassword} placeholder="Confirm password" className="mb-5" />
                {validationErrors.repeatPassword
                && <FormControl.Feedback type="invalid" className="d-block">{validationErrors.repeatPassword}</FormControl.Feedback>}
              </FormGroup>
              <FormGroup className="actions d-flex justify-content-between m-0">
                <Link className="btn" to={Routes.Login.path}>Cancel</Link>
                <Button className="form-control bg-blue" onClick={handleSubmit} disabled={false}>Save</Button>
              </FormGroup>
            </>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
