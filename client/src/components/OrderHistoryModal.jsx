import React, { useState, useEffect } from 'react';
import { X, Package, Clock, RefreshCw, AlertCircle, ShoppingBag, Truck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { api } from '../api';

export default function OrderHistoryModal({ isOpen, onClose }) {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchOrders = async () => {
    setLoading(true);
    setError(null);
    try {
      const params = user ? { email: user.email } : {};
      const data = await api.getOrders(params);
      setOrders(data.orders || []);
    } catch (err) {
      console.error('Failed to load orders:', err);
      setError(err.message || 'Could not fetch orders.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchOrders();
    }
  }, [isOpen, user]);

  if (!isOpen) return null;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="orders-modal-content" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="modal-header">
          <div className="modal-title-box">
            <div className="flex-title">
              <Package size={22} className="text-primary" />
              <h2>{user ? `Orders for ${user.name}` : 'Recent Orders'}</h2>
            </div>
            <p className="modal-subtitle">
              {user ? `Viewing orders linked to ${user.email}` : 'All recent orders placed in this store'}
            </p>
          </div>
          <div className="header-actions">
            <button className="icon-btn" onClick={fetchOrders} title="Refresh orders">
              <RefreshCw size={17} className={loading ? 'animate-spin' : ''} />
            </button>
            <button className="close-btn" onClick={onClose} aria-label="Close modal">
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="orders-modal-body">
          {loading && (
            <div className="orders-loading">
              <div className="skeleton-line medium skeleton-shimmer mb-4"></div>
              <div className="skeleton-line full skeleton-shimmer mb-2"></div>
              <div className="skeleton-line short skeleton-shimmer"></div>
            </div>
          )}

          {!loading && error && (
            <div className="catalog-error-state">
              <AlertCircle size={36} className="text-rose-500" />
              <p>{error}</p>
              <button className="btn-secondary" onClick={fetchOrders}>
                Try Again
              </button>
            </div>
          )}

          {!loading && !error && orders.length === 0 && (
            <div className="empty-orders-view">
              <ShoppingBag size={48} className="empty-orders-icon" />
              <h3>No orders found</h3>
              <p>You haven't placed any orders yet. Add items to your cart and check out!</p>
              <button className="btn-primary mt-4" onClick={onClose}>
                Browse Products
              </button>
            </div>
          )}

          {!loading && !error && orders.length > 0 && (
            <div className="orders-list">
              {orders.map((order) => (
                <div key={order.id} className="order-history-card">
                  {/* Card Header */}
                  <div className="order-card-header">
                    <div className="order-meta-left">
                      <span className="order-id-tag">{order.id}</span>
                      <div className="order-date">
                        <Clock size={13} />
                        <span>{new Date(order.createdAt).toLocaleDateString(undefined, {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}</span>
                      </div>
                    </div>
                    <div className="order-meta-right">
                      <span className="order-status-badge">
                        <Truck size={13} />
                        {order.status || 'Confirmed'}
                      </span>
                    </div>
                  </div>

                  {/* Customer & Address Details */}
                  <div className="order-customer-snippet">
                    <strong>Shipped to:</strong> {order.customer.name} • {order.customer.address}, {order.customer.city}
                  </div>

                  {/* Item List */}
                  <div className="order-items-snippet">
                    {order.items.map((item, index) => (
                      <div key={index} className="order-item-mini-row">
                        <img src={item.image} alt={item.name} className="order-item-thumbnail" />
                        <div className="order-item-desc">
                          <span className="order-item-title">{item.name}</span>
                          <span className="order-item-qty">Qty: {item.quantity} × ${item.price.toFixed(2)}</span>
                        </div>
                        <span className="order-item-line-total">${item.itemTotal.toFixed(2)}</span>
                      </div>
                    ))}
                  </div>

                  {/* Order Financials Footer */}
                  <div className="order-card-footer">
                    <span className="payment-method-badge">{order.paymentMethod}</span>
                    <div className="order-total-group">
                      <span className="order-total-label">Total:</span>
                      <span className="order-total-val">${order.pricing.total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

