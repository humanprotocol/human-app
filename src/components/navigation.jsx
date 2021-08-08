import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, withRouter } from "react-router-dom";
import { PrimaryColor, SecondaryColor } from '../constants';
import logImg from '../assets/images/app_logo.png';
import { Routes } from '../routes';
import { Dropdown, Button } from 'react-bootstrap';
import { logOut } from '../service/user.service';

const Navigation = ({ history }) => {
  const dispatch = useDispatch();
  const { user, isAuthed } = useSelector((state) => state.auth);
  const [ avatar, setAvatar ] = useState('X');
  const hmtCounts = useSelector((state) => state.hmt.htmCounts);

  const LogOut = (e) => {
    e.preventDefault();
    logOut().then(() => {
      dispatch({
        type: 'AUTH_SIGN_OUT',
        payload: false,
      });
    });
    history.push({ pathname: Routes.Home.path });
  };

  return (
    <nav id='menu' className='navbar navbar-default fixed-top mb-0'>
      <div className='container'>
        <div className='navbar-header'>
          <Link to={{ pathname: Routes.Home.path}} className='navbar-brand page-scroll no-padding' style={{ color: SecondaryColor.blue, letterSpacing: '4px' }}>
            <img className='app-logo mr-3' src={logImg} alt='human-app-log'></img>
            <span className='d-none d-sm-block'>HUMAN App</span>
          </Link>
        </div>
        { isAuthed &&  
        <div className='d-block d-sm-none'>{hmtCounts} HMT</div>
        }
        <div className='row m-0'>
          { !isAuthed && <Link to={{ pathname:'/login' }} style={{color: PrimaryColor.black}} className='page-scroll'>Log In</Link> }
          {isAuthed &&
          <Dropdown>
            <Dropdown.Toggle id="avatar" className='bg-blue text-center p-0'><span className='ml-1'>{avatar}</span></Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Item href={Routes.Profile.path}>Profile</Dropdown.Item>
              <Dropdown.Item onClick={LogOut}>Log out</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
          }
        </div>
      </div>
    </nav>
  );
};

export default withRouter(Navigation);
