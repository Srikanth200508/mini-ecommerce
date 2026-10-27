import React, { useState } from 'react';
import { X, Lock, Mail, User, AlertCircle, Loader2, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function AuthModal({ isOpen, onClose, onAuthSuccess }) {
  const { login, register, authError, setAuthError, loading } = useAuth();

  const [mode, setMode] = useState('login'); // 'login' or 'register'
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });

  if (!isOpen) return null;

  const handleModeSwitch = (newMode) => {
    setMode(newMode);
    setAuthError(null);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleUseDemo = () => {
    setMode('login');
    setFormData({
      name: '',
      email: 'demo@shopnova.com',
      password: 'password123',
    });
    setAuthError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (mode === 'login') {
      const res = await login(formData.email, formData.password);
      if (res.success) {
        if (onAuthSuccess) onAuthSuccess(`Welcome back, ${res.user.name}!`);
        onClose();
      }
    } else {
      if (!formData.name.trim()) {
        setAuthError('Please enter your full name.');
        return;
      }
      const res = await register(formData.name, formData.email, formData.password);
      if (res.success) {
        if (onAuthSuccess) onAuthSuccess(`Welcome to ShopNova, ${res.user.name}!`);
        onClose();
      }
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="auth-modal-content" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="modal-header">
          <div className="modal-title-box">
            <h2>{mode === 'login' ? 'Sign In to Your Account' : 'Create an Account'}</h2>
            <p className="modal-subtitle">
              {mode === 'login'
                ? 'Access your orders and fast-track checkout.'
                : 'Join ShopNova for seamless order tracking and rewards.'}
            </p>
          </div>
          <button className="close-btn" onClick={onClose} aria-label="Close modal">
            <X size={20} />
          </button>
        </div>

        {/* Tab switch */}
        <div className="auth-tab-buttons">
          <button
            type="button"
            className={`auth-tab ${mode === 'login' ? 'active' : ''}`}
            onClick={() => handleModeSwitch('login')}
          >
            Sign In
          </button>
          <button
            type="button"
            className={`auth-tab ${mode === 'register' ? 'active' : ''}`}
            onClick={() => handleModeSwitch('register')}
          >
            Create Account
          </button>
        </div>

        {/* Demo Account Quick Pill */}
        <div className="demo-credentials-pill" onClick={handleUseDemo} role="button" tabIndex={0}>
          <Sparkles size={14} className="sparkle-gold" />
          <span>Quick Demo: Click to auto-fill sample credentials</span>
        </div>

        {/* Error Notification */}
        {authError && (
          <div className="form-error-banner">
            <AlertCircle size={18} />
            <span>{authError}</span>
          </div>
        )}

        <form className="auth-form" onSubmit={handleSubmit}>
          {mode === 'register' && (
            <div className="form-group">
              <label htmlFor="auth-name">Full Name</label>
              <div className="input-icon-wrapper">
                <User size={18} className="input-icon" />
                <input
                  id="auth-name"
                  type="text"
                  name="name"
                  required
                  placeholder="e.g. Alex Johnson"
                  value={formData.name}
                  onChange={handleChange}
                />
              </div>
            </div>
          )}

          <div className="form-group">
            <label htmlFor="auth-email">Email Address</label>
            <div className="input-icon-wrapper">
              <Mail size={18} className="input-icon" />
              <input
                id="auth-email"
                type="email"
                name="email"
                required
                placeholder="e.g. demo@shopnova.com"
                value={formData.email}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="auth-password">Password</label>
            <div className="input-icon-wrapper">
              <Lock size={18} className="input-icon" />
              <input
                id="auth-password"
                type="password"
                name="password"
                required
                minLength={6}
                placeholder="At least 6 characters"
                value={formData.password}
                onChange={handleChange}
              />
            </div>
          </div>

          <button
            type="submit"
            className="btn-primary auth-submit-btn"
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                <span>Please wait...</span>
              </>
            ) : (
              <span>{mode === 'login' ? 'Sign In' : 'Create My Account'}</span>
            )}
          </button>
        </form>

        <div className="auth-footer-prompt">
          {mode === 'login' ? (
            <p>
              Don't have an account?{' '}
              <button
                type="button"
                className="text-link"
                onClick={() => handleModeSwitch('register')}
              >
                Sign up free
              </button>
            </p>
          ) : (
            <p>
              Already registered?{' '}
              <button
                type="button"
                className="text-link"
                onClick={() => handleModeSwitch('login')}
              >
                Sign in here
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

