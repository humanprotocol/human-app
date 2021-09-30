import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { FormControl } from 'react-bootstrap';
import './password.css';

export const Password = ({ placeholder, name, value, onChange, submitted, confirm }) => {
  const [hidden, setHidden] = useState(true);
  const ToogleShow = e => {
    e.preventDefault();
    setHidden(!hidden);
  };
  return (
    <div className="form-group password">
      <div className="input-group">
        <FormControl
          placeholder={placeholder}
          type={hidden ? 'password' : 'text'}
          name={name}
          value={value}
          onChange={onChange}
        />
        <span
          onClick={ToogleShow}
          className="position-absolute d-flex flex-column justify-content-center h-100"
        >
          <i className={`fa ${hidden ? 'fa-eye-slash' : 'fa-eye'}`} aria-hidden="true" />
        </span>
      </div>
      {submitted && !value && (
        <FormControl.Feedback className="d-block" type="invalid">
          <div key="field-error-password" className="fieldError">
            Password is required
          </div>
        </FormControl.Feedback>
      )}
      {submitted && value && !confirm && (
        <FormControl.Feedback className="d-block" type="invalid">
          <div key="field-error-password" className="fieldError">
            Password not same
          </div>
        </FormControl.Feedback>
      )}
    </div>
  );
};
Password.propTypes = {
  placeholder: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  submitted: PropTypes.bool.isRequired,
  confirm: PropTypes.bool.isRequired,
  onChange: PropTypes.func.isRequired,
};
