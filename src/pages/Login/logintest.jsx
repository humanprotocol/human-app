import { useState, useRef } from 'react'
import { Button, FormControl, FormGroup, Alert } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import { Link, withRouter } from 'react-router-dom';
import HCaptcha from "@hcaptcha/react-hcaptcha";
import { Formik, useFormik } from 'formik';
import * as Yup from 'yup';
import { Password } from '../../components/inputs/password/password';
import { signIn } from '../../service/user.service';
import { Routes } from '../../routes';
import './login.scss';
import { ErrorType, ErrorMessage, SignUpOpt } from '../../constants';

const LoginTestPage = (props) => {
  const dispatch = useDispatch();
  const { history } = props;
  const [inputs, setInputs] = useState({
    email: '',
    password: ''
  }); 
  const [alertMsg, setAlertMsg] = useState('')
  const formik = useFormik({
    initialValues: {
      email: '',
      password: ''
    },
    validationSchema: Yup.object({
      email: Yup.string().email(ErrorMessage.invalidEmail).required(ErrorMessage.requireEmail),
      password: Yup.string().required(ErrorMessage.requirePassword),
      token: Yup.string().required(ErrorMessage.captchaPassRequired),
    }),
    onSubmit: values => {
      console.log('>>>>>>>>>>>>>>>>>>>>>>>>>> ', { values })
    },
    onChange: value => {
      console.log('>>>>>>>>>>>>>>>>>>>>>>>>', { value })
    }
  })

  return (
    <div id='login' className='col-md-4 offset-md-4 d-flex flex-column justify-content-center h-100'>
      <div className='container'>
        <div className='page-title d-flex justify-content-between mb-4'>
          <h2>Log in</h2>
        </div>
        { alertMsg && alertMsg.length &&
          <Alert variant="danger" onClose={() => setAlertMsg('')} dismissible>
            <Alert.Heading>Login failed!</Alert.Heading>
            <p>{alertMsg}</p>
          </Alert>
        }
      </div>
      <div>
        <form name='form' onSubmit={formik.handleSubmit}>
          <FormGroup>
            <FormControl placeholder='Email' type='email' name='email' value={formik.values.email} onChange={formik.handleChange} onBlur={formik.handleBlur}></FormControl>
                {formik.touched.email && formik.errors.email &&
                  <FormControl.Feedback type='invalid' className='d-block'>{formik.errors.email}</FormControl.Feedback>
                }
          </FormGroup>
          <FormGroup className='password'>
            <Password placeholder='Password' type='password' name='password' value={formik.values.password} onChange={formik.handleChange} onBlur={formik.handleBlur}></Password>
              {formik.touched.password && formik.errors.password &&
                <FormControl.Feedback type='invalid' className='d-block'>{formik.errors.password}</FormControl.Feedback>
              }
          </FormGroup>
        </form>
      </div>
    </div>
  )
}

export default withRouter(LoginTestPage);