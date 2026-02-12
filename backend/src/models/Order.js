const mongoose = require("mongoose");

const orderItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
  },
  price: {
    type: Number,
    required: true,  // Prix au moment de la commande (en cas de changement de prix)
  },
});

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false,  // Optionnel pour les commandes guest
    },
    guestEmail: {
      type: String,
      required: false,  // Email pour les commandes sans compte
    },
    items: {
      type: [orderItemSchema],
      required: true,
      validate: {
        validator: (v) => v.length > 0,
        message: "La commande doit contenir au moins un produit",
      },
    },
    totalPrice: {
      type: Number,
      required: true,
      min: 0,
    },
    shippingAddress: {
      street: { type: String, required: true },
      city: { type: String, required: true },
      postal: { type: String, required: true },
      country: { type: String, required: true },
    },
    status: {
      type: String,
      enum: ["En attente", "Confirmée", "En cours", "Expédiée", "Livrée", "Annulée"],
      default: "En attente",
    },
    paymentMethod: {
      type: String,
      enum: ["Carte", "Virement", "Espèces"],
      default: "Carte",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);
