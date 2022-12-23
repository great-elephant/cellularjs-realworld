FROM node:18-alpine

WORKDIR /app

COPY . .

RUN yarn install --frozen-lockfile

CMD yarn run dev