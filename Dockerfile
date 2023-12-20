FROM node:18.2

WORKDIR /app

COPY package*.json /app/

RUN npm install

COPY . .

CMD [ "npm", "run", "dev" ]