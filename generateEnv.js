require('dotenv').config();

const fs = require('fs');
const path = require('path');

const applicationEnvironment = process.env.NODE_ENV;
const isProduction = applicationEnvironment === 'production';

const staticFolder = isProduction ? 'build' : 'public';
const ENV_FRONTEND_SCRIPT = 'env.js';
const envFilePath = path.join(__dirname, staticFolder, ENV_FRONTEND_SCRIPT);

const environmentObj = {
  REACT_APP_API_URL: process.env.REACT_APP_API_URL,
  REACT_APP_HCAPTCHA_SITE_KEY: process.env.REACT_APP_HCAPTCHA_SITE_KEY,
  REACT_APP_TAWK_PROPERTY_ID: process.env.REACT_APP_TAWK_PROPERTY_ID,
  REACT_APP_TAWK_WIDGET_ID: process.env.REACT_APP_TAWK_WIDGET_ID,
  REACT_APP_POLYGON_MAINNET: process.env.REACT_APP_POLYGON_MAINNET,
  REACT_APP_HUMAN_HMT_TOKEN_CONTRACT_ADDRESS:
    process.env.REACT_APP_HUMAN_HMT_TOKEN_CONTRACT_ADDRESS,
  REACT_APP_VERIFF_API_KEY: process.env.REACT_APP_VERIFF_API_KEY,
  REACT_APP_HCAPTCHA_LABELING_BASE_URL: process.env.REACT_APP_HCAPTCHA_LABELING_BASE_URL,
  REACT_APP_HCAPTCHA_EXCHANGE_URL: process.env.REACT_APP_HCAPTCHA_EXCHANGE_URL,
};

const fileContent = `window.env = ${JSON.stringify(environmentObj)};`;

fs.writeFileSync(envFilePath, fileContent);
