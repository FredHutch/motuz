# Build as
# docker build -t fredhutch/motuz_nginx:latest -f prod/docker/nginx/Dockerfile .


FROM node:10.15.2 as build-stage

WORKDIR /app
COPY ./package.json /app
RUN npm install

COPY ./src/frontend /app/src/frontend
RUN npm run build

FROM nginx

COPY --from=build-stage /app/build/ /var/www/
COPY ./prod/docker/nginx/wsgi.params /etc/nginx/wsgi.params
COPY ./prod/docker/nginx/nginx.conf /etc/nginx/nginx.conf

EXPOSE 80 443
CMD ["nginx","-g","daemon off;"]
