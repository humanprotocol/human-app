import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Link, Redirect, withRouter } from "react-router-dom";
import { FormGroup, FormControl, Button, Alert } from "react-bootstrap";
import * as EmailValidator from 'email-validator';
import { ErrorMessage, SignUpOpt } from "../../constants";
import { Password } from "../../components/inputs/password/password";
import './login.scss';
import { register, linkWallet } from "../../service/user.service";
import { Routes } from "../../routes";

const RegisterPage = (props) => {
    const { history } = props;
    const dispatch = useDispatch();
    const [option, setOption] = useState(SignUpOpt.verifyEmail)
    const [emailVerified, setEmailVerified] = useState(false)
    const [inputs, setInputs] = useState({
        email: '',
        userName: '',
        firstName: '',
        lastName: '',
        password: '',
        walletAddress: '',
        verificationToken: '',
    });
    const [alertMsg, setAlertMsg] = useState('');
    useEffect(() => {
        if(history.location.state) 
            setOption(history.location.state);
    }, [])
    const [submitted, setSubmitted] = useState(false);
    const { email, password, userName, firstName, lastName, walletAddress, verificationToken } = inputs;
    
    const handleChange = (e) => {
        const { name, value } = e.target;
        setInputs(inputs => ({ ...inputs, [name]: value }));
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        setSubmitted(true);
        if(email && password && userName && firstName && lastName && EmailValidator.validate(email)) {
            register(inputs).then((user) => {
                dispatch({
                    type: 'AUTH_SIGN_IN',
                    payload: true,
                });
                dispatch({
                    type: 'AUTH_SUCCESS',
                    payload: user,
                });
                history.push({ pathname: Routes.Home.path });
            })
        }
    }

    const handleLinkWallet = (e) => {
        e.preventDefault();
        setSubmitted(true);
        if(walletAddress && walletAddress.length === 42) {
            linkWallet(walletAddress).then(() => {
                console.log('Success to link Wallet');
                setAlertMsg('');
                setOption(SignUpOpt.complete);
            }).catch((err) => {
                setAlertMsg(err.message);
            })
        }
    }

    const startQuestionnaire = (e) => {
        e.preventDefault();
        setSubmitted(false);
        history.push({ pathname: Routes.Home.path });
    }

    return (
        <div id='register' className='col-md-4 offset-md-4 d-flex flex-column justify-content-center h-100'>
            { option !== SignUpOpt.complete &&
            <div className='d-flex justify-content-between'>
                <div className={ option === SignUpOpt.verifyEmail ? 'opt active' : 'opt' } onClick={(e) => setOption(SignUpOpt.verifyEmail)}>Verify Email</div>
                <div className={ option === SignUpOpt.register ? 'opt active' : 'opt' } onClick={(e) => setOption(SignUpOpt.register)}>Create Account</div>
                <div className={ option === SignUpOpt.linkWallet ? 'opt active' : 'opt' } onClick={(e) => setOption(SignUpOpt.linkWallet)}>Link Wallet</div>
            </div>
            }
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
                    { option === SignUpOpt.linkWallet && 
                       <h2>Link wallet</h2>
                    }
                    { option === SignUpOpt.complete && 
                       <h2>Start earning HMT</h2>
                    }
                    <Link to='/'><i className='material-icons close'>clear</i></Link>
                </div>
                { alertMsg && alertMsg.length &&
                <Alert variant="danger" onClose={() => setAlertMsg('')} dismissible>
                    { option === SignUpOpt.linkWallet && 
                    <Alert.Heading>Link wallet failed!</Alert.Heading>
                    }
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
                    <form name='form' onSubmit={handleSubmit}>
                        { option === SignUpOpt.verifyEmail && 
                        <>
                        <FormGroup>
                            <FormControl placeholder='Token' type='text' name='verificationToken' value={verificationToken} onChange={handleChange}></FormControl>
                            {submitted && !verificationToken &&
                            <FormControl.Feedback type='invalid' className='d-block'>{ErrorMessage.requireVerificationToken}</FormControl.Feedback>
                            }
                        </FormGroup>
                        <FormGroup className='actions d-flex justify-content-between m-0'>
                            <Link className='btn' to={{ pathname:Routes.Register.path, state: SignUpOpt.register}}>Back</Link>
                            <Button className='form-control bg-blue' onClick={handleLinkWallet}>Next</Button>
                        </FormGroup>
                        </>
                        }
                        { option === SignUpOpt.complete && 
                        <>
                        <FormGroup>
                            <p>Complete the questionnaire to receive 1 HMT.</p>
                        </FormGroup>
                        <FormGroup className='actions d-flex justify-content-between m-0'>
                            <Link className='btn' to={Routes.Home.path}>Skip</Link>
                            <Button className='form-control bg-blue' onClick={startQuestionnaire}>Questionnaire</Button>
                        </FormGroup>
                        </>
                        }
                        { option === SignUpOpt.linkWallet &&
                        <>
                        <FormGroup>
                            <p>The wallet address must be KYC-verified. We’ll need this to send you HMT!</p>
                        </FormGroup>
                        <FormGroup>
                            <FormControl placeholder='Wallet address' type='text' name='walletAddress' value={walletAddress} onChange={handleChange}></FormControl>
                            {submitted && !walletAddress &&
                            <FormControl.Feedback type='invalid' className='d-block'>{ErrorMessage.requireWalletAddress}</FormControl.Feedback>
                            }
                            {submitted && walletAddress && walletAddress.length !== 42 &&
                            <FormControl.Feedback type='invalid' className='d-block'>{ErrorMessage.invalidWalletAddress}</FormControl.Feedback>
                            }
                        </FormGroup>
                        <p><Link>Click here</Link> to create your crypto wallet</p>
                        <FormGroup className='actions d-flex justify-content-between m-0'>
                            <Link className='btn' to={{ pathname:Routes.Register.path, state: SignUpOpt.register}}>Back</Link>
                            <Button className='form-control bg-blue' onClick={handleLinkWallet}>Next</Button>
                        </FormGroup>
                        </> 
                        }
                        { option === SignUpOpt.register && 
                        <>
                        <FormGroup>
                            <FormControl placeholder='Email' type='email' name='email' value={email} onChange={handleChange}></FormControl>
                            {submitted && !email &&
                            <FormControl.Feedback type='invalid' className='d-block'>{ErrorMessage.requireEmail}</FormControl.Feedback>
                            }
                            {submitted && email && !EmailValidator.validate(email) &&
                            <FormControl.Feedback type='invalid' className='d-block'>{ErrorMessage.invalidEmail}</FormControl.Feedback>
                            }
                        </FormGroup>
                        <FormGroup>
                            <FormControl placeholder='Username' type='text' name='userName' value={userName} onChange={handleChange}></FormControl>
                            {submitted && !userName &&
                            <FormControl.Feedback type='invalid' className='d-block'>{ErrorMessage.requireUserName}</FormControl.Feedback>
                            }
                        </FormGroup>
                        <FormGroup className='mb-5'>
                            <div className='row'>
                                <div className='col'>
                                    <FormControl placeholder='First Name' type='text' name='firstName' value={firstName} onChange={handleChange}></FormControl>
                                    {submitted && !firstName &&
                                    <FormControl.Feedback type='invalid' className='d-block'>{ErrorMessage.requireFirstName}</FormControl.Feedback>
                                    }
                                </div>
                                <div className='col'>
                                    <FormControl placeholder='Last Name' type='text' name='lastName' value={lastName} onChange={handleChange}></FormControl>
                                    {submitted && !firstName &&
                                    <FormControl.Feedback type='invalid' className='d-block'>{ErrorMessage.requireLastName}</FormControl.Feedback>
                                    }
                                </div>
                            </div>
                        </FormGroup>
                        <Password onChange={handleChange} value={password} submitted={submitted} className='mb-5'></Password>
                        </>
                        }
                        {/* <FormGroup className='actions d-flex justify-content-between m-0'>
                            <Link className='btn' to={Routes.Home.path}>Back</Link>
                            <Button className='form-control bg-blue'>Next</Button>
                        </FormGroup> */}
                    </form>
                </div>
            </div>
        </div>
    )
}

export default withRouter(RegisterPage);