# Some secret file is removed, some security features/api calling is malfunction, i.e. PayPal for payment is disabled

# Environment set up ,ubuntu 22.04

sudo apt install git
git clone https://github.com/joeng0001/e-commerce.git
cd e-commerce

# client side (node v18.17.0,npm v9.6.7)

cd client
npm install --force
npm start

# server side

sudo apt-get update
sudo apt-get install php8.1-pdo-sqlite
sudo apt-get install php8.1-sqlite3
sudo apt install php
sudo php --ini
sudo systemctl stop apache2
sudo php -S localhost:80

# access website

localhost:3000

# account

    admin:
        admin_joe@gmail.com
        secret_password

    normal:
        joe@gmail.com
        password
