import { useState } from 'react';
import { FormGroup, Button, Alert } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useLocation } from 'react-router-dom';
import { Routes } from '../../routes';
import { resendEmailVerification, verifyEmail } from '../../service/user.service';
import './login.scss';

const VerifyEmail = ({ history }) => {
    const dispatch = useDispatch();
    const { search } = useLocation();
    const auth = useSelector((state) => state.auth);
    const accessToken = auth.token;
    const user = auth.user;
    const [verified, setVerified] = useState(false);
    const [resentVerification, setResentVerification] = useState(false);
    const [token, setToken] = useState(search.replace('?token=', ''))
    const [alertMsg, setAlertMsg] = useState('')
    const handleVerification = (e) => {
        e.preventDefault();
        if(!token) setAlertMsg('token requried');
        else {
            return verifyEmail(token)
                .then(() => {
                    setAlertMsg('');
                    dispatch({ type: 'AUTH_SIGN_IN', payload: true });
                    dispatch({ type: 'SET_USER', payload: { ...user, isEmailVerified: true } });
                    setVerified(true);
                    setTimeout(() => {history.push({ pathname: Routes.Login.path })}, 3000);
                }).catch((err) => setAlertMsg(err.message));
        }
    }

    const resendVerification = (e) => {
        e.preventDefault()
        return resendEmailVerification(accessToken)
            .then(() => {
                setAlertMsg('');
                setResentVerification(true);
            }).catch((err) => setAlertMsg(err.message));

    }
    return (
        <div id='verifyEmail' className='col-md-4 offset-md-4 d-flex flex-column justify-content-center h-100'>
            <div className='container'>
                <div className='page-title d-flex justify-content-between mb-4'>
                    <h2>{ verified ? 'Email verified' : 'Verify email'}</h2>
                </div>
                { alertMsg && alertMsg.length &&
                <Alert variant="danger" onClose={() => setAlertMsg('')} dismissible>
                    <Alert.Heading>Email verification failed!</Alert.Heading>
                    <p>{alertMsg}</p>
                </Alert>
                }
                <div>
                    { verified && 
                    <p>Redirecting you to login.</p>
                    }
                    { !verified && !resentVerification && !token && accessToken &&
                    <p>Verification email is sent. Please check your email.</p>
                    }
                    { !verified && resentVerification && !token && accessToken && 
                    <p>Verification email is resent. Please check your email.</p>
                    }
                    {
                      !verified && token &&
                      <p> Please click Verify Email below to continue </p>
                    }
                    <form name='form'>
                        { !verified &&
                        <FormGroup className='actions d-flex justify-content-between m-0'>
                           {    !token && accessToken && 
                                <Link className='btn' onClick={resendVerification}>Re-send</Link>
                           }
                           { token &&  
                                <Button className='form-control bg-blue' onClick={handleVerification}>Verify email</Button> 
                            }
                        </FormGroup>
                        }
                    </form>
                </div>
            </div>
        </div>
    )
}

export default VerifyEmail;