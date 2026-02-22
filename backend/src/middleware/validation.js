const { body, validationResult } = require("express-validator");

// ➡️ Middleware pour vérifier les erreurs de validation
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ 
      message: "Données invalides", 
      errors: errors.array().map(e => ({ field: e.path, message: e.msg }))
    });
  }
  next();
};

// ➡️ Validation pour l'inscription
const validateRegister = [
  body("name")
    .trim()
    .notEmpty().withMessage("Le nom est obligatoire")
    .isLength({ min: 2, max: 50 }).withMessage("Le nom doit contenir entre 2 et 50 caractères"),
  
  body("email")
    .trim()
    .notEmpty().withMessage("L'email est obligatoire")
    .isEmail().withMessage("Email invalide")
    .normalizeEmail(),
  
  body("password")
    .notEmpty().withMessage("Le mot de passe est obligatoire")
    .isLength({ min: 6 }).withMessage("Le mot de passe doit contenir au moins 6 caractères")
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/).withMessage("Le mot de passe doit contenir au moins une majuscule, une minuscule et un chiffre"),
  
  validate
];

// ➡️ Validation pour le login
const validateLogin = [
  body("email")
    .trim()
    .notEmpty().withMessage("L'email est obligatoire")
    .isEmail().withMessage("Email invalide")
    .normalizeEmail(),
  
  body("password")
    .notEmpty().withMessage("Le mot de passe est obligatoire"),
  
  validate
];

// ➡️ Validation pour création de produit
const validateProduct = [
  body("name")
    .trim()
    .notEmpty().withMessage("Le nom du produit est obligatoire")
    .isLength({ min: 3, max: 200 }).withMessage("Le nom doit contenir entre 3 et 200 caractères"),
  
  body("description")
    .trim()
    .notEmpty().withMessage("La description est obligatoire")
    .isLength({ min: 10, max: 2000 }).withMessage("La description doit contenir entre 10 et 2000 caractères"),
  
  body("price")
    .notEmpty().withMessage("Le prix est obligatoire")
    .isFloat({ min: 0 }).withMessage("Le prix doit être un nombre positif"),
  
  body("category")
    .notEmpty().withMessage("La catégorie est obligatoire")
    .isIn(["Vis Corticale", "Plaques", "Implants", "Orthèses", "Instruments", "Autre"])
    .withMessage("Catégorie invalide"),
  
  body("stock")
    .optional()
    .isInt({ min: 0 }).withMessage("Le stock doit être un nombre entier positif"),
  
  body("image")
    .optional()
    .isURL().withMessage("L'URL de l'image est invalide"),
  
  validate
];

// ➡️ Validation pour création de commande
const validateOrder = [
  body("items")
    .isArray({ min: 1 }).withMessage("La commande doit contenir au moins un produit"),
  
  body("items.*.product")
    .notEmpty().withMessage("L'ID du produit est obligatoire")
    .isMongoId().withMessage("ID produit invalide"),
  
  body("items.*.quantity")
    .isInt({ min: 1 }).withMessage("La quantité doit être au moins 1"),
  
  body("shippingAddress.street")
    .trim()
    .notEmpty().withMessage("L'adresse de livraison est obligatoire"),
  
  body("shippingAddress.city")
    .trim()
    .notEmpty().withMessage("La ville est obligatoire"),
  
  body("shippingAddress.postal")
    .trim()
    .notEmpty().withMessage("Le code postal est obligatoire"),
  
  body("shippingAddress.country")
    .trim()
    .notEmpty().withMessage("Le pays est obligatoire"),
  
  body("paymentMethod")
  // .isIn(["Carte", "Virement", "Espèces"]).withMessage("Méthode de paiement invalide"),pour plus tard si on veut integrer d'autres méthodes de paiement, on peut enlever cette validation stricte et juste vérifier que ce n'est pas vide
    .isIn([ "Espèces"]).withMessage("Méthode de paiement invalide"),
  
  validate
];

module.exports = {
  validateRegister,
  validateLogin,
  validateProduct,
  validateOrder,
};