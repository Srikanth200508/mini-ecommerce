import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [cart, setCart] = useState(() => {
    try {
      const saved = localStorage.getItem('shopnova_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Save to localStorage whenever cart changes
  useEffect(() => {
    localStorage.setItem('shopnova_cart', JSON.stringify(cart));
  }, [cart]);

  // Add product to cart
  const addToCart = (product, quantity = 1) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [
        ...prev,
        {
          id: product.id,
          name: product.name,
          price: product.price,
          image: product.image,
          category: product.category,
          quantity,
        },
      ];
    });
  };

  // Increase quantity by 1
  const increaseQty = (productId) => {
    setCart((prev) =>
      prev.map((item) =>
        item.id === productId ? { ...item, quantity: item.quantity + 1 } : item
      )
    );
  };

  // Decrease quantity by 1 (or remove if 1)
  const decreaseQty = (productId) => {
    setCart((prev) =>
      prev
        .map((item) =>
          item.id === productId ? { ...item, quantity: item.quantity - 1 } : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  // Remove completely from cart
  const removeFromCart = (productId) => {
    setCart((prev) => prev.filter((item) => item.id !== productId));
  };

  // Clear entire cart
  const clearCart = () => {
    setCart([]);
  };

  // Total item count in cart
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  // Subtotal calculation
  const subtotal = Number(
    cart.reduce((sum, item) => sum + item.price * item.quantity, 0).toFixed(2)
  );

  // Tax calculation (8%)
  const tax = Number((subtotal * 0.08).toFixed(2));

  // Free shipping above $100, or 0 if empty
  const freeShippingThreshold = 100;
  const shipping = cart.length === 0 ? 0 : subtotal >= freeShippingThreshold ? 0 : 9.99;

  // Grand Total calculation
  const total = Number((subtotal + tax + shipping).toFixed(2));

  const amountToFreeShipping = Math.max(0, Number((freeShippingThreshold - subtotal).toFixed(2)));

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
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
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}

