FROM node:15-alpine

WORKDIR /usr/src/app

COPY package.json ./
COPY yarn.lock ./

ENV NODE_ENV production
RUN yarn install --production=true

COPY . .

EXPOSE 8080

CMD [ "node", "server.js" ]