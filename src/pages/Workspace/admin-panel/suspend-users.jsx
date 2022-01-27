/* eslint-disable no-unused-vars */
import React from 'react';
import PropTypes from 'prop-types';
import { Formik, Form } from 'formik';
import { TextField, FormControl, MenuItem } from '@mui/material';
import { useDispatch } from 'react-redux';
import Button from '../../../ui/button';
import { suspendUsers } from '../../../service/user.service';
import notifier from '../../../service/notify.service';
import { startGlobalLoading, finishGlobalLoading } from '../../../store/action';
import './index.scss';

const suspendStatuses = [
  {
    value: 'FAKE_USER',
    label: 'Fake user',
  },
  {
    value: 'REFERRAL_PROGRAM_VIOLATOR',
    label: 'Referral program violator',
  },
];

export default function SuspendUsers({ authToken }) {
  const dispatch = useDispatch();
  const [suspendStatus, setStatus] = React.useState('FAKE_USER');

  const handleChange = (event) => {
    setStatus(event.target.value);
  };

  return (
    <Formik
      initialValues={{
        userEmails: '',
      }}
      onSubmit={({ userEmails }) => {
        dispatch(startGlobalLoading());
        suspendUsers(userEmails, suspendStatus, authToken)
          .then((data) => notifier.success(data.message))
          .catch((error) => notifier.error(error.message))
          .finally(() => dispatch(finishGlobalLoading()));
      }}
    >
      {(formikObj) => {
        return (
          <Form className="suspendUsers">
            <h4>Suspend Users</h4>
            <FormControl margin="normal" className="execution__input">
              <TextField
                id="userEmails"
                label="User emails"
                size="small"
                value={formikObj.values.userEmails}
                onChange={formikObj.handleChange}
              />
            </FormControl>
            <FormControl margin="normal" className="execution__input">
              <TextField
                id="suspendStatus"
                select
                label="Select"
                value={suspendStatus}
                onChange={handleChange}
                helperText="Please select the reason"
              >
                {suspendStatuses.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>
            </FormControl>
            <Button onClick={formikObj.submitForm}>Suspend</Button>
          </Form>
        );
      }}
    </Formik>
  );
}

SuspendUsers.propTypes = {
  authToken: PropTypes.string.isRequired,
};
