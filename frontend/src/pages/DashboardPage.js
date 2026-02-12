import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../utils/api";
import Loader from "../components/Loader";

const CATEGORIES = ["Vis Corticale", "Plaques", "Implants", "Orthèses", "Instruments", "Autre"];
const STATUS_OPTIONS = ["En attente", "Confirmée", "En cours", "Expédiée", "Livrée", "Annulée"];

const statusColor = (status) => {
  const map = {
    "En attente": "badge-yellow",
    "Confirmée": "badge-blue",
    "En cours": "badge-blue",
    "Expédiée": "badge-green",
    "Livrée": "badge-green",
    "Annulée": "badge-red",
  };
  return map[status] || "badge-blue";
};

const DashboardPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState("stats");          // stats | products | orders
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // Formulaire nouveau produit
  const emptyProduct = { name: "", description: "", price: "", category: "Vis Corticale", image: "", stock: 0 };
  const [newProduct, setNewProduct] = useState(emptyProduct);
  const [editId, setEditId] = useState(null);
  const [formError, setFormError] = useState("");

  useEffect(() => {
    if (user?.role !== "admin") { navigate("/"); return; }
    fetchAll();
  }, [user, navigate]);

  const fetchAll = async () => {
    setLoading(true);
    try {
      const [prodRes, ordRes] = await Promise.all([
        api.get("/products"),
        api.get("/orders"),
      ]);
      setProducts(prodRes.data);
      setOrders(ordRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // ── CRUD Produits ──
  const handleSaveProduct = async () => {
    setFormError("");
    if (!newProduct.name || !newProduct.description || !newProduct.price || !newProduct.category) {
      setFormError("Remplissez tous les champs obligatoires.");
      return;
    }
    try {
      if (editId) {
        await api.put(`/products/${editId}`, newProduct);
      } else {
        await api.post("/products", newProduct);
      }
      setNewProduct(emptyProduct);
      setEditId(null);
      await fetchAll();
    } catch (err) {
      setFormError(err.response?.data?.message || "Erreur.");
    }
  };

  const handleEditProduct = (product) => {
    setNewProduct({
      name: product.name,
      description: product.description,
      price: product.price,
      category: product.category,
      image: product.image,
      stock: product.stock,
    });
    setEditId(product._id);
    setTab("products");
  };

  const handleDeleteProduct = async (id) => {
    if (!window.confirm("Supprimer ce produit ?")) return;
    await api.delete(`/products/${id}`);
    await fetchAll();
  };

  // ── Update statut commande ──
  const handleUpdateStatus = async (orderId, status) => {
    await api.put(`/orders/${orderId}/status`, { status });
    await fetchAll();
  };

  if (loading) return <Loader />;

  const totalRevenue = orders
    .filter((o) => o.status !== "Annulée")
    .reduce((sum, o) => sum + o.totalPrice, 0);

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      {/* Titre */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-neutral-800">Dashboard Admin</h1>
          <p className="text-neutral-500">Bienvenue, <strong>{user?.name}</strong></p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-8 border-b border-neutral-200 pb-2">
        {[
          { key: "stats", label: "📊 Statistiques" },
          { key: "products", label: "📦 Produits" },
          { key: "orders", label: "📋 Commandes" },
        ].map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`py-2 px-5 rounded-t-xl text-sm font-semibold transition-all border-none cursor-pointer
              ${tab === t.key ? "bg-primary-500 text-white" : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"}`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* ═══════ TAB : STATS ═══════ */}
      {tab === "stats" && (
        <div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
            {[
              { title: "Produits", value: products.length, icon: "📦", color: "bg-blue-50 text-blue-600" },
              { title: "Commandes", value: orders.length, icon: "📋", color: "bg-purple-50 text-purple-600" },
              { title: "Revenus (FCFA)", value: totalRevenue.toFixed(2), icon: "💰", color: "bg-green-50 text-green-600" },
              { title: "En stock", value: products.filter((p) => p.inStock).length, icon: "✅", color: "bg-orange-50 text-orange-600" },
            ].map((stat) => (
              <div key={stat.title} className="card p-6">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm text-neutral-500">{stat.title}</span>
                  <span className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl ${stat.color}`}>{stat.icon}</span>
                </div>
                <p className="text-3xl font-extrabold text-neutral-800">{stat.value}</p>
              </div>
            ))}
          </div>

          {/* Dernières commandes */}
          <h2 className="text-lg font-bold text-neutral-800 mb-4">Dernières commandes</h2>
          <div className="card overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-neutral-50">
                <tr>
                  <th className="text-left p-4 text-neutral-600 font-semibold">Client</th>
                  <th className="text-left p-4 text-neutral-600 font-semibold">Total</th>
                  <th className="text-left p-4 text-neutral-600 font-semibold">Statut</th>
                  <th className="text-left p-4 text-neutral-600 font-semibold">Date</th>
                </tr>
              </thead>
              <tbody>
                {orders.slice(0, 5).map((order) => (
                  <tr key={order._id} className="border-t border-neutral-100">
                    <td className="p-4 text-neutral-700">{order.user?.name || "—"}</td>
                    <td className="p-4 font-semibold text-primary-600">{order.totalPrice.toFixed(2)} FCFA</td>
                    <td className="p-4"><span className={`badge ${statusColor(order.status)}`}>{order.status}</span></td>
                    <td className="p-4 text-neutral-500">{new Date(order.createdAt).toLocaleDateString("fr-FR")}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ═══════ TAB : PRODUCTS ═══════ */}
      {tab === "products" && (
        <div>
          {/* Formulaire ajout/edit */}
          <div className="card p-6 mb-6">
            <h2 className="text-lg font-bold text-neutral-800 mb-4">
              {editId ? "✏️ Modifier le produit" : "➕ Ajouter un produit"}
            </h2>
            {formError && <div className="bg-red-50 border border-red-200 text-red-600 text-sm p-3 rounded-xl mb-4">⚠️ {formError}</div>}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-neutral-600 mb-1 block">Nom</label>
                <input value={newProduct.name} onChange={(e) => setNewProduct((p) => ({ ...p, name: e.target.value }))} placeholder="Nom du produit" className="input-style" />
              </div>
              <div>
                <label className="text-sm text-neutral-600 mb-1 block">Catégorie</label>
                <select value={newProduct.category} onChange={(e) => setNewProduct((p) => ({ ...p, category: e.target.value }))} className="input-style">
                  {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="text-sm text-neutral-600 mb-1 block">Prix (FCFA)</label>
                <input type="number" value={newProduct.price} onChange={(e) => setNewProduct((p) => ({ ...p, price: e.target.value }))} placeholder="0.00" className="input-style" />
              </div>
              <div>
                <label className="text-sm text-neutral-600 mb-1 block">Stock</label>
                <input type="number" value={newProduct.stock} onChange={(e) => setNewProduct((p) => ({ ...p, stock: e.target.value }))} placeholder="0" className="input-style" />
              </div>
              <div className="sm:col-span-2">
                <label className="text-sm text-neutral-600 mb-1 block">Description</label>
                <textarea rows={2} value={newProduct.description} onChange={(e) => setNewProduct((p) => ({ ...p, description: e.target.value }))} placeholder="Description du produit..." className="input-style resize-none" />
              </div>
              <div className="sm:col-span-2">
                <label className="text-sm text-neutral-600 mb-1 block">URL Image (optionnel)</label>
                <input value={newProduct.image} onChange={(e) => setNewProduct((p) => ({ ...p, image: e.target.value }))} placeholder="https://..." className="input-style" />
              </div>
            </div>
            <div className="flex gap-3 mt-5">
              <button onClick={handleSaveProduct} className="btn-primary">{editId ? "Mettre à jour" : "Créer le produit"}</button>
              {editId && (
                <button onClick={() => { setNewProduct(emptyProduct); setEditId(null); }} className="btn-outline">Annuler</button>
              )}
            </div>
          </div>

          {/* Liste produits */}
          <div className="card overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-neutral-50">
                <tr>
                  <th className="text-left p-4 text-neutral-600 font-semibold">Produit</th>
                  <th className="text-left p-4 text-neutral-600 font-semibold">Catégorie</th>
                  <th className="text-left p-4 text-neutral-600 font-semibold">Prix</th>
                  <th className="text-left p-4 text-neutral-600 font-semibold">Stock</th>
                  <th className="text-left p-4 text-neutral-600 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((p) => (
                  <tr key={p._id} className="border-t border-neutral-100 hover:bg-neutral-50 transition-colors">
                    <td className="p-4 font-medium text-neutral-800">{p.name}</td>
                    <td className="p-4"><span className="badge badge-blue">{p.category}</span></td>
                    <td className="p-4 text-primary-600 font-semibold">{p.price.toFixed(2)} FCFA</td>
                    <td className="p-4">
                      <span className={`badge ${p.inStock ? "badge-green" : "badge-red"}`}>{p.stock}</span>
                    </td>
                    <td className="p-4 flex gap-2">
                      <button onClick={() => handleEditProduct(p)} className="text-xs bg-primary-100 text-primary-600 px-3 py-1 rounded-lg hover:bg-primary-200 transition-colors font-semibold">✏️ Edit</button>
                      <button onClick={() => handleDeleteProduct(p._id)} className="text-xs bg-red-100 text-red-600 px-3 py-1 rounded-lg hover:bg-red-200 transition-colors font-semibold">🗑️ Del</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ═══════ TAB : ORDERS ═══════ */}
      {tab === "orders" && (
        <div className="card overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-neutral-50">
              <tr>
                <th className="text-left p-4 text-neutral-600 font-semibold">Client</th>
                <th className="text-left p-4 text-neutral-600 font-semibold">Articles</th>
                <th className="text-left p-4 text-neutral-600 font-semibold">Total</th>
                <th className="text-left p-4 text-neutral-600 font-semibold">Statut</th>
                <th className="text-left p-4 text-neutral-600 font-semibold">Date</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order._id} className="border-t border-neutral-100 hover:bg-neutral-50 transition-colors">
                  <td className="p-4 text-neutral-700">{order.user?.name || "—"}</td>
                  <td className="p-4 text-neutral-500">{order.items?.length || 0} article(s)</td>
                  <td className="p-4 font-semibold text-primary-600">{order.totalPrice.toFixed(2)} FCFA</td>
                  <td className="p-4">
                    <select
                      value={order.status}
                      onChange={(e) => handleUpdateStatus(order._id, e.target.value)}
                      className={`text-xs font-semibold px-2 py-1 rounded-full border-none cursor-pointer outline-none
                        ${order.status === "Livrée" || order.status === "Expédiée" ? "bg-green-100 text-green-700" :
                          order.status === "Annulée" ? "bg-red-100 text-red-700" :
                          order.status === "En attente" ? "bg-yellow-100 text-yellow-700" :
                          "bg-blue-100 text-blue-700"}`}
                    >
                      {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </td>
                  <td className="p-4 text-neutral-500">{new Date(order.createdAt).toLocaleDateString("fr-FR")}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default DashboardPage;
