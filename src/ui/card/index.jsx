import React from 'react';
import { useTheme } from '@mui/styles';
import PropTypes from 'prop-types';
import MuiCard from '@mui/material/Card';

export default function Card({ children, styles }) {
  const theme = useTheme();
  const cardStyles = {
    borderColor: theme.palette.primary.main,
    ...styles,
  };
  return (
    <MuiCard variant="outlined" sx={cardStyles}>
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
