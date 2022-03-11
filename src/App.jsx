import React from 'react';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ReactGA from 'react-ga4';
import SmoothScroll from 'smooth-scroll';
import { createBrowserHistory } from 'history';
import { ToastContainer } from 'react-toastify';
import { ThemeProvider } from '@mui/material/styles';

import CookieConsent from 'react-cookie-consent';
import Navigation from './components/navigation';
import HomePage from './pages/Home';
import LoginPage from './pages/Login';
import RegisterPage from './pages/Register';
import ForgotPasswordPage from './pages/ForgotPassword';
import VerifyEmail from './pages/VerifyEmail';

import { Subscribe } from './pages/Home/subscribe';
import { Routes } from './routes';
import ScrollToTop from './ui/scroll-to-top';
import Loader from './ui/loader';
import theme from './theme';

import './App.scss';
import Workspace from './pages/Workspace';

import 'react-toastify/dist/ReactToastify.css';

export const scroll = new SmoothScroll('a[href*="#"]', {
  speed: 1000,
  speedAsDuration: true,
});

const App = () => {
  const history = createBrowserHistory();
  const { isLoading } = useSelector((state) => state.app);
  // Google Analytics Setup
  ReactGA.initialize('G-YGBRX2Z0WB');
  history.listen((location) => {
    ReactGA.set({ page: location.pathname }); // Update the user's current page
    ReactGA.pageview(location.pathname); // Record a pageview for the given page
  });

  return (
    <ThemeProvider theme={theme}>
      <Router history={history}>
        <Navigation />
        <ScrollToTop>
          <Switch>
            <Route exact path={Routes.Home.path} component={HomePage} />
            <Route exact path={Routes.Login.path} component={LoginPage} />
            <Route exact path={Routes.Register.path} component={RegisterPage} />
            <Route exact path={Routes.ForgotPassword.path} component={ForgotPasswordPage} />
            <Route exact path={Routes.VerifyEmail.path} component={VerifyEmail} />
            <Route path={Routes.Workspace.path} component={Workspace} />
            <Redirect from="*" to="/" />
          </Switch>
        </ScrollToTop>
        <Subscribe history={history} />
        <Loader isOpen={isLoading} />
      </Router>
      <CookieConsent
        location="bottom"
        buttonClasses="btn btn-custom form-control"
        buttonText="I understand"
        cookieName="cookiesConsent"
        style={{ background: 'rgba(50, 10, 141, 0.8)' }}
        expires={30}
      >
        We use cookies. By using this site, you consent to our{' '}
        <span>
          <a href="https://humanprotocol.org/app/privacy-policy" style={{ fontSize: '14px' }}>
            Privacy Policy
          </a>
        </span>
      </CookieConsent>
      <ToastContainer />
    </ThemeProvider>
  );
};

export default App;
