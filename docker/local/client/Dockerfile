FROM node:25-alpine3.22

WORKDIR /client
RUN npm install -g pnpm

# COPY ./client/package.json  ./client/pnpm-lock.yaml ./

# RUN pnpm i


COPY client/ .

CMD ["pnpm","dev"]

