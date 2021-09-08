import { useSelector, useDispatch } from 'react-redux';
import { withRouter } from 'react-router-dom';
import Welcome from './welcome';
import { IntroSection } from './intro/intro';
import './home.scss';

const HomePage = ({ data, history }) => (
  <>
    <Welcome />
    <IntroSection />
  </>
);

export default withRouter(HomePage);
