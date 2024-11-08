FROM node:20-slim
SHELL ["/bin/bash", "-c"]
ARG BUILD_ENV=prod

EXPOSE 80
WORKDIR /app

COPY package.json /app
RUN npm install 
COPY ./build /app
COPY ./src/public /app/public
COPY ./src/uploads /app/uploads
COPY .ci/setting/$BUILD_ENV /app/.env

HEALTHCHECK --interval=5s --timeout=5s CMD curl -sf http://localhost:3000/ || exit 1
CMD ["node", "index.js"]