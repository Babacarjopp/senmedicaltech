FROM nginx:alpine

# Copier la configuration Nginx
COPY nginx.conf /etc/nginx/nginx.conf

# Créer les répertoires pour les certificats et ACME challenges
RUN mkdir -p /var/www/certbot /etc/letsencrypt/live/senmedicaltech.com

# Healthcheck
HEALTHCHECK --interval=10s --timeout=5s --retries=3 \
    CMD wget -q --spider http://localhost:80 || exit 1

EXPOSE 80 443

CMD ["nginx", "-g", "daemon off;"]
