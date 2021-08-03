import { useState } from 'react'
import emailjs from 'emailjs-com'
import { EmailInput } from '../../components/inputs/email'
import { Button } from 'react-bootstrap'

const initialState = {
  name: '',
  email: '',
  message: '',
}
export const Subscribe = (props) => {
  return (
    <div id='subscribe'>
      <div className='container'>
        <div className='col-md-6 text-right'>
          <h1 className='mb-4'>Subscribe to<br/><span className='color-blue'>Human</span></h1>
          <p className='mb-4'>To recieve updates about latest developments in HUMAN please subscribe by entering your email id.</p>
          <div><EmailInput className='input-group mb-4 ml-auto'></EmailInput></div>
          <Button className='btn btn-custom'>Enter</Button>
        </div>
        <div className='col-md-6'>
        </div>
      </div>
    </div>
  )
}
