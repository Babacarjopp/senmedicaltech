# Étape 1 — Build
FROM node:20-alpine AS build

WORKDIR /app
COPY package*.json ./
RUN npm install --legacy-peer-deps

COPY . .
ARG REACT_APP_API_URL=http://localhost:5000/api
ENV REACT_APP_API_URL=$REACT_APP_API_URL
RUN npm run build

# Étape 2 — Serve avec nginx
FROM nginx:alpine

COPY --from=build /app/build /usr/share/nginx/html

# Config nginx pour gérer les routes React (SPA)
RUN echo 'server { \
  listen 80; \
  location / { \
    root /usr/share/nginx/html; \
    try_files $uri /index.html; \
  } \
}' > /etc/nginx/conf.d/default.conf

# Install wget for healthcheck
RUN apk add --no-cache wget

EXPOSE 80
