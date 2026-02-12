// ======================================================
// SEEDER — Exécuter : node src/seed.js
// Insère des produits de test + un compte admin
// 
// ⚠️ SÉCURITÉ: N'exécute QUE si NODE_ENV !== 'production' && !== 'staging'
// ⚠️ JAMAIS en production — utiliser une autre méthode
// ======================================================

const dotenv = require("dotenv");
const path = require("path");
dotenv.config({ path: path.join(__dirname, "..", ".env") });

// ⚠️ SÉCURITÉ: Empêcher l'exécution en production ou staging
// Sauf si ALLOW_SEED=true est défini (pour CI/CD ou tests contrôlés)
const allowSeed = process.env.ALLOW_SEED === "true";
if ((process.env.NODE_ENV === "production" || process.env.NODE_ENV === "staging") && !allowSeed) {
  console.error(
    "❌ DANGER: Le seeder ne peut pas s'exécuter en production ou staging !"
  );
  console.error("   Si vous avez besoin de créer un admin en production, utilisez:");
  console.error("   - Une CLI administrateur sécurisée");
  console.error("   - Une interface web d'administration protégée (JWT admin)");
  console.error("   - Un gestionnaire de secrets + scripts de déploiement");
  console.error("");
  console.error("   Pour override (tests contrôlés): ALLOW_SEED=true node src/seed.js");
  process.exit(1);
}

const mongoose = require("mongoose");
const Product = require("./models/Product");
const User = require("./models/User");

const sampleProducts = [
  {
    name: "Vis Corticale 4.5 x 30mm",
    description: "Vis corticale en acier inoxydable, filetage standard, utilisée pour la fixation osseuse. Compatibles avec les plaques orthopédiques standard.",
    price: 45.0,
    category: "Vis Corticale",
    image: "https://dis-promed.com/web/image/product.product/2948/image_1024/VIS%20CORTICAL%20DIAM%204.5?unique=bc0a96d",
    stock: 150,
    inStock: true,
  },
  {
    name: "Vis Corticale 3.5 x 25mm",
    description: "Vis corticale plus fine, idéale pour les os plus petits ou les chirurgies pédiatriques. Fabriquée en titanium médical.",
    price: 52.0,
    category: "Vis Corticale",
    image: "https://dis-promed.com/web/image/product.product/2948/image_1024/VIS%20CORTICAL%20DIAM%204.5?unique=bc0a96d",
    stock: 200,
    inStock: true,
  },
  {
    name: "Plaque dorsale rachidiale",
    description: "Plaque dorsale utilisée pour la stabilisation de la colonne vertébrale. Matériau : titanium biocompatible.",
    price: 320.0,
    category: "Plaques",
    image: "https://www.amazon.fr/NCLCPVO-Rachidienne-Thoraco-Lombaire-Scoliose-Thoracique/dp/B0BQL1FJYG",
    stock: 30,
    inStock: true,
  },
  {
    name: "Plaque antérieure tibiale",
    description: "Plaque pour la fixation des fractures du tibia. Design ergonomique pour une mise en place précise.",
    price: 275.0,
    category: "Plaques",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSuu_AY6SqhFLB8zIOjbfOGyeRzmr4WAxihOQ&s",
    stock: 45,
    inStock: true,
  },
  {
    name: "Implant humeral inversé",
    description: "Implant inversé pour la reconstruction de l'épaile. Utilisé en cas d'arthropathie de la coiffe.",
    price: 890.0,
    category: "Implants",
    image: "data:image/jpeg;base64,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",
    stock: 15,
    inStock: true,
  },
  {
    name: "Orthèse du genouiller articulée",
    description: "Orthèse stabilisatrice du genou avec charnières articulées. Ajustable en taille. Confort quotidien.",
    price: 85.0,
    category: "Orthèses",
    image: "data:image/jpeg;base64,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",
    stock: 100,
    inStock: true,
  },
  {
    name: "Orthèse cervicale rigide",
    description: "Collier cervical rigide pour immobilisation post-traumatique. Rembourrage interne pour le confort.",
    price: 65.0,
    category: "Orthèses",
    image: "https://via.placeholder.com/400x300?text=Orthese+Cervicale",
    stock: 80,
    inStock: true,
  },
  {
    name: "Kit instrumentale de visserie",
    description: "Kit complet pour la mise en place des vis corticales. Inclut clés Allen, guide et dispositif de verrouillage.",
    price: 450.0,
    category: "Instruments",
    image: "https://via.placeholder.com/400x300?text=Kit+Instrumentale",
    stock: 20,
    inStock: true,
  },
];

const adminUser = {
  name: "Admin Test",
  email: "admin@orthoshop.com",
  password: "admin123", // sera hashé automatiquement par le middleware pre-save
  role: "admin",
};

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Connecté à MongoDB");

    // Supprimer les anciennes données
    await Product.deleteMany({});
    await User.deleteMany({});
    console.log("🗑️  Anciennes données supprimées");

    // Insérer produits
    await Product.insertMany(sampleProducts);
    console.log(`📦 ${sampleProducts.length} produits insérés`);

    // Insérer admin (via create pour déclencher le middleware pre-save → hash du mdp)
    await User.create(adminUser);
    console.log("👤 Admin créé → email: admin@orthoshop.com | mdp: admin123");

    await mongoose.disconnect();
    console.log("\n✅ Seeder terminé avec succès !");
  } catch (err) {
    console.error("❌ Erreur du seeder :", err.message);
    process.exit(1);
  }
}

seed();
