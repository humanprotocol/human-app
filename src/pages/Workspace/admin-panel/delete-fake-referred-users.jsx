import React from 'react';
import PropTypes from 'prop-types';
import { Formik, Form } from 'formik';
import { TextField, FormControl } from '@mui/material';
import { useDispatch } from 'react-redux';
import Button from '../../../ui/button';
import { deleteFakeReferralUsers } from '../../../service/user.service';
import notifier from '../../../service/notify.service';
import { startGlobalLoading, finishGlobalLoading } from '../../../store/action';
import './index.scss';

export default function DeleteFakeReferredUsers({ authToken }) {
  const dispatch = useDispatch();

  return (
    <Formik
      initialValues={{
        userEmails: '',
      }}
      onSubmit={({ violatorEmail, userEmails }) => {
        dispatch(startGlobalLoading());
        deleteFakeReferralUsers(violatorEmail, userEmails, authToken)
          .then((data) => notifier.success(data.message))
          .catch((error) => notifier.error(error.message))
          .finally(() => dispatch(finishGlobalLoading()));
      }}
    >
      {(formikObj) => {
        return (
          <Form className="deleteFakeReferralUsers">
            <h4>Remove fake referred users</h4>
            <FormControl margin="normal" className="execution__input">
              <TextField
                id="violatorEmail"
                label="Violator's email"
                size="small"
                value={formikObj.values.violatorEmail}
                onChange={formikObj.handleChange}
              />
            </FormControl>
            <FormControl margin="normal" className="execution__input">
              <TextField
                id="userEmails"
                label="User emails"
                size="small"
                helperText="Input emails separated by a comma"
                value={formikObj.values.userEmails}
                onChange={formikObj.handleChange}
              />
            </FormControl>
            <Button onClick={formikObj.submitForm}>Remove</Button>
          </Form>
        );
      }}
    </Formik>
  );
}

DeleteFakeReferredUsers.propTypes = {
  authToken: PropTypes.string.isRequired,
};
