import { useState } from 'react';
import { FormGroup, Button } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import './login.scss';

const VerifyEmail = ({ history }) => {
    const dispatch = useDispatch();

    const [verified, setVerified] = useState(false)
    const { email } = history.location.state;
    const handleSubmit = (e) => {
        e.preventDefault();
        if(verified) {
            dispatch({
                type: 'AUTH_SIGN_IN',
                payload: true,
            });
            history.push({ pathname: '/', state: { email } });
        }
        else {
            setVerified(true);
        }
    }

    return (
        <div id='verifyEmail' className='col-md-4 offset-md-4 d-flex flex-column justify-content-center h-100'>
            <div className='page-title d-flex justify-content-between mb-4'>
                <h2>{ verified ? 'Email verified' : 'Verify email'}</h2>
                <Link to='/'><i className='material-icons close'>clear</i></Link>
            </div>
            <div>
                <form name='form'>
                    { verified && 
                    <FormGroup><Button className='form-control bg-blue' onClick={handleSubmit}>Next</Button></FormGroup>
                    }
                    { !verified &&
                    <>
                        <FormGroup><Button className='form-control bg-blue' onClick={handleSubmit}>Click here to verify your email</Button></FormGroup>
                        <FormGroup><Button className='form-control bg-white' onClick={handleSubmit}>Click here to re-send email</Button></FormGroup>
                    </>
                    }
                </form>
            </div>
        </div>
    )
}

export default VerifyEmail;