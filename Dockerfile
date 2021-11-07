FROM node:14.17.0-alpine as restore
WORKDIR /app
COPY ./package.json /app/package.json
RUN yarn

FROM node:14.17.0-alpine as builder
WORKDIR /app
COPY --from=restore /app/node_modules /app/node_modules
COPY . /app
RUN yarn compile

FROM node:14.17.0-alpine
WORKDIR /app
COPY --from=restore /app/node_modules /app/node_modules
COPY --from=builder /app/package.json /app/package.json
COPY --from=builder /app/dist /app/dist

EXPOSE 5000

ENTRYPOINT ["yarn", "start"]