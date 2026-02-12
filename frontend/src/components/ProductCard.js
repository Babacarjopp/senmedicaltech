import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const [added, setAdded] = useState(false);

  const handleAdd = (e) => {
    e.stopPropagation();
    addToCart(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <div className="card group flex flex-col">
      {/* Image */}
      <Link to={`/products/${product._id}`} className="block">
        <div className="relative h-48 bg-neutral-100 overflow-hidden">
          <img
            src={product.image || "https://via.placeholder.com/400x300?text=Produit"}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          {/* Badge catégorie */}
          <span className="absolute top-3 left-3 badge badge-blue">{product.category}</span>
          {/* Badge stock */}
          {!product.inStock && (
            <span className="absolute top-3 right-3 badge badge-red">Épuisé</span>
          )}
        </div>
      </Link>

      {/* Contenu */}
      <div className="flex flex-col flex-1 p-4 gap-2">
        <Link to={`/products/${product._id}`}>
          <h3 className="font-semibold text-neutral-800 text-base hover:text-primary-500 transition-colors line-clamp-2">
            {product.name}
          </h3>
        </Link>

        <p className="text-neutral-500 text-sm line-clamp-2 flex-1">
          {product.description}
        </p>

        {/* Prix + Bouton */}
        <div className="flex items-center justify-between mt-auto pt-2 border-t border-neutral-100">
          <span className="text-primary-600 font-bold text-lg">
            {product.price.toFixed(2)} <span className="text-xs font-normal text-neutral-400">FCFA</span>
          </span>

          <button
            onClick={handleAdd}
            disabled={!product.inStock}
            className={`text-sm py-1.5 px-4 rounded-xl font-semibold transition-all duration-200 border-none cursor-pointer
              ${added
                ? "bg-green-500 text-white"
                : product.inStock
                  ? "bg-primary-500 text-white hover:bg-primary-600"
                  : "bg-neutral-200 text-neutral-400 cursor-not-allowed"
              }`}
          >
            {added ? "✓ Ajouté" : product.inStock ? "Ajouter" : "Épuisé"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
