FROM alpine:3.19

RUN apk add --no-cache nodejs npm dumb-init

WORKDIR /app

COPY package*.json .

RUN npm install && npm install -g vite

EXPOSE 3000

ENTRYPOINT ["/usr/bin/dumb-init", "--"]

CMD ["npm", "run", "dev"]