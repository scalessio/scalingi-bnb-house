FROM nginx:1.27-alpine

# Copia configurazione personalizzata
COPY nginx.conf /etc/nginx/nginx.conf

# Copia i file statici
COPY . /usr/share/nginx/html

# Assicura permessi leggibili dal worker nginx
RUN chmod -R 755 /usr/share/nginx/html

EXPOSE 80
