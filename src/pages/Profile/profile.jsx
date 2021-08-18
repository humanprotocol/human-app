import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, withRouter } from 'react-router-dom'
import * as EmailValidator from 'email-validator';
import { FormGroup, FormControl, Button, Dropdown, Alert } from 'react-bootstrap';
import countryList from "react-select-country-list";
import { Routes } from '../../routes';
import { update } from '../../service/user.service';
import { ErrorMessage } from '../../constants';
import './profile.scss';

const ProfilePage = (props) => {
  const { history } = props;
  const dispatch = useDispatch();
  const { user, isAuthed, token } = useSelector((state) => state.auth);
  if(!isAuthed) history.push({ pathname: Routes.Home.path });

  const [ editing, setEditting ] = useState(false);
  const [ submitted, setSubmitted ] = useState(false);
  const [ inputs, setInputs ] = useState({
    email: user ? user.email || '' : '',
    name: user? user.name || '' : '',
    walletAddress: user ? user.walletAddr || '' : '',
    country: user ? user.country || '' : '',
  })
  const [countries, setCountries] = useState([])
  const [alertMsg, setAlertMsg] = useState('');

  useEffect(() => {
    const countries = countryList().getData();
    setCountries(countries);
    if(user && user.country) {
      countries.map((country) => {
        if(country.value === user.country) {
          setInputs({ ...inputs, country })
        }
      })
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setInputs(inputs => ({ ...inputs, [name]: value }));
  }

  const selectCountry = (country) => {
    setInputs({ ...inputs, country });
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
    if(inputs.name && inputs.walletAddress && inputs.country) {
      update(user.id, token, {
        name: inputs.name,
        walletAddr: inputs.walletAddress,
        country: inputs.country.value,
      }).then((user) => {
        if(user) {
          dispatch({ type: 'SET_USER', payload: user });
        } else {
          setAlertMsg('Failed to update profile');
        }
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
          {/* <Link to='/'><i className='material-icons close'>clear</i></Link> */}
        </div>
        { alertMsg &&
          <Alert variant="danger" onClose={() => setAlertMsg('')} dismissible>
            <Alert.Heading>Update profile failed!</Alert.Heading>
            <p>{alertMsg}</p>
          </Alert>
          }
        <div>
          <form name='form' className='m-0'>
            <FormGroup>
              { !editing && 
              <p>{inputs.name || 'Full name'}</p>
              }
              { editing &&
              <>
                <FormControl placeholder='Full Name' type='text' name='name' value={inputs.name} onChange={handleChange} readOnly={!editing}></FormControl>
                {submitted && !inputs.name &&
                <FormControl.Feedback type='invalid' className='d-block'>{ErrorMessage.requireUserName}</FormControl.Feedback>
                }
              </>
              }
            </FormGroup>
            <FormGroup>
              { !editing && 
              <p>{inputs.email || 'Email'}</p>
              }
              { editing &&
              <>
              <FormControl placeholder='Email' type='email' name='email' value={inputs.email} onChange={handleChange} readOnly={true}></FormControl>
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
              <p>{inputs.country?.label || 'Country'}</p>
              }
              { editing && 
              <>
              <Dropdown drop="down">
              <Dropdown.Toggle className="form-control text-left bg-white">
                {inputs.country?.label || 'Select country'}
                <i className="fa fa-angle-down text-right" />
              </Dropdown.Toggle>
              <Dropdown.Menu className="w-100">
                <Dropdown.Item className="w-100" onClick={(e) => { selectCountry(""); }}>
                  ...
                </Dropdown.Item>
                {countries &&
                countries.length &&
                countries.map((optItem, index) => {
                  return (
                  <Dropdown.Item
                      key={index}
                      className="w-100"
                      onClick={(e) => {
                        selectCountry(optItem);
                      }}
                      active={inputs.country.value === optItem.value}
                  >
                      {optItem.label}
                  </Dropdown.Item>
                  );
                })}
              </Dropdown.Menu>
              </Dropdown>
              <FormControl.Feedback type="invalid" className={ submitted && !inputs.country ? "d-block" : ""}>
                  Country required
              </FormControl.Feedback>
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
