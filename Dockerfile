FROM node:lts as build

WORKDIR /app
ENV PATH /app/node_modules/.bin:$PATH
COPY . .
ARG NODE_ENV
RUN npm install
RUN npm run build

## Deploy ######################################################################
# Unprivileged nginx: listens on 8080 and relocates pid/temp paths to /tmp, so the
# pod can run as an arbitrary non-root UID (runAsUser 1000 in gitops).
FROM nginxinc/nginx-unprivileged:stable-alpine as deploy
COPY --from=build /app/build /usr/share/nginx/html/
# Overwrite rather than rm -rf /etc/nginx/conf.d: this image has already dropped
# to USER 101, so RUN cannot modify root-owned paths.
COPY conf/conf.d/default.conf /etc/nginx/conf.d/default.conf
EXPOSE 8080
CMD ["nginx", "-g", "daemon off;"]
