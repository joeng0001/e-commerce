FROM php:8.1

WORKDIR /var/www/html

COPY . /var/www/html

RUN apt-get update 

RUN apt-get install sqlite3

RUN apt-get install -y libsqlite3-dev 

RUN docker-php-ext-install pdo_sqlite 

EXPOSE 80

CMD ["php", "-S","0.0.0.0:80"]
