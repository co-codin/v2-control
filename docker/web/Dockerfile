FROM node:14.18.1-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

EXPOSE 3000

CMD ["npm", "run", "dev"]
