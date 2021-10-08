# Human APP website

## Description

Human APP is an application which allow you to connect to the Human Protocol. It is written in the React.js
Please visit [humanprotocol.org](https://humanprotocol.org) for more information

## Note for maintainers:

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


## Found a bug?

Please search for any existing issues at our [Issues](https://github.com/humanprotocol/human-app/issues) page before submitting your own.
