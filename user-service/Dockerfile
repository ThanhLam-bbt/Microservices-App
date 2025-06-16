FROM node:18-alpine

WORKDIR /usr/src/app

COPY package*.json ./

# Cài đặt dependencies
RUN npm install

COPY . .

EXPOSE 3000

CMD [ "npm", "start" ]