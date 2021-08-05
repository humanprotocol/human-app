import { useState } from 'react'

const LoginPage = (props) => {
  const [inputs, setInputs] = useState({
    username: '',
    password: ''
  }); 
  const [submitted, setSubmitted] = useState(false);
  const { username, password } = inputs;
  return (
    <div id='login'>
      Login Page
    </div>
  )
}

export default LoginPage;