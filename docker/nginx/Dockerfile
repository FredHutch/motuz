# Build as
# docker build -t motuz_nginx:latest -f Dockerfile ../..


FROM nginx:1.15.2-alpine
FROM node:6

WORKDIR /app
COPY ./package.json /app
RUN npm install

COPY ./docker/nginx/nginx.conf /etc/nginx/nginx.conf

COPY . /app
RUN npm run build


COPY ./build /var/www
EXPOSE 80 443
ENTRYPOINT ["nginx","-g","daemon off;"]
