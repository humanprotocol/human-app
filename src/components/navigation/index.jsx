import React, { useSelector, useDispatch } from 'react-redux';
import { Link, withRouter, useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';
import { Button } from 'react-bootstrap';
import { colors } from '../../constants';
import logImg from '../../assets/images/app_logo.svg';
import { Routes } from '../../routes';
import { logOut } from '../../service/user.service';
import './index.scss';

const Navigation = ({ history }) => {
  const dispatch = useDispatch();
  const { pathname } = useLocation();
  const { isAuthed, token, refreshToken } = useSelector((state) => state.auth);

  const handleLogIn = (e) => {
    e.preventDefault();
    if (!isAuthed) {
      return history.push({ pathname: Routes.Login.path });
    }
    logOut(token, refreshToken)
      .catch(() => {})
      .finally(() => {
        dispatch({ type: 'AUTH_SIGN_OUT', payload: false });
        history.push({ pathname: Routes.Home.path });
      });
  };

  return (
    <nav id="menu" className="navbar navbar-default fixed-top mb-0">
      <div className="container">
        <div className="navbar-header">
          <Link
            to={{ pathname: Routes.Home.path }}
            className="navbar-brand page-scroll no-padding"
            style={{ color: colors.secondaryColor.blue, letterSpacing: '4px' }}
          >
            <img className="app-logo mr-3" src={logImg} alt="human-app-log" />
          </Link>
        </div>
        <div className="row m-0">
          {!pathname.includes('verify-email') && (
            <Button className="page-scroll login-btn" onClick={handleLogIn}>
              {!isAuthed ? 'Log in' : 'Log out'}
            </Button>
          )}
        </div>
      </div>
    </nav>
  );
};
Navigation.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
};

export default withRouter(Navigation);
