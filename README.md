# 🛍️ ShopNova - Mini E-Commerce Web Application

A clean, modern, beginner-friendly mini E-Commerce Web Application built from scratch with **React 18 + Vite** on the frontend, **Node.js + Express** on the backend, and **JSON flat-file storage** (no MongoDB required).

---

## 🌟 Key Features

1. **Product Catalog**:
   - Displays products with high-resolution images, names, prices, ratings, and detailed descriptions.
   - Filter by categories (*Audio, Wearables, Electronics, Accessories, Lifestyle*).
   - Search bar with instant real-time filtering.
   - Sorting options (*Price: Low to High, Price: High to Low, Highest Rated*).

2. **Full Shopping Cart System**:
   - Add products directly to the cart with animated visual feedback.
   - Increment (`+`), decrement (`-`), and remove (`Trash`) cart items.
   - Automatic calculation of subtotal, sales tax (8%), shipping fees, and grand total.
   - Free shipping progress bar (Free shipping for orders over $100).
   - Cart persists in browser local storage.

3. **Authentication Interface**:
   - User Registration (Full Name, Email, Password).
   - User Login with session persistence.
   - One-click **Demo Account** auto-fill (`demo@shopnova.com` / `password123`).
   - Profile badge and sign-out controls.

4. **Checkout & Order Management**:
   - Multi-step checkout modal with customer details (Name, Email, Street Address, City, Postal Code).
   - Payment method simulation (Demo Card or Cash on Delivery).
   - Backend order creation with generated Order IDs (e.g. `ORD-84920`).
   - Order history modal displaying past orders, line items, timestamps, and order status.

5. **Robust Error Handling & Loading States**:
   - Skeleton loading animations for smooth product loading.
   - Graceful network error handling with retry actions.
   - Server-side and client-side form validation.
   - Floating interactive toast notifications.

---

## 🛠️ Technology Stack

| Component | Technology | Description |
| :--- | :--- | :--- |
| **Frontend** | React 18, Vite | Blazing fast client bundle and reactive UI |
| **Icons** | Lucide React | Modern, clean feather-style iconography |
| **Styling** | Vanilla CSS3 | Responsive CSS variables, flexbox, and grid |
| **Backend** | Node.js, Express.js | REST API server with CORS enabled |
| **Database** | JSON Files | Flat-file storage (`products.json`, `orders.json`, `users.json`) |
| **HTTP Client** | Native Fetch API | Browser-native API communication |

---

## 📁 Project Structure

```text
mini-ecommerce/
├── package.json              # Root scripts to run both client and server
├── README.md                 # Complete documentation
│
├── server/                   # Express Backend
│   ├── package.json          # Server dependencies (express, cors)
│   ├── server.js             # Server entry point & API route setup
│   ├── data/                 # JSON file database
│   │   ├── dbHelper.js       # Asynchronous JSON file read/write utility
│   │   ├── products.json     # Initial catalog data
│   │   ├── orders.json       # Persisted customer orders
│   │   └── users.json        # Registered user accounts
│   ├── routes/
│   │   ├── products.js       # GET /api/products, GET /api/products/:id
│   │   ├── orders.js         # POST /api/orders, GET /api/orders
│   │   └── auth.js           # POST /api/auth/login, POST /api/auth/register
│   └── middleware/
│       └── errorHandler.js   # 404 & Centralized error handler
│
└── client/                   # React + Vite Frontend
    ├── package.json          # Frontend dependencies (react, lucide-react, vite)
    ├── vite.config.js        # Vite config with /api proxy to 127.0.0.1:5050
    ├── index.html            # HTML entry point with fonts & meta tags
    └── src/
        ├── main.jsx          # React DOM render
        ├── App.jsx           # Main layout & component integration
        ├── App.css           # Responsive styles and animations
        ├── index.css         # CSS design variables and resets
        ├── api.js            # Native Fetch API client helper
        ├── context/
        │   ├── CartContext.jsx   # Cart state, quantities & price calculation
        │   └── AuthContext.jsx   # User login, register & state management
        └── components/
            ├── Navbar.jsx            # Header with search, categories & cart badge
            ├── ProductCard.jsx       # Individual product card with add-to-cart
            ├── ProductList.jsx       # Catalog grid, filters & skeleton states
            ├── CartModal.jsx         # Slide-in cart drawer with quantity adjustments
            ├── CheckoutModal.jsx     # Shipping address form & order submission
            ├── AuthModal.jsx         # Sign-in and Sign-up modal with demo button
            ├── OrderHistoryModal.jsx # Order history review screen
            ├── Toast.jsx             # Floating notification alert
            └── Footer.jsx            # Store footer and trust badges
```

