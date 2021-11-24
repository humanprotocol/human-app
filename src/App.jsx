import React from 'react';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import ReactGA from 'react-ga4';
import SmoothScroll from 'smooth-scroll';
import { createBrowserHistory } from 'history';
import { ToastContainer } from 'react-toastify';

import Navigation from './components/navigation';
import HomePage from './pages/Home';
import LoginPage from './pages/Login';
// import RegisterPage from './pages/login/register';
import ForgotPasswordPage from './pages/Login/forgot-password';
import ProfilePage from './pages/Profile';
// import VerifyEmail from './pages/login/verifyEmail';

import { Subscribe } from './pages/Home/subscribe';
import { Routes } from './routes';
import ScrollToTop from './ui/scroll-to-top';

import './app.scss';
import Workspace from './pages/Workspace';

import 'react-toastify/dist/ReactToastify.css';

export const scroll = new SmoothScroll('a[href*="#"]', {
  speed: 1000,
  speedAsDuration: true,
});

const App = () => {
  const history = createBrowserHistory();
  // Google Analytics Setup
  ReactGA.initialize('G-YGBRX2Z0WB');
  history.listen((location) => {
    ReactGA.set({ page: location.pathname }); // Update the user's current page
    ReactGA.pageview(location.pathname); // Record a pageview for the given page
  });

  return (
    <div>
      <Router history={history}>
        <Navigation />
        <ScrollToTop>
          <Switch>
            <Route exact path={Routes.Home.path} component={HomePage} />
            <Route exact path={Routes.Login.path} component={LoginPage} />
            {/* <Route exact path={Routes.Register.path} component={RegisterPage} /> */}
            <Route exact path={Routes.Profile.path} component={ProfilePage} />
            <Route exact path={Routes.ForgotPassword.path} component={ForgotPasswordPage} />
            {/* <Route exact path={Routes.VerifyEmail.path} component={VerifyEmail} /> */}
            <Route exact path={Routes.Workspace.path} component={Workspace} />
            <Redirect from="*" to="/" />
          </Switch>
        </ScrollToTop>
        <Subscribe history={history} />
      </Router>
      <ToastContainer />
    </div>
  );
};

export default App;
