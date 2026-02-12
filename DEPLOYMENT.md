# 🚀 OrthoShop — Checklist Production

Guide complet pour déployer OrthoShop en production.

---

## ✅ **Étapes d'avant déploiement**

### 1. **Générer clés/secrets forts**

```bash
# JWT Secret (32 bytes)
openssl rand -base64 32

# MongoDB Password (fort)
openssl rand -base64 20
```

Copier les valeurs dans `.env.production` et fichiers de configuration

### 2. **Configuration environnement production**

**Créer `.env.production` à la racine :**
```bash
cp .env.example .env.production
# Éditer avec valeurs réelles
```

**Variables essentielles :**
- `JWT_SECRET` → clé forte (32+ bytes)
- `MONGO_PASSWORD` → mot de passe robuste
- `NODE_ENV=production`
- `CORS_ORIGIN` → domaine(s) frontend uniquement
- `REACT_APP_API_URL` → URL publique API

### 3. **Docker Setup**

```bash
# Vérifier docker-compose.yml
docker-compose config

# Builder images
docker-compose build

# Lancer (sans -d d'abord pour voir les logs)
docker-compose up

# Vérifier santé des services
docker-compose ps
```

### 4. **Bases de données**

```bash
# Vérifier connexion Mongo
docker-compose exec mongo mongosh -u admin -p <password> --authenticationDatabase admin

# Ne PAS exécuter seed.js en production
# (erreur affichée automatiquement si NODE_ENV=production)

# Créer admin via autre méthode (CLI séparé recommandé)
```

### 5. **HTTPS & Reverse Proxy** (OBLIGATOIRE)

> ⚠️ **Ne jamais exposer Express directement en production !**

**Option A : Nginx + Let's Encrypt**

```nginx
# /etc/nginx/sites-available/SenMedicaltech
upstream backend {
  server localhost:5000;
}

server {
  listen 80;
  server_name api.SenMedicaltech.com;

  # Redirect HTTP → HTTPS
  return 301 https://$server_name$request_uri;
}

server {
  listen 443 ssl http2;
  server_name api.SenMedicaltech.com;

  ssl_certificate /etc/letsencrypt/live/api.SenMedicaltech.com/fullchain.pem;
  ssl_certificate_key /etc/letsencrypt/live/api.SenMedicaltech.com/privkey.pem;

  # Proxy API
  location /api {
    proxy_pass http://backend;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection 'upgrade';
    proxy_set_header Host $host;
    proxy_cache_bypass $http_upgrade;
  }

  # Frontend
  location / {
    proxy_pass http://localhost:3000;
    proxy_http_version 1.1;
  }
}
```

**Option B : Caddy (plus simple)**

```caddyfile
api.SenMedicaltech.com {
  reverse_proxy localhost:5000
}

SenMedicaltech.com {
  reverse_proxy localhost:3000
}
```

Certificats automatiques via Let's Encrypt.

### 6. **Logs & Monitoring**

Vérifier que les logs s'écrivent :

```bash
docker-compose exec backend ls -la /app/logs/
docker-compose exec backend tail -f /app/logs/combined.log
```

Logs produits par Winston :
- `logs/combined.log` — tous les logs
- `logs/error.log` — erreurs uniquement
- `logs/exceptions.log` — exceptions non gérées

### 7. **Backup MongoDB**

```bash
# Daily cron pour backup
0 2 * * * docker exec orthoshop-mongo mongodump --uri "mongodb://admin:PASSWORD@localhost:27017/orthopedic_shop?authSource=admin" --out /data/backups/$(date +\%Y\%m\%d)
```

### 8. **Tests de sécurité**

```bash
# Tester endpoints
curl -H "Content-Type: application/json" https://api.SenMedicaltech.com/api/health

# Tester auth
curl -X POST https://api.orthoshop.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@orthoshop.com","password":"ADMIN_PASSWORD"}'

# Vérifier rate limiting
for i in {1..10}; do curl https://api.orthoshop.com/api/auth/login; done
```

### 9. **Checklist final**

- [ ] `.env.production` rempli avec secrets forts
- [ ] JWT_SECRET changé (minimum 32 bytes)
- [ ] MONGO_PASSWORD changé
- [ ] CORS_ORIGIN = domaine(s) frontend
- [ ] REACT_APP_API_URL = domaine backend public
- [ ] NODE_ENV=production
- [ ] Reverse proxy (Nginx/Caddy) configuré avec HTTPS
- [ ] Certificats SSL valides (Let's Encrypt)
- [ ] Health checks Docker activés
- [ ] Logs dirigés vers fichiers
- [ ] Seed.js désactivé (test : exit code 1)
- [ ] MongoDB avec authentification activée
- [ ] Backups MongoDB programmés
- [ ] Tests curl réussis

---

## 🔒 **Variables sensibles à NE JAMAIS commiter**

```gitignore
.env
.env.local
.env.*.local
.env.production
.env.production.local
backend/.env
backend/.env.production
frontend/.env
frontend/.env.production
```

✅ Déjà dans `.gitignore`.

---

## 📊 **Monitoring optionnel**

### Prometheus + Grafana

```yaml
# docker-compose-monitoring.yml
prometheus:
  image: prom/prometheus
  volumes:
    - ./monitoring/prometheus.yml:/etc/prometheus/prometheus.yml

grafana:
  image: grafana/grafana
  ports:
    - "3001:3000"
```

### DataDog / New Relic

Ajouter agent dans `backend/Dockerfile` ou `docker-compose.yml`.

---

## 🆘 **Troubleshooting Production**

### "❌ Erreur MongoDB : Authentication failed"

```bash
# Vérifier MONGO_URI dans docker-compose.yml
# Vérifier MONGO_USER + MONGO_PASSWORD correspondent
docker-compose down -v
docker-compose up
```

### "Seed.js s'exécute en production"

```bash
# Ajouter check dans seed.js
if (process.env.NODE_ENV === "production") {
  console.error("❌ Seeder not allowed in production");
  process.exit(1);
}
```

✅ Déjà implémenté.

### "Rate limit trop strict"

Éditer `backend/src/app.js` :

```javascript
const limiter = rateLimit({
  max: 200, // Augmenter si nécessaire
});
```

---

## 📝 **Documentation de déploiement**

À garder à jour :
- Domaine(s) de production
- Administrateur contact
- Procédure rollback
- Procédure d'urgence

---

**Dernier check avant go-live :**

```bash
docker-compose ps  # Tous "healthy" ?
curl https://api.orthoshop.com/api/health  # 200 OK ?
```

✅ **Ready to deploy ! 🚀**
