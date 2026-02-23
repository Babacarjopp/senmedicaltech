const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Le nom du produit est obligatoire"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "La description est obligatoire"],
      trim: true,
    },
    price: {
      type: Number,
      required: [true, "Le prix est obligatoire"],
      min: [0, "Le prix doit être positif"],
    },
    category: {
      type: String,
      required: [true, "La catégorie est obligatoire"],
      trim: true,
    },
    image: {
      type: String,
      default: "",
    },
    stock: {
      type: Number,
      default: 0,
      min: [0, "Le stock ne peut pas être négatif"],
    },
    inStock: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Mettre à jour automatiquement le champ inStock en fonction du stock
productSchema.pre("save", function (next) {
  if (typeof this.stock === "number") {
    this.inStock = this.stock > 0;
  }
  next();
});

module.exports = mongoose.model("Product", productSchema);