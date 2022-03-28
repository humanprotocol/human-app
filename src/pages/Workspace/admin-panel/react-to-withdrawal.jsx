import React from 'react';
import PropTypes from 'prop-types';
import { Formik, Form } from 'formik';
import { TextField, FormControl } from '@mui/material';
import { useDispatch } from 'react-redux';
import Button from '../../../ui/button';
import notifier from '../../../service/notify.service';
import { startGlobalLoading, finishGlobalLoading } from '../../../store/action';
import './index.scss';
import { reactToWithdrawal } from '../../../service/withdraw.service';

export default function ReactToWithdrawal({ authToken }) {
  const dispatch = useDispatch();

  return (
    <Formik
      initialValues={{
        withdrawalId: '',
      }}
      onSubmit={({ withdrawalId, txHash }) => {
        dispatch(startGlobalLoading());
        reactToWithdrawal(authToken, withdrawalId, txHash)
          .then((data) => notifier.success(data.message))
          .catch((error) => notifier.error(error.message))
          .finally(() => dispatch(finishGlobalLoading()));
      }}
    >
      {(formikObj) => {
        return (
          <Form>
            <h4>Sync Withdrawal With Blockchain</h4>
            <p color="grey">
              This is intended for syncing transactions in the blockchain and withdrawals in the
              system in case of errors on the human app side. This functionality should be used only
              when withdrawals have a transaction in the blockchain, but user tokens and withdrawal
              status are not updated in the system
            </p>
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
                id="txHash"
                label="Transaction Hash"
                size="small"
                value={formikObj.values.txHash}
                helperText="Input the new transaction hash"
                onChange={formikObj.handleChange}
              />
            </FormControl>
            <Button onClick={formikObj.submitForm}>Sync</Button>
          </Form>
        );
      }}
    </Formik>
  );
}

ReactToWithdrawal.propTypes = {
  authToken: PropTypes.string.isRequired,
};
