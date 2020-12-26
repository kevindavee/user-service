# Builder
FROM node:12-slim as builder

WORKDIR /app
COPY . /app

RUN npm ci
RUN npm run build
RUN rm -rf node_modules/
RUN npm install --production

# Distribution
FROM node:12-slim as distribution

WORKDIR /app

COPY --from=builder /app/node_modules /app/node_modules
COPY --from=builder /app/dist /app/dist
COPY --from=builder	/app/package*.json /app/

ENV PORT 80
EXPOSE 80

CMD npm start
