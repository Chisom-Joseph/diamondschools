FROM node:22-alpine

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build:css --if-present

RUN npm prune --production

EXPOSE 4728

ENV NODE_ENV=production

CMD [ "node", "server.js" ]
