FROM node:18-alpine

RUN apk add --no-cache wget

WORKDIR /app

# Installer les dépendances d'abord (cache Docker)
COPY package*.json ./
RUN npm ci --only=production

# Copier le reste du code
COPY . .

EXPOSE 5000

CMD ["node", "src/app.js"]
