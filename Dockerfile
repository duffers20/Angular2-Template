FROM    nginx:alpine

MAINTAINER  Gareth Oates

COPY ./dist /usr/share/nginx/html
