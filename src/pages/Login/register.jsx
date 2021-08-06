import { useState } from "react";
import { useDispatch } from "react-redux";
import { Link, withRouter } from "react-router-dom";
import { FormGroup, FormControl, Button } from "react-bootstrap";
import * as EmailValidator from 'email-validator';
import { ErrorMessage } from "../../constants";
import { Password } from "../../components/inputs/password/password";
import './login.css';
import { register } from "../../service/user.service";
import { Routes } from "../../routes";

const RegisterPage = (props) => {
    const { history } = props;
    const dispatch = useDispatch();
    const [inputs, setInputs] = useState({
        email: '',
        userName: '',
        firstName: '',
        lastName: '',
        password: '',
    });
    const [submitted, setSubmitted] = useState(false);
    const { email, password, userName, firstName, lastName } = inputs;
    
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

    return (
        <div id='register' className='col-md-4 offset-md-4 d-flex flex-column justify-content-center h-100'>
            <div className='page-title d-flex justify-content-between mb-4'>
                <h2>Sign Up</h2>
                <Link to='/'><i className='material-icons close'>clear</i></Link>
            </div>
            <div>
                <form name='form' onSubmit={handleSubmit}>
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
                    <FormGroup>
                        <Button className='form-control' onClick={handleSubmit}>Next</Button>
                    </FormGroup>
                </form>
            </div>
            </div>
    )
}

export default withRouter(RegisterPage);