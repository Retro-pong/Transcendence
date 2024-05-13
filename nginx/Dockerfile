FROM alpine:3.19

RUN apk add --no-cache nginx dumb-init vim curl

COPY ./server.conf /etc/nginx/http.d/default.conf

ENTRYPOINT [ "/usr/bin/dumb-init", "--", "nginx", "-g", "daemon off;" ]