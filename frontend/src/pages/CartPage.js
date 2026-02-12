import React from "react";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";

const CartPage = () => {
  const { cart, removeFromCart, updateQuantity, cartTotal, clearCart } = useCart();

  if (cart.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-32 text-center">
        <p className="text-6xl mb-4">🛒</p>
        <h2 className="text-2xl font-bold text-neutral-700 mb-2">Votre panier est vide</h2>
        <p className="text-neutral-500 mb-6">Ajoutez des produits pour commencer à acheter.</p>
        <Link to="/products" className="btn-primary inline-block">Parcourir les produits</Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      {/* Titre */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-neutral-800">Votre Panier</h1>
          <p className="text-neutral-500">{cart.length} article(s)</p>
        </div>
        <button onClick={clearCart} className="text-sm text-red-500 hover:text-red-600 font-semibold transition-colors">
          🗑️ Vider le panier
        </button>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Liste articles */}
        <div className="flex-1 flex flex-col gap-4">
          {cart.map((item) => (
            <div key={item._id} className="card flex flex-col sm:flex-row gap-4 p-4">
              {/* Image */}
              <img
                src={item.image || "https://via.placeholder.com/100x100?text=Img"}
                alt={item.name}
                className="w-24 h-24 object-cover rounded-xl bg-neutral-100"
              />
              {/* Info */}
              <div className="flex-1 flex flex-col gap-1 justify-between">
                <div>
                  <h3 className="font-semibold text-neutral-800">{item.name}</h3>
                  <span className="text-xs badge badge-blue">{item.category}</span>
                </div>
                <div className="flex items-center justify-between">
                  {/* Quantité */}
                  <div className="flex items-center border border-neutral-200 rounded-lg overflow-hidden">
                    <button
                      onClick={() => updateQuantity(item._id, item.quantity - 1)}
                      className="px-3 py-1 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 font-bold"
                    >−</button>
                    <span className="px-4 py-1 font-semibold text-neutral-800">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item._id, item.quantity + 1)}
                      className="px-3 py-1 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 font-bold"
                    >+</button>
                  </div>
                  {/* Prix ligne */}
                  <span className="font-bold text-primary-600">
                    {(item.price * item.quantity).toFixed(2)} FCFA
                  </span>
                </div>
              </div>
              {/* Supprimer */}
              <button onClick={() => removeFromCart(item._id)} className="text-red-400 hover:text-red-600 transition-colors self-start">
                ✕
              </button>
            </div>
          ))}
        </div>

        {/* Résumé commande */}
        <div className="w-full lg:w-80">
          <div className="card p-6 flex flex-col gap-4 sticky top-24">
            <h2 className="text-lg font-bold text-neutral-800 border-b border-neutral-200 pb-3">Résumé</h2>

            <div className="flex justify-between text-sm text-neutral-600">
              <span>Sous-total</span>
              <span>{cartTotal.toFixed(2)} FCFA</span>
            </div>
            <div className="flex justify-between text-sm text-neutral-600">
              <span>Livraison</span>
              <span className={cartTotal >= 200 ? "text-green-600 font-semibold" : ""}>
                {cartTotal >= 200 ? "Gratuite ✓" : "15.00 FCFA"}
              </span>
            </div>

            <hr className="border-neutral-200" />

            <div className="flex justify-between text-lg font-bold text-neutral-800">
              <span>Total</span>
              <span className="text-primary-600">
                {(cartTotal >= 200 ? cartTotal : cartTotal + 15).toFixed(2)} FCFA
              </span>
            </div>

            <Link to="/checkout" className="btn-primary text-center text-base mt-2">
              Passer à la commande →
            </Link>

            <Link to="/products" className="text-sm text-neutral-500 hover:text-primary-500 text-center transition-colors">
              ← Continuer les achats
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
