FROM node:10.19.0

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm install -g bower

WORKDIR /app/public

RUN bower install

WORKDIR /app/bin

EXPOSE 4000
CMD [ "node", "www" ]