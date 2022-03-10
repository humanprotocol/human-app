import React from 'react';
import PropTypes from 'prop-types';
import { useRouteMatch, useHistory } from 'react-router-dom';
import Tooltip from '@mui/material/Tooltip';

export default function WorkSpaceNavLink({ to, disabled, children, tooltip }) {
  const history = useHistory();
  const match = useRouteMatch({
    path: to,
    exact: true,
  });
  const classes = ['workspace-nav-item'];
  if (disabled) {
    classes.push('disabled');
  }
  if (match) {
    classes.push('active');
  }
  const onClick = (e) => {
    e.stopPropagation();
    if (disabled) {
      return null;
    }

    history.push({ pathname: to });
  };
  return (
    <Tooltip title={tooltip}>
      <span className={`${classes.join(' ')}`} to={to} onClick={onClick}>
        {children}
      </span>
    </Tooltip>
  );
}

WorkSpaceNavLink.propTypes = {
  to: PropTypes.string.isRequired,
  disabled: PropTypes.bool,
  children: PropTypes.node,
  tooltip: PropTypes.string,
};

WorkSpaceNavLink.defaultProps = {
  disabled: false,
  children: '',
  tooltip: '',
};
