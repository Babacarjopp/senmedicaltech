import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import api from "../utils/api";
import ProductCard from "../components/ProductCard";
import Loader from "../components/Loader";

const CATEGORIES = ["Tous", "Vis Corticale", "Plaques", "Implants", "Orthèses", "Instruments", "Autre"];
const SORTS = [
  { label: "Plus récents", value: "newest" },
  { label: "Prix : Bas → Haut", value: "price-asc" },
  { label: "Prix : Haut → Bas", value: "price-desc" },
];

const ProductsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState(searchParams.get("category") || "Tous");
  const [sort, setSort] = useState("newest");

  // Récupérer les produits à chaque changement de filtre
  useEffect(() => {
    setLoading(true);
    const params = {};
    if (category !== "Tous") params.category = category;
    if (search.trim()) params.search = search.trim();
    if (sort) params.sort = sort;

    api.get("/products", { params })
      .then((res) => setProducts(res.data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [category, search, sort]);

  // Sync URL params
  useEffect(() => {
    if (category !== "Tous") {
      setSearchParams({ category });
    } else {
      setSearchParams({});
    }
  }, [category, setSearchParams]);

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      {/* Titre */}
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-neutral-800">Nos Produits</h1>
        <p className="text-neutral-500 mt-1">Catalogue complet de matériel orthopédique</p>
      </div>

      {/* ── Filtres & Recherche ── */}
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        {/* Recherche */}
        <div className="flex-1">
          <input
            type="text"
            placeholder="Rechercher un produit..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input-style"
          />
        </div>
        {/* Tri */}
        <select value={sort} onChange={(e) => setSort(e.target.value)} className="input-style w-full md:w-56">
          {SORTS.map((s) => (
            <option key={s.value} value={s.value}>{s.label}</option>
          ))}
        </select>
      </div>

      {/* Catégories — pills */}
      <div className="flex flex-wrap gap-2 mb-8">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setCategory(cat)}
            className={`py-1.5 px-4 rounded-full text-sm font-semibold transition-all duration-200 border-none cursor-pointer
              ${category === cat
                ? "bg-primary-500 text-white shadow-sm"
                : "bg-white text-neutral-600 hover:bg-neutral-100 border border-neutral-200"
              }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Résultats */}
      {loading ? (
        <Loader />
      ) : products.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-5xl mb-4">🔍</p>
          <p className="text-neutral-500 text-lg">Aucun produit trouvé.</p>
          <p className="text-neutral-400 text-sm mt-1">Essayez de modifier vos filtres.</p>
        </div>
      ) : (
        <div>
          <p className="text-neutral-500 text-sm mb-4">{products.length} produit(s) trouvé(s)</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductsPage;
