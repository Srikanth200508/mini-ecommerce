import React, { useState, useEffect, useCallback } from 'react';
import { Search, SlidersHorizontal, RefreshCw, AlertCircle, ShoppingBag, X } from 'lucide-react';
import ProductCard from './ProductCard';
import { api } from '../api';

export default function ProductList({ activeCategory, onCategoryChange, onShowToast }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [sortBy, setSortBy] = useState('');

  // Debounce search input to avoid spamming the backend
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.getProducts({
        category: activeCategory,
        search: debouncedSearch,
        sort: sortBy,
      });
      setProducts(data.products || []);
    } catch (err) {
      console.error('Error fetching products:', err);
      setError(err.message || 'Failed to load products. Please check if the server is running.');
    } finally {
      setLoading(false);
    }
  }, [activeCategory, debouncedSearch, sortBy]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleResetFilters = () => {
    setSearchTerm('');
    setDebouncedSearch('');
    setSortBy('');
    onCategoryChange('All');
  };

  return (
    <section className="catalog-section">
      {/* Hero Banner */}
      <div className="hero-banner">
        <div className="hero-content">
          <span className="hero-badge">Curated Collection 2026</span>
          <h1 className="hero-title">Elevate Your Lifestyle With Next-Gen Essentials</h1>
          <p className="hero-subtitle">
            Explore premium acoustics, cutting-edge wearables, and modern workstation gear designed for precision and elegance.
          </p>
        </div>
      </div>

      {/* Filter and Search Controls Bar */}
      <div className="controls-container">
        {/* Search Bar */}
        <div className="search-bar-wrapper">
          <Search size={18} className="search-icon" />
          <input
            type="text"
            className="search-input"
            placeholder="Search audio, watches, keyboards..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {searchTerm && (
            <button
              className="clear-search-btn"
              onClick={() => setSearchTerm('')}
              aria-label="Clear search"
            >
              <X size={16} />
            </button>
          )}
        </div>

        {/* Sort Controls */}
        <div className="sort-wrapper">
          <SlidersHorizontal size={16} className="sort-icon" />
          <select
            className="sort-select"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            aria-label="Sort products"
          >
            <option value="">Sort: Featured</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="rating">Highest Rated</option>
          </select>
        </div>
      </div>

      {/* Status Bar (Results count and active filter tag) */}
      <div className="catalog-status-bar">
        <span className="results-count">
          {loading ? 'Searching catalog...' : `Showing ${products.length} products`}
        </span>
        {(activeCategory !== 'All' || debouncedSearch || sortBy) && (
          <button className="reset-filters-chip" onClick={handleResetFilters}>
            Clear filters <X size={13} />
          </button>
        )}
      </div>

      {/* Loading Skeleton View */}
      {loading && (
        <div className="products-grid">
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <div key={n} className="skeleton-card">
              <div className="skeleton-image skeleton-shimmer"></div>
              <div className="skeleton-body">
                <div className="skeleton-line short skeleton-shimmer"></div>
                <div className="skeleton-line medium skeleton-shimmer"></div>
                <div className="skeleton-line full skeleton-shimmer"></div>
                <div className="skeleton-footer skeleton-shimmer"></div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Error View */}
      {!loading && error && (
        <div className="catalog-error-state">
          <AlertCircle size={44} className="error-icon" />
          <h3>Unable to fetch products</h3>
          <p>{error}</p>
          <button className="btn-primary retry-btn" onClick={fetchProducts}>
            <RefreshCw size={16} />
            <span>Try Again</span>
          </button>
        </div>
      )}

      {/* Empty View */}
      {!loading && !error && products.length === 0 && (
        <div className="catalog-empty-state">
          <ShoppingBag size={48} className="empty-icon" />
          <h3>No products found</h3>
          <p>We couldn't find any items matching your current filters or search query.</p>
          <button className="btn-secondary" onClick={handleResetFilters}>
            Reset Filters
          </button>
        </div>
      )}

      {/* Products Grid */}
      {!loading && !error && products.length > 0 && (
        <div className="products-grid">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onShowToast={onShowToast}
            />
          ))}
        </div>
      )}
    </section>
  );
}

