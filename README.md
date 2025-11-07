# 💻 Tramar: Custom PC Builder & Parts Retailer

## 🌟 Case Study: The Tramar Platform - Special Edition

### Problem
The PC parts retail market is complex, fraught with **compatibility headaches** (e.g., CPU socket vs. Motherboard chipset) and frequent **stock shortages** of high-demand items. Existing e-commerce solutions treat all items equally, failing to provide the crucial technical guidance shoppers need, leading to high return rates and poor user experience.

### Solution
**Tramar** has been specialized into a custom PC builder and parts retailer built on the **MERN stack** (MongoDB, Express, React, Node.js). It provides robust e-commerce foundations alongside **advanced logic** to ensure component compatibility and offer proactive **stock alerts** for customers.

### Key Features (Specialized)

| Feature Area | Description | Implementation Details |
| :--- | :--- | :--- |
| **PC Compatibility Checker** | Automatically scans items in the cart (e.g., CPU, Motherboard, RAM) and warns the user about technical mismatches. | Custom backend **`checkCompatibility` API route** leveraging specialized `compatibilityKey` fields in the Mongoose Model. |
| **Stock Alert System** | Allows registered users to subscribe to alerts for out-of-stock products, notifying them when inventory returns. | Extended **`User` Model** with a `stockAlerts` array; Requires specialized **`subscribeToAlert` API route**. |
| **Product Attributes** | Products are categorized with technical fields like `Socket Type`, `Memory Type`, and `Wattage`. | Enhanced **`Product` Mongoose Schema** with specialized validation and data fields. |
| **Product Variants** | Management of products with minor differences (e.g., RAM size: 8GB, 16GB, 32GB) under a single parent SKU. | Utilizes the `variant` field in the Product Model for display and inventory control. |
| **Admin Dashboard** | **Role-based access control** for administrators to manage the entire technical product catalog (CRUD). | **`admin` middleware** protects all product CRUD routes. |
| **Payment Gateway** | Integrated with **Stripe** for secure, tokenized credit card processing during checkout. | Uses Stripe's **Payment Intents** and **Webhook** handling. |

---

## 🛠️ Technology Stack

| Component | Technology | Role & Purpose |
| :--- | :--- | :--- |
| **Frontend** | **React.js** | Building the User Interface as a fast Single-Page Application (SPA). |
| **State** | **React Context API** | Application-wide state management (Authentication, Cart). |
| **Backend** | **Node.js & Express.js** | Fast, non-blocking runtime environment for the RESTful API and custom logic. |
| **Database** | **MongoDB & Mongoose** | Flexible NoSQL database for products (with technical specs), user alerts, and orders. |
| **Security** | **JWT / Bcrypt** | Secure user authentication and password storage. |
| **Payment** | **Stripe SDK** | Secure processing of credit card transactions. |

---

## 📂 Project Folder Structure

The project follows a standard MERN stack monorepo, ensuring clear separation of concerns between the client and server.

---

## 🛠️ Technology Stack

| Component | Technology | Role & Purpose |
| :--- | :--- | :--- |
| **Frontend** | **React.js** | Building the User Interface as a fast Single-Page Application (SPA). |
| **State** | **React Context API** | Application-wide state management (Authentication, Cart). |
| **Backend** | **Node.js & Express.js** | Fast, non-blocking runtime environment for the RESTful API. |
| **Database** | **MongoDB & Mongoose** | Flexible NoSQL database for product, user, and order persistence. |
| **Security** | **JWT / Bcrypt** | Secure user authentication and password storage. |
| **Payment** | **Stripe SDK** | Secure processing of credit card transactions. |

---

## 📂 Project Folder Structure

The project follows a standard MERN stack monorepo, ensuring clear separation of concerns between the client and server.

