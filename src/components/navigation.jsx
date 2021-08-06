import { useSelector, useDispatch } from 'react-redux';
import { Link, withRouter } from "react-router-dom";
import { signIn } from '../service/base.service';
import { PrimaryColor, SecondaryColor } from '../constants';
import logImg from '../assets/images/app_logo.png';

const Navigation = ({ history }) => {
  const dispatch = useDispatch();
  const isAuthed = useSelector((state) => state.auth.isAuthed);
  const handleLogOut = () => {
    dispatch({
      type: 'AUTH_SIGN_OUT',
      payload: false,
    });
  };

  return (
    <nav id='menu' className='navbar navbar-default fixed-top mb-0'>
      <div className='container'>
        <div className='navbar-header'>
          <a className='navbar-brand page-scroll no-padding' href='/' style={{ color: SecondaryColor.blue, height:'36px', letterSpacing: '4px' }}>
            <img className='app-logo mr-3' src={logImg} alt='human-app-log'></img>
            HUMAN App
          </a>{' '}
        </div>
        <div style={{ width: '87px' }}>
          {isAuthed ? (
            <Link to={{ pathname:'/' }} onClick={handleLogOut} style={{color: PrimaryColor.black}}>LogOut</Link>
          ) : (
            <Link to={{ pathname:'/login' }} style={{color: PrimaryColor.black}} className='page-scroll'>Log In</Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default withRouter(Navigation);
