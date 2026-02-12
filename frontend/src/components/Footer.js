import React from "react";
import { Link } from "react-router-dom";

const Footer = () => (
  <footer className="bg-primary-900 text-white mt-16">
    <div className="max-w-6xl mx-auto px-4 py-12 grid grid-cols-1 md:grid-cols-3 gap-8">

      {/* Colonne 1 — Marque */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <div className="w-9 h-9 bg-accent-500 rounded-xl flex items-center justify-center">
            <span className="text-white font-bold text-lg">SM</span>
          </div>
          <span className="text-xl font-bold">SenMedicaltech</span>
        </div>
        <p className="text-primary-200 text-sm leading-relaxed">
          Fournisseur de confiance en matériel orthopédique et chirurgical.
          Qualité, fiabilité et innovation depuis 2026.
        </p>
      </div>

      {/* Colonne 2 — Liens rapides */}
      <div>
        <h4 className="font-bold text-lg mb-3 text-white">Liens rapides</h4>
        <ul className="flex flex-col gap-2 text-primary-200 text-sm">
          <li><Link to="/" className="hover:text-white transition-colors">Accueil</Link></li>
          <li><Link to="/products" className="hover:text-white transition-colors">Produits</Link></li>
          <li><Link to="/cart" className="hover:text-white transition-colors">Panier</Link></li>
          <li><Link to="/login" className="hover:text-white transition-colors">Connexion</Link></li>
        </ul>
      </div>

      {/* Colonne 3 — Contact */}
      <div>
        <h4 className="font-bold text-lg mb-3 text-white">Contact</h4>
        <ul className="flex flex-col gap-2 text-primary-200 text-sm">
          <li>📧 infosenmedicaltech@gmail.com</li>
          <li>📞 +221 778101320</li>
          <li>📍 Dakar, Sénégal</li>
          <li className="pt-2 text-primary-400 text-xs">Lun – Ven : 08h – 18h</li>
        </ul>
      </div>
    </div>

    {/* Barre inférieure */}
    <div className="border-t border-primary-700 mt-8">
      <div className="max-w-6xl mx-auto px-4 py-4 flex flex-col md:flex-row items-center justify-between text-primary-300 text-xs">
        <span>© 2026 SenMedicaltech. Tous droits réservés.</span>
        <span>Fait avec ❤️ pour la médecine orthopédique</span>
      </div>
    </div>
  </footer>
);

export default Footer;
