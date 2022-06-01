/* Production only */
const express = require('express');
const path = require('path');
const helmet = require('helmet');

const app = express();

const port = process.env.PORT;
const isCspEnabledString = process.env.ENABLE_CSP_FF;
const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:3000';
const isCspEnabled = isCspEnabledString === 'true';

const cspScripts = 'script-src ';
const cspFonts = 'font-src ';
const cspStyles = 'style-src ';
const cspDefault = `default-src `;
const cspHeader = `${cspDefault}; ${cspScripts}; ${cspStyles}; ${cspFonts}`;

app.use(
  helmet.contentSecurityPolicy({
    useDefaults: false,
    directives: {
      defaultSrc: [
        "'self'",
        'https://googleads.g.doubleclick.net',
        'https://newassets.hcaptcha.com',
        'https://hcaptcha.com',
        'https://magic.veriff.me',
      ],
      connectSrc: [
        "'self'",
        'https://foundation-exchange.hmt.ai',
        'https://www.google-analytics.com',
        'https://polygon-mainnet.infura.io',
        'https://api.veriff.me/v1/sessions',
        '*.tawk.to',
        'wss://*.tawk.to',
        apiUrl,
        '*.veriff.com',
      ],
      scriptSrc: [
        "'self'",
        "'unsafe-inline'",
        'https://hcaptcha.com',
        '*.googleadservices.com',
        '*.tawk.to',
        'https://www.google-analytics.com',
        'https://www.googletagmanager.com',
        'https://cdn.jsdelivr.net/',
        '*.veriff.com',
      ],
      fontSrc: [
        "'self'",
        'https://fonts.googleapis.com',
        'https://fonts.gstatic.com',
        'https://cdnjs.cloudflare.com',
        '*.tawk.to',
        '*.veriff.com',
      ],
      styleSrc: [
        "'self'",
        "'unsafe-inline'",
        'https://cdnjs.cloudflare.com',
        'https://fonts.googleapis.com',
        '*.tawk.to',
        '*.veriff.com',
      ],
      imgSrc: [
        "'self'",
        'data:',
        'https://googleads.g.doubleclick.net',
        'https://www.google.com',
        '*.tawk.to',
        'https://cdn.jsdelivr.net',
        'https://s3.amazonaws.com',
        '*.veriff.com',
      ],
    },
    reportOnly: !isCspEnabled,
  }),
);

app.use(helmet.frameguard({ action: 'deny' }));

app.use(express.static(path.join(__dirname, 'build')));

app.get('/*', function (req, res) {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

app.listen(port, () => {
  console.log(`HUMAN APP is up and running. Port - ${port}`);
});
