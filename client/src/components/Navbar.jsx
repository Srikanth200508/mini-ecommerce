import React from 'react';
import { ShoppingBag, ShoppingCart, User, Package, LogOut, Sparkles } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

export default function Navbar({ onOpenCart, onOpenAuth, onOpenOrders, onCategorySelect, activeCategory }) {
  const { totalItems } = useCart();
  const { user, isAuthenticated, logout } = useAuth();

  const categories = ['All', 'Audio', 'Wearables', 'Electronics', 'Accessories', 'Lifestyle'];

  return (
    <header className="navbar-header">
      {/* Top Announcement Bar */}
      <div className="announcement-bar">
        <div className="announcement-content">
          <Sparkles size={14} className="sparkle-icon" />
          <span>⚡ <strong>Spring Special:</strong> Free Express Shipping on orders over $100!</span>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="navbar-container">
        {/* Brand Logo */}
        <div className="navbar-brand" onClick={() => onCategorySelect('All')} role="button" tabIndex={0}>
          <div className="brand-logo-icon">
            <ShoppingBag size={22} />
          </div>
          <div className="brand-text">
            <span className="brand-name">ShopNova</span>
            <span className="brand-tagline">mini store</span>
          </div>
        </div>

        {/* Quick Category Navigation */}
        <nav className="nav-categories" aria-label="Product categories">
          {categories.map((cat) => (
            <button
              key={cat}
              className={`category-pill ${activeCategory === cat ? 'active' : ''}`}
              onClick={() => onCategorySelect(cat)}
            >
              {cat}
            </button>
          ))}
        </nav>

        {/* Right Navigation Actions */}
        <div className="nav-actions">
          {/* Order History Button */}
          <button
            className="action-btn"
            onClick={onOpenOrders}
            title="View Order History"
            aria-label="Order History"
          >
            <Package size={19} />
            <span className="action-text">Orders</span>
          </button>

          {/* User Auth Button */}
          {isAuthenticated ? (
            <div className="user-profile-menu">
              <div className="user-badge" title={`Signed in as ${user.email}`}>
                <div className="user-avatar">{user.name ? user.name[0].toUpperCase() : 'U'}</div>
                <span className="user-name">{user.name.split(' ')[0]}</span>
              </div>
              <button
                className="action-btn logout-btn"
                onClick={logout}
                title="Sign Out"
                aria-label="Sign Out"
              >
                <LogOut size={17} />
              </button>
            </div>
          ) : (
            <button
              className="action-btn signin-btn"
              onClick={onOpenAuth}
              aria-label="Sign In"
            >
              <User size={19} />
              <span className="action-text">Sign In</span>
            </button>
          )}

          {/* Shopping Cart Button */}
          <button
            className="cart-toggle-btn"
            onClick={onOpenCart}
            aria-label={`Shopping Cart with ${totalItems} items`}
          >
            <div className="cart-icon-wrapper">
              <ShoppingCart size={20} />
              {totalItems > 0 && (
                <span className="cart-badge-count animate-pop">
                  {totalItems > 99 ? '99+' : totalItems}
                </span>
              )}
            </div>
            <span className="cart-label">Cart</span>
          </button>
        </div>
      </div>
    </header>
  );
}

