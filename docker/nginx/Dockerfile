# Build as
# docker build -t motuz_nginx:latest -f Dockerfile ../..


FROM node:6 as build-stage

WORKDIR /app
COPY ./package.json /app
RUN npm install

COPY ./src/frontend /app/src/frontend
RUN npm run build

FROM nginx

COPY --from=build-stage /app/build/ /var/www/
# /usr/share/nginx/html
COPY ./docker/nginx/wsgi.params /etc/nginx/wsgi.params
COPY ./docker/nginx/nginx.conf /etc/nginx/nginx.conf
EXPOSE 80 443
CMD ["nginx","-g","daemon off;"]
