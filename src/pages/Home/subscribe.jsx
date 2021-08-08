import { useState } from 'react'
import { Button, FormControl, FormGroup } from 'react-bootstrap'
import * as EmailValidator from "email-validator";
import { Routes } from '../../routes';
import { ErrorMessage } from '../../constants';

export const Subscribe = ({ history }) => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setEmail(e.target.value);
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    if(EmailValidator.validate(email)) history.push({ pathname: Routes.Profile.path });
  }
  return (
    <div id='subscribe'>
      <div className='container'>
        <div className='row'>
        <div className='col-md-6 text-right'>
            <h1 className='mb-4'>Subscribe to<br/><span className='color-blue'>Human</span></h1>
            <p className='mb-4'>To recieve updates about latest developments in HUMAN please subscribe by entering your email id.</p>
            <FormGroup>
              <FormControl placeholder='Email' type='email' name='email' value={email} onChange={handleChange}></FormControl>
              { submitted && !EmailValidator.validate(email) &&
                <FormControl.Feedback type='invalid' className='d-block text-left'>{ email ? ErrorMessage.invalidEmail : ErrorMessage.requireEmail }</FormControl.Feedback>
              }
            </FormGroup>
            <FormGroup>
              <Button className='btn btn-custom form-control' onClick={handleSubmit}>Enter</Button>
            </FormGroup>
          </div>
          <div className='col-md-6 d-none d-sm-block'>
            <div className='image-container'>
              <img src='' alt='subscribe-img'></img>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
