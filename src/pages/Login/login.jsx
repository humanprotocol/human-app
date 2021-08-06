import { useState } from 'react'
import { Button, FormControl, FormGroup } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import { Link, withRouter } from 'react-router-dom';
import * as EmailValidator from 'email-validator';
import { Password } from '../../components/inputs/password/password';
import { signIn } from '../../service/user.service';
import { Routes } from '../../routes';
import './login.css';
import { ErrorType, ErrorMessage } from '../../constants';

const LoginPage = (props) => {
  const dispatch = useDispatch();
  const { history } = props;
  const [inputs, setInputs] = useState({
    email: '',
    password: ''
  }); 
  const [submitted, setSubmitted] = useState(false);
  const { email, password } = inputs;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setInputs(inputs => ({ ...inputs, [name]: value }));
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    if (email && password && EmailValidator.validate(email)) {
      signIn({ email, password }).then((res) => {
        if (res) {
          dispatch({
            type: 'AUTH_SIGN_IN',
            payload: true,
          });
          dispatch({
            type: 'AUTH_SUCCESS',
            payload: { email, password },
          })
          history.push({ pathname: Routes.Home.path });
        }
      });
    } 
  }


  return (
    <div id='login' className='col-md-4 offset-md-4 d-flex flex-column justify-content-center h-100'>
      <div className='page-title d-flex justify-content-between mb-4'>
        <h2>Log in</h2>
        <Link to='/'><i className='material-icons close'>clear</i></Link>
      </div>
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
          <Password onChange={handleChange} value={password} submitted={submitted}></Password>
          <div className='d-flex justify-content-between mb-2'>
            <Link to='/changePassword' className='btn btn-link'>Forgot Password?</Link>
            <Link to='/register' className='btn btn-link'>Register</Link>
          </div>
          <div className='form-group'>
            <Button className='form-control' onClick={handleSubmit}>Next</Button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default withRouter(LoginPage);