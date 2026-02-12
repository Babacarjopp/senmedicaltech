# 🏥 OrthoShop — Application de vente de matériel orthopédique

Application web complète pour la vente de matériel orthopédique (vis corticales, plaques, implants, orthèses, instruments).

**Production-ready** avec infrastructure sécurisée, multi-environnements (staging/prod), monitoring centralisé et documentation complète.

---

## 🚀 Quick Start

```bash
# Development
docker-compose up --build

# Staging
docker-compose -f docker-compose.staging.yml up --build

# Production (see docs/HTTPS_SETUP.md)
docker-compose -f docker-compose.prod.yml up --build

# Validation
bash validate-env.sh dev       # Check dev environment
bash validate-env.sh staging   # Check staging environment
bash validate-env.sh prod      # Check production environment
```

---

## 📁 Structure du projet

```
orthopedic-shop/
├── backend/
│   ├── src/
│   │   ├── config/db.js          → Connexion MongoDB
│   │   ├── middleware/auth.js    → JWT protect + adminOnly
│   │   ├── models/
│   │   │   ├── Product.js        → Modèle produit
│   │   │   ├── User.js           → Modèle utilisateur
│   │   │   └── Order.js          → Modèle commande
│   │   ├── routes/
│   │   │   ├── auth.js           → Login / Register / Profile
│   │   │   ├── products.js       → CRUD produits
│   │   │   └── orders.js         → Créer & gérer commandes
│   │   ├── app.js                → Serveur Express principal
│   │   └── seed.js               → Données de test
│   ├── package.json
│   ├── .env
│   └── Dockerfile
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.js         → Barre de navigation
│   │   │   ├── Footer.js         → Pied de page
│   │   │   ├── ProductCard.js    → Carte produit
│   │   │   └── Loader.js         → Spinner
│   │   ├── context/
│   │   │   ├── AuthContext.js    → Gestion authentification
│   │   │   └── CartContext.js    → Gestion panier
│   │   ├── pages/
│   │   │   ├── HomePage.js       → Accueil
│   │   │   ├── ProductsPage.js   → Liste produits + filtres
│   │   │   ├── ProductDetailPage → Détail produit
│   │   │   ├── CartPage.js       → Panier
│   │   │   ├── CheckoutPage.js   → Checkout / Commande
│   │   │   ├── LoginPage.js      → Connexion
│   │   │   ├── RegisterPage.js   → Inscription
│   │   │   └── DashboardPage.js  → Admin dashboard
│   │   ├── utils/api.js          → Instance Axios
│   │   ├── App.js                → Router principal
│   │   ├── index.js              → Point d'entrée
│   │   └── index.css             → Tailwind + styles globaux
│   ├── public/index.html
│   ├── tailwind.config.js
│   ├── package.json
│   ├── .env
│   └── Dockerfile
│
├── docker-compose.yml
└── README.md
```

---

## 🚀 Démarrage (sans Docker)

### 1. Backend

```bash
cd backend
npm install
node src/seed.js          # Insérer les données de test
npm run dev               # Lancer le serveur (avec nodemon)
```

### 2. Frontend

```bash
cd frontend
npm install
npm start                 # Lancement sur localhost:3000
```

### 3. MongoDB

Assurez-vous que MongoDB est installé et en cours d'exécution sur `localhost:27017`.

---

## 🚀 Démarrage (avec Docker)

1. **Créer le fichier `.env`** à la racine :
   ```bash
   cp .env.example .env
   # Éditer .env et définir JWT_SECRET, MONGO_PASSWORD, etc.
   ```

2. **Lancer les services** :
   ```bash
   docker-compose up --build
   ```

3. **Seeder les données de test** (une fois MongoDB prêt) :
   ```bash
   docker exec -it orthoshop-backend node src/seed.js
   ```

Puis ouvrez :
- **Frontend** → http://localhost:3000
- **Backend API** → http://localhost:5000/api/health

> ⚠️ **Production** : Ne pas utiliser le seed avec le compte admin par défaut. Changer le mot de passe ou créer un admin via une autre méthode.

---

## 🚀 Déploiement en Production

### Infrastructure Production (HTTPS + Nginx)

Pour déployer en production avec **HTTPS, TLS/Let's Encrypt et domaine senmedicaltech.com** :

```bash
# 1. Préparer la configuration
cp .env.production .env.production.local
# Éditer avec credentials secrets (JWT_SECRET, MONGO_PASSWORD, MAIL_*, SENTRY_DSN)

# 2. Lancer les services
docker-compose -f docker-compose.prod.yml up -d --build

# 3. Initialiser certificats Let's Encrypt
# Voir: docs/HTTPS_SETUP.md pour instructions détaillées
```

