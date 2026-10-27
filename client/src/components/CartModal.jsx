import React from 'react';
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight, Truck } from 'lucide-react';
import { useCart } from '../context/CartContext';

export default function CartModal({ isOpen, onClose, onProceedToCheckout }) {
  const {
    cart,
    increaseQty,
    decreaseQty,
    removeFromCart,
    clearCart,
    totalItems,
    subtotal,
    tax,
    shipping,
    total,
    amountToFreeShipping,
  } = useCart();

  if (!isOpen) return null;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <aside className="cart-drawer" onClick={(e) => e.stopPropagation()}>
        {/* Drawer Header */}
        <div className="drawer-header">
          <div className="drawer-title-group">
            <ShoppingBag size={20} className="drawer-icon" />
            <h2>Shopping Cart</h2>
            <span className="drawer-count-badge">
              {totalItems} {totalItems === 1 ? 'item' : 'items'}
            </span>
          </div>
          <button className="close-btn" onClick={onClose} aria-label="Close cart">
            <X size={20} />
          </button>
        </div>

        {/* Free Shipping Progress Indicator */}
        {cart.length > 0 && (
          <div className="shipping-progress-box">
            <div className="shipping-progress-text">
              <Truck size={16} />
              {amountToFreeShipping > 0 ? (
                <span>
                  Add <strong>${amountToFreeShipping.toFixed(2)}</strong> more for <strong>FREE Shipping</strong>!
                </span>
              ) : (
                <span className="text-free-shipping">
                  🎉 Congratulations! You unlocked <strong>FREE Shipping</strong>.
                </span>
              )}
            </div>
            <div className="progress-bar-track">
              <div
                className="progress-bar-fill"
                style={{
                  width: `${Math.min(100, (subtotal / 100) * 100)}%`,
                }}
              ></div>
            </div>
          </div>
        )}

        {/* Cart Items List */}
        <div className="drawer-body">
          {cart.length === 0 ? (
            <div className="empty-cart-view">
              <div className="empty-cart-icon-circle">
                <ShoppingBag size={42} />
              </div>
              <h3>Your cart is empty</h3>
              <p>Looks like you haven't added any products to your cart yet.</p>
              <button className="btn-primary" onClick={onClose}>
                Explore Products
              </button>
            </div>
          ) : (
            <ul className="cart-items-list">
              {cart.map((item) => (
                <li key={item.id} className="cart-item">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="cart-item-image"
                  />
                  <div className="cart-item-info">
                    <div className="cart-item-top">
                      <h4 className="cart-item-title">{item.name}</h4>
                      <button
                        className="item-remove-btn"
                        onClick={() => removeFromCart(item.id)}
                        title="Remove item"
                        aria-label={`Remove ${item.name} from cart`}
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>

                    <span className="cart-item-unit-price">
                      ${item.price.toFixed(2)} each
                    </span>

                    <div className="cart-item-bottom">
                      <div className="quantity-controller">
                        <button
                          className="qty-btn"
                          onClick={() => decreaseQty(item.id)}
                          aria-label="Decrease quantity"
                        >
                          <Minus size={14} />
                        </button>
                        <span className="qty-value">{item.quantity}</span>
                        <button
                          className="qty-btn"
                          onClick={() => increaseQty(item.id)}
                          aria-label="Increase quantity"
                        >
                          <Plus size={14} />
                        </button>
                      </div>

                      <div className="cart-item-subtotal">
                        ${(item.price * item.quantity).toFixed(2)}
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Cart Drawer Footer with Price Summary */}
        {cart.length > 0 && (
          <div className="drawer-footer">
            <div className="summary-row">
              <span className="summary-label">Subtotal</span>
              <span className="summary-value">${subtotal.toFixed(2)}</span>
            </div>
            <div className="summary-row">
              <span className="summary-label">Estimated Tax (8%)</span>
              <span className="summary-value">${tax.toFixed(2)}</span>
            </div>
            <div className="summary-row">
              <span className="summary-label">Shipping</span>
              <span className="summary-value">
                {shipping === 0 ? (
                  <span className="free-shipping-tag">FREE</span>
                ) : (
                  `$${shipping.toFixed(2)}`
                )}
              </span>
            </div>
            <div className="summary-divider"></div>
            <div className="summary-row total-row">
              <span className="total-label">Total Amount</span>
              <span className="total-value">${total.toFixed(2)}</span>
            </div>

            <div className="cart-footer-actions">
              <button
                className="btn-checkout"
                onClick={() => {
                  onClose();
                  onProceedToCheckout();
                }}
              >
                <span>Proceed to Checkout</span>
                <ArrowRight size={17} />
              </button>
              <button className="btn-clear-cart" onClick={clearCart}>
                Clear Cart
              </button>
            </div>
          </div>
        )}
      </aside>
    </div>
  );
}

