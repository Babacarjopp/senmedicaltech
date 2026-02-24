const { sendOrderConfirmation } = require("../utils/mailer");
const express = require("express");
const router = express.Router();
const Order = require("../models/Order");
const Product = require("../models/Product");
const { protect, adminOnly } = require("../middleware/auth");
const { validateOrder } = require("../middleware/validation");

// ── Fonction utilitaire pour créer une commande ──
const createOrder = async ({ items, shippingAddress, paymentMethod, userId, guestEmail }) => {
  let totalPrice = 0;
  const orderItems = [];

  for (const item of items) {
    const product = await Product.findById(item.product);
    if (!product) {
      throw new Error(`Produit ${item.product} non trouvé.`);
    }
    if (product.stock < item.quantity) {
      throw new Error(`Stock insuffisant pour : ${product.name}`);
    }

    totalPrice += product.price * item.quantity;
    orderItems.push({
      product: item.product,
      quantity: item.quantity,
      price: product.price,
    });

    product.stock -= item.quantity;
    product.inStock = product.stock > 0;
    await product.save();
  }

  const orderData = {
    items: orderItems,
    totalPrice,
    shippingAddress,
    paymentMethod,
  };

  if (userId) orderData.user = userId;
  if (guestEmail) orderData.guestEmail = guestEmail;

  return Order.create(orderData);
};

// POST /api/orders — Créer une commande (utilisateur connecté)
router.post("/", protect, validateOrder, async (req, res) => {
  try {
    const { items, shippingAddress, paymentMethod } = req.body;
    const order = await createOrder({
      items,
      shippingAddress,
      paymentMethod,
      userId: req.user._id,
    });

    // ne pas bloquer la réponse si le mail échoue
    sendOrderConfirmation(order).catch((err) =>
      console.error("Erreur envoi mail confirmation:", err.message)
    );

    res.status(201).json(order);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// POST /api/orders/guest — Créer une commande invité
router.post("/guest", validateOrder, async (req, res) => {
  try {
    const { items, shippingAddress, paymentMethod, guestEmail } = req.body;
    if (!guestEmail) {
      return res.status(400).json({ message: "Email requis pour les commandes invité." });
    }

    const order = await createOrder({
      items,
      shippingAddress,
      paymentMethod,
      guestEmail,
    });

    sendOrderConfirmation(order).catch((err) =>
      console.error("Erreur envoi mail confirmation:", err.message)
    );

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
    if (!order) return res.status(404).json({ message: "Commande non trouvée." });
    res.json(order);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;