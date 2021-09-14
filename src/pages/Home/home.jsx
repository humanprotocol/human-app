import React from 'react-redux';
import { withRouter } from 'react-router-dom';
import Welcome from './welcome';
import { IntroSection } from './intro/intro';
import './home.scss';

const HomePage = () => (
  <>
    <Welcome />
    <IntroSection />
  </>
);

export default withRouter(HomePage);
