FROM golang:1.26rc1-alpine3.23

WORKDIR /server
COPY  ./server .
COPY ./docker/test/server/start_server.sh /data/start_server.sh
RUN go install github.com/pressly/goose/v3/cmd/goose@latest
RUN  chmod +x /data/start_server.sh
RUN go mod tidy
