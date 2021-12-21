import React from 'react';
import PropTypes from 'prop-types';
import './index.scss';

export default function NetworkBadge({ title }) {
  return <div className="mark mb-3">{title}</div>;
}

NetworkBadge.propTypes = {
  title: PropTypes.string.isRequired,
};
