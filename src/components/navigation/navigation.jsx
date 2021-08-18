import { useSelector, useDispatch } from 'react-redux';
import { Link, withRouter, useLocation } from "react-router-dom";
import { PrimaryColor, SecondaryColor } from '../../constants';
import logImg from '../../assets/images/app_logo.svg';
import { Routes } from '../../routes';
import { logOut } from '../../service/user.service';
import './navigation.scss';

const Navigation = ({ history }) => {
  const dispatch = useDispatch();
  const { pathname } = useLocation();
  const { user, isAuthed, token, refreshToken } = useSelector((state) => state.auth);
  const hmtCounts = useSelector((state) => state.hmt.htmCounts);

  const handleLogIn = (e) => {
    e.preventDefault()
    if(!isAuthed) {
      return history.push({ pathname: Routes.Login.path });
    } else {
      return logOut(token, refreshToken)
      .then(() => {
        dispatch({ type: 'AUTH_SIGN_OUT', payload: false });
        history.push({ pathname: Routes.Home.path });
      }).catch((err) => {
        console.log('>>>>>>>>>>>>>>>>>>>>>>', err.message);
        alert('Failed to log out');
      });
      
    }
  }

  return (
    <nav id='menu' className='navbar navbar-default fixed-top mb-0'>
      <div className='container'>
        <div className='navbar-header'>
          <Link to={{ pathname: Routes.Home.path}} className='navbar-brand page-scroll no-padding' style={{ color: SecondaryColor.blue, letterSpacing: '4px' }}>
            <img className='app-logo mr-3' src={logImg} alt='human-app-log'></img>
          </Link>
        </div>
        { //isAuthed &&  
        // <div className='d-block d-sm-none'>{hmtCounts} HMT</div>
        }
        <div className='row m-0'>
          { !pathname.includes('verify-email') && 
          <Link to='' style={{color: PrimaryColor.black}} className='page-scroll login-btn' onClick={handleLogIn}>{ !isAuthed ? 'Log in' : 'Log out' }</Link>
          }
        </div>
      </div>
    </nav>
  );
};

export default withRouter(Navigation);
