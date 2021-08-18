import { useState } from 'react'
import { Button, FormControl, FormGroup, Modal, Toast } from 'react-bootstrap';
import * as EmailValidator from "email-validator";
import { Routes } from '../../routes';
import { ErrorMessage } from '../../constants';
import SubscribeImg from '../../assets/images/subscribe.png';
import { sendNewsletterSignup } from '../../service/user.service';
import { Redirect } from 'react-router';
import { Link } from 'react-router-dom';
import ReadMoreIcon from '../../assets/icons/readmore.svg';

export const Subscribe = ({ history }) => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [modalShow, setModalShow] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setEmail(e.target.value);
    setError('');
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    if(EmailValidator.validate(email)) {
      return sendNewsletterSignup({ email, newsletter: true })
        .then(() => {
          setError('')
          setModalShow(true)})
        .catch((err) => { setError(err.message) })
    }
  }

  const handleSocial = (link) => {
    return <Redirect to={{ pathname: link}}></Redirect>
  }

  return (
    <div id='subscribe'>
      <div className='container'>
        <div className='row'>
          <div className='col-md-6 text-right'>
            <h1 className='mb-4'>Subscribe to <span className='color-blue'>HUMAN</span></h1>
            <p className='mb-4'>To receive the latest updates on HUMAN, please subscribe by entering your email below.</p>
            <FormGroup className='d-flex text-center'>
              <div className='w-100 mr-4'>
              <FormControl placeholder='Email' type='email' name='email' value={email} onChange={handleChange}></FormControl>
              { submitted && !EmailValidator.validate(email) &&
                <FormControl.Feedback type='invalid' className='d-block text-left'>{ email ? ErrorMessage.invalidEmail : ErrorMessage.requireEmail }</FormControl.Feedback>
              }
              { submitted && error &&
                <FormControl.Feedback type='invalid' className='d-block text-left'>{ error }</FormControl.Feedback>
              }
              </div>
              <Button className='btn btn-custom form-control' onClick={handleSubmit}>Subscribe</Button>
            </FormGroup>
            <FormGroup className='social'>
              <a href='https://github.com/humanprotocol' className='social-icon icon-github'><i className='fa fa-github'></i></a>
              <a href='https://twitter.com/human_protocol/' className='social-icon icon-twitter'><i className='fa fa-twitter'></i></a>
              <a href='https://t.me/hcaptchachat' className='social-icon icon-telegram'><i className='fa fa-telegram'></i></a>
              <a href='https://www.linkedin.com/company/human-protocol/' className='social-icon icon-linkedin'><i className='fa fa-linkedin'></i></a>
            </FormGroup>
          </div>
          <div className='col-md-6'>
            <div className='image-container d-flex flex-column justify-content-center h-100'>
              <img src={SubscribeImg} alt='subscribe-img'></img>
            </div>
          </div>
        </div>
        <div className='terms col-md-6'>
          <a className='terms-item' href="https://humanprotocol.org/app/terms-and-conditions" target="_blank" rel="noreferrer">Terms and conditions</a>
          <a className='terms-item' href="https://humanprotocol.org/app/privacy-policy" target="_blank" rel="noreferrer">Privacy policy</a>
          <a className='terms-item' href='https://humanprotocol.org/'><img src={ReadMoreIcon} className='mr-2 ml-n1'/>Read more on HUMAN Protocol</a>
          <p className='terms-item'>© 2021 HPF. HUMAN Protocol® is a registered trademark</p>
        </div>
      </div>
      <Modal show={modalShow} onHide={() => setModalShow(false)} centered>
        <Modal.Header closeButton></Modal.Header>
        <Modal.Body>Thank you for expressing interest in the HUMAN App. We are currently experiencing a large volume of traffic, and it may take a few days to get your account setup. We will be in touch through your registered email address.</Modal.Body>
      </Modal>
    </div>
  )
}
