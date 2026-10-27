import React, { useState, useEffect } from 'react';
import { X, CheckCircle2, ShieldCheck, CreditCard, Truck, AlertCircle, Loader2 } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { api } from '../api';

export default function CheckoutModal({ isOpen, onClose, onOrderPlaced, onOpenOrders }) {
  const { cart, subtotal, tax, shipping, total, clearCart } = useCart();
  const { user } = useAuth();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    address: '',
    city: '',
    postalCode: '',
    paymentMethod: 'Card (Demo Mode)',
  });

  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [placedOrder, setPlacedOrder] = useState(null);

  // Prepopulate form if user is logged in
  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        name: user.name || prev.name,
        email: user.email || prev.email,
      }));
    }
  }, [user]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage(null);

    // Basic validation
    if (!formData.name.trim() || !formData.email.trim() || !formData.address.trim()) {
      setErrorMessage('Please fill in all required shipping fields.');
      return;
    }

    setSubmitting(true);
    try {
      const orderPayload = {
        userId: user ? user.id : null,
        items: cart.map((item) => ({
          id: item.id,
          quantity: item.quantity,
        })),
        customer: {
          name: formData.name.trim(),
          email: formData.email.trim(),
          address: formData.address.trim(),
          city: formData.city.trim(),
          postalCode: formData.postalCode.trim(),
        },
        paymentMethod: formData.paymentMethod,
      };

      const response = await api.createOrder(orderPayload);

      if (response.success && response.order) {
        setPlacedOrder(response.order);
        clearCart();
        if (onOrderPlaced) {
          onOrderPlaced(response.order);
        }
      } else {
        throw new Error(response.message || 'Failed to place order.');
      }
    } catch (err) {
      console.error('Order submission error:', err);
      setErrorMessage(err.message || 'An error occurred while processing your order.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleClose = () => {
    setPlacedOrder(null);
    setErrorMessage(null);
    onClose();
  };

  return (
    <div className="modal-backdrop" onClick={handleClose}>
      <div className="checkout-modal-content" onClick={(e) => e.stopPropagation()}>
        {/* Modal Header */}
        <div className="modal-header">
          <div className="modal-title-box">
            <h2>{placedOrder ? 'Order Confirmation' : 'Checkout & Delivery'}</h2>
            <p className="modal-subtitle">
              {placedOrder
                ? 'Thank you! Your order is being prepared.'
                : 'Enter your shipping and delivery information.'}
            </p>
          </div>
          <button className="close-btn" onClick={handleClose} aria-label="Close modal">
            <X size={20} />
          </button>
        </div>

        {/* Success View */}
        {placedOrder ? (
          <div className="order-success-card">
            <div className="success-badge-wrapper">
              <CheckCircle2 size={56} className="text-emerald-500 animate-bounce-short" />
            </div>
            <h3 className="success-title">Order Successfully Placed!</h3>
            <p className="order-id-label">
              Order Reference: <strong className="order-id-badge">{placedOrder.id}</strong>
            </p>
            <p className="confirmation-note">
              A confirmation email has been dispatched to <strong>{placedOrder.customer.email}</strong>.
            </p>

            {/* Order Summary box */}
            <div className="placed-order-summary">
              <div className="placed-summary-row">
                <span>Items ({placedOrder.items.length}):</span>
                <span>${placedOrder.pricing.subtotal.toFixed(2)}</span>
              </div>
              <div className="placed-summary-row">
                <span>Shipping:</span>
                <span>{placedOrder.pricing.shipping === 0 ? 'FREE' : `$${placedOrder.pricing.shipping.toFixed(2)}`}</span>
              </div>
              <div className="placed-summary-row">
                <span>Tax (8%):</span>
                <span>${placedOrder.pricing.tax.toFixed(2)}</span>
              </div>
              <div className="placed-summary-row total">
                <span>Total Paid:</span>
                <span className="total-highlight">${placedOrder.pricing.total.toFixed(2)}</span>
              </div>
              <div className="delivery-badge">
                <Truck size={16} />
                <span>Estimated Delivery: {placedOrder.estimatedDelivery}</span>
              </div>
            </div>

            <div className="success-actions">
              <button
                className="btn-primary"
                onClick={() => {
                  handleClose();
                  if (onOpenOrders) onOpenOrders();
                }}
              >
                View in Order History
              </button>
              <button className="btn-secondary" onClick={handleClose}>
                Continue Shopping
              </button>
            </div>
          </div>
        ) : (
          /* Checkout Form & Cart Breakdown */
          <form className="checkout-form-grid" onSubmit={handleSubmit}>
            {/* Left: Shipping Form */}
            <div className="checkout-form-fields">
              <h3 className="form-section-title">Shipping Details</h3>

              {errorMessage && (
                <div className="form-error-banner">
                  <AlertCircle size={18} />
                  <span>{errorMessage}</span>
                </div>
              )}

              <div className="form-group">
                <label htmlFor="name">Full Name *</label>
                <input
                  id="name"
                  type="text"
                  name="name"
                  required
                  placeholder="e.g. John Doe"
                  value={formData.name}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label htmlFor="email">Email Address *</label>
                <input
                  id="email"
                  type="email"
                  name="email"
                  required
                  placeholder="e.g. john@example.com"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label htmlFor="address">Street Address *</label>
                <input
                  id="address"
                  type="text"
                  name="address"
                  required
                  placeholder="e.g. 742 Evergreen Terrace, Apt 4B"
                  value={formData.address}
                  onChange={handleChange}
                />
              </div>

              <div className="form-row-two">
                <div className="form-group">
                  <label htmlFor="city">City *</label>
                  <input
                    id="city"
                    type="text"
                    name="city"
                    required
                    placeholder="e.g. New York"
                    value={formData.city}
                    onChange={handleChange}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="postalCode">Postal Code *</label>
                  <input
                    id="postalCode"
                    type="text"
                    name="postalCode"
                    required
                    placeholder="e.g. 10001"
                    value={formData.postalCode}
                    onChange={handleChange}
                  />
                </div>
              </div>

              {/* Payment selection */}
              <h3 className="form-section-title mt-4">Payment Method</h3>
              <div className="payment-options">
                <label className={`payment-option-card ${formData.paymentMethod === 'Card (Demo Mode)' ? 'selected' : ''}`}>
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="Card (Demo Mode)"
                    checked={formData.paymentMethod === 'Card (Demo Mode)'}
                    onChange={handleChange}
                  />
                  <CreditCard size={18} />
                  <div className="payment-option-desc">
                    <strong>Demo Card / Instant Checkout</strong>
                    <small>Simulated payment for demo testing</small>
                  </div>
                </label>

                <label className={`payment-option-card ${formData.paymentMethod === 'Cash on Delivery' ? 'selected' : ''}`}>
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="Cash on Delivery"
                    checked={formData.paymentMethod === 'Cash on Delivery'}
                    onChange={handleChange}
                  />
                  <Truck size={18} />
                  <div className="payment-option-desc">
                    <strong>Cash on Delivery</strong>
                    <small>Pay upon package receipt</small>
                  </div>
                </label>
              </div>

              <div className="security-notice">
                <ShieldCheck size={16} />
                <span>256-bit SSL encrypted checkout simulation</span>
              </div>
            </div>

            {/* Right: Order Summary Sidebar */}
            <div className="checkout-sidebar">
              <h3 className="form-section-title">Order Items ({cart.length})</h3>

              <div className="checkout-items-preview">
                {cart.map((item) => (
                  <div key={item.id} className="checkout-item-row">
                    <img src={item.image} alt={item.name} className="checkout-item-thumb" />
                    <div className="checkout-item-details">
                      <p className="checkout-item-name">{item.name}</p>
                      <span className="checkout-item-qty">Qty: {item.quantity}</span>
                    </div>
                    <span className="checkout-item-price">${(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>

              <div className="sidebar-totals">
                <div className="sidebar-row">
                  <span>Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="sidebar-row">
                  <span>Tax (8%)</span>
                  <span>${tax.toFixed(2)}</span>
                </div>
                <div className="sidebar-row">
                  <span>Shipping</span>
                  <span>{shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}</span>
                </div>
                <div className="sidebar-row grand-total">
                  <span>Grand Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>

              <button
                type="submit"
                className="btn-place-order"
                disabled={submitting || cart.length === 0}
              >
                {submitting ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    <span>Processing Order...</span>
                  </>
                ) : (
                  <>
                    <span>Place Order (${total.toFixed(2)})</span>
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

