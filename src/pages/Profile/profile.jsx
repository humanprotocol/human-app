import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, withRouter } from 'react-router-dom'
import * as EmailValidator from 'email-validator';
import { FormGroup, FormControl, Button } from 'react-bootstrap';
import { Routes } from '../../routes';
import { update } from '../../service/user.service';
import { ErrorMessage } from '../../constants';
import './profile.scss';

const ProfilePage = (props) => {
  const auth = useSelector((state) => state.auth);
  const { user, isAuthed } = auth;
  const dispatch = useDispatch();
  const { history } = props;
  if(!isAuthed) history.push({ pathname: Routes.Home.path });

  const [ editing, setEditting ] = useState(false);
  const [ submitted, setSubmitted ] = useState(false);
  const [ inputs, setInputs ] = useState({
    email: user ? user.email || '' : '',
    userName: user ? user.userName || '' : '',
    firstName: user? user.firstName || '' : '',
    lastName: user ? user.lastName || '' : '',
    password: user ? user.password || '' : '',
    walletAddress: user ? user.walletAddress || '' : '',
  })

  const handleChange = (e) => {
    const { name, value } = e.target;
    setInputs(inputs => ({ ...inputs, [name]: value }));
  }

  const logout = (e) => {
    e.preventDefault();
    dispatch({
      type: 'AUTH_SIGN_OUT',
      payload: false
    });
    history.push({ pathname: Routes.Home.path });
  } 

  const updateProfile = (e) => {
    e.preventDefault();
    setSubmitted(true);
    if(inputs.email && inputs.userName && inputs.firstName && inputs.lastName && inputs.password && inputs.walletAddress && EmailValidator.validate(inputs.email)) {
      update(inputs).then((user) => {
        dispatch({
          type: 'AUTH_SUCCESS',
          payload: user,
        })
        setEditting(false);
      })
    }
  }

  const toggleEditProfile = (e) => {
    e.preventDefault();
    setEditting(!editing);
  }
  return (
    <div id='profile' className='col-md-4 offset-md-4 d-flex flex-column justify-content-center h-100'>
      <div className='container'>
        <div className='page-title d-flex justify-content-between mb-4'>
          <h2>{ editing ? 'Edit Profile' : 'Profile' }</h2>
          <Link to='/'><i className='material-icons close'>clear</i></Link>
        </div>
        <div>
          <form name='form' className='m-0'>
            <FormGroup>
              { !editing && 
              <p>{inputs.firstName || 'First Name'} {inputs.lastName || 'Last Name'}</p>
              }
              { editing &&
              <div className='row'>
                <div className='col'>
                  <FormControl placeholder='First Name' type='text' name='firstName' value={inputs.firstName} onChange={handleChange} readOnly={!editing}></FormControl>
                  {submitted && !inputs.firstName &&
                  <FormControl.Feedback type='invalid' className='d-block'>{ErrorMessage.requireFirstName}</FormControl.Feedback>
                  }
                </div>
                <div className='col'>
                  <FormControl placeholder='Last Name' type='text' name='lastName' value={inputs.lastName} onChange={handleChange} readOnly={!editing}></FormControl>
                  {submitted && !inputs.firstName &&
                  <FormControl.Feedback type='invalid' className='d-block'>{ErrorMessage.requireLastName}</FormControl.Feedback>
                  }
                </div>
              </div>
              }
            </FormGroup>
            <FormGroup>
              { !editing && 
              <p>{inputs.email || 'Email'}</p>
              }
              { editing &&
              <>
              <FormControl placeholder='Email' type='email' name='email' value={inputs.email} onChange={handleChange}></FormControl>
              {submitted && !inputs.email &&
              <FormControl.Feedback type='invalid' className='d-block'>{ErrorMessage.requireEmail}</FormControl.Feedback>
              }
              {submitted && !inputs.email && !EmailValidator.validate(inputs.email) &&
              <FormControl.Feedback type='invalid' className='d-block'>{ErrorMessage.invalidEmail}</FormControl.Feedback>
              }
              </>
              }
            </FormGroup>
            <FormGroup>
              { !editing && 
                <p>{inputs.walletAddress || 'Wallet address'}</p>
              }
              { editing && 
                <>
                  <FormControl placeholder='Wallet address' type='text' name='walletAddress' value={inputs.walletAddress} onChange={handleChange} readOnly={!editing}></FormControl>
                  {submitted && !inputs.walletAddress &&
                  <FormControl.Feedback type='invalid' className='d-block'>{ErrorMessage.requireWalletAddress}</FormControl.Feedback>
                  }
                  {submitted && inputs.walletAddress && inputs.walletAddress.length !== 42 &&
                  <FormControl.Feedback type='invalid' className='d-block'>{ErrorMessage.invalidWalletAddress}</FormControl.Feedback>
                  }
                </>
              }
            </FormGroup>
            { editing && 
            <div className='mb-2'><Link to={Routes.ForgotPassword.path}>Change password</Link></div>
            }
            <FormGroup className='actions d-flex justify-content-between m-0'>
              <Link className='btn' to={Routes.Home.path}>Back</Link>
              <Button className='form-control bg-blue' onClick={editing ? updateProfile : toggleEditProfile}>{ editing ? 'Save changes' : 'Edit' }</Button>
            </FormGroup>
          </form>
        </div>
      </div>
    </div>
  );
};
export default withRouter(ProfilePage);
