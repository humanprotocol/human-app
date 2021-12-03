import React from 'react';
import PropTypes from 'prop-types';
import { Checkbox, TextField, FormControl, FormControlLabel } from '@mui/material';
import { Formik, Form } from 'formik';
import Button from '../../../ui/button';
import { desiredTasks } from './constants';
import './index.scss';

export default function DesiredTasks({ onSubmit, title }) {
  return (
    <Formik
      initialValues={{
        tasks: desiredTasks.map(() => false),
        otherTask: '',
      }}
      onSubmit={({ tasks, otherTask }) => {
        const result = [];
        tasks.forEach((isChecked, idx) => {
          if (!isChecked) {
            return null;
          }
          result.push(desiredTasks[idx]);
        });
        if (otherTask) {
          result.push(otherTask);
        }
        onSubmit(result);
      }}
    >
      {(formikObj) => {
        const { values, setFieldValue, submitForm, dirty } = formikObj;
        return (
          <Form className="questionnaire-form-container">
            <div className="page-title">
              <h2> {title} </h2>
            </div>
            {values.tasks.map((isChecked, idx) => (
              <FormControlLabel
                key={desiredTasks[idx]}
                control={
                  <Checkbox
                    checked={isChecked}
                    onChange={(event) => {
                      event.stopPropagation();
                      setFieldValue(`tasks.${idx}`, event.target.checked);
                    }}
                  />
                }
                label={desiredTasks[idx]}
              />
            ))}

            <FormControl margin="normal">
              <TextField
                id="otherTask"
                label="Something else"
                size="small"
                value={values.otherTask}
                onChange={formikObj.handleChange}
              />
            </FormControl>
            <Button onClick={submitForm} disabled={!dirty}>
              Next
            </Button>
          </Form>
        );
      }}
    </Formik>
  );
}

DesiredTasks.propTypes = {
  title: PropTypes.string.isRequired,
  onSubmit: PropTypes.func.isRequired,
};
