// Automated API Verification Script
const http = require('http');
const app = require('./server');

async function runTests() {
  const server = http.createServer(app);

  await new Promise((resolve) => {
    server.listen(0, '127.0.0.1', () => {
      resolve();
    });
  });

  const port = server.address().port;
  console.log(`[Test Suite] Test server temporarily listening on port ${port}...`);

  function request(method, path, body = null) {
    return new Promise((resolve, reject) => {
      const options = {
        hostname: '127.0.0.1',
        port,
        path,
        method,
        headers: {
          'Content-Type': 'application/json',
        },
      };

      const req = http.request(options, (res) => {
        let data = '';
        res.on('data', (chunk) => (data += chunk));
        res.on('end', () => {
          try {
            resolve({ status: res.statusCode, body: JSON.parse(data) });
          } catch (e) {
            resolve({ status: res.statusCode, raw: data });
          }
        });
      });

      req.on('error', reject);
      if (body) {
        req.write(JSON.stringify(body));
      }
      req.end();
    });
  }

  console.log('--- Testing API Endpoints ---');

  // Test 1: Health check
  const healthRes = await request('GET', '/api/health');
  console.log('1. GET /api/health -> Status:', healthRes.status, 'Body:', healthRes.body.status);
  if (healthRes.status !== 200 || healthRes.body.status !== 'online') {
    throw new Error('Health check failed');
  }

  // Test 2: Products list
  const productsRes = await request('GET', '/api/products');
  console.log('2. GET /api/products -> Status:', productsRes.status, 'Count:', productsRes.body.count);
  if (productsRes.status !== 200 || productsRes.body.count === 0) {
    throw new Error('Products fetch failed');
  }

  // Test 3: Filter products by category
  const audioRes = await request('GET', '/api/products?category=Audio');
  console.log('3. GET /api/products?category=Audio -> Status:', audioRes.status, 'Count:', audioRes.body.count);
  if (audioRes.status !== 200 || audioRes.body.count === 0) {
    throw new Error('Category filter failed');
  }

  // Test 4: Single Product
  const productOne = await request('GET', '/api/products/1');
  console.log('4. GET /api/products/1 -> Status:', productOne.status, 'Product:', productOne.body.product.name);
  if (productOne.status !== 200 || !productOne.body.product) {
    throw new Error('Get product 1 failed');
  }

  // Test 5: Auth Login with demo user
  const loginRes = await request('POST', '/api/auth/login', {
    email: 'demo@shopnova.com',
    password: 'password123',
  });
  console.log('5. POST /api/auth/login -> Status:', loginRes.status, 'User:', loginRes.body.user.name, 'Token:', !!loginRes.body.token);
  if (loginRes.status !== 200 || !loginRes.body.token) {
    throw new Error('Login failed');
  }

  // Test 6: Create Order
  const orderRes = await request('POST', '/api/orders', {
    userId: loginRes.body.user.id,
    customer: {
      name: 'Alex Johnson',
      email: 'demo@shopnova.com',
      address: '742 Evergreen Terrace',
      city: 'Springfield',
      postalCode: '97477',
    },
    items: [
      { id: 1, quantity: 1 },
      { id: 2, quantity: 2 },
    ],
    paymentMethod: 'Card (Demo Mode)',
  });
  console.log('6. POST /api/orders -> Status:', orderRes.status, 'Order ID:', orderRes.body.order.id, 'Total: $' + orderRes.body.order.pricing.total);
  if (orderRes.status !== 201 || !orderRes.body.order.id) {
    throw new Error('Order creation failed');
  }

  // Test 7: Get Orders for user
  const ordersRes = await request('GET', '/api/orders?email=demo@shopnova.com');
  console.log('7. GET /api/orders?email=demo@shopnova.com -> Status:', ordersRes.status, 'Orders Count:', ordersRes.body.count);
  if (ordersRes.status !== 200 || ordersRes.body.count === 0) {
    throw new Error('Orders list failed');
  }

  // Close test server
  await new Promise((resolve) => server.close(resolve));

  console.log('\n🎉 ALL 7 API ENDPOINTS TESTED AND VERIFIED SUCCESSFULLY!');
  process.exit(0);
}

runTests().catch((err) => {
  console.error('❌ Test failed:', err);
  process.exit(1);
});

