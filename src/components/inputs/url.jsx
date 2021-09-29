import React from 'react';
import PropTypes from 'prop-types';

export const URLInput = ({ className, value, onChange, name, reset }) => {
  const refresh = e => {
    e.preventDefault();
    reset();
  };
  return (
    <div className={className}>
      <div className="input-group">
        <input
          className="form-control py-2"
          type="url"
          value={value}
          onChange={onChange}
          name={name}
        />
        <div className="input-group-append" onClick={refresh}>
          <button className="btn" type="button">
            <i className="material-icons">refresh</i>
          </button>
        </div>
      </div>
    </div>
  );
};
URLInput.propTypes = {
  className: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  name: PropTypes.string.isRequired,
  reset: PropTypes.func.isRequired,
};
