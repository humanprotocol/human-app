import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import { Formik, Form, Field } from 'formik';
import { FormGroup, FormControl, Button, Dropdown, Alert } from 'react-bootstrap';
import countryList from 'react-select-country-list';
import { Routes } from '../../routes';
import { update } from '../../service/user.service';
import { ErrorMessage } from '../../constants';
import { ProfileValidationSchema } from '../../validationSchema/user.schema';
import './profile.scss';

const ProfilePage = props => {
  const { history } = props;
  const dispatch = useDispatch();
  const { user, isAuthed, token } = useSelector(state => state.auth);
  if (!isAuthed) history.push({ pathname: Routes.Home.path });
  const countries = countryList().getData();
  const countryData = {};
  countries.map(item => {
    countryData[item.value] = item;
    return true;
  });

  const [editing, setEditting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [inputs, setInputs] = useState({
    email: user ? user.email : '',
    name: user ? user.name : '',
    walletAddress: user ? user.walletAddress : '',
    country: user?.country ? countryData[user.country] : '',
  });
  const [countries, setCountries] = useState(coutryList);
  const [alertMsg, setAlertMsg] = useState('');

  const handleChange = e => {
    const { name, value } = e.target;
    setInputs({ ...inputs, [name]: value });
  };

  const [editing, setEditting] = useState(false);
  const initialValues = {
    email: user?.email || '',
    name: user?.name || '',
    walletAddr: user?.walletAddr || '',
    country: user?.country || '',
  };
  const [alertMsg, setAlertMsg] = useState('');

  const handleUpdatProfile = ({ name, walletAddr, country }, { setSubmitting }) => {
    setSubmitting(true);
    if (token) {
      update(user.id, token, {
        name,
        walletAddr,
        country,
      })
        .then(userRes => {
          if (userRes) {
            dispatch({ type: 'SET_USER', payload: userRes });
          } else {
            setAlertMsg('Failed to update profile');
          }
          setEditting(false);
          setSubmitting(false);
        })
        .catch(err => {
          setAlertMsg(err.message);
          setSubmitting(false);
        });
    } else {
      setSubmitting(false);
      setAlertMsg(ErrorMessage.requireAuthToken);
    }
  };

  const toggleEditProfile = e => {
    e.preventDefault();
    setEditting(!editing);
  };

  return (
    <div id="profile" className="col-md-4 offset-md-4 d-flex flex-column justify-content-center">
      <div className="container">
        <div className="page-title d-flex justify-content-between mb-4">
          <h2>{editing ? 'Edit Profile' : 'Profile'}</h2>
          {/* <Link to='/'><i className='material-icons close'>clear</i></Link> */}
        </div>
        {alertMsg && (
          <Alert variant="danger" onClose={() => setAlertMsg('')} dismissible>
            <Alert.Heading>Update profile failed!</Alert.Heading>
            <p>{alertMsg}</p>
          </Alert>
        )}
        <Formik
          initialValues={initialValues}
          validationSchema={ProfileValidationSchema}
          onSubmit={handleUpdatProfile}
        >
          {({
            errors,
            touched,
            isValid,
            dirty,
            values,
            handleSubmit,
            setFieldTouched,
            setFieldValue,
          }) => (
            <Form>
              <FormGroup>
                {!editing && <p>{values.name || 'Full name'}</p>}
                {editing && (
                  <Field className="form-control" placeholder="Full Name" type="text" name="name" />
                )}
                {editing && touched.name && errors.name && (
                  <FormControl.Feedback type="invalid" className="d-block text-left">
                    {errors.name}
                  </FormControl.Feedback>
                )}
              </FormGroup>
              <FormGroup>
                {!editing && <p>{values.email || 'Email'}</p>}
                {editing && (
                  <FormControl
                    className="form-control"
                    placeholder="Email"
                    type="email"
                    name="email"
                    value={values.email}
                    readOnly={editing}
                  />
                )}
                {editing && touched.email && errors.email && (
                  <FormControl.Feedback type="invalid" className="d-block text-left">
                    {errors.name}
                  </FormControl.Feedback>
                )}
              </FormGroup>
              <FormGroup>
                {!editing && (
                  <p>{values.country ? countryData[values.country].label : 'Country'}</p>
                )}
                {editing && (
                  <>
                    <Dropdown
                      drop="down"
                      onToggle={isOpen => {
                        if (isOpen) setFieldTouched('country', true);
                      }}
                    >
                      <Dropdown.Toggle className="form-control text-left bg-white">
                        {values.country ? countryData[values.country].label : 'Select country'}
                        <i className="fa fa-angle-down text-right" />
                      </Dropdown.Toggle>
                      <Dropdown.Menu className="w-100">
                        <Dropdown.Item
                          className="w-100"
                          onClick={e => {
                            e.preventDefault();
                            setFieldTouched('country', true);
                            setFieldValue('country', '');
                          }}
                        >
                          ...
                        </Dropdown.Item>
                        {countries &&
                          countries.length &&
                          countries.map(optItem => (
                            <Dropdown.Item
                              className="w-100"
                              key={optItem.value}
                              // eslint-disable-next-line no-unused-vars
                              onClick={e => {
                                setFieldValue('country', optItem.value);
                              }}
                              active={values.country === optItem.value}
                            >
                              {optItem.label}
                            </Dropdown.Item>
                          ))}
                      </Dropdown.Menu>
                    </Dropdown>
                  </>
                )}
                {editing && touched.country && errors.country && (
                  <FormControl.Feedback type="invalid" className="d-block text-left">
                    {errors.country}
                  </FormControl.Feedback>
                )}
              </FormGroup>
              <FormGroup>
                {!editing && <p>{values.walletAddr || 'Wallet address'}</p>}
                {editing && (
                  <Field
                    className="form-control"
                    placeholder="Wallet Address"
                    type="text"
                    name="walletAddr"
                  />
                )}
                {editing && touched.walletAddr && errors.walletAddr && (
                  <FormControl.Feedback type="invalid" className="d-block text-left">
                    {errors.walletAddr}
                  </FormControl.Feedback>
                )}
              </FormGroup>
              <FormGroup className="actions d-flex justify-content-between m-0">
                <Link className="btn" to={Routes.Home.path}>
                  Back
                </Link>
                <Button
                  className="form-control bg-blue"
                  disabled={editing && !(isValid && dirty)}
                  onClick={editing ? handleSubmit : toggleEditProfile}
                >
                  {editing ? 'Save changes' : 'Edit'}
                </Button>
              </FormGroup>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};
ProfilePage.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
};
export default withRouter(ProfilePage);
