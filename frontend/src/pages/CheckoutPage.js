import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import api from "../utils/api";

const CheckoutPage = () => {
  const { cart, cartTotal, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  // États pour mode guest ou connecté
  const [mode, setMode] = useState(user ? "user" : null);  // "user" ou "guest"
  const [guestEmail, setGuestEmail] = useState("");

  const [address, setAddress] = useState({
    street: user?.address?.street || "",
    city: user?.address?.city || "",
    postal: user?.address?.postal || "",
    country: user?.address?.country || "Sénégal",
  });
  // --- MÉTHODE DE PAIEMENT : pour réintégrer Carte + Virement, décommenter la ligne ci-dessous et commenter la suivante ---
  // const [paymentMethod, setPaymentMethod] = useState("Carte");
  const paymentMethod = "Espèces"; // Paiement uniquement espèces pour le moment
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  // Si panier vide → rediriger
  if (cart.length === 0 && !success) {
    navigate("/cart");
    return null;
  }

  const shippingCost = cartTotal >= 200 ? 0 : 15;
  const total = cartTotal + shippingCost;

  const handleChange = (e) => {
    setAddress((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async () => {
    // Validation
    if (!address.street || !address.city || !address.postal) {
      setError("Veuillez remplir tous les champs de l'adresse.");
      return;
    }

    if (mode === "guest" && !guestEmail) {
      setError("Veuillez entrer votre email pour continuer.");
      return;
    }

    setError("");
    setLoading(true);

    try {
      const orderData = {
        items: cart.map((item) => ({
          product: item._id,
          quantity: item.quantity,
          price: item.price,
        })),
        shippingAddress: address,
        paymentMethod,
      };

      if (mode === "guest") {
        orderData.guestEmail = guestEmail;
        await api.post("/orders/guest", orderData);
      } else {
        await api.post("/orders", orderData);
      }

      clearCart();
      setSuccess(true);
    } catch (err) {
      setError(err.response?.data?.message || "Erreur lors de la commande.");
    } finally {
      setLoading(false);
    }
  };

  // ── Page de succès ──
  if (success) {
    return (
      <div className="max-w-lg mx-auto px-4 py-32 text-center">
        <div className="text-7xl mb-4">✅</div>
        <h2 className="text-2xl font-bold text-neutral-800 mb-2">Commande confirmée !</h2>
        <p className="text-neutral-500 mb-6">
          Merci pour votre commande. Vous recevrez une confirmation par email très rapidement.
        </p>
        <Link to="/" className="btn-primary inline-block">Retour à l'accueil</Link>
      </div>
    );
  }

  // ── Page de sélection (guest ou compte) ──
  if (!mode) {
    return (
      <div className="max-w-lg mx-auto px-4 py-20 text-center">
        <h1 className="text-3xl font-extrabold text-neutral-800 mb-4">Comment voulez-vous commander ?</h1>
        <p className="text-neutral-500 mb-10">Choisissez votre mode de checkout</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* Option Invité */}
          <button
            onClick={() => setMode("guest")}
            className="card p-8 hover:shadow-lg hover:scale-105 transition-all cursor-pointer border-2 border-transparent hover:border-primary-300"
          >
            <div className="text-5xl mb-4">👤</div>
            <h2 className="text-xl font-bold text-neutral-800 mb-2">Continuer en tant qu'invité</h2>
            <p className="text-sm text-neutral-500">
              Commande rapide sans créer de compte.
            </p>
          </button>

          {/* Option Connexion */}
          <button
            onClick={() => navigate("/login")}
            className="card p-8 hover:shadow-lg hover:scale-105 transition-all cursor-pointer border-2 border-transparent hover:border-primary-300"
          >
            <div className="text-5xl mb-4">🔐</div>
            <h2 className="text-xl font-bold text-neutral-800 mb-2">Me connecter</h2>
            <p className="text-sm text-neutral-500">
              Accès à mes commandes passées.
            </p>
          </button>
        </div>

        <div className="mt-6">
          <Link to="/cart" className="text-primary-600 hover:underline">← Retour au panier</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-extrabold text-neutral-800 mb-2">Finaliser votre commande</h1>
      <p className="text-neutral-500 mb-8">
        Mode: <span className="font-semibold text-neutral-700">
          {mode === "user" ? `Connecté(e) — ${user?.name}` : "Invité"}
        </span>
      </p>

      <div className="flex flex-col lg:flex-row gap-10">
        {/* Formulaire gauche */}
        <div className="flex-1 flex flex-col gap-6">

          {/* Email pour les invités */}
          {mode === "guest" && (
            <div className="card p-6 bg-blue-50 border border-blue-200">
              <h2 className="text-lg font-bold text-neutral-800 mb-4">📧 Votre email</h2>
              <input
                type="email"
                value={guestEmail}
                onChange={(e) => setGuestEmail(e.target.value)}
                placeholder="exemple@email.com"
                className="input-style"
              />
              <p className="text-xs text-neutral-500 mt-2">
                Nous utiliserons cet email pour vous envoyer la confirmation de votre commande.
              </p>
            </div>
          )}

          {/* Adresse livraison */}
          <div className="card p-6">
            <h2 className="text-lg font-bold text-neutral-800 mb-4">📍 Adresse de livraison</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="text-sm text-neutral-600 mb-1 block">Adresse</label>
                <input name="street" value={address.street} onChange={handleChange} placeholder="Ex : 10 Rue de la République" className="input-style" />
              </div>
              <div>
                <label className="text-sm text-neutral-600 mb-1 block">Ville</label>
                <input name="city" value={address.city} onChange={handleChange} placeholder="Dakar" className="input-style" />
              </div>
              <div>
                <label className="text-sm text-neutral-600 mb-1 block">Code postal</label>
                <input name="postal" value={address.postal} onChange={handleChange} placeholder="1000" className="input-style" />
              </div>
              <div className="sm:col-span-2">
                <label className="text-sm text-neutral-600 mb-1 block">Pays</label>
                <input name="country" value={address.country} onChange={handleChange} placeholder="Sénégal" className="input-style" />
              </div>
            </div>
          </div>

          {/* Méthode de paiement */}
          <div className="card p-6">
            <h2 className="text-lg font-bold text-neutral-800 mb-4">💳 Méthode de paiement</h2>
            {/* --- Pour réintégrer Carte + Virement : décommenter le bloc ci-dessous et commenter le bloc "Espèces uniquement" --- */}
            {/*
            <div className="grid grid-cols-3 gap-3">
              {["Carte", "Virement", "Espèces"].map((method) => (
                <button
                  key={method}
                  onClick={() => setPaymentMethod(method)}
                  className={`p-4 rounded-xl border-2 text-sm font-semibold transition-all duration-200 cursor-pointer
                    ${paymentMethod === method
                      ? "border-primary-500 bg-primary-50 text-primary-600"
                      : "border-neutral-200 text-neutral-600 hover:border-neutral-300 bg-white"
                    }`}
                >
                  {method === "Carte" && "💳 "}
                  {method === "Virement" && "🏦 "}
                  {method === "Espèces" && "💵 "}
                  {method}
                </button>
              ))}
            </div>
            */}
            {/* Espèces uniquement - commenter ce bloc pour réactiver Carte + Virementsssss */}
            <div className="flex items-center gap-3 p-4 rounded-xl border-2 border-primary-500 bg-primary-50 text-primary-600">
              <span className="text-2xl">💵</span>
              <span className="font-semibold">Paiement à la livraison en espèces</span>
            </div>
          </div>

          {/* Erreur */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 text-sm p-4 rounded-xl">
              ⚠️ {error}
            </div>
          )}

          {/* Boutons */}
          <div className="flex gap-3">
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="btn-primary text-lg py-3 flex-1"
            >
              {loading ? "Traitement..." : `Confirmer la commande — ${total.toFixed(2)} FCFA`}
            </button>
            <button
              onClick={() => setMode(null)}
              className="btn-outline text-lg py-3 px-6"
            >
              Changer mode
            </button>
          </div>
        </div>

        {/* Résumé droite */}
        <div className="w-full lg:w-96">
          <div className="card p-6 sticky top-24">
            <h2 className="text-lg font-bold text-neutral-800 border-b border-neutral-200 pb-3 mb-4">📦 Votre commande</h2>
            <div className="flex flex-col gap-3 max-h-64 overflow-y-auto pr-1">
              {cart.map((item) => (
                <div key={item._id} className="flex items-center gap-3">
                  <img src={item.image || "https://via.placeholder.com/48"} alt={item.name} className="w-12 h-12 rounded-lg object-cover bg-neutral-100" />
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-neutral-700 truncate">{item.name}</p>
                    <p className="text-xs text-neutral-400">x{item.quantity}</p>
                  </div>
                  <span className="text-sm font-bold text-neutral-700">{(item.price * item.quantity).toFixed(2)} FCFA</span>
                </div>
              ))}
            </div>
            <hr className="my-4 border-neutral-200" />
            <div className="flex justify-between text-sm text-neutral-600">
              <span>Sous-total</span><span>{cartTotal.toFixed(2)} FCFA</span>
            </div>
            <div className="flex justify-between text-sm text-neutral-600 mt-1">
              <span>Livraison</span>
              <span className={shippingCost === 0 ? "text-green-600 font-semibold" : ""}>
                {shippingCost === 0 ? "Gratuite ✓" : `${shippingCost.toFixed(2)} FCFA`}
              </span>
            </div>
            <hr className="my-3 border-neutral-200" />
            <div className="flex justify-between text-lg font-bold text-neutral-800">
              <span>Total</span>
              <span className="text-primary-600">{total.toFixed(2)} FCFA</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
