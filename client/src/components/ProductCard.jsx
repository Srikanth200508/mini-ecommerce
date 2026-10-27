import React, { useState } from 'react';
import { ShoppingCart, Check, Star } from 'lucide-react';
import { useCart } from '../context/CartContext';

export default function ProductCard({ product, onShowToast }) {
  const { addToCart, cart } = useCart();
  const [addedRecently, setAddedRecently] = useState(false);

  const existingInCart = cart.find((item) => item.id === product.id);
  const cartQuantity = existingInCart ? existingInCart.quantity : 0;

  const handleAdd = (e) => {
    e.stopPropagation();
    addToCart(product, 1);
    setAddedRecently(true);
    if (onShowToast) {
      onShowToast({
        type: 'success',
        title: 'Added to Cart',
        message: `${product.name} is now in your cart!`,
      });
    }

    setTimeout(() => {
      setAddedRecently(false);
    }, 1500);
  };

  return (
    <article className="product-card">
      {/* Product Image Box */}
      <div className="product-image-container">
        <img
          src={product.image}
          alt={product.name}
          className="product-image"
          loading="lazy"
          onError={(e) => {
            // High quality fallback SVG placeholder if image url fails
            e.target.onerror = null;
            e.target.src = 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&w=800&q=80';
          }}
        />
        <span className="product-category-tag">{product.category}</span>
        {cartQuantity > 0 && (
          <span className="product-in-cart-badge">{cartQuantity} in cart</span>
        )}
      </div>

      {/* Product Details */}
      <div className="product-details">
        {/* Rating and Stock */}
        <div className="product-meta">
          <div className="rating-box">
            <Star size={14} className="star-icon fill-amber-400 text-amber-400" />
            <span className="rating-score">{product.rating}</span>
            <span className="rating-count">({product.reviewsCount})</span>
          </div>
          <span className="stock-status">In Stock</span>
        </div>

        {/* Title & Description */}
        <h3 className="product-title" title={product.name}>
          {product.name}
        </h3>
        <p className="product-description">{product.description}</p>

        {/* Footer: Price and Add Button */}
        <div className="product-card-footer">
          <div className="product-price-box">
            <span className="price-currency">$</span>
            <span className="price-amount">{product.price.toFixed(2)}</span>
          </div>

          <button
            className={`add-cart-btn ${addedRecently ? 'btn-success' : ''}`}
            onClick={handleAdd}
            aria-label={`Add ${product.name} to cart`}
          >
            {addedRecently ? (
              <>
                <Check size={16} />
                <span>Added!</span>
              </>
            ) : (
              <>
                <ShoppingCart size={16} />
                <span>Add to Cart</span>
              </>
            )}
          </button>
        </div>
      </div>
    </article>
  );
}