---

## 🚀 Getting Started

### 1. Prerequisites
- **Node.js** (v18 or higher recommended)
- **npm** (comes with Node.js)

### 2. Open Project in VS Code
Open VS Code and navigate to this folder:
```bash
# Set active workspace in VS Code:
File -> Open Folder -> C:\Users\Admin\.gemini\antigravity\scratch\mini-ecommerce
```

### 3. Install Dependencies
Run the install command from the root directory to install root, backend, and frontend packages:

```bash
# Option A: One-command install (from the root folder):
npm run install-all
```

*Or manually install inside each folder:*
```bash
# Root dependencies
npm install

# Backend dependencies
cd server
npm install

# Frontend dependencies
cd ../client
npm install
cd ..
```

---

## 🏃‍♂️ Running the Application

### Method 1: Start Both Frontend and Backend Concurrently (Recommended)
From the root `mini-ecommerce` folder:
```bash
npm run dev
```
This runs both the Express API server (port `5050`) and the Vite React frontend (port `3000`) concurrently.

### Method 2: Start Separately in Two Terminals

**Terminal 1 (Backend Server):**
```bash
cd server
npm run dev
# Server runs on: http://127.0.0.1:5050
```

**Terminal 2 (Frontend Client):**
```bash
cd client
npm run dev
# Frontend runs on: http://localhost:3000
```

Open your browser and navigate to:
👉 **`http://localhost:3000`**

---

## 🔌 API Endpoints Reference

### **Products**
- `GET /api/products` — Retrieve all products.
  - Query parameters:
    - `category`: Filter by category (e.g. `?category=Audio`)
    - `search`: Filter by keyword (e.g. `?search=headphone`)
    - `sort`: Sort items (`price-low`, `price-high`, `rating`)
- `GET /api/products/:id` — Retrieve a single product by ID.

### **Orders**
- `GET /api/orders` — Retrieve all orders (supports `?email=...` or `?userId=...`).
- `GET /api/orders/:id` — Retrieve single order details.
- `POST /api/orders` — Submit a new order.
  - Request body:
    ```json
    {
      "userId": "usr_demo123",
      "items": [{ "id": 1, "quantity": 2 }],
      "customer": {
        "name": "Alex Johnson",
        "email": "demo@shopnova.com",
        "address": "123 Market St",
        "city": "San Francisco",
        "postalCode": "94103"
      },
      "paymentMethod": "Card (Demo Mode)"
    }
    ```

### **Authentication**
- `POST /api/auth/register` — Register a new account (`{ name, email, password }`).
- `POST /api/auth/login` — Login (`{ email, password }`).
- `GET /api/auth/me` — Verify session token.

### **Health Check**
- `GET /api/health` — Check server status & uptime.

---

## 🧪 Testing the Application

1. **Browse & Filter**: Type into the search input or click category tags (*Audio, Electronics, etc.*) to verify instant filtering.
2. **Add to Cart**: Click "Add to Cart" on any product. Notice the badge count update on the Navbar and the toast alert.
3. **Manage Quantities**: Open the cart modal. Click `+` and `-` to test quantity adjustment and observe the subtotal, tax, and shipping recalculate live.
4. **Sign In**: Click "Sign In" in the navigation bar. Click **"Quick Demo: Click to auto-fill sample credentials"** and press Sign In.
5. **Checkout**: Click "Proceed to Checkout", review the auto-filled address or provide one, and submit the order.
6. **Order History**: Click "Orders" in the navigation bar to see your placed order with its assigned Order ID and timestamps.

