const express = require('express');
const cors = require('cors');
const path = require('path');

const productsRouter = require('./routes/products');
const ordersRouter = require('./routes/orders');
const authRouter = require('./routes/auth');
const { notFoundHandler, globalErrorHandler } = require('./middleware/errorHandler');

const app = express();
const PORT = process.env.PORT || 5050;
const HOST = process.env.HOST || '127.0.0.1';

// Enable CORS for frontend development
app.use(
  cors({
    origin: ['http://localhost:3000', 'http://localhost:5173', 'http://127.0.0.1:3000', 'http://127.0.0.1:5173'],
    credentials: true,
  })
);

// Body parser
app.use(express.json());

// Request logger for debugging
app.use((req, res, next) => {
  const timestamp = new Date().toLocaleTimeString();
  console.log(`[${timestamp}] ${req.method} ${req.originalUrl}`);
  next();
});

// API Routes
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

app.use('/api/products', productsRouter);
app.use('/api/orders', ordersRouter);
app.use('/api/auth', authRouter);

// 404 and Error handling
app.use(notFoundHandler);
app.use(globalErrorHandler);

// Export app and conditionally start server
if (require.main === module) {
  app.listen(PORT, HOST, () => {
    console.log(`===============================================`);
    console.log(`🚀 Mini E-Commerce Server is running!`);
    console.log(`📡 URL: http://${HOST}:${PORT}`);
    console.log(`🛒 Products API: http://${HOST}:${PORT}/api/products`);
    console.log(`📦 Orders API:   http://${HOST}:${PORT}/api/orders`);
    console.log(`🔐 Auth API:     http://${HOST}:${PORT}/api/auth`);
    console.log(`===============================================`);
  });
}

module.exports = app;

