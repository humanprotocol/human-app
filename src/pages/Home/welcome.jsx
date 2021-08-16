import { useState } from 'react';
import { useSelector } from 'react-redux';
import { Link, withRouter } from 'react-router-dom';
import * as EmailValidator from 'email-validator';
import { FormControl, FormGroup, Button } from 'react-bootstrap';
import './home.scss';
import { Routes } from '../../routes';
import { SignUpOpt } from '../../constants';
import { sendVerificationEmail } from '../../service/user.service';

const Welcome = ({ history }) => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState({ email: true, msg: '' });
  const { isAuthed, user, token } = useSelector((state) => state.auth);

  const handleSubmit = (e) => {
    e.preventDefault();
    if(!isAuthed) {
      setStatus({ email: false, msg: 'You shold login' });
    } else if(isAuthed && !user) {
      setStatus({ email: false, msg: 'You should login again' });
    } else if(isAuthed && user && !token) {
      setStatus({ email: false, msg: 'Access token required' });
    } else if (isAuthed && user && token) {
      return sendVerificationEmail(token)
        .then(() => history.push({ pathname: Routes.Register.path, state: SignUpOpt.verifyEmail }))
        .catch((err) => setStatus({ email: false, msg: err.message }));
    }
    // if (!email && !isAuthed) {
    //   setStatus({ email: false, msg: 'email is required' });
    // } else if (!EmailValidator.validate(email) && !isAuthed) {
    //   setStatus({ email: false, msg: 'Invalid email' });
    // } else if (isAuthed && !user && !email) {
    //   setStatus({ email: false, msg: 'email is required' });
    // } else {
    //   history.push({ pathname: Routes.Register.path, state: SignUpOpt.verifyEmail });
    // }
  };

  const handleChange = (e) => {
    const { value } = e.target;
    if (value) setStatus({ email: true, msg: '' });
    setEmail(value);
  };
  return (
    <div id='welcome' className='intro'>
      <div className='text-center'>
        <div className='intro-text'>
          <h1 className='text-center mb-4'>
            Welcome to <span className='color-blue'>HUMAN App</span>
          </h1>
          <h4 className='text-center mb-4 font-weight-bold'>
            Gateway to the HUMAN experience
          </h4>
          <p className='text-center mb-4'>
            Verify your email - we will also need a crypto wallet for security, and to send you HMT - you will receive 1 HMT for free when you register. To earn more, complete tasks, or refer friends. If you don’t have a wallet, follow <Link to={Routes.Register.path}>this link.</Link>
          </p>

          <div className='row justify-content-center earning-container'>
            {isAuthed && (
              <FormGroup>
                <Button className='form-control' onClick={handleSubmit}>
                  Link your wallet and start earning HMT
                </Button>
              </FormGroup>
            )}
            {!isAuthed && (
              <>
                <FormGroup className='mr-2'>
                  <FormControl
                    type='email'
                    placeholder='email'
                    name='email'
                    value={email}
                    onChange={handleChange}
                  />
                  <FormControl.Feedback
                    className={!status.email ? 'd-block' : ''}
                    type='invalid'
                  >
                    {status.msg}
                  </FormControl.Feedback>
                </FormGroup>
                <FormGroup>
                  <Button className='form-control' onClick={handleSubmit}>
                    Start earning HMT
                  </Button>
                </FormGroup>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default withRouter(Welcome);
