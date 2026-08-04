FROM node:lts AS build

WORKDIR /app
ENV PATH=/app/node_modules/.bin:$PATH
COPY . .
ARG NODE_ENV
RUN npm install
RUN npm run build

## Deploy ######################################################################
FROM nginxinc/nginx-unprivileged:stable-alpine AS deploy
COPY --from=build /app/build /usr/share/nginx/html/
COPY conf/conf.d/default.conf /etc/nginx/conf.d/default.conf
EXPOSE 8080
CMD ["nginx", "-g", "daemon off;"]
