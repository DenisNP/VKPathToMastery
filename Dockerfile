# build client
FROM node:10 as BUILD_CLIENT
COPY ./vk-path-to-mastery ./app
WORKDIR ./app
RUN npm install
RUN npm run build

# run server
FROM node:10
COPY --from=BUILD_CLIENT /app/dist /app/dist
COPY ./vk-path-to-mastery-back /app

# run
WORKDIR /app
EXPOSE 3000
ENTRYPOINT ["node", "app.js"]