FROM node:20-slim
SHELL ["/bin/bash", "-c"]
ARG BUILD_ENV=dev

EXPOSE 80
WORKDIR /app

COPY package.json ./
RUN npm install 
COPY . .

CMD ["npm", "start"]