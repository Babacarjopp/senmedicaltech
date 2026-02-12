import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";

const Navbar = () => {
  const { user, logout } = useAuth();
  const { cartCount } = useCart();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50 border-b border-neutral-100">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">

        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <div className="w-9 h-9 bg-primary-500 rounded-xl flex items-center justify-center">
            <span className="text-white font-bold text-lg">SM</span>
          </div>
          <span className="text-xl font-bold text-primary-700">SenMedicaltech</span>
        </Link>

        {/* Links — Desktop */}
        <div className="hidden md:flex items-center gap-6">
          <Link to="/" className="text-neutral-600 hover:text-primary-500 font-medium transition-colors">Accueil</Link>
          <Link to="/products" className="text-neutral-600 hover:text-primary-500 font-medium transition-colors">Produits</Link>
          {user?.role === "admin" && (
            <Link to="/dashboard" className="text-accent-600 hover:text-accent-500 font-semibold transition-colors">Dashboard</Link>
          )}
        </div>

        {/* Right — Desktop */}
        <div className="hidden md:flex items-center gap-4">
          {/* Panier */}
          <Link to="/cart" className="relative p-2 text-neutral-600 hover:text-primary-500 transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4zM3 6h18M16 10a4 4 0 01-8 0" />
            </svg>
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-accent-500 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </Link>

          {/* Auth */}
          {user ? (
            <div className="flex items-center gap-3">
              <span className="text-sm text-neutral-500">Bonjour, <strong>{user.name}</strong></span>
              <button onClick={handleLogout} className="text-sm text-neutral-500 hover:text-red-500 transition-colors font-medium">
                Déconnecter
              </button>
            </div>
          ) : (
            <div className="flex gap-3">
              <Link to="/login" className="btn-outline text-sm py-1.5 px-4">Connexion</Link>
              <Link to="/register" className="btn-primary text-sm py-1.5 px-4">Inscription</Link>
            </div>
          )}
        </div>

        {/* Hamburger — Mobile */}
        <button className="md:hidden p-2 text-neutral-600" onClick={() => setMenuOpen(!menuOpen)}>
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={menuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
          </svg>
        </button>
      </div>

      {/* Menu Mobile */}
      {menuOpen && (
        <div className="md:hidden bg-white border-t border-neutral-100 px-4 py-4 flex flex-col gap-3">
          <Link to="/" onClick={() => setMenuOpen(false)} className="text-neutral-700 font-medium">Accueil</Link>
          <Link to="/products" onClick={() => setMenuOpen(false)} className="text-neutral-700 font-medium">Produits</Link>
          <Link to="/cart" onClick={() => setMenuOpen(false)} className="text-neutral-700 font-medium">Panier ({cartCount})</Link>
          {user?.role === "admin" && (
            <Link to="/dashboard" onClick={() => setMenuOpen(false)} className="text-accent-600 font-semibold">Dashboard</Link>
          )}
          {user ? (
            <button onClick={() => { handleLogout(); setMenuOpen(false); }} className="text-red-500 font-medium text-left">Déconnecter</button>
          ) : (
            <div className="flex gap-3 pt-2">
              <Link to="/login" onClick={() => setMenuOpen(false)} className="btn-outline text-sm py-1.5 px-4">Connexion</Link>
              <Link to="/register" onClick={() => setMenuOpen(false)} className="btn-primary text-sm py-1.5 px-4">Inscription</Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
