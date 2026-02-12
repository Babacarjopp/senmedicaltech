const express = require("express");
const router = express.Router();
const Product = require("../models/Product");
const { protect, adminOnly } = require("../middleware/auth");

// GET /api/products — Liste tous les produits (public)
router.get("/", async (req, res) => {
  try {
    const { category, search, sort } = req.query;
    let query = {};

    // Filtrer par catégorie
    if (category) query.category = category;

    // Recherche par nom (insensible à la casse)
    if (search) query.name = { $regex: search, $options: "i" };

    let products = Product.find(query);

    // Trier par prix
    if (sort === "price-asc") products = products.sort({ price: 1 });
    if (sort === "price-desc") products = products.sort({ price: -1 });
    if (sort === "newest") products = products.sort({ createdAt: -1 });

    const result = await products;
    res.json(result);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/products/:id — Détail d'un produit (public)
router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Produit non trouvé." });
    }
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/products — Créer un produit (admin uniquement)
router.post("/", protect, adminOnly, async (req, res) => {
  try {
    const product = await Product.create(req.body);
    res.status(201).json(product);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// PUT /api/products/:id — Mettre à jour un produit (admin uniquement)
router.put("/:id", protect, adminOnly, async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!product) {
      return res.status(404).json({ message: "Produit non trouvé." });
    }
    res.json(product);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE /api/products/:id — Supprimer un produit (admin uniquement)
router.delete("/:id", protect, adminOnly, async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Produit non trouvé." });
    }
    res.json({ message: "Produit supprimé avec succès." });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
