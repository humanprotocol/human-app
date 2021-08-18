import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect,
} from "react-router-dom";
import ReactGA from 'react-ga4';
import SmoothScroll from "smooth-scroll";
import { createBrowserHistory } from "history";

import Navigation from "./components/navigation/navigation";
import HomePage from "./pages/Home/home";
import LoginPage from "./pages/Login/login";
import RegisterPage from "./pages/Login/register";
import ForgotPasswordPage from "./pages/Login/forgotPassword";
import ProfilePage from "./pages/Profile/profile";
import LinkWalletPage from "./pages/Wallet/link";
import VerifyEmail from "./pages/Login/verifyEmail";

import { Subscribe } from "./pages/Home/subscribe";
import { Routes } from "./routes";

import "./App.scss";
import Job from "./pages/Job/job";


export const scroll = new SmoothScroll('a[href*="#"]', {
  speed: 1000,
  speedAsDuration: true,
});

const App = () => {
  const history = createBrowserHistory();
  // Google Analytics Setup
  ReactGA.initialize("G-YGBRX2Z0WB");
  history.listen(location => {
    ReactGA.set({ page: location.pathname }); // Update the user's current page
    ReactGA.pageview(location.pathname); // Record a pageview for the given page
  });

  return (
    <div>
      <Router history={history}>
        <Navigation />
        <Switch>
          <Route exact path={Routes.Home.path} component={HomePage} />
          <Route exact path={Routes.Login.path} component={LoginPage} />
          <Route exact path={Routes.Register.path} component={RegisterPage} />
          <Route exact path={Routes.Profile.path} component={ProfilePage} />
          <Route
            exact
            path={Routes.LinkWallet.path}
            component={LinkWalletPage}
          />
          <Route
            exact
            path={Routes.ForgotPassword.path}
            component={ForgotPasswordPage}
          />
          <Route exact path={Routes.VerifyEmail.path} component={VerifyEmail} />
          <Route exact path={Routes.Earning.path} component={LinkWalletPage} />
          <Route exact path={Routes.Job.path} component={Job} />
          <Redirect from="*" to="/" />
        </Switch>
        <Subscribe history={history} />
      </Router>
    </div>
  );
};

export default App;
