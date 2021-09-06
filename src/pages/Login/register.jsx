import { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, withRouter } from "react-router-dom";
import { FormGroup, FormControl, Button, Alert, Dropdown } from "react-bootstrap";
import HCaptcha from "@hcaptcha/react-hcaptcha";
import countryList from "react-select-country-list";
import { Password } from "../../components/inputs/password/password";
import './login.scss';
import { register, resendEmailVerification } from "../../service/user.service";
import { Routes } from "../../routes";
import { RegisterSchema, validate } from "../../util/validation";

const RegisterPage = (props) => {
    const { history } = props;
    const dispatch = useDispatch();
    const { user, token } = useSelector((state) => state.auth);
    if(!user || !user?.email) {
        history.push({ pathname: Routes.Home.path });
    }

    const [countries, setCountries] = useState([])
    const [inputs, setInputs] = useState({
        email: user ? user.email : '',
        userName: '',
        password: '',
        repeatPassword: '',
        country: '',
        refCode: '',
    });
    const [validationErrors, setValidationErrors] = useState({
        email: '',
        userName: '',
        password: '',
        repeatPassword: '',
        country: '',
        refCode: ''
    });
    const [submitted, setSubmitted] = useState(false);
    const [submittable, setsubmittable] = useState(false);
    const [alertMsg, setAlertMsg] = useState('');
    const [hcaptchaToken, setHcaptchaToken] = useState('');
    const captchaRef = useRef(null);
    const { email, password, repeatPassword, userName, country, refCode } = inputs;

    useEffect(() => {
        const countries = countryList().getData();
        setCountries(countries);
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setInputs(inputs => ({ ...inputs, [name]: value }));
    }

    const handleVerificationSuccess = (token) => {
        if(token) {
            setHcaptchaToken(token);
            const validationError = validate(RegisterSchema, inputs);
            if(validationError) {
                let newErrors = {
                    email: '',
                    userName: '',
                    password: '',
                    repeatPassword: '',
                    country: '',
                    refCode: ''
                };
                validationError.map((error) => {
                    newErrors[error.key] = error.message;
                });
                setValidationErrors(newErrors);
                setsubmittable(false);
            } else {
                setValidationErrors({
                    email: '',
                    userName: '',
                    password: '',
                    repeatPassword: '',
                    country: '',
                    refCode: ''
                });
                setsubmittable(true);
            }
        } else {
            setValidationErrors({
                email: '',
                userName: '',
                password: '',
                repeatPassword: '',
                country: '',
                refCode: ''
            });
            setsubmittable(false);
        }
    }

    const handleRegister = (e) => {
        e.preventDefault();
        setSubmitted(true);
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
            setAlertMsg('');
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
            setHcaptchaToken('');
            setsubmittable(false);
            captchaRef.current.resetCaptcha();
        });
    }
    
    const handleBlur = (e) => {
        e.preventDefault()
        const validationError = validate(RegisterSchema, inputs);
        if(validationError) {
            let newErrors = {
                email: '',
                userName: '',
                password: '',
                repeatPassword: '',
                country: '',
                refCode: ''
            };
            validationError.map((error) => {
                newErrors[error.key] = error.message;
            });
            setValidationErrors(newErrors);
            setsubmittable(false);
        } else {
            setValidationErrors({
                email: '',
                userName: '',
                password: '',
                repeatPassword: '',
                country: '',
                refCode: ''
            });
            setsubmittable(true);
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
                            <FormControl placeholder='Full name' type='text' name='userName' value={userName} onChange={handleChange} onBlur={handleBlur}></FormControl>
                            {validationErrors.userName &&
                            <FormControl.Feedback type='invalid' className='d-block'>{validationErrors.userName}</FormControl.Feedback>
                            }
                        </FormGroup>
                        <FormGroup>
                            <FormControl placeholder='refCode' type='text' name='refCode' value={refCode} onChange={handleChange}></FormControl>
                        </FormGroup>
                        <FormGroup>
                            <Dropdown drop="down" onBlur={handleBlur}>
                            <Dropdown.Toggle className="form-control text-left bg-white">
                                {country?.label || 'Select country'}
                                <i className="fa fa-angle-down text-right" />
                            </Dropdown.Toggle>
                            <Dropdown.Menu className="w-100">
                                <Dropdown.Item
                                className="w-100"
                                onClick={(e) => setInputs({ ...inputs, country: '' })}
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
                                        onClick={(e) => setInputs({ ...inputs, country: optItem })}
                                        active={country.value === optItem.value}
                                    >
                                        {optItem.label}
                                    </Dropdown.Item>
                                    );
                                })}
                            </Dropdown.Menu>
                            </Dropdown>
                            {validationErrors.country &&
                            <FormControl.Feedback type='invalid' className='d-block'>{validationErrors.country}</FormControl.Feedback>
                            }
                            <FormControl.Feedback type="invalid" className={ submitted && !inputs.country ? "d-block" : ""}>
                                Country required
                            </FormControl.Feedback>
                        </FormGroup>
                        <FormGroup className='password'>
                            <Password onChange={handleChange} onBlur={handleBlur} name='password' value={password} placeholder='Create password' className='mb-5'></Password>
                            {validationErrors.password &&
                            <FormControl.Feedback type='invalid' className='d-block'>{validationErrors.password}</FormControl.Feedback>
                            }
                        </FormGroup>
                        <FormGroup className='password'>
                            <Password onChange={handleChange} onBlur={handleBlur} name='repeatPassword' value={repeatPassword} placeholder='Confirm password' className='mb-5'></Password>
                            {validationErrors.repeatPassword &&
                            <FormControl.Feedback type='invalid' className='d-block'>{validationErrors.repeatPassword}</FormControl.Feedback>
                            }
                        </FormGroup>
                        <FormGroup className='text-center'>
                            <HCaptcha
                                sitekey={process.env.REACT_APP_HCAPTCHA_SITE_KEY}
                                onVerify={(token) =>
                                handleVerificationSuccess(token)
                                }
                                ref={captchaRef}
                            />
                        </FormGroup>
                        <FormGroup className='actions d-flex justify-content-between m-0'>
                            <Link className='btn' to={Routes.Home.path}>Back</Link>
                            <Button className='form-control bg-blue' onClick={handleRegister} disabled={!submittable}>Next</Button>
                        </FormGroup>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default withRouter(RegisterPage);