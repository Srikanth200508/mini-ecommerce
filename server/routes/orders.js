const express = require('express');
const router = express.Router();
const { readJson, writeJson } = require('../data/dbHelper');

// GET /api/orders - Get orders (supports ?email=... or ?userId=...)
router.get('/', async (req, res, next) => {
  try {
    const { email, userId } = req.query;
    let orders = await readJson('orders.json', []);

    if (email) {
      orders = orders.filter(
        (o) => o.customer && o.customer.email.toLowerCase() === email.toLowerCase()
      );
    } else if (userId) {
      orders = orders.filter((o) => o.userId === userId);
    }

    res.json({
      success: true,
      count: orders.length,
      orders,
    });
  } catch (err) {
    next(err);
  }
});

// GET /api/orders/:id - Get order by ID
router.get('/:id', async (req, res, next) => {
  try {
    const orders = await readJson('orders.json', []);
    const order = orders.find((o) => o.id === req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: `Order #${req.params.id} not found`,
      });
    }

    res.json({
      success: true,
      order,
    });
  } catch (err) {
    next(err);
  }
});

// POST /api/orders - Create a new order
router.post('/', async (req, res, next) => {
  try {
    const { items, customer, paymentMethod, userId } = req.body;

    // Validation
    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Order must contain at least one item.',
      });
    }

    if (!customer || !customer.name || !customer.email || !customer.address) {
      return res.status(400).json({
        success: false,
        message: 'Customer name, email, and shipping address are required.',
      });
    }

    // Email format check
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(customer.email)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid email address.',
      });
    }

    // Calculate totals securely on the server
    const products = await readJson('products.json', []);
    const verifiedItems = [];
    let subtotal = 0;

    for (const cartItem of items) {
      const product = products.find((p) => p.id === cartItem.id);
      if (!product) {
        return res.status(400).json({
          success: false,
          message: `Product with ID ${cartItem.id} does not exist.`,
        });
      }

      const quantity = Math.max(1, parseInt(cartItem.quantity, 10) || 1);
      const itemTotal = Number((product.price * quantity).toFixed(2));
      subtotal += itemTotal;

      verifiedItems.push({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        quantity,
        itemTotal,
      });
    }

    subtotal = Number(subtotal.toFixed(2));
    const taxRate = 0.08; // 8% sales tax
    const tax = Number((subtotal * taxRate).toFixed(2));
    const shipping = subtotal > 100 ? 0 : 9.99; // Free shipping above $100
    const total = Number((subtotal + tax + shipping).toFixed(2));

    const newOrder = {
      id: 'ORD-' + Math.floor(100000 + Math.random() * 900000),
      createdAt: new Date().toISOString(),
      userId: userId || null,
      customer: {
        name: customer.name.trim(),
        email: customer.email.trim(),
        address: customer.address.trim(),
        city: customer.city || '',
        postalCode: customer.postalCode || '',
      },
      paymentMethod: paymentMethod || 'Cash On Delivery / Demo Pay',
      items: verifiedItems,
      pricing: {
        subtotal,
        tax,
        shipping,
        total,
      },
      status: 'Processing',
      estimatedDelivery: '3-5 Business Days',
    };

    // Save order
    const orders = await readJson('orders.json', []);
    orders.unshift(newOrder); // Add to beginning
    await writeJson('orders.json', orders);

    res.status(201).json({
      success: true,
      message: 'Order placed successfully!',
      order: newOrder,
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;

