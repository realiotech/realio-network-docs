FROM node:lts as build

# We'll run the app as the `node` user, so put it in their home directory
WORKDIR /home/node/app
# Copy the source code over
COPY --chown=node:node . /home/node/app/

RUN npm install
RUN npm run build

## Deploy ######################################################################
# Use a stable nginx image
FROM nginx:stable-alpine as deploy
WORKDIR /home/node/app
# Copy what we've installed/built from production
COPY --chown=node:node --from=build /home/node/app/build /usr/share/nginx/html/
COPY --from=build /home/node/app/build/blog/archive/index.html /usr/share/nginx/html/index.html
RUN rm -rf /etc/nginx/conf.d
COPY conf /etc/nginx
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]