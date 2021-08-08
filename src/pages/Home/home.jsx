import { useSelector, useDispatch } from "react-redux";
import Welcome  from "./welcome";
import { Job } from "./job";
import { Subscribe } from "./subscribe";
import { IntroSection } from "./intro/intro";
import { withRouter } from "react-router-dom";

const HomePage = ({ data, history }) => {
  const isAuthed = useSelector((state) => state.auth.isAuthed);

  return (
    <>
      <Welcome />
      {isAuthed && <Job history={history}/>}
      <IntroSection />
      <Subscribe history={history} />
    </>
  );
};

export default withRouter(HomePage);
