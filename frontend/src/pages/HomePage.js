import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../utils/api";
import ProductCard from "../components/ProductCard";
import Loader from "../components/Loader";

const HomePage = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/products?sort=newest")
      .then((res) => setFeaturedProducts(res.data.slice(0, 6)))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const categories = [
    { name: "Vis Corticale", icon: "🔩", color: "bg-blue-50 text-blue-600" },
    { name: "Plaques", icon: "📋", color: "bg-purple-50 text-purple-600" },
    { name: "Implants", icon: "🦴", color: "bg-green-50 text-green-600" },
    { name: "Orthèses", icon: "🦵", color: "bg-orange-50 text-orange-600" },
    { name: "Instruments", icon: "🔧", color: "bg-red-50 text-red-600" },
  ];

  const advantages = [
    { icon: "🏥", title: "Qualité Médicale", desc: "Tous nos produits sont certifiés et respectent les normes internationales." },
    { icon: "🚚", title: "Livraison Rapide", desc: "Expédition dans les 48h sur tous le senegal et les pays voisins." },
    { icon: "🛡️", title: "Garantie", desc: "Chaque produit est garanti avec un suivi qualité rigoureux." },
    { icon: "📞", title: "Support 24/7", desc: "Notre équipe est disponible pour vous accompagner à tout moment." },
  ];

  return (
    <div>
      {/* ── HERO ── */}
      <section className="relative bg-gradient-to-br from-primary-700 via-primary-600 to-primary-800 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-72 h-72 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-20 w-96 h-96 bg-accent-500 rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-6xl mx-auto px-4 py-24 flex flex-col md:flex-row items-center gap-10">
          <div className="flex-1 text-center md:text-left">
            <span className="inline-block bg-accent-500 text-white text-xs font-bold px-3 py-1 rounded-full mb-4">
              🏆 Fournisseur de confiance
            </span>
            <h1 className="text-4xl md:text-5xl font-extrabold leading-tight mb-4">
              Matériel Orthopédique<br/>
              <span className="text-accent-400">de Haute Qualité</span>
            </h1>
            <p className="text-primary-200 text-lg mb-8 max-w-md mx-auto md:mx-0">
              Découvrez notre gamme complète de vis corticales, plaques, implants et orthèses.
              Fiabilité et innovation au service de la médecine.
            </p>
            <div className="flex flex-wrap gap-3 justify-center md:justify-start">
              <Link to="/products" className="btn-accent text-base">Voir tous les produits</Link>
              <Link to="/products" className="btn-outline border-white text-white hover:bg-white/10 text-base">Explorer les catégories</Link>
            </div>
          </div>
          {/* Stats du côté droit */}
          <div className="flex-1 flex justify-center">
            <div className="grid grid-cols-2 gap-4">
              {[
                { value: "200+", label: "Produits" },
                { value: "50+", label: "Partenaires" },
                { value: "99%", label: "Satisfaction" },
                { value: "24/7", label: "Support" },
              ].map((stat) => (
                <div key={stat.label} className="bg-white/10 backdrop-blur rounded-2xl p-5 text-center w-36">
                  <div className="text-3xl font-extrabold text-white">{stat.value}</div>
                  <div className="text-primary-200 text-sm">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── CATÉGORIES ── */}
      <section className="max-w-6xl mx-auto px-4 py-14">
        <h2 className="text-2xl font-bold text-neutral-800 text-center mb-2">Nos Catégories</h2>
        <p className="text-neutral-500 text-center mb-8">Explorez notre gamme par type de produit</p>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {categories.map((cat) => (
            <Link
              key={cat.name}
              to={`/products?category=${encodeURIComponent(cat.name)}`}
              className="card p-5 text-center hover:scale-105 transition-transform duration-200 cursor-pointer"
            >
              <div className={`w-14 h-14 mx-auto rounded-2xl flex items-center justify-center text-2xl mb-3 ${cat.color}`}>
                {cat.icon}
              </div>
              <span className="text-sm font-semibold text-neutral-700">{cat.name}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* ── PRODUITS PHARES ── */}
      <section className="max-w-6xl mx-auto px-4 pb-14">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-neutral-800">Produits Phares</h2>
            <p className="text-neutral-500">Les derniers ajouts à notre catalogue</p>
          </div>
          <Link to="/products" className="text-primary-500 font-semibold text-sm hover:underline">Voir tout →</Link>
        </div>
        {loading ? (
          <Loader />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {featuredProducts.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </section>

      {/* ── AVANTAGES ── */}
      <section className="bg-primary-50 py-14">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-neutral-800 text-center mb-8">Pourquoi choisir SenMedicaltech ?</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {advantages.map((adv) => (
              <div key={adv.title} className="card p-6 text-center">
                <div className="text-4xl mb-3">{adv.icon}</div>
                <h3 className="font-bold text-neutral-800 mb-1">{adv.title}</h3>
                <p className="text-neutral-500 text-sm">{adv.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
