FROM golang:1.26-rc-alpine AS builder

WORKDIR /build

COPY ./server .

RUN go install github.com/pressly/goose/v3/cmd/goose@latest
RUN go mod tidy && go mod verify && go build -o server

FROM alpine:latest AS runner
WORKDIR /server

COPY --from=builder /build/server .
COPY --from=builder /go/bin/goose /usr/local/bin
COPY --from=builder /build/sql ./sql
COPY ./docker/prod/server/start_server.sh .
RUN  chmod +x start_server.sh


CMD [ "./start_server.sh" ]