```
tramar/
├── client/                                 # 🖥️ FRONTEND: React Application
│   ├── public/                             # Static assets (index.html, favicon)
│   ├── src/
│   │   ├── components/                     # 🧩 Reusable UI Components
│   │   │   ├── layout/                     # Global parts (Header, Footer, MainNav)
│   │   │   ├── forms/                      # Generic form elements (InputField, Button)
│   │   │   ├── product/                    # Specific product-related UI (ProductCard, AlertButton)
│   │   │   └── routes/                     # Custom route wrappers (ProtectedRoute)
│   │   ├── context/                        # 🔑 Global State Management
│   │   │   ├── AuthContext.jsx             # User authentication state (user, token)
│   │   │   └── CartContext.jsx             # Shopping cart state
│   │   ├── pages/                          # 📄 Route Components (Views)
│   │   │   ├── public/                     # Pages accessible to all
│   │   │   │   ├── HomePage.jsx
│   │   │   │   └── ProductDetailPage.jsx
│   │   │   ├── user/                       # Pages for logged-in users
│   │   │   │   ├── CartPage.jsx
│   │   │   │   └── ProfilePage.jsx
│   │   │   └── admin/                      # Pages for administrators
│   │   │       └── AdminDashboard.jsx      # CRUD forms for products/users
│   │   ├── services/                       # 🌐 Centralized API Interaction
│   │   │   ├── apiService.js               # Main Axios instance & CRUD functions
│   │   │   └── compatibilityLogic.js       # (Optional: dedicated logic file)
│   │   └── App.jsx                         # Main router setup
│   │   └── index.js                        # Entry point
│   └── package.json                        # Frontend dependencies & proxy setup
│
├── server/                                 # ⚙️ BACKEND: Node.js/Express API
│   ├── config/                             # Configuration files
│   │   └── db.js                           # MongoDB connection setup
│   ├── controllers/                        # 🧠 Business Logic (Request Handlers)
│   │   ├── userController.js               # User registration, login, profile, stock alerts
│   │   └── productController.js            # Product CRUD, **checkCompatibility**
│   ├── middleware/                         # 🛡️ Express Middleware
│   │   └── auth.js                         # `protect` (JWT verification), `admin` (Role check)
│   ├── models/                             # 💾 Mongoose Schemas
│   │   ├── User.js                         # Includes `stockAlerts` array
│   │   └── Product.js                      # Includes `compatibilityKey`, `socketType`, etc.
│   │   └── Cart.js                         # Schema for user shopping cart
│   ├── routes/                             # 🛣️ API Endpoints
│   │   ├── userRoutes.js                   # /api/users routes
│   │   └── productRoutes.js                # /api/products routes (includes /compatibility)
│   └── server.js                           # Main Express application entry point
│
├── .env                                    # 🤫 Environment Variables (MONGO_URI, JWT_SECRET, STRIPE_KEYS)
├── .gitignore                              # Defines files to exclude from Git (node_modules, .env)
└── package.json                            # Root dependencies, scripts (`npm run dev`)
```

---

## 🚀 Getting Started

### Prerequisites

You will need the following installed:
1.  **Node.js** (v18 or higher)
2.  **npm** (comes with Node.js)
3.  **MongoDB URI** (from MongoDB Atlas or a local instance)
4.  **Stripe API Keys** (Test Public, Secret, and Webhook Secret)

### Installation

1.  **Clone the Repository**
    ```bash
    git clone [https://github.com/your-username/tramar.git](https://github.com/your-username/tramar.git)
    cd tramar
    ```
2.  **Install Dependencies**
    ```bash
    # Install dependencies for the root and the server
    npm install
    # Install dependencies for the client
    npm install --prefix client
    ```
3.  **Configure Environment**
    Create a file named **`.env`** in the root `tramar/` directory and populate it with your environment variables:

    ```
    PORT=5000
    MONGO_URI="your_mongodb_connection_string"
    JWT_SECRET="your_secure_jwt_secret"

    STRIPE_SECRET_KEY="sk_test_..."
    STRIPE_PUBLIC_KEY="pk_test_..."
    STRIPE_WEBHOOK_SECRET="whsec_..."
    ```

### Running the Application

Execute the following command from the root `tramar/` directory. This utilizes `concurrently` to start both the Node.js API server and the React development server.

```bash
npm run dev

The server will run on http://localhost:5000 and the client application will open in your browser at http://localhost:3000.

```

### 🖼️ Screenshots (Placeholders)

Feature	Description
Home Page	
Admin Dashboard	
Checkout Process	[Image showing the final checkout page with the integrated Stripe Elements payment form.]
User Profile	

### ✍️ Author & License

    Author: Marjory D. Marquez

    GitHub Profile: Marjory00
    Codepen Profile: Marjory00

    License: MIT