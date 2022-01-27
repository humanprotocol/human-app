import React from 'react';
import PropTypes from 'prop-types';
import { Formik, Form } from 'formik';
import { TextField, FormControl } from '@mui/material';
import { useDispatch } from 'react-redux';
import Button from '../../../ui/button';
import { unsuspendUsers } from '../../../service/user.service';
import notifier from '../../../service/notify.service';
import { startGlobalLoading, finishGlobalLoading } from '../../../store/action';
import './index.scss';

export default function UnsuspendUsers({ authToken }) {
  const dispatch = useDispatch();

  return (
    <Formik
      initialValues={{
        userEmails: '',
      }}
      onSubmit={({ userEmails }) => {
        dispatch(startGlobalLoading());
        unsuspendUsers(userEmails, authToken)
          .then((data) => notifier.success(data.message))
          .catch((error) => notifier.error(error.message))
          .finally(() => dispatch(finishGlobalLoading()));
      }}
    >
      {(formikObj) => {
        return (
          <Form className="suspendUsers">
            <h4>Unsuspend Users</h4>
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
            <Button onClick={formikObj.submitForm}>Unsuspend</Button>
          </Form>
        );
      }}
    </Formik>
  );
}

UnsuspendUsers.propTypes = {
  authToken: PropTypes.string.isRequired,
};
