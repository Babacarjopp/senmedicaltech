const express = require("express");
const dotenv = require("dotenv");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const mongoSanitize = require("express-mongo-sanitize");
const connectDB = require("./config/db");

// Routes
const authRoutes = require("./routes/auth");
const productRoutes = require("./routes/products");
const orderRoutes = require("./routes/orders");

// ── Init ──
dotenv.config({ path: require("path").join(__dirname, "..", ".env") });
const app = express();
const PORT = process.env.PORT || 5000;

// ── Connexion MongoDB ──
connectDB();

// ── Middleware globaux ──
app.use(express.json());                          // Parser JSON
app.use(require("cors")({ origin: "*" }));        // CORS (autorise toutes les origines en dev)

// ── Sécurité ──
app.use(helmet({
  contentSecurityPolicy: false,  // Désactivé pour le dev (à activer en prod)
  crossOriginEmbedderPolicy: false
}));                                              // Headers HTTP sécurisés
app.use(mongoSanitize());                        // Protection injection NoSQL

// ── Rate Limiting (anti brute-force) ──
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,  // 15 minutes
  max: 100,                   // Max 100 requêtes par IP
  message: "Trop de requêtes depuis cette IP, réessayez dans 15 minutes.",
  standardHeaders: true,
  legacyHeaders: false,
});
app.use("/api/", limiter);

// Rate limit spécial pour les routes d'authentification (plus strict)
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,  // 15 minutes
  max: 5,                     // Max 5 tentatives de login
  message: "Trop de tentatives de connexion, réessayez dans 15 minutes.",
  skipSuccessfulRequests: true,
});
app.use("/api/auth/login", authLimiter);
app.use("/api/auth/register", authLimiter);

// ── Routes ──
app.use("/api/auth",     authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders",   orderRoutes);

// ── Route santé (pour vérifier que le serveur tourne) ──
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", message: "🟢 Serveur orthopédique en ligne !" });
});

// ── Gestion d'erreurs globales ──
process.on('uncaughtException', (err) => {
  console.error('❌ ERREUR CRITIQUE :', err);
  process.exit(1);
});

process.on('unhandledRejection', (err) => {
  console.error('❌ PROMESSE REJETÉE :', err);
  process.exit(1);
});

// ── Lancement du serveur ──
app.listen(PORT, () => {
  console.log(`\n🚀 Serveur Express lancé sur http://localhost:${PORT}`);
}).on('error', (err) => {
  console.error('❌ Erreur serveur :', err.message);
  if (err.code === 'EADDRINUSE') {
    console.error(`⚠️  Le port ${PORT} est déjà utilisé. Changez le port dans .env`);
  }
});

module.exports = app;