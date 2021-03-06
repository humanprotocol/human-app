FROM node:16.15.0-alpine AS builder

WORKDIR /usr/src/node-app

RUN chown -R node:node /usr/src/node-app

USER node

COPY package.json yarn.lock ./

RUN yarn install

COPY --chown=node:node . .

RUN yarn install && yarn build

FROM node:16.15.0-alpine AS release

WORKDIR /usr/src/node-app

USER node

COPY --chown=node:node --from=builder /usr/src/node-app .

CMD yarn start-prod
