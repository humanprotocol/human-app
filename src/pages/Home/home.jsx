import { useSelector, useDispatch } from "react-redux";
import Welcome  from "./welcome";
import { Subscribe } from "./subscribe";
import { IntroSection } from "./intro/intro";
import { withRouter } from "react-router-dom";
import './home.scss';

const HomePage = ({ data, history }) => {
  return (
    <>
      <Welcome />
      <IntroSection />
      <Subscribe history={history} />
    </>
  );
};

export default withRouter(HomePage);
