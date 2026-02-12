import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(email, password);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Erreur de connexion.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-md">
        {/* Card */}
        <div className="card p-8">
          {/* Logo */}
          <div className="flex justify-center mb-6">
            <div className="w-14 h-14 bg-primary-500 rounded-2xl flex items-center justify-center">
              <span className="text-white font-bold text-2xl">O</span>
            </div>
          </div>

          <h1 className="text-2xl font-extrabold text-neutral-800 text-center mb-1">Bienvenue</h1>
          <p className="text-neutral-500 text-center text-sm mb-6">Connectez-vous à votre compte</p>

          {/* Erreur */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 text-sm p-3 rounded-xl mb-4">
              ⚠️ {error}
            </div>
          )}

          {/* Formulaire */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label className="text-sm text-neutral-600 mb-1 block">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="votre@email.com"
                required
                className="input-style"
              />
            </div>
            <div>
              <label className="text-sm text-neutral-600 mb-1 block">Mot de passe</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="input-style"
              />
            </div>

            <button type="submit" disabled={loading} className="btn-primary py-3 text-base mt-2">
              {loading ? "Connexion..." : "Se connecter"}
            </button>
          </form>

          {/* Lien inscription */}
          <p className="text-center text-sm text-neutral-500 mt-6">
            Pas de compte ?{" "}
            <Link to="/register" className="text-primary-500 font-semibold hover:underline">Créer un compte</Link>
          </p>

          {/* Compte test admin */}
          <div className="bg-neutral-50 rounded-xl p-3 mt-4">
            <p className="text-xs text-neutral-400 text-center">
              🧪 Test admin : <strong>admin@SenMedicaltech.com</strong> / <strong>admin123</strong>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
