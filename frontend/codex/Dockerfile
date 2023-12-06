# Dockerfile for frontend

FROM node:latest

WORKDIR /app/frontend

COPY package*.json ./

# install dependencies
RUN npm install
RUN npm install react-router-dom

COPY . .

EXPOSE 3000

CMD ["npm", "start"]
