FROM golang:1.26rc1-alpine3.23

WORKDIR /server
COPY  ./server .
RUN go mod tidy
CMD [ "go","run","." ]
