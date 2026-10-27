const express = require('express');
const cors = require('cors');
const path = require('path');

const productsRouter = require('./routes/products');
const ordersRouter = require('./routes/orders');
const authRouter = require('./routes/auth');
const { notFoundHandler, globalErrorHandler } = require('./middleware/errorHandler');

const app = express();
const PORT = process.env.PORT || 5000;
const HOST = '0.0.0.0';

// Configurable CORS origins: allow local dev ports + production client origin
const defaultOrigins = [
  'http://localhost:3000',
  'http://localhost:5173',
  'http://127.0.0.1:3000',
  'http://127.0.0.1:5173',
];

const clientOrigin = process.env.CLIENT_ORIGIN;
const allowedOrigins = clientOrigin
  ? [...defaultOrigins, ...clientOrigin.split(',').map((o) => o.trim().replace(/\/$/, ''))]
  : defaultOrigins;

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (e.g. mobile apps, curl, server-to-server health checks)
      if (!origin) return callback(null, true);

      const normalizedOrigin = origin.replace(/\/$/, '');
      if (
        allowedOrigins.includes(normalizedOrigin) ||
        allowedOrigins.includes('*') ||
        normalizedOrigin.endsWith('.vercel.app')
      ) {
        return callback(null, true);
      }

      return callback(new Error(`CORS policy blocked access from origin: ${origin}`));
    },
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
  let activePort = PORT;
  const server = app.listen(activePort, HOST, () => {
    console.log(`===============================================`);
    console.log(`🚀 Mini E-Commerce Server is running!`);
    console.log(`📡 URL: http://${HOST}:${activePort}`);
    console.log(`🛒 Products API: http://${HOST}:${activePort}/api/products`);
    console.log(`📦 Orders API:   http://${HOST}:${activePort}/api/orders`);
    console.log(`🔐 Auth API:     http://${HOST}:${activePort}/api/auth`);
    console.log(`===============================================`);
  });

  server.on('error', (err) => {
    if (err.code === 'EADDRINUSE' && !process.env.PORT) {
      console.warn(`⚠️  Port ${activePort} is busy locally. Trying fallback port 5050 on ${HOST}...`);
      activePort = 5050;
      server.listen(activePort, HOST);
    } else {
      console.error('Server error:', err.message);
    }
  });
}

module.exports = app;

