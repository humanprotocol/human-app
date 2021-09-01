import { useEffect, useState } from "react"
import { FormControl } from "react-bootstrap";
import './password.css';

export const Password = (props) => {
    const [hidden, setHidden] = useState(true);
    const [value, setValue] = useState(props.value);
    const [invalid, setInvalid] = useState(false);
    const [invalidMsg, setInvalidMsg] = useState('');

    const ToogleShow = (e) => {
        e.preventDefault();
        setHidden(!hidden);
    }
    
    const handleChange = (e) => {
        setValue(e.target.value);
        props.onChange(e);
    }

    useEffect(() => {
        if(props.enableValidation && props.submitted) {
            if (value.length < 8) {
                setInvalid(true);
                setInvalidMsg('Password must be at least 8 characters');
                return false;
            } else if (!value.match(/\d/) || !value.match(/[a-zA-Z]/)) {
                setInvalid(true);
                setInvalidMsg('Password must contain at least 1 letter and 1 number');
                return false;
            } else if(!props.confirm && value.length) {
                setInvalid(true);
                setInvalidMsg('Password must be same')
            } else {
                setInvalid(false)
            }
        }
    }, [value, props.confirm, props.submitted]);
    
    return (
        <div className='form-group password'>
            <div className='input-group'>
                <FormControl placeholder={props.placeholder} type={hidden ? 'password' : 'text'} name={props.name} value={value} onChange={handleChange}></FormControl>
                <span onClick={ToogleShow} className='position-absolute d-flex flex-column justify-content-center h-100'><i className={`fa ${hidden ? 'fa-eye-slash' : 'fa-eye'}`} aria-hidden="true"></i></span>
            </div>
            { invalid && 
            <FormControl.Feedback className='d-block'type='invalid'>
                <div key={`field-error-password`} className="fieldError">{ invalidMsg }</div>
            </FormControl.Feedback>
            }
        </div>
    )
}