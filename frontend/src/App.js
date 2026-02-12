import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

import HomePage        from "./pages/HomePage";
import ProductsPage    from "./pages/ProductsPage";
import ProductDetailPage from "./pages/ProductDetailPage";
import CartPage        from "./pages/CartPage";
import CheckoutPage    from "./pages/CheckoutPage";
import LoginPage       from "./pages/LoginPage";
import RegisterPage    from "./pages/RegisterPage";
import DashboardPage   from "./pages/DashboardPage";

function App() {
  return (
    <Router>
      <AuthProvider>
        <CartProvider>
          {/* Layout global */}
          <div className="flex flex-col min-h-screen">
            <Navbar />

            <main className="flex-1">
              <Routes>
                <Route path="/"                 element={<HomePage />} />
                <Route path="/products"         element={<ProductsPage />} />
                <Route path="/products/:id"     element={<ProductDetailPage />} />
                <Route path="/cart"             element={<CartPage />} />
                <Route path="/checkout"         element={<CheckoutPage />} />
                <Route path="/login"            element={<LoginPage />} />
                <Route path="/register"         element={<RegisterPage />} />
                <Route path="/dashboard"        element={<DashboardPage />} />
              </Routes>
            </main>

            <Footer />
          </div>
        </CartProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
