import React from 'react';
import PropTypes from 'prop-types';
import { Formik, Form } from 'formik';
import { TextField, FormControl } from '@mui/material';
import { useDispatch } from 'react-redux';
import Button from '../../../ui/button';
import { deleteUsersByEmail } from '../../../service/user.service';
import notifier from '../../../service/notify.service';
import { startGlobalLoading, finishGlobalLoading } from '../../../store/action';
import './index.scss';

export default function DeleteUsersByEmail({ authToken }) {
  const dispatch = useDispatch();

  return (
    <Formik
      initialValues={{
        emails: '',
      }}
      onSubmit={({ emails }) => {
        dispatch(startGlobalLoading());
        deleteUsersByEmail(emails, authToken)
          .then((data) => notifier.success(data.message))
          .catch((error) => notifier.error(error.message))
          .finally(() => dispatch(finishGlobalLoading()));
      }}
    >
      {(formikObj) => {
        return (
          <Form className="deleteUsersByEmail">
            <h4>Remove users by emails</h4>
            <FormControl margin="normal" className="execution__input">
              <TextField
                id="emails"
                label="User emails"
                size="small"
                helperText="Input emails separated by a comma"
                value={formikObj.values.emails}
                onChange={formikObj.handleChange}
              />
            </FormControl>
            <Button onClick={formikObj.submitForm}>Delete users</Button>
          </Form>
        );
      }}
    </Formik>
  );
}

DeleteUsersByEmail.propTypes = {
  authToken: PropTypes.string.isRequired,
};
