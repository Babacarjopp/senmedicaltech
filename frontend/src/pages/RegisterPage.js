import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const RegisterPage = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Les mots de passe ne correspondent pas.");
      return;
    }
    if (password.length < 6) {
      setError("Le mot de passe doit contenir au moins 6 caractères.");
      return;
    }

    setLoading(true);
    try {
      await register(name, email, password);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Erreur lors de l'inscription.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-md">
        <div className="card p-8">
          {/* Logo */}
          <div className="flex justify-center mb-6">
            <div className="w-14 h-14 bg-primary-500 rounded-2xl flex items-center justify-center">
              <span className="text-white font-bold text-2xl">O</span>
            </div>
          </div>

          <h1 className="text-2xl font-extrabold text-neutral-800 text-center mb-1">Créer un compte</h1>
          <p className="text-neutral-500 text-center text-sm mb-6">Rejoignez SenMedicaltech dès aujourd'hui</p>

          {/* Erreur */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 text-sm p-3 rounded-xl mb-4">
              ⚠️ {error}
            </div>
          )}

          {/* Formulaire */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label className="text-sm text-neutral-600 mb-1 block">Nom complet</label>
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Jean Dupont" required className="input-style" />
            </div>
            <div>
              <label className="text-sm text-neutral-600 mb-1 block">Email</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="votre@email.com" required className="input-style" />
            </div>
            <div>
              <label className="text-sm text-neutral-600 mb-1 block">Mot de passe</label>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Min. 6 caractères" required className="input-style" />
            </div>
            <div>
              <label className="text-sm text-neutral-600 mb-1 block">Confirmer le mot de passe</label>
              <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Répétez votre mot de passe" required className="input-style" />
            </div>

            <button type="submit" disabled={loading} className="btn-primary py-3 text-base mt-2">
              {loading ? "Création..." : "Créer un compte"}
            </button>
          </form>

          {/* Lien connexion */}
          <p className="text-center text-sm text-neutral-500 mt-6">
            Déjà un compte ?{" "}
            <Link to="/login" className="text-primary-500 font-semibold hover:underline">Se connecter</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
