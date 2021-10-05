import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { FormControl, InputGroup } from 'react-bootstrap';
import './password.css';

export const Password = (props) => {
  const [hidden, setHidden] = useState(true);
  const ToogleShow = (e) => {
    e.preventDefault();
    setHidden(!hidden);
  };
  const { placeholder, name, value, onChange, onBlur } = props;
  return (
    <InputGroup>
      <FormControl
        placeholder={placeholder}
        type={hidden ? 'password' : 'text'}
        name={name}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
      />
      <span
        onClick={ToogleShow}
        className="position-absolute d-flex flex-column justify-content-center h-100"
      >
        <i className={`fa ${hidden ? 'fa-eye-slash' : 'fa-eye'}`} aria-hidden="true" />
      </span>
    </InputGroup>
  );
};

Password.propTypes = {
  placeholder: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  onBlur: PropTypes.func.isRequired,
};
