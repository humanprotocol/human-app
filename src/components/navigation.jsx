import { useSelector, useDispatch } from 'react-redux';
import { useHistory } from "react-router-dom";
import { signIn } from '../service/base.service';
import { PrimaryColor, SecondaryColor } from '../constants';
import logImg from '../assets/images/app_logo.png';
import { Routes } from '../routes';

export const Navigation = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const isAuthed = useSelector((state) => state.auth.isAuthed);
  const hmtCounts = useSelector((state) => state.hmt.htmCounts);

  const handleSignIn = () => {
    signIn().then((res) => {
      if (res) {
        dispatch({
          type: 'AUTH_SIGN_IN',
          payload: true,
        });
        history.push('/login')
      }
    });
  };

  const handleLogOut = () => {
    dispatch({
      type: 'AUTH_SIGN_OUT',
      payload: false,
    });
    history.push('/');
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
            <a onClick={handleLogOut} style={{color: PrimaryColor.black}}>LogOut</a>
          ) : (
            <a href={Routes.Login.path} className='page-scroll' onClick={handleSignIn} style={{color: PrimaryColor.black}}>Log in</a>
          )}
        </div>
      </div>
    </nav>
  );
};
