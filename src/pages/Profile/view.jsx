import React from 'react';
import PropTypes from 'prop-types';
import Button from '../../ui/button';
import { countryCodeToTitleMap } from '../../constants/countries';

export default function ProfileView(props) {
  const { name, email, countryCode, walletAddr, onEditClick } = props;

  const country = countryCodeToTitleMap[countryCode];
  return (
    <div className="container">
      <div className="page-title d-flex justify-content-between mb-4">
        <h2>Profile</h2>
      </div>
      <p>{name || 'Full Name'}</p>
      <p>{email || 'Email'}</p>
      <p>{country || 'Country'}</p>
      <p>{walletAddr || 'Polygon Wallet Address'}</p>
      <div>
        <Button onClick={onEditClick}>Edit</Button>
      </div>
    </div>
  );
}

ProfileView.propTypes = {
  name: PropTypes.string,
  email: PropTypes.string,
  countryCode: PropTypes.string,
  walletAddr: PropTypes.string,
  onEditClick: PropTypes.func.isRequired,
};

ProfileView.defaultProps = {
  name: '',
  email: '',
  countryCode: '',
  walletAddr: '',
};
