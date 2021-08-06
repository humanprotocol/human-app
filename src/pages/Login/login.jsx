import { useState } from 'react'
import { Button, FormControl } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { Password } from '../../components/inputs/password/password';
import './login.css';

const LoginPage = (props) => {
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
    if (email && password) {
      console.log('>>>>>>>>>>>>>>>>>>>>>> Login Action. ', { email, password })
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
          <div className='form-group'>
            <input placeholder='Email' type='email' name='email' value={email} onChange={handleChange} className={'form-control' + (submitted && !email ? ' is-invalid' : '')} />
            {submitted && !email &&
              <div className='invalid-feedback'>email is required</div>
            }
          </div>
          <Password onChange={handleChange} value={password} submitted={submitted}></Password>
          <div className='d-flex justify-content-between mb-2'>
            <Link to='/changePassword' className='btn btn-link'>Forgot Password?</Link>
            <Link to='/register' className='btn btn-link'>Register</Link>
          </div>
          <div className='form-group'>
            <Button className='btn btn-primary form-control' onClick={handleSubmit}>Next</Button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default LoginPage;