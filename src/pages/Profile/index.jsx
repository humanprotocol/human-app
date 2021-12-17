import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import { Formik, Form, Field } from 'formik';
import { FormGroup, FormControl, Button, Dropdown, Alert } from 'react-bootstrap';
import { startGlobalLoading, finishGlobalLoading } from '../../store/action';
import { ProfileValidationSchema } from './schema';
import { Routes } from '../../routes';
import { update } from '../../service/user.service';
import { countries, errors as errorsConstants } from '../../constants';
import ProfileView from './view';
import './index.scss';

const ProfilePage = (props) => {
  const { history } = props;
  const dispatch = useDispatch();
  const { user, isAuthed, token } = useSelector((state) => state.auth);
  if (!isAuthed) history.push({ pathname: Routes.Home.path });

  const [editing, setEditing] = useState(false);
  const [alertMsg, setAlertMsg] = useState('');
  const [countryName, setCountryName] = useState('');
  const initialValues = {
    email: user?.email || '',
    name: user?.name || '',
    polygonWalletAddr: user?.polygonWalletAddr || '',
    country: user?.country || '',
  };

  useEffect(() => {
    if (user) {
      if (user.country) {
        const countryData = countries.countryList.filter((item) => item.Code === user.country);
        setCountryName(countryData[0].Name);
      }
    }
  }, []);

  const handleUpdateProfile = ({ name, polygonWalletAddr, country }, { setSubmitting }) => {
    setSubmitting(true);
    if (token) {
      dispatch(startGlobalLoading());
      update(user.id, token, {
        name,
        polygonWalletAddr,
        country,
      })
        .then((userRes) => {
          if (userRes) {
            dispatch({ type: 'SET_USER', payload: userRes });
          } else {
            setAlertMsg('Failed to update profile');
          }
          setEditing(false);
          setSubmitting(false);
        })
        .catch((err) => {
          setAlertMsg(err.message);
          setSubmitting(false);
        })
        .finally(() => dispatch(finishGlobalLoading()));
    } else {
      setSubmitting(false);
      setAlertMsg(errorsConstants.ErrorMessage.requireAuthToken);
    }
  };

  const handleChangeCountry = (countryCode) => {
    const countryData = countries.countryList.filter((item) => item.Code === countryCode);
    setCountryName(countryData[0].Name);
  };

  return (
    <div id="profile" className="col-md-4 offset-md-4 d-flex flex-column justify-content-center">
      {!editing && (
        <ProfileView
          name={user?.name}
          email={user?.email}
          countryCode={user?.country}
          walletAddr={user?.polygonWalletAddr}
          onEditClick={() => setEditing(true)}
        />
      )}
      {editing && (
        <div className="container">
          <div className="page-title d-flex justify-content-between mb-4">
            <h2>Edit Profile</h2>
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
            onSubmit={handleUpdateProfile}
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
                  <Field className="form-control" placeholder="Full Name" type="text" name="name" />
                  {touched.name && errors.name && (
                    <FormControl.Feedback type="invalid" className="d-block text-left">
                      {errors.name}
                    </FormControl.Feedback>
                  )}
                </FormGroup>
                <FormGroup>
                  <FormControl
                    className="form-control"
                    placeholder="Email"
                    type="email"
                    name="email"
                    value={values.email}
                    readOnly
                  />
                  {touched.email && errors.email && (
                    <FormControl.Feedback type="invalid" className="d-block text-left">
                      {errors.name}
                    </FormControl.Feedback>
                  )}
                </FormGroup>
                <FormGroup>
                  <Dropdown
                    drop="down"
                    onToggle={(isOpen) => {
                      if (isOpen) setFieldTouched('country', true);
                    }}
                  >
                    <Dropdown.Toggle className="form-control text-left bg-white">
                      {countryName || 'Select country'}
                      <i className="fa fa-angle-down text-right" />
                    </Dropdown.Toggle>
                    <Dropdown.Menu className="w-100">
                      <Dropdown.Item
                        className="w-100"
                        onClick={(e) => {
                          e.preventDefault();
                          setFieldTouched('country', true);
                          setFieldValue('country', '');
                          setCountryName('');
                        }}
                      >
                        ...
                      </Dropdown.Item>
                      {countries.countryList &&
                        countries.countryList.length &&
                        countries.countryList.map((optItem) => (
                          <Dropdown.Item
                            className="w-100"
                            key={optItem.Code}
                            onClick={() => {
                              setFieldValue('country', optItem.Code);
                              handleChangeCountry(optItem.Code);
                            }}
                            active={values.country === optItem.Code}
                          >
                            {optItem.Name}
                          </Dropdown.Item>
                        ))}
                    </Dropdown.Menu>
                  </Dropdown>
                  {touched.country && errors.country && (
                    <FormControl.Feedback type="invalid" className="d-block text-left">
                      {errors.country}
                    </FormControl.Feedback>
                  )}
                </FormGroup>
                <FormGroup>
                  <Field
                    className="form-control"
                    placeholder="Polygon Wallet Address"
                    type="text"
                    name="polygonWalletAddr"
                  />
                  {touched.polygonWalletAddr && errors.polygonWalletAddr && (
                    <FormControl.Feedback type="invalid" className="d-block text-left">
                      {errors.polygonWalletAddr}
                    </FormControl.Feedback>
                  )}
                </FormGroup>
                <FormGroup className="actions d-flex justify-content-between m-0">
                  <Button
                    className="form-control btn mr-2 bg-white"
                    onClick={() => history.push({ pathname: Routes.Workspace.path })}
                  >
                    Back
                  </Button>
                  <Button
                    className="form-control bg-blue"
                    disabled={!(isValid && dirty)}
                    onClick={handleSubmit}
                  >
                    Save changes
                  </Button>
                </FormGroup>
              </Form>
            )}
          </Formik>
        </div>
      )}
    </div>
  );
};
ProfilePage.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
};
export default withRouter(ProfilePage);
