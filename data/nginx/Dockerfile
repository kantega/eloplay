FROM nginx:latest

COPY default.conf /etc/nginx/conf.d/default.conf

RUN apt-get update && apt-get install -y openssl && apt-get clean

RUN mkdir -p /ssl && openssl req -x509 -newkey rsa:4096 -sha256 -nodes -keyout /ssl/ssl.key -out /ssl/ssl.crt -subj "/CN=Bordtennis" -days 2000
