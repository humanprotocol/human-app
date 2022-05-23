/* Production only */
const express = require('express');
const path = require('path');
const helmet = require('helmet');
const app = express();

const port = process.env['PORT'];
const isCspEnabledString = process.env['ENABLE_CSP_FF'];
const apiUrl = process.env['REACT_APP_API_URL'] || 'http://localhost:3000';
const isCspEnabled = isCspEnabledString === 'true';

const cspScripts = 'script-src ';
const cspFonts = 'font-src ';
const cspStyles = 'style-src ';
const cspDefault = `default-src `;
const cspHeader = `${cspDefault}; ${cspScripts}; ${cspStyles}; ${cspFonts}`;


app.use(helmet.contentSecurityPolicy({
  useDefaults: false,
  directives: {
    defaultSrc: [
      "'self'",
      '*.civic.com',
      'https://googleads.g.doubleclick.net',
      'https://newassets.hcaptcha.com',
      'https://hcaptcha.com',
    ],
    connectSrc: [
      "'self'",
      'https://foundation-exchange.hmt.ai',
      'https://api.civic.com',
      'https://www.google-analytics.com',
      'https://polygon-mainnet.infura.io',
      '*.tawk.to',
      'wss://*.tawk.to',
      apiUrl,
    ],
    scriptSrc: [
      "'self'",
      "'unsafe-inline'",
      'https://hcaptcha.com',
      '*.civic.com',
      '*.googleadservices.com',
      '*.tawk.to',
      'https://www.google-analytics.com',
      'https://www.googletagmanager.com',
      'https://cdn.jsdelivr.net/',
    ],
    fontSrc: [
      "'self'",
      'https://fonts.googleapis.com',
      'https://fonts.gstatic.com',
      'https://cdnjs.cloudflare.com',
      '*.tawk.to',
    ],
    styleSrc: [
      "'self'",
      "'unsafe-inline'",
      'https://cdnjs.cloudflare.com',
      'https://fonts.googleapis.com',
      '*.tawk.to',
    ],
    imgSrc: [
      "'self'",
      'data:',
      'https://googleads.g.doubleclick.net',
      'https://www.google.com',
      '*.tawk.to',
      'https://cdn.jsdelivr.net',
      'https://s3.amazonaws.com/tawk-to-pi',
    ]
  },
  reportOnly: !isCspEnabled,
}));

app.use(helmet.frameguard({ action: 'deny' }));

app.use(express.static(path.join(__dirname, 'build')));

app.get('/*', function(req, res) {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

app.listen(port, () => {
  console.log(`HUMAN APP is up and running. Port - ${port}`);
});
