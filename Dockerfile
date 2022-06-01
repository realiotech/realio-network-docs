FROM node:lts as build

WORKDIR /app
ENV PATH /app/node_modules/.bin:$PATH
COPY . .
ARG NODE_ENV
RUN npm install
RUN npm run build

## Deploy ######################################################################
# Use a stable nginx image
FROM nginx:stable-alpine as deploy
COPY --from=build /app/build /usr/share/nginx/html/
COPY --from=build /app/build/index.html /usr/share/nginx/html/index.html
RUN rm -rf /etc/nginx/conf.d
COPY conf /etc/nginx
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]