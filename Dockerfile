FROM node:14.17.5-alpine AS builder

ARG REACT_APP_API_URL
ARG REACT_APP_HCAPTCHA_SITE_KEY
ARG REACT_APP_CIVIC_APP_ID

WORKDIR /usr/src/node-app

RUN chown -R node:node /usr/src/node-app

USER node

COPY package.json yarn.lock ./

RUN yarn install

COPY --chown=node:node . .

RUN echo "REACT_APP_API_URL=${REACT_APP_API_URL}" > ./.env && \
    echo "REACT_APP_HCAPTCHA_SITE_KEY=${REACT_APP_HCAPTCHA_SITE_KEY}" >> ./.env && \
    echo "REACT_APP_CIVIC_APP_ID=${REACT_APP_CIVIC_APP_ID}" >> ./.env

RUN yarn install && yarn build && \
    mv serve.json build/

FROM node:14.17.5-alpine AS release

WORKDIR /usr/src/node-app

USER node

COPY --chown=node:node --from=builder /usr/src/node-app .

CMD yarn start-prod