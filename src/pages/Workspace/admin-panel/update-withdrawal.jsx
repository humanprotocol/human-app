import React from 'react';
import PropTypes from 'prop-types';
import { Formik, Form } from 'formik';
import { TextField, FormControl, MenuItem } from '@mui/material';
import { useDispatch } from 'react-redux';
import Button from '../../../ui/button';
import notifier from '../../../service/notify.service';
import { startGlobalLoading, finishGlobalLoading } from '../../../store/action';
import './index.scss';
import { withdrawalStatusToTitle } from '../withdrawals/constants';
import { updateWithdrawal } from '../../../service/withdraw.service';

const statuses = [
  {
    value: 'cancelled',
    label: withdrawalStatusToTitle.cancelled,
  },
  {
    value: 'waitsExecution',
    label: withdrawalStatusToTitle.waitsExecution,
  },
];

export default function UpdateWithdrawal({ authToken }) {
  const dispatch = useDispatch();
  const [newWithdrawalStatus, setStatus] = React.useState('cancelled');

  const handleChange = (event) => {
    setStatus(event.target.value);
  };

  return (
    <Formik
      initialValues={{
        withdrawalId: '',
      }}
      onSubmit={({ withdrawalId }) => {
        dispatch(startGlobalLoading());
        updateWithdrawal(authToken, withdrawalId, newWithdrawalStatus)
          .then((data) => notifier.success(data.message))
          .catch((error) => notifier.error(error.message))
          .finally(() => dispatch(finishGlobalLoading()));
      }}
    >
      {(formikObj) => {
        return (
          <Form>
            <h4>Update Withdrawal Status</h4>
            <FormControl margin="normal" className="execution__input">
              <TextField
                id="withdrawalId"
                label="Withdrawal ID"
                size="small"
                value={formikObj.values.withdrawalId}
                onChange={formikObj.handleChange}
              />
            </FormControl>
            <FormControl margin="normal" className="execution__input">
              <TextField
                id="newWithdrawalStatus"
                select
                label="Select"
                value={newWithdrawalStatus}
                onChange={handleChange}
                helperText="Please select the new status"
              >
                {statuses.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>
            </FormControl>
            <Button onClick={formikObj.submitForm}>Update</Button>
          </Form>
        );
      }}
    </Formik>
  );
}

UpdateWithdrawal.propTypes = {
  authToken: PropTypes.string.isRequired,
};
