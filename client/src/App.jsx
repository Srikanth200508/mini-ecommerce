import React, { useState } from 'react';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import Navbar from './components/Navbar';
import ProductList from './components/ProductList';
import CartModal from './components/CartModal';
import CheckoutModal from './components/CheckoutModal';
import AuthModal from './components/AuthModal';
import OrderHistoryModal from './components/OrderHistoryModal';
import Toast from './components/Toast';
import Footer from './components/Footer';
import './App.css';

function MainShop() {
  const [activeCategory, setActiveCategory] = useState('All');
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isOrdersOpen, setIsOrdersOpen] = useState(false);
  const [toast, setToast] = useState(null);

  const showToast = (toastData) => {
    setToast(toastData);
  };

  const handleProceedToCheckout = () => {
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  const handleOrderPlaced = (order) => {
    showToast({
      type: 'success',
      title: 'Order Confirmed!',
      message: `Your order #${order.id} has been recorded.`,
    });
  };

  const handleAuthSuccess = (msg) => {
    showToast({
      type: 'success',
      title: 'Success',
      message: msg,
    });
  };

  return (
    <div className="app-container">
      {/* Toast Notification Container */}
      <Toast toast={toast} onClose={() => setToast(null)} />

      {/* Navigation Bar */}
      <Navbar
        activeCategory={activeCategory}
        onCategorySelect={(cat) => setActiveCategory(cat)}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenAuth={() => setIsAuthOpen(true)}
        onOpenOrders={() => setIsOrdersOpen(true)}
      />

      {/* Main Content: Catalog */}
      <main className="main-content">
        <ProductList
          activeCategory={activeCategory}
          onCategoryChange={(cat) => setActiveCategory(cat)}
          onShowToast={showToast}
        />
      </main>

      {/* Footer */}
      <Footer onCategorySelect={(cat) => setActiveCategory(cat)} />

      {/* Cart Drawer */}
      <CartModal
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        onProceedToCheckout={handleProceedToCheckout}
      />

      {/* Checkout Modal */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        onOrderPlaced={handleOrderPlaced}
        onOpenOrders={() => {
          setIsCheckoutOpen(false);
          setIsOrdersOpen(true);
        }}
      />

      {/* Auth Modal (Login / Sign Up) */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onAuthSuccess={handleAuthSuccess}
      />

      {/* Orders History Modal */}
      <OrderHistoryModal
        isOpen={isOrdersOpen}
        onClose={() => setIsOrdersOpen(false)}
      />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <MainShop />
      </CartProvider>
    </AuthProvider>
  );
}

