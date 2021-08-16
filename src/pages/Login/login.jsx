import { useState } from 'react'
import { Button, FormControl, FormGroup, Alert } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import { Link, withRouter } from 'react-router-dom';
import * as EmailValidator from 'email-validator';
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
            payload: res,
          })
          history.push({ pathname: Routes.Home.path });
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
          <Link to='/'><i className='material-icons close'>clear</i></Link>
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
            <Password onChange={handleChange} value={password} submitted={submitted}></Password>
            <FormGroup className='actions d-flex justify-content-between m-0'>
              <Link className='btn' to={Routes.Home.path}>Back</Link>
              <Button className='form-control bg-blue' onClick={handleSubmit}>Next</Button>
            </FormGroup>
          </form>
        </div>
      </div>
    </div>
  )
}

export default withRouter(LoginPage);