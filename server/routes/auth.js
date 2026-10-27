const express = require('express');
const router = express.Router();
const { readJson, writeJson } = require('../data/dbHelper');

// POST /api/auth/register
router.post('/register', async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Name, email, and password are required.',
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters long.',
      });
    }

    const users = await readJson('users.json', []);
    const existing = users.find(
      (u) => u.email.toLowerCase() === email.trim().toLowerCase()
    );

    if (existing) {
      return res.status(409).json({
        success: false,
        message: 'An account with this email address already exists.',
      });
    }

    const newUser = {
      id: 'usr_' + Date.now().toString(36),
      name: name.trim(),
      email: email.trim().toLowerCase(),
      password, // In a simple JSON storage, store readable for beginner demo
      createdAt: new Date().toISOString(),
    };

    users.push(newUser);
    await writeJson('users.json', users);

    // Return safe user without password
    const safeUser = {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
    };

    res.status(201).json({
      success: true,
      message: 'Account created successfully!',
      user: safeUser,
      token: 'mock-token-' + newUser.id,
    });
  } catch (err) {
    next(err);
  }
});

// POST /api/auth/login
router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both email and password.',
      });
    }

    const users = await readJson('users.json', []);
    const user = users.find(
      (u) =>
        u.email.toLowerCase() === email.trim().toLowerCase() &&
        u.password === password
    );

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password. Please try again.',
      });
    }

    const safeUser = {
      id: user.id,
      name: user.name,
      email: user.email,
    };

    res.json({
      success: true,
      message: 'Login successful!',
      user: safeUser,
      token: 'mock-token-' + user.id,
    });
  } catch (err) {
    next(err);
  }
});

// GET /api/auth/me - Check current user status
router.get('/me', async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ success: false, message: 'Not authenticated' });
    }

    const token = authHeader.replace('Bearer ', '');
    const userId = token.replace('mock-token-', '');

    const users = await readJson('users.json', []);
    const user = users.find((u) => u.id === userId);

    if (!user) {
      return res.status(401).json({ success: false, message: 'User session expired or invalid' });
    }

    res.json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;

