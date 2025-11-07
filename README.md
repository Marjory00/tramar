
# 🛍️ Tramar: Next-Generation E-Commerce Platform

## 🌟 Case Study: The Tramar Platform

### Problem
Modern shoppers demand a seamless, fast, and secure online purchasing experience. Existing e-commerce solutions often suffer from poor performance, complex checkout flows, or weak security, leading to high cart abandonment rates. For businesses, managing product inventory and sales data across fragmented systems is a major pain point.

### Solution
**Tramar** is a robust, full-stack e-commerce application built on the **MERN stack** (MongoDB, Express, React, Node.js). It delivers a high-performance, single-page application (SPA) experience for customers and a secure, dedicated Admin Dashboard for product management.

### Key Features

| Feature Area | Description | Implementation Details |
| :--- | :--- | :--- |
| **Product Listings** | Dynamic catalog display, product detail pages, and search/filtering capabilities. | Frontend: **React Pages**; Backend: **Product Controller** with query support. |
| **Shopping Cart** | Persistent, user-specific cart functionality allowing items to be added, updated, and removed. | Dedicated **Cart Model** and **Cart Controller** to manage state server-side. |
| **User Authentication** | Secure user registration, login, and profile management. | **JWT** for stateless authorization; **Bcrypt** for password hashing. |
| **Admin Dashboard** | **Role-based access control** for administrators to manage the entire product catalog. | **`admin` middleware** protects all product CRUD routes. |
| **Payment Gateway** | Integrated with **Stripe** for secure, tokenized credit card processing during checkout. | Uses Stripe's **Payment Intents** and **Webhook** handling. |

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
├── client/                     # Frontend: React Application
│   ├── src/                    
│   │   ├── components/         # Reusable UI elements (Header, Forms)
│   │   ├── pages/              # Route components (HomePage, AdminDashboard)
│   │   ├── context/            # Global state (AuthContext, CartContext)
│   │   └── services/           # Centralized API logic (apiService.js)
│   └── package.json            
│
├── server/                     # Backend: Node.js/Express API
│   ├── controllers/            # Business logic (userController, productController)
│   ├── middleware/             # Authorization (auth.js: protect, admin)
│   ├── models/                 # Mongoose Schemas (User.js, Product.js, Cart.js)
│   ├── routes/                 # API Endpoints (productRoutes, userRoutes)
│   └── server.js               # Main Express entry point
│
├── .env                        # ⚠️ Local Environment Variables (Git Ignored)
├── .gitignore                  
└── package.json                # Root package.json with 'npm run dev' script
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

🖼️ Screenshots (Placeholders)

Feature	Description
Home Page	
Admin Dashboard	
Checkout Process	[Image showing the final checkout page with the integrated Stripe Elements payment form.]
User Profile	

✍️ Author & License

    Author: Marjory D. Marquez

    GitHub Profile: Marjory00
    Codepen Profile: Marjory00

    License: MIT