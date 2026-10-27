// In-Memory Express API Test Suite
// Verifies all endpoints, route handlers, logic, calculations, and data persistence
const app = require('./server');

function simulateRequest(options) {
  return new Promise((resolve) => {
    const { EventEmitter } = require('events');
    const req = new EventEmitter();
    req.method = options.method || 'GET';
    req.url = options.url || '/';
    req.originalUrl = req.url;
    req.headers = options.headers || {};
    req.body = options.body || {};
    req.query = {};

    // Parse query params if present
    if (req.url.includes('?')) {
      const parts = req.url.split('?');
      req.url = parts[0];
      const params = new URLSearchParams(parts[1]);
      for (const [key, value] of params.entries()) {
        req.query[key] = value;
      }
    }

    let statusCode = 200;
    let responseData = null;

    const res = {
      statusCode: 200,
      status(code) {
        statusCode = code;
        this.statusCode = code;
        return this;
      },
      json(data) {
        responseData = data;
        resolve({ statusCode, data });
      },
      send(data) {
        responseData = data;
        resolve({ statusCode, data });
      },
      setHeader() {},
      getHeader() {},
    };

    app.handle(req, res);
  });
}

async function runTestSuite() {
  console.log('====================================================');
  console.log('🧪 Starting In-Memory API Integration Test Suite');
  console.log('====================================================\n');

  // 1. Health check
  const health = await simulateRequest({ method: 'GET', url: '/api/health' });
  console.log('1. GET /api/health -> Status:', health.statusCode, 'Data:', health.data.status);
  if (health.statusCode !== 200 || health.data.status !== 'online') {
    throw new Error('Health check failed');
  }

  // 2. Fetch all products
  const productsRes = await simulateRequest({ method: 'GET', url: '/api/products' });
  console.log('2. GET /api/products -> Status:', productsRes.statusCode, 'Count:', productsRes.data.count);
  if (productsRes.statusCode !== 200 || productsRes.data.count < 8) {
    throw new Error('Product catalog fetch failed');
  }

  // 3. Filter products by category
  const audioRes = await simulateRequest({ method: 'GET', url: '/api/products?category=Audio' });
  console.log('3. GET /api/products?category=Audio -> Status:', audioRes.statusCode, 'Audio items:', audioRes.data.count);
  if (audioRes.statusCode !== 200 || audioRes.data.count !== 2) {
    throw new Error('Product category filter failed');
  }

  // 4. Search products
  const searchRes = await simulateRequest({ method: 'GET', url: '/api/products?search=keyboard' });
  console.log('4. GET /api/products?search=keyboard -> Status:', searchRes.statusCode, 'Search matches:', searchRes.data.count);
  if (searchRes.statusCode !== 200 || searchRes.data.products[0].name !== 'Minimalist Mechanical Keyboard') {
    throw new Error('Product search failed');
  }

  // 5. Get individual product by ID
  const productOne = await simulateRequest({ method: 'GET', url: '/api/products/1' });
  console.log('5. GET /api/products/1 -> Status:', productOne.statusCode, 'Title:', productOne.data.product.name);
  if (productOne.statusCode !== 200 || productOne.data.product.id !== 1) {
    throw new Error('Get single product failed');
  }

  // 6. User Login
  const loginRes = await simulateRequest({
    method: 'POST',
    url: '/api/auth/login',
    body: {
      email: 'demo@shopnova.com',
      password: 'password123',
    },
  });
  console.log('6. POST /api/auth/login -> Status:', loginRes.statusCode, 'User:', loginRes.data.user.name, 'Token:', loginRes.data.token);
  if (loginRes.statusCode !== 200 || !loginRes.data.token) {
    throw new Error('Auth login failed');
  }

  // 7. Place Order
  const orderRes = await simulateRequest({
    method: 'POST',
    url: '/api/orders',
    body: {
      userId: loginRes.data.user.id,
      items: [
        { id: 1, quantity: 1 },
        { id: 3, quantity: 1 },
      ],
      customer: {
        name: 'Alex Johnson',
        email: 'demo@shopnova.com',
        address: '100 Silicon Way',
        city: 'San Francisco',
        postalCode: '94105',
      },
      paymentMethod: 'Card (Demo Mode)',
    },
  });
  console.log('7. POST /api/orders -> Status:', orderRes.statusCode, 'Order ID:', orderRes.data.order.id, 'Subtotal: $' + orderRes.data.order.pricing.subtotal, 'Total: $' + orderRes.data.order.pricing.total);
  if (orderRes.statusCode !== 201 || !orderRes.data.order.id) {
    throw new Error('Order creation failed');
  }

  // 8. Retrieve Orders
  const ordersListRes = await simulateRequest({
    method: 'GET',
    url: '/api/orders?email=demo@shopnova.com',
  });
  console.log('8. GET /api/orders?email=demo@shopnova.com -> Status:', ordersListRes.statusCode, 'Orders retrieved:', ordersListRes.data.count);
  if (ordersListRes.statusCode !== 200 || ordersListRes.data.count === 0) {
    throw new Error('Orders query failed');
  }

  console.log('\n====================================================');
  console.log('🎉 ALL 8 BACKEND INTEGRATION TESTS PASSED!');
  console.log('====================================================');
  process.exit(0);
}

runTestSuite().catch((err) => {
  console.error('❌ Test suite failed:', err);
  process.exit(1);
});

