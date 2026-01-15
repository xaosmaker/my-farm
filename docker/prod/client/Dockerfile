FROM node:25-alpine3.22 AS builder

WORKDIR /build
RUN npm install -g pnpm

COPY ./client/package.json  ./client/pnpm-lock.yaml ./


RUN pnpm i
COPY ./client .
RUN pnpm build


FROM node:25-alpine3.22 AS runner 

WORKDIR /client

RUN npm install -g pnpm

COPY --from=builder /build/package.json  /build/pnpm-lock.yaml ./

RUN pnpm i typescript --prod
COPY --from=builder /build/.next /client/.next
COPY --from=builder /build/next.config.ts /client/.

CMD [ "pnpm","start" ]








