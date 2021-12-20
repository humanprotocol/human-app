import React from 'react';
import PropTypes from 'prop-types';
import { Formik, Form } from 'formik';
import { TextField, FormControl } from '@mui/material';
import { useDispatch } from 'react-redux';
import Button from '../../../ui/button';
import { execute } from '../../../service/withdraw.service';
import notifier from '../../../service/notify.service';
import { startGlobalLoading, finishGlobalLoading } from '../../../store/action';
import './index.scss';

export default function ExecuteWithdrawals({ authToken }) {
  const dispatch = useDispatch();

  return (
    <Formik
      initialValues={{
        withdrawalsLimit: 5,
        maxGasPriceInGwei: 55,
        maxGasLimit: 100000,
      }}
      onSubmit={({ withdrawalsLimit, maxGasPriceInGwei, maxGasLimit }) => {
        dispatch(startGlobalLoading());
        execute(maxGasPriceInGwei, maxGasLimit, withdrawalsLimit, authToken)
          .then((data) => notifier.success(data.message))
          .catch((error) => notifier.error(error.message))
          .finally(() => dispatch(finishGlobalLoading()));
      }}
    >
      {(formikObj) => {
        return (
          <Form className="execution">
            <h4>Execute Withdrawals</h4>
            <FormControl margin="normal" className="execution__input">
              <TextField
                id="withdrawalsLimit"
                label="Withdrawals limit"
                size="small"
                value={formikObj.values.withdrawalsLimit}
                onChange={formikObj.handleChange}
              />
            </FormControl>
            <FormControl margin="normal" className="execution__input">
              <TextField
                id="maxGasPrice"
                label="Max gas price in GWEI"
                size="small"
                value={formikObj.values.maxGasPriceInGwei}
                onChange={formikObj.handleChange}
              />
            </FormControl>
            <FormControl margin="normal" className="execution__input">
              <TextField
                id="maxGasLimit"
                label="Max gas limit"
                size="small"
                value={formikObj.values.maxGasLimit}
                onChange={formikObj.handleChange}
              />
            </FormControl>
            <Button onClick={formikObj.submitForm}>Execute</Button>
          </Form>
        );
      }}
    </Formik>
  );
}

ExecuteWithdrawals.propTypes = {
  authToken: PropTypes.string.isRequired,
};
