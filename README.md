# secret file/function is removed, i.e. PayPal is disabled

# Docker
    docker-compose up

# Environment: ubuntu 22.04

# client side (/e-commerce/client) (node v18.17.0,npm v9.6.7)
    npm install --force
    npm start

# server side (/e-commerce)
    sudo apt-get update
    sudo apt-get install php8.1-pdo-sqlite
    sudo apt-get install php8.1-sqlite3
    sudo apt install php
    sudo php --ini
    sudo systemctl stop apache2
    sudo php -S localhost:80

# access
    localhost:3000

# account
    admin:
        admin_joe@gmail.com
        secret_password

    normal:
        joe@gmail.com
        password
