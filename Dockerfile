FROM node:14.17.5

ARG API_URL
RUN mkdir -p /usr/src/node-app \
    && chown -R node:node /usr/src/node-app

WORKDIR /usr/src/node-app

USER node

COPY package.json yarn.lock ./

RUN yarn install --immutable

COPY --chown=node:node . .

RUN echo "REACT_APP_API_URL=$API_URL" > ./.env

RUN yarn build

CMD yarn start-prod