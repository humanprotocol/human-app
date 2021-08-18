import { useSelector, useDispatch } from "react-redux";
import Welcome  from "./welcome";
import { IntroSection } from "./intro/intro";
import { withRouter } from "react-router-dom";
import './home.scss';

const HomePage = ({ data, history }) => {
  return (
    <>
      <Welcome />
      <IntroSection />
    </>
  );
};

export default withRouter(HomePage);
