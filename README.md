# Some secret file is removed, some security features/api calling is malfunction

# Environment set up ,ubuntu 22.04

sudo apt install git
git clone https://github.com/joeng0001/e-commerce.git
cd e-commerce

# client side

cd client
npm install
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

127.0.0.1:3000
