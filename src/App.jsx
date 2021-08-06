import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Switch, Redirect, useHistory } from 'react-router-dom';
import Navigation from './components/navigation';
import HomePage from './pages/Home/home';
import LoginPage from './pages/Login/login';
import RegisterPage from './pages/Login/register';
import ForgotPasswordPage from './pages/Login/forgotPassword';
import ProfilePage from './pages/Profile/profile';
import LinkWalletPage from './pages/Wallet/link';
import VerifyEmail from './pages/Login/verifyEmail';

import { Footer } from './components/footer';
import { Routes } from './routes';

import JsonData from './data/data.json';
import SmoothScroll from 'smooth-scroll';
import './App.css';

export const scroll = new SmoothScroll('a[href*="#"]', {
  speed: 1000,
  speedAsDuration: true,
});

const App = () => {
  const history = useHistory();
  const [landingPageData, setLandingPageData] = useState({});
  useEffect(() => {
    setLandingPageData(JsonData);
  }, []);

  return (
    <div>
      <Router history={history}>
        <Navigation />
        <Switch>
          <Route exact path={Routes.Home.path} component={HomePage} />
          <Route exact path={Routes.Login.path} component={LoginPage} />
          <Route exact path={Routes.Register.path} component={RegisterPage} />
          <Route exact path={Routes.Profile.path} component={ProfilePage} />
          <Route exact path={Routes.LinkWallet.path} component={LinkWalletPage} />
          <Route exact path={Routes.ForgotPassword.path} component={ForgotPasswordPage} />
          <Route exact path={Routes.VerifyEmail.path} component={VerifyEmail} />
          <Route exact path={Routes.Earning.path} component={LinkWalletPage} />
          <Redirect from='*' to='/' />
        </Switch>
        <Footer />
      </Router>
    </div>
  );
};

export default App;
