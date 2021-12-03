import React from 'react';
import PropTypes from 'prop-types';
import { Radio, RadioGroup, TextField, FormControl, FormControlLabel } from '@mui/material';
import { Formik, Form } from 'formik';
import Button from '../../../ui/button';
import { referQuestions } from './constants';
import './index.scss';

export default function ReferPlaces({ onSubmit, title }) {
  return (
    <Formik
      initialValues={{
        referPlace: '',
        otherPlace: '',
      }}
      onSubmit={({ referPlace, otherPlace }) => {
        if (referPlace) {
          onSubmit(referPlace);
        } else {
          onSubmit(otherPlace);
        }
      }}
    >
      {(formikObj) => {
        const { values, setFieldValue, submitForm, dirty } = formikObj;
        return (
          <Form className="questionnaire-form-container">
            <div className="page-title">
              <h2> {title} </h2>
            </div>
            <FormControl component="fieldset">
              <RadioGroup name="refer-questions-group">
                {referQuestions.map((referQuestion) => (
                  <FormControlLabel
                    key={referQuestion}
                    control={
                      <Radio
                        checked={values.referPlace === referQuestion}
                        onChange={(event) => {
                          event.stopPropagation();
                          setFieldValue('otherPlace', '');
                          setFieldValue('referPlace', referQuestion);
                        }}
                      />
                    }
                    label={referQuestion}
                  />
                ))}
              </RadioGroup>
            </FormControl>

            <FormControl margin="normal">
              <TextField
                id="otherPlace"
                value={values.otherPlace}
                size="small"
                label="Somewhere else"
                onChange={(e) => {
                  e.stopPropagation();
                  const {
                    target: { value },
                  } = e;
                  if (!value) {
                    return null;
                  }
                  setFieldValue('referPlace', '');
                  setFieldValue('otherPlace', e.target.value);
                }}
              />
            </FormControl>
            <Button onClick={submitForm} disabled={!dirty}>
              Submit
            </Button>
          </Form>
        );
      }}
    </Formik>
  );
}

ReferPlaces.propTypes = {
  title: PropTypes.string.isRequired,
  onSubmit: PropTypes.func.isRequired,
};
