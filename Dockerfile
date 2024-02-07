FROM ubuntu:22.04

ENV DEBIAN_FRONTEND=noninteractive

COPY . /app

RUN apt-get update
RUN apt install -y npm
RUN apt install -y php
RUN apt-get install php8.1-pdo-sqlite
RUN apt-get install php8.1-sqlite3

WORKDIR /app/client
RUN npm install

EXPOSE 80
EXPOSE 3000

CMD bash -c 'cd /app/client && npm start' & bash -c 'php -S 0.0.0.0:80'
