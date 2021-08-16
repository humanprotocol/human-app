import { useState } from 'react';
import { Button, FormControl, FormGroup } from 'react-bootstrap';
import { Link, withRouter } from 'react-router-dom';
import { Routes } from '../../routes';

const LinkWalletPage = (props) => {
    const { history } = props;
    const [submitted, setSubmitted] = useState(false);
    const [linked, SetLinked] = useState(false);
    const [address, setAddress] = useState('')
    const [status, setStatus] = useState({ address: true, msg: '' });
    
    const handleLink = (e) => {
        e.preventDefault();
        setSubmitted(true);
        if(address.length !== 42) {
            setStatus({ address: false, msg: 'Invalid wallet address' });
        } else {
            SetLinked(true);
        }
    }

    const handleChange = (e) => {
        const { value } = e.target;
        if(value) setStatus({ address: true, msg: '' });
        setAddress(value);
    }

    const handleNext = (e) => {
        if(e === 'skip') history.push(Routes.Home.path)
        else if(e === 'next') history.push(`${Routes.Home.path}/#subscribe`)
    } 

    return(
        <div id='linkWallet' className='col-md-4 offset-md-4 d-flex flex-column justify-content-center h-100'>
            { !linked && 
            <>
                <div className='page-title d-flex justify-content-between mb-4'>
                    <h2>Link your wallet</h2>
                    <Link to={Routes.Home.path}><i className='material-icons close'>clear</i></Link>
                </div>
                <div>
                    <form name='form'>
                        <FormGroup className='mb-5'>
                            <FormControl placeholder='Wallet address' type='text' value={address} onChange={handleChange}></FormControl>
                            <FormControl.Feedback className={!status.address ? 'd-block' : ''} type='invalid'>{status.msg}</FormControl.Feedback>
                        </FormGroup>
                        <div className='row m-0'>
                            <p className='mb-2'><Link className='color-blue' to={Routes.CreateWallet.path}>Click here</Link> to create your crypto wallet</p>
                        </div>
                        <FormGroup className='w-100'>
                            <Button className='bg-blue color-white form-control' type='default' onClick={handleLink}>Next</Button>
                        </FormGroup>
                        <FormGroup className='w-100'>
                            <Button className='bg-white color-blue form-control'>Skip for now</Button>
                        </FormGroup>
                    </form>
                </div>
            </>
            }
            { linked && 
            <>
                <div className='page-title mb-4'>
                    <h2>Start earning HMT</h2>
                    <p>Fill the questionare and earn 1 HTM</p>
                </div>
                <div>
                    <form name='form'>
                        <FormGroup className='w-100'>
                            <Button className='bg-blue color-white form-control' type='default' onClick={handleNext('next')}>Questionare</Button>
                        </FormGroup>
                        <FormGroup className='w-100'>
                            <Button className='bg-white color-blue form-control' onClick={handleNext('skip')}>Skip for now</Button>
                        </FormGroup>
                    </form>
                </div>
            </>
            }

            {/* <FormGroup>
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
            </FormGroup> */}
            
        </div>
    )
}

export default withRouter(LinkWalletPage);