import { useEffect, useState } from "react"
import { FormControl, InputGroup } from "react-bootstrap";
import './password.css';

export const Password = (props) => {
    const [hidden, setHidden] = useState(true);
    const [value, setValue] = useState(props.value);

    const ToogleShow = (e) => {
        e.preventDefault();
        setHidden(!hidden);
    }
    
    const handleChange = (e) => {
        setValue(e.target.value);
        props.onChange(e);
    }

    return (
        <InputGroup>
            <FormControl placeholder={props.placeholder} type={hidden ? 'password' : 'text'} name={props.name} value={value} onChange={handleChange} onBlur={props.onBlur}></FormControl>
            <span onClick={ToogleShow} className='position-absolute d-flex flex-column justify-content-center h-100'><i className={`fa ${hidden ? 'fa-eye-slash' : 'fa-eye'}`} aria-hidden="true"></i></span>
        </InputGroup>
    )
}