**Configuration requise:**
- Domaine `senmedicaltech.com` (+ subdomains) pointant vers votre serveur
- Ports 80 et 443 ouverts
- Certificats Let's Encrypt (auto-renouvelables)
- JWT_SECRET fort (ex. `openssl rand -base64 64`)
- MAIL_* configurés (SendGrid/Mailgun/SES)
- SENTRY_DSN pour error tracking

Voir [docs/HTTPS_SETUP.md](docs/HTTPS_SETUP.md) pour guide complet.

---

## 🚀 Déploiement en Production
## 🏗️ Environnement STAGING

Pour tester avant production, utilisez le déploiement staging :

```bash
# Lancer staging
docker-compose -f docker-compose.staging.yml up -d --build

# Seeder les données de test
docker-compose -f docker-compose.staging.yml exec backend node src/seed.js

# Vérifier l'état
docker-compose -f docker-compose.staging.yml ps
```

Voir [docs/STAGING_DEPLOY.md](docs/STAGING_DEPLOY.md) pour les détails complets.

---

## 🚀 Déploiement en production
## 🧪 Compte de test Admin

| Email | Mot de passe |
|---|---|
| admin@orthoshop.com | admin123 |

---

## 🛠️ Technologies utilisées

| Catégorie | Outil |
|---|---|
| Frontend | React, React Router, Tailwind CSS, Axios |
| Backend | Node.js, Express, Mongoose, JWT, bcryptjs |
| Database | MongoDB |
| Deploy | Docker, Docker Compose |

---

## 📝 Fonctionnalités

- ✅ Catalogue de produits avec filtres et recherche
- ✅ Détail produit avec ajout au panier
- ✅ Panier avec gestion des quantités
- ✅ Checkout avec formulaire adresse + paiement (guest + authentifié)
- ✅ Authentification (register / login / logout) avec JWT
- ✅ Dashboard admin (CRUD produits, gestion commandes)
- ✅ Confirmation de commande par email (Nodemailer)
- ✅ Validation des entrées (express-validator)
- ✅ Sécurité: Helmet, rate-limiting, CORS
- ✅ Responsive (mobile-friendly)
- ✅ Design propre et moderne avec Tailwind CSS

---

## 🔒 Sécurité (Production)

### Avant de mettre en ligne, vérifier:

1. **Secrets & Environnement**
   - Générer `JWT_SECRET` fort: `openssl rand -base64 32`
   - Utiliser un gestionnaire de secrets (GitHub Secrets, AWS Secrets Manager, Vault)
   - Ne jamais commiter `.env`
   - Définir `NODE_ENV=production` ou `staging`

2. **Seeder**
   - ⚠️ Ne JAMAIS exécuter le seeder en production
   - Créer les comptes admin via:
     - Une CLI sécurisée
     - Une interface d'administration protégée (JWT admin)
     - Scripts de déploiement

3. **TLS & Reverse Proxy**
   - Placer Nginx/Caddy devant l'app
   - Obtenir certificats (Let's Encrypt)
   - Rediriger HTTP → HTTPS

4. **Mail (SMTP)**
   - Utiliser un fournisseur: SendGrid, Mailgun, AWS SES
   - Configurer `MAIL_HOST`, `MAIL_PORT`, `MAIL_USER`, `MAIL_PASS`, `MAIL_FROM`
   - Ajouter retry logic et templates professionnels

5. **Validation & Rate-Limiting**
   - ✅ Déjà implémenté: `express-validator` sur auth
   - ✅ Déjà implémenté: rate-limit (100 req/15min global, 5 req/15min auth)
   - ✅ Déjà implémenté: Helmet pour headers de sécurité

6. **Logs & Monitoring**
   - Centraliser les logs (Sentry, Datadog, CloudWatch)
   - Configurer des alertes
   - Monitorer les healthchecks
   - Voir [docs/MONITORING.md](docs/MONITORING.md) pour la configuration Sentry + Winston

7. **Backups & Persistance**
   - Sauvegarder MongoDB régulièrement
   - Tester les restaurations
   - Configurer des snapshots des volumes

8. **CI/CD & Images**
   - Scanner les vulnérabilités des images
   - Tagger les images (`v1.0.0`, `latest`)
   - Automatiser les tests avant déploiement

Voir [docs/EMAIL_TEST.md](docs/EMAIL_TEST.md) pour tester l'envoi d'e-mails en développement.
