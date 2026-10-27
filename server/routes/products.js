const express = require('express');
const router = express.Router();
const { readJson } = require('../data/dbHelper');

// GET /api/products - Get all products with optional search, category, and sort
router.get('/', async (req, res, next) => {
  try {
    const { category, search, sort } = req.query;
    let products = await readJson('products.json', []);

    // Filter by category
    if (category && category !== 'All') {
      products = products.filter(
        (p) => p.category.toLowerCase() === category.toLowerCase()
      );
    }

    // Filter by search query
    if (search && search.trim() !== '') {
      const q = search.trim().toLowerCase();
      products = products.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q)
      );
    }

    // Sort products
    if (sort === 'price-low') {
      products.sort((a, b) => a.price - b.price);
    } else if (sort === 'price-high') {
      products.sort((a, b) => b.price - a.price);
    } else if (sort === 'rating') {
      products.sort((a, b) => b.rating - a.rating);
    }

    res.json({
      success: true,
      count: products.length,
      products,
    });
  } catch (err) {
    next(err);
  }
});

// GET /api/products/:id - Get a single product by ID
router.get('/:id', async (req, res, next) => {
  try {
    const productId = parseInt(req.params.id, 10);
    const products = await readJson('products.json', []);
    const product = products.find((p) => p.id === productId);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: `Product with ID ${req.params.id} not found`,
      });
    }

    res.json({
      success: true,
      product,
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;

