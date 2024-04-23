FROM alpine:3.19

RUN apk add --no-cache nodejs npm dumb-init

WORKDIR /app

COPY package.json .

COPY package-lock.json .

COPY vite.config.js .

RUN npm install

EXPOSE 3000

CMD ["npm", "start"]