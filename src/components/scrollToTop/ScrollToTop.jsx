import React, { useEffect } from 'react';
import { useLocation } from 'react-router';
import PropTypes from 'prop-types';

const ScrollToTop = ({ children }) => {
  const location = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);

  return <>{children}</>;
};

ScrollToTop.propTypes = {
  children: PropTypes.node.isRequired,
};

export default ScrollToTop;
