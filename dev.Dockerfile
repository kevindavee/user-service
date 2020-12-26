FROM node:12-slim

WORKDIR /app

EXPOSE 3000

CMD ["npm", "run", "start:dev"]
