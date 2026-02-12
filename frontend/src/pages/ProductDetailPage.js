import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../utils/api";
import { useCart } from "../context/CartContext";
import Loader from "../components/Loader";

const ProductDetailPage = () => {
  const { id } = useParams();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    api.get(`/products/${id}`)
      .then((res) => setProduct(res.data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [id]);

  const handleAdd = () => {
    addToCart(product, qty);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  if (loading) return <Loader />;
  if (!product) return (
    <div className="text-center py-32">
      <p className="text-5xl mb-4">❌</p>
      <p className="text-neutral-500">Produit non trouvé.</p>
      <Link to="/products" className="text-primary-500 font-semibold hover:underline mt-2 inline-block">← Retour</Link>
    </div>
  );

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      {/* Fil d'ariane */}
      <p className="text-sm text-neutral-400 mb-6">
        <Link to="/" className="hover:text-primary-500">Accueil</Link>
        {" / "}
        <Link to="/products" className="hover:text-primary-500">Produits</Link>
        {" / "}
        <span className="text-neutral-600">{product.name}</span>
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* Image */}
        <div className="card overflow-hidden">
          <img
            src={product.image || "https://via.placeholder.com/600x500?text=Produit"}
            alt={product.name}
            className="w-full h-80 object-cover"
          />
        </div>

        {/* Détails */}
        <div className="flex flex-col gap-4">
          <span className="badge badge-blue w-fit">{product.category}</span>
          <h1 className="text-3xl font-extrabold text-neutral-800">{product.name}</h1>

          {/* Prix */}
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-extrabold text-primary-600">{product.price.toFixed(2)}</span>
            <span className="text-neutral-400 text-lg">FCFA</span>
          </div>

          {/* Stock */}
          <div className="flex items-center gap-2">
            <span className={`inline-block w-3 h-3 rounded-full ${product.inStock ? "bg-green-500" : "bg-red-400"}`} />
            <span className={`text-sm font-semibold ${product.inStock ? "text-green-600" : "text-red-500"}`}>
              {product.inStock ? `En stock (${product.stock} disponible)` : "Épuisé"}
            </span>
          </div>

          {/* Description */}
          <p className="text-neutral-600 leading-relaxed">{product.description}</p>

          <hr className="my-2 border-neutral-200" />

          {/* Quantité */}
          <div className="flex items-center gap-4">
            <span className="text-sm font-semibold text-neutral-700">Quantité :</span>
            <div className="flex items-center border border-neutral-200 rounded-xl overflow-hidden">
              <button
                onClick={() => setQty((q) => Math.max(1, q - 1))}
                className="px-4 py-2 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 font-bold transition-colors"
              >−</button>
              <span className="px-5 py-2 font-semibold text-neutral-800">{qty}</span>
              <button
                onClick={() => setQty((q) => q + 1)}
                className="px-4 py-2 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 font-bold transition-colors"
              >+</button>
            </div>
          </div>

          {/* Bouton Ajout */}
          <button
            onClick={handleAdd}
            disabled={!product.inStock}
            className={`mt-2 py-3 rounded-xl font-bold text-lg transition-all duration-300 border-none cursor-pointer
              ${added
                ? "bg-green-500 text-white"
                : product.inStock
                  ? "bg-primary-500 text-white hover:bg-primary-600 shadow-md hover:shadow-lg"
                  : "bg-neutral-200 text-neutral-400 cursor-not-allowed"
              }`}
          >
            {added ? "✓ Ajouté au panier !" : product.inStock ? "Ajouter au panier 🛒" : "Épuisé"}
          </button>

          {/* Info livraison */}
          <div className="bg-primary-50 rounded-xl p-4 mt-2">
            <p className="text-sm text-primary-700">🚚 Livraison gratuite pour toute commande supérieure à <strong>200 FCFA</strong></p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;
