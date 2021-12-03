import React from 'react';
import PropTypes from 'prop-types';
import MuiCard from '@mui/material/Card';

export default function Card({ children, styles }) {
  return (
    <MuiCard variant="outlined" sx={styles}>
      {children}
    </MuiCard>
  );
}

Card.propTypes = {
  children: PropTypes.node.isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  styles: PropTypes.any,
};

Card.defaultProps = {
  styles: {},
};
