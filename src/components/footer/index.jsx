import React from 'react';
import ReadMoreIcon from '../../assets/icons/readmore.svg';
import './index.scss';

export const Footer = () => (
  <div id="footer" className="py-2">
    <div className="container">
      <a className="m-0" href="https://humanprotocol.org/">
        <img src={ReadMoreIcon} className="mr-2 ml-n1" alt="readmore" />
        Read more on HUMAN Protocol
      </a>
    </div>
  </div>
);
