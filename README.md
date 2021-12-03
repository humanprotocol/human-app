# HUMAN App


## Description

The HUMAN App is the frontend interface which allows earners to connect to HUMAN Protocol and solve labelling tasks for $HMT rewards. 
It is written in the React.js. Please visit [humanprotocol.org](https://humanprotocol.org) for more information

## Note:
The application is in active development state and can have breaking changes.

### Prerequisites:

* `REACT_APP_API_URL`: Human APP API
* `REACT_APP_HCAPTCHA_SITE_KEY`: Site Key for HCaptcha widget


### Running locally:
$ `cp .env.example .env`

$ `yarn`

$ `yarn start`

### Running in the production:
$ `cp .env.example .env`

$ `yarn`

$ `yarn build`

$ `serve -s build -p $PORT`


# Note for developers
Bootstrap framework is DEPRECATED. For newer components everyone should use material-ui ui-kit instead


## Found a bug?

Please search for any existing issues at our [Issues](https://github.com/humanprotocol/human-app/issues) page before submitting your own.
