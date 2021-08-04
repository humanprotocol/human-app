import { useState, useEffect } from "react";
import { Router, Route, Switch, Redirect } from "react-router-dom";
import { Navigation } from "./components/navigation";
import HomePage from "./pages/Home/home";
import LoginPage from "./pages/Login/login";
import RegisterPage from "./pages/Login/register";
import ForgotPasswordPage from "./pages/Login/forgotPassword";
import ProfilePage from "./pages/Profile/profile";
import LinkWalletPage from "./pages/Wallet/link";
import { Footer } from "./components/footer";
import { history, Routes } from "./routes";

import JsonData from "./data/data.json";
import SmoothScroll from "smooth-scroll";
import "./App.css";

export const scroll = new SmoothScroll('a[href*="#"]', {
  speed: 1000,
  speedAsDuration: true,
});

const App = () => {
  const [landingPageData, setLandingPageData] = useState({});
  useEffect(() => {
    setLandingPageData(JsonData);
  }, []);

  return (
    <div>
      <Navigation />
      {/* <Router history={history}>
        <Switch>
          <Route exact path={Routes.Home.path} component={HomePage} />
          <Route exact path={Routes.Login.path} component={LoginPage} />
          <Route exact path={Routes.Register} component={RegisterPage} />
          <Route exact path={Routes.Profile} component={ProfilePage} />
          <Route exact path={Routes.LinkWallet} component={LinkWalletPage} />
          <Route exact path={Routes.ForgotPassword} component={ForgotPasswordPage} />
          <Route exact path={Routes.Earning} component={LinkWalletPage} />
          <Redirect from="*" to="/" />
        </Switch>
      </Router> */}
      <ProfilePage />

      <Footer />
    </div>
  );
};

export default App;
