const express = require("express");
const router = express.Router();
const Order = require("../models/Order");
const Product = require("../models/Product");
const { protect, adminOnly } = require("../middleware/auth");
const { validateOrder } = require("../middleware/validation");

// POST /api/orders — Créer une commande (utilisateur connecté)
router.post("/", protect, validateOrder, async (req, res) => {
  try {
    const { items, shippingAddress, paymentMethod } = req.body;

    // Calculer le prix total & vérifier le stock
    let totalPrice = 0;
    for (const item of items) {
      const product = await Product.findById(item.product);
      if (!product) {
        return res.status(404).json({ message: `Produit ${item.product} non trouvé.` });
      }
      if (product.stock < item.quantity) {
        return res.status(400).json({ message: `Stock insuffisant pour : ${product.name}` });
      }
      totalPrice += product.price * item.quantity;

      // Diminuer le stock
      product.stock -= item.quantity;
      product.inStock = product.stock > 0;
      await product.save();
    }

    const order = await Order.create({
      user: req.user._id,
      items: items.map((item) => ({
        product: item.product,
        quantity: item.quantity,
        price: totalPrice / items.length, // prix unitaire medio (on peut affiner)
      })),
      totalPrice,
      shippingAddress,
      paymentMethod,
    });

    res.status(201).json(order);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// GET /api/orders/my — Mes commandes (utilisateur connecté)
router.get("/my", protect, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .populate("items.product", "name price image")
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/orders — Toutes les commandes (admin uniquement)
router.get("/", protect, adminOnly, async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("user", "name email")
      .populate("items.product", "name price image")
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT /api/orders/:id/status — Mettre à jour le statut (admin uniquement)
router.put("/:id/status", protect, adminOnly, async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findByIdAndUpdate(req.params.id, { status }, { new: true });
    if (!order) {
      return res.status(404).json({ message: "Commande non trouvée." });
    }
    res.json(order);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;