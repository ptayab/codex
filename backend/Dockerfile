FROM node:latest

WORKDIR /app/backend

COPY package*.json ./

# install dependencies
RUN npm install
RUN -init -y
RUN npm install mysql2
RUN npm install express
RUN npm install cors
RUN npm install multer
RUN npm install bcrypt 
RUN npm install jsonwebtoken
RUN npm i dotenv


COPY . .

EXPOSE 5000

CMD ["npm", "start"]