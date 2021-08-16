import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, Redirect, withRouter } from "react-router-dom";
import { FormGroup, FormControl, Button, Alert, Dropdown } from "react-bootstrap";
import * as EmailValidator from 'email-validator';
import countryList from "react-select-country-list";
import { ErrorMessage, SignUpOpt } from "../../constants";
import { Password } from "../../components/inputs/password/password";
import './login.scss';
import { register, verifyEmail } from "../../service/user.service";
import { Routes } from "../../routes";

const RegisterPage = (props) => {
    const { history } = props;
    const dispatch = useDispatch();
    const { user, isAuthed } = useSelector((state) => state.auth);
    const [option, setOption] = useState(SignUpOpt.register)
    const [emailVerified, setEmailVerified] = useState(false)
    const [coutries, setCoutries] = useState([])
    const [confirm, setConfirm] = useState(true)
     
    const [inputs, setInputs] = useState({
        email: '',
        userName: '',
        firstName: '',
        lastName: '',
        password: '',
        repeatPassword: '',
        walletAddress: '',
        verificationToken: '',
    });
    const [alertMsg, setAlertMsg] = useState('');
    useEffect(() => {
        const countries = countryList().getData();
        setCoutries(countries);
        if(history.location.state.email) {
            setInputs({ ...inputs, email: history.location.state.email })
        }
    }, []);

    const [submitted, setSubmitted] = useState(false);
    const { email, password, repeatPassword, userName,  verificationToken } = inputs;
    
    const handleChange = (e) => {
        const { name, value } = e.target;
        setInputs(inputs => ({ ...inputs, [name]: value }));
    }

    const handleRegister = (e) => {
        e.preventDefault();
        setSubmitted(true);

        if(password && repeatPassword && password !== repeatPassword) {
            setConfirm(false);
        }

        if(email && password && userName && confirm && EmailValidator.validate(email)) {
            return register({ name: userName, email, password }).then((response) => {
                dispatch({
                    type: 'AUTH_SIGN_IN',
                    payload: true,
                });
                dispatch({
                    type: 'AUTH_SUCCESS',
                    payload: response,
                });
                setOption(SignUpOpt.verifyEmail);
                setSubmitted(false);
            }).catch((err) => {
                setAlertMsg(err.message);
            })
        }
    }

    const resendVerification = (e) => {
        e.preventDefault();

    }

    const handleSubmit = (e) => {
        e.preventDefault();
        setSubmitted(true);
        if(emailVerified) {
            history.push({ pathname: Routes.Profile.path });
        }
    }

    const handleVerification = (e) => {
        e.preventDefault()
        setSubmitted(true);

        if(verificationToken) {
            return verifyEmail(verificationToken)
                .then(() => {
                    setAlertMsg('');
                    setEmailVerified(true);
                }).catch((err) => { setAlertMsg(err.message) });
        }
    }

    return (
        <div id='register' className='col-md-4 offset-md-4 d-flex flex-column justify-content-center h-100'>
            <div className='container'>
                <div className='page-title d-flex justify-content-between mb-4'>
                    { option === SignUpOpt.verifyEmail && !emailVerified &&
                       <h2>Verify email</h2>
                    }
                    { option === SignUpOpt.verifyEmail && emailVerified &&
                       <h2>Email verified</h2>
                    }
                    { option === SignUpOpt.register && 
                       <h2>Create account</h2>
                    }
                    <Link to='/'><i className='material-icons close'>clear</i></Link>
                </div>
                { alertMsg && alertMsg.length &&
                <Alert variant="danger" onClose={() => setAlertMsg('')} dismissible>
                    { option === SignUpOpt.register && 
                    <Alert.Heading>Register failed!</Alert.Heading>
                    }
                    { option === SignUpOpt.verifyEmail && 
                    <Alert.Heading>Email verification failed!</Alert.Heading>
                    }
                    <p>{alertMsg}</p>
                </Alert>
                }
                <div>
                    <form name='form'>
                        { option === SignUpOpt.verifyEmail && !emailVerified && 
                        <>
                        <FormGroup>
                            <FormControl placeholder='Token' type='text' name='verificationToken' value={verificationToken} onChange={handleChange}></FormControl>
                            {submitted && !verificationToken &&
                            <FormControl.Feedback type='invalid' className='d-block'>{ErrorMessage.requireVerificationToken}</FormControl.Feedback>
                            }
                        </FormGroup>
                        <FormGroup className='actions d-flex justify-content-between m-0'>
                            <Link className='btn' onClick={resendVerification}>Re-send</Link>
                            <Button className='form-control bg-blue' onClick={handleVerification}>Verify email</Button>
                        </FormGroup>
                        </>
                        }
                        { option === SignUpOpt.verifyEmail && emailVerified && 
                        <FormGroup className='actions d-flex justify-content-between m-0'>
                            <Link className='btn' onClick={() => setOption(SignUpOpt.register)}>Back</Link>
                            <Button className='form-control bg-blue' onClick={handleSubmit}>Next</Button>
                        </FormGroup>
                        }
                        { option === SignUpOpt.register && 
                        <>
                        <FormGroup>
                            <FormControl placeholder='Username' type='text' name='userName' value={userName} onChange={handleChange}></FormControl>
                            {submitted && !userName &&
                            <FormControl.Feedback type='invalid' className='d-block'>{ErrorMessage.requireUserName}</FormControl.Feedback>
                            }
                        </FormGroup>
                        {/* <FormGroup>
                            <Dropdown drop="down">
                            <Dropdown.Toggle className="form-control text-left bg-white">
                                {inputs.question_3 || "Select"}
                                <i className="fa fa-angle-down text-right" />
                            </Dropdown.Toggle>
                            <Dropdown.Menu className="w-100">
                                <Dropdown.Item
                                className="w-100"
                                onClick={(e) => {
                                    handleSelect("");
                                }}
                                >
                                Select
                                </Dropdown.Item>
                                {coutries &&
                                coutries.length &&
                                optItems.map((optItem, index) => {
                                    return (
                                    <Dropdown.Item
                                        key={index}
                                        className="w-100"
                                        onClick={(e) => {
                                        handleSelect(optItem.value);
                                        }}
                                        active={optItem.checked}
                                    >
                                        {optItem.value}
                                    </Dropdown.Item>
                                    );
                                })}
                            </Dropdown.Menu>
                            </Dropdown>
                            <FormControl.Feedback
                            type="invalid"
                            className={
                                submitted && !questions.question_3 ? "d-block" : ""
                            }
                            >
                            Question 3 required
                            </FormControl.Feedback>
                        </FormGroup> */}
                        <Password onChange={handleChange} name='password' value={password} placeholder='Create password' submitted={submitted} className='mb-5' confirm={confirm}></Password>
                        <Password onChange={handleChange} name='repeatPassword' value={repeatPassword} placeholder='Confirm password' submitted={submitted} className='mb-5' confirm={confirm}></Password>
                        <FormGroup className='actions d-flex justify-content-between m-0'>
                            <Link className='btn' to={Routes.Home.path}>Back</Link>
                            <Button className='form-control bg-blue' onClick={handleRegister}>Next</Button>
                        </FormGroup>
                        </>
                        }
                    </form>
                </div>
            </div>
        </div>
    )
}

export default withRouter(RegisterPage);