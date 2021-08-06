import { useState } from "react"
import { FormControl } from "react-bootstrap";
import './password.css';

export const Password = (props) => {
    const [hidden, setHidden] = useState(true);
    const ToogleShow = (e) => {
        e.preventDefault();
        setHidden(!hidden);
    }

    return (
        <div className='form-group password'>
            <div className='input-group'>
                <FormControl placeholder='password' type={hidden ? 'password' : 'text'} name='password' value={props.value} onChange={props.onChange}></FormControl>
                <span onClick={ToogleShow} className='position-absolute d-flex flex-column justify-content-center h-100'><i className={`fa ${hidden ? 'fa-eye-slash' : 'fa-eye'}`} aria-hidden="true"></i></span>
            </div>
            <FormControl.Feedback className={props.submitted && !props.value ? 'd-block' : ''} type='invalid'>
                <div key={`field-error-password`} className="fieldError">Password is required</div>
            </FormControl.Feedback>
        </div>
    )
}