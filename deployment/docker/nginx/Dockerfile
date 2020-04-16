# Build as
# docker build -t fredhutch/motuz_nginx:latest -f deployment/docker/nginx/Dockerfile .


FROM node:10.15.2-alpine as build-stage

WORKDIR /app
COPY ./package.json /app
RUN npm install

COPY ./src/frontend /app/src/frontend
RUN npm run build

FROM nginx:1.17.9-alpine

COPY --from=build-stage /app/build/ /var/www/
COPY ./deployment/docker/nginx/wsgi.params /etc/nginx/wsgi.params
COPY ./deployment/docker/nginx/nginx.conf /etc/nginx/nginx.conf

EXPOSE 80 443
CMD ["nginx","-g","daemon off;"]
