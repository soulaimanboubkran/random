FROM  node:20-alpine

WORKDIR /app

COPY  package*.json ./

RUN npm install 

COPY . .

EXPOSE 5000
ENV  MONGO=mongodb+srv://soulaimansoulb:1234@api.r4yvkb5.mongodb.net/random

CMD ["npm" , "run", "start"] 
