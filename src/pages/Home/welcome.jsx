import { useHistory } from 'react-router-dom';
import { Button } from "../../components/button"
import { EmailInput } from "../../components/inputs/email"
import { SecondaryColor } from "../../constants"

export const Welcome = (props) => {
  const history = useHistory();
  const handleClick = () => { 
    history.push('/login');
  }
  return (
    <div id='welcome' className='intro'>
      <div className='text-center'>
        <div className='intro-text'>
          <h1 className='text-center mb-4'>Welcome to <span className='color-blue'>Human App</span></h1>
          <h3 className='text-center mb-4'>Do interesting jobs and get paid in HMT</h3>
          <p className='text-left mb-4'>Subscribe to HUMAN by verifying your email and complete your KYC by linking your crypto wallet to earn instant 10HMT and earn more HMT by doing hcaptcha jobs, and by sending referral links to your friends.</p>
          <div>
            <EmailInput className='mr-3' />
            <button onClick={handleClick}></button>
            <Button title='Start earning HMT' bgColor={SecondaryColor.blue} />
          </div>
        </div>
      </div>
    </div>
  )
}
