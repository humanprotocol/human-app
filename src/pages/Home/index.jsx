import React from 'react-redux';
import { withRouter } from 'react-router-dom';
import Welcome from './welcome';
import { IntroSection } from './intro';
import './index.scss';

const HomePage = () => (
  <>
    <Welcome />
    <IntroSection />
  </>
);

export default withRouter(HomePage);
