import React from 'react';
import PropTypes from 'prop-types';
import MuiButton from '@mui/material/Button';

export default function Button(props) {
  const { disabled, variant, endIcon, size, children, onClick } = props;
  return (
    <MuiButton
      disabled={disabled}
      variant={variant}
      endIcon={endIcon}
      size={size}
      color="primary"
      onClick={onClick}
      sx={{
        borderRadius: '0.5rem',
        width: '100%',
        height: '46px',
      }}
    >
      {children}
    </MuiButton>
  );
}

Button.propTypes = {
  disabled: PropTypes.bool,
  variant: PropTypes.string,
  children: PropTypes.node,
  endIcon: PropTypes.node,
  size: PropTypes.string,
  onClick: PropTypes.func,
};

Button.defaultProps = {
  disabled: false,
  variant: 'contained',
  children: '',
  endIcon: '',
  size: 'medium',
  onClick: () => {},
};
