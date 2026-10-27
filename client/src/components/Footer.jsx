import React from 'react';
import { ShieldCheck, Truck, RefreshCw, Headphones, ShoppingBag, Heart } from 'lucide-react';

export default function Footer({ onCategorySelect }) {
  return (
    <footer className="store-footer">
      {/* Benefits Ribbon */}
      <div className="footer-benefits-grid">
        <div className="benefit-card">
          <div className="benefit-icon-wrapper">
            <Truck size={22} />
          </div>
          <div className="benefit-text">
            <h4>Free Shipping</h4>
            <p>On all domestic orders over $100</p>
          </div>
        </div>

        <div className="benefit-card">
          <div className="benefit-icon-wrapper">
            <ShieldCheck size={22} />
          </div>
          <div className="benefit-text">
            <h4>Secure Checkout</h4>
            <p>100% encrypted & protected</p>
          </div>
        </div>

        <div className="benefit-card">
          <div className="benefit-icon-wrapper">
            <RefreshCw size={22} />
          </div>
          <div className="benefit-text">
            <h4>30-Day Returns</h4>
            <p>Hassle-free replacement policy</p>
          </div>
        </div>

        <div className="benefit-card">
          <div className="benefit-icon-wrapper">
            <Headphones size={22} />
          </div>
          <div className="benefit-text">
            <h4>Friendly Support</h4>
            <p>Dedicated customer care team</p>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="footer-main">
        <div className="footer-brand-col">
          <div className="footer-brand-title">
            <ShoppingBag size={22} />
            <span>ShopNova</span>
          </div>
          <p className="footer-tagline">
            A mini e-commerce web application crafted with React 18, Vite, Express.js, and JSON file storage.
          </p>
          <div className="footer-stack-tags">
            <span className="stack-pill">React 18</span>
            <span className="stack-pill">Vite</span>
            <span className="stack-pill">Node Express</span>
            <span className="stack-pill">JSON DB</span>
            <span className="stack-pill">Fetch API</span>
          </div>
        </div>

        <div className="footer-links-col">
          <h4>Explore Categories</h4>
          <ul>
            {['Audio', 'Wearables', 'Electronics', 'Accessories', 'Lifestyle'].map((cat) => (
              <li key={cat}>
                <button
                  className="footer-nav-link"
                  onClick={() => {
                    onCategorySelect(cat);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                >
                  {cat}
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div className="footer-links-col">
          <h4>Store Features</h4>
          <ul>
            <li><span>✓ Real-time Cart Calculations</span></li>
            <li><span>✓ RESTful Express API</span></li>
            <li><span>✓ JSON File Storage</span></li>
            <li><span>✓ Authentication & Orders</span></li>
            <li><span>✓ Zero Database Configuration</span></li>
          </ul>
        </div>
      </div>

      {/* Bottom Legal / Copyright */}
      <div className="footer-bottom">
        <p>© {new Date().getFullYear()} ShopNova Mini Store. Built with React & Express.</p>
        <p className="footer-love">
          Designed with <Heart size={14} className="heart-icon fill-rose-500 text-rose-500" /> for clean modern web development
        </p>
      </div>
    </footer>
  );
}

