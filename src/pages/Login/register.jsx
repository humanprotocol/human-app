import { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, Redirect, withRouter } from "react-router-dom";
import { FormGroup, FormControl, Button, Alert, Dropdown } from "react-bootstrap";
import * as EmailValidator from 'email-validator';
import HCaptcha from "@hcaptcha/react-hcaptcha";
import countryList from "react-select-country-list";
import { ErrorMessage, SignUpOpt } from "../../constants";
import { Password } from "../../components/inputs/password/password";
import './login.scss';
import { register, resendEmailVerification, sendNewsletterSignup, verifyEmail } from "../../service/user.service";
import { Routes } from "../../routes";

const RegisterPage = (props) => {
    const { history } = props;
    const dispatch = useDispatch();
    const { user, isAuthed, token } = useSelector((state) => state.auth);
    if(!user || !user?.email) {
        history.push({ pathname: Routes.Home.path });
    }

    const [option, setOption] = useState(SignUpOpt.register)
    const [emailVerified, setEmailVerified] = useState(false)
    const [countries, setCountries] = useState([])
    const [confirm, setConfirm] = useState(true)     
    const [inputs, setInputs] = useState({
        email: user ? user.email : '',
        userName: '',
        firstName: '',
        lastName: '',
        password: '',
        repeatPassword: '',
        walletAddress: '',
        country: '',
        refCode: '',
    });
    const [submitted, setSubmitted] = useState(false);
    const [alertMsg, setAlertMsg] = useState('');
    const [captchaPassed, setCaptchaPassed] = useState(false);
    const [hcaptchaToken, setHcaptchaToken] = useState('');
    const captchaRef = useRef(null);

    useEffect(() => {
        const countries = countryList().getData();
        setCountries(countries);
    }, []);

    const { email, password, repeatPassword, userName, country, refCode } = inputs;
    
    const handleChange = (e) => {
        const { name, value } = e.target;
        setInputs(inputs => ({ ...inputs, [name]: value }));
    }

    const selectCountry = (country) => {
        setInputs({ ...inputs, country });
    } 

    const handleVerificationSuccess = (token) => {
        if(token) {
            setCaptchaPassed(true);
            setHcaptchaToken(token);
        }
      }

    const handleRegister = (e) => {
        e.preventDefault();
        setSubmitted(true);

        if(password && repeatPassword && password !== repeatPassword) {
            setConfirm(false);
            setCaptchaPassed(false);
            setHcaptchaToken('');
            captchaRef.current.resetCaptcha();
        }
        setConfirm(true);
        if(email && password && country && userName && confirm && EmailValidator.validate(email) && captchaPassed) {
            const newUser = {
                name: userName, 
                email, 
                password, 
                country: country.value,
                hcaptchaToken,
            }
            
            if(refCode) {
                newUser['refCode'] = refCode;
            }

            return register(newUser).then((response) => {
                dispatch({
                    type: 'AUTH_SIGN_IN',
                    payload: response.isEmailVerified,
                });
                dispatch({
                    type: 'AUTH_SUCCESS',
                    payload: response,
                });
                setSubmitted(false);
                setAlertMsg('');
                setCaptchaPassed(false);
                setHcaptchaToken('');
                return response.token;
            })
            .then((token) => resendEmailVerification(token))
            .then(() => {
                setAlertMsg('');
                history.push({ pathname: Routes.VerifyEmail.path });
            })
            .catch((err) => {
                setAlertMsg(err.message);
                setCaptchaPassed(false);
                setHcaptchaToken('');
                captchaRef.current.resetCaptcha();
            })
        } else {
            setCaptchaPassed(false);
            setHcaptchaToken('');
            captchaRef.current.resetCaptcha();
        }
    }

    return (
        <div id='register' className='col-md-4 offset-md-4 d-flex flex-column justify-content-center h-100'>
            <div className='container'>
                <div className='page-title d-flex justify-content-between mb-4'>
                    <h2>Create account</h2>
                </div>
                { alertMsg && alertMsg.length &&
                <Alert variant="danger" onClose={() => setAlertMsg('')} dismissible>
                    <Alert.Heading>Register failed!</Alert.Heading>
                    <p>{alertMsg}</p>
                </Alert>
                }
                <div>
                    <form name='form'>
                        <FormGroup>
                            <FormControl placeholder='Full name' type='text' name='userName' value={userName} onChange={handleChange}></FormControl>
                            {submitted && !userName &&
                            <FormControl.Feedback type='invalid' className='d-block'>{ErrorMessage.requireUserName}</FormControl.Feedback>
                            }
                        </FormGroup>
                        <FormGroup>
                            <FormControl placeholder='refCode' type='text' name='refCode' value={refCode} onChange={handleChange}></FormControl>
                        </FormGroup>
                        <FormGroup>
                            <Dropdown drop="down">
                            <Dropdown.Toggle className="form-control text-left bg-white">
                                {country?.label || 'Select country'}
                                <i className="fa fa-angle-down text-right" />
                            </Dropdown.Toggle>
                            <Dropdown.Menu className="w-100">
                                <Dropdown.Item
                                className="w-100"
                                onClick={(e) => {
                                    selectCountry("");
                                }}
                                >
                                ...
                                </Dropdown.Item>
                                {countries &&
                                countries.length &&
                                countries.map((optItem, index) => {
                                    return (
                                    <Dropdown.Item
                                        key={index}
                                        className="w-100"
                                        onClick={(e) => {
                                         selectCountry(optItem);
                                        }}
                                        active={country.value === optItem.value}
                                    >
                                        {optItem.label}
                                    </Dropdown.Item>
                                    );
                                })}
                            </Dropdown.Menu>
                            </Dropdown>
                            <FormControl.Feedback type="invalid" className={ submitted && !inputs.country ? "d-block" : ""}>
                                Country required
                            </FormControl.Feedback>
                        </FormGroup>
                        <Password onChange={handleChange} name='password' value={password} placeholder='Create password' submitted={submitted} className='mb-5' confirm={confirm}></Password>
                        <Password onChange={handleChange} name='repeatPassword' value={repeatPassword} placeholder='Confirm password' submitted={submitted} className='mb-5' confirm={confirm}></Password>
                        <FormGroup className='text-center'>
                        <HCaptcha
                            sitekey={process.env.REACT_APP_HCAPTCHA_SITE_KEY}
                            onVerify={(token, ekey) =>
                            handleVerificationSuccess(token)
                            }
                            ref={captchaRef}
                        />
                        {submitted && !captchaPassed &&
                            <FormControl.Feedback type='invalid' className='d-block'>{ErrorMessage.captchPassRequired}</FormControl.Feedback>
                        }
                        </FormGroup>
                        <FormGroup className='actions d-flex justify-content-between m-0'>
                            <Link className='btn' to={Routes.Home.path}>Back</Link>
                            <Button className='form-control bg-blue' onClick={handleRegister} disabled={!captchaPassed}>Next</Button>
                        </FormGroup>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default withRouter(RegisterPage);