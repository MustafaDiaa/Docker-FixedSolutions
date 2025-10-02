# 📚 Bookly API

Bookly is a full-stack MERN application that allows users to browse, buy, and manage books. It supports role-based access control (User, SubAdmin, RootAdmin), cart management, purchases, and authentication with JWT.

This repository contains the backend APIs with Swagger documentation, input validation, global error handling, and MongoDB transactions.

## 🛠️ Features

### 👤 User Features
- **User registration, login, logout, and JWT authentication**
- **Email confirmation and password reset flows**
- **View and edit profile, change password**
- **Add books to cart, update quantity, remove from cart**
- **Purchase books, with stock validation**
- **View purchase history**

### 👨‍💼 Admin Features
- **SubAdmin Management** (RootAdmin only)
  - CRUD operations on SubAdmins
- **User Management** (RootAdmin and SubAdmin)
  - CRUD operations on users
- **Book Management** (SubAdmin and RootAdmin)
  - CRUD operations on books
- **View all purchases** (SubAdmin and RootAdmin)

### 🔧 Other Features
- **Role-based access control (RBAC)**
- **Input validation using Joi**
- **Global error handling**
- **MongoDB transactions to handle race conditions**
- **Swagger API documentation**

## 📦 Tech Stack

- **Backend**: Node.js, Express.js
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT
- **Validation**: Joi
- **API Docs**: Swagger
- **Dev Tools**: Nodemon, dotenv

## 🏗️ Project Structure

  Bookly/
  ├─ controllers/ # All controllers (auth, user, book, cart, purchase)
  
  ├─ middlewares/ # Validation, auth, global error handler
  
  ├─ models/ # Mongoose models (User, Book, Cart, Purchase)
  
  ├─ routes/ # Express routes (auth, user, admin, books, cart, purchases)
  
  ├─ validators/ # Joi validation schemas
  
  ├─ swagger.js # Swagger API documentation setup
  
  ├─ server.js # Main entry point
  
  ├─ package.json
  
  ├─ .env # Environment variables
  
  └─ README.md
  

## ⚡ Installation

### 1. Clone the repo
```bash
git clone https://github.com/<your-username>/bookly.git
cd bookly
```

### 2. Install dependencies

```bash
npm install
```
### 3. Setup environment variables
Create a .env file in the root directory:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/bookly
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=1d
EMAIL_HOST=smtp.example.com
EMAIL_PORT=587
EMAIL_USER=example@example.com
EMAIL_PASS=password
```

### 4. Run the server
```bash
npm run dev
```

  Server will run on: http://localhost:5000
  Swagger docs available at: http://localhost:5000/api-docs

## 📄 API Documentation
The project uses Swagger (OpenAPI 3.0) to document all endpoints.

## 🔐 Auth Endpoints:

- POST /auth/signup – Register a user
- GET /auth/confirm-email – Confirm user email
- POST /auth/login – Login user
- POST /auth/refresh-token – Refresh JWT
- POST /auth/logout – Logout
- POST /auth/request-password-reset – Request password reset
- POST /auth/reset-password – Reset password

## 👨‍💼 Admin / SubAdmin Endpoints:

- GET /admins – List SubAdmins (RootAdmin only)
- POST /admins – Create SubAdmin (RootAdmin only)
- GET /admins/:id – Get SubAdmin by ID
- PUT /admins/:id – Update SubAdmin
- DELETE /admins/:id – Delete SubAdmin

## 👤 User Endpoints:

- GET /users/me – Current user profile
- PUT /users/me – Update profile
- PATCH /users/me/password – Change password
- DELETE /users/me – Delete user account
- GET /users – List all users (Admin only)
- POST /users – Create user (Admin only)
- PUT /users/:id – Update user (Admin only)
- DELETE /users/:id – Delete user (Admin only)

## 📖 Book Endpoints:

- GET /books – List all books
- GET /books/:id – Get book by ID
- POST /books – Add a book (Admin only)
- PUT /books/:id – Update a book (Admin only)
- DELETE /books/:id – Delete a book (RootAdmin only)

## 🛒 Cart Endpoints: 

- GET /cart – Get current user's cart
- POST /cart – Add book to cart
- PUT /cart – Update book quantity in cart
- DELETE /cart/:bookId – Remove book from cart

## 💳 Purchase Endpoints: 

- POST /purchases – Purchase all items in cart
- GET /purchases/my – Get current user purchases
- GET /purchases – Get all purchases (Admin only)

## 🔒 Input Validation

All endpoints use Joi schemas for request validation, e.g.:
- authValidator.js – Signup, login, reset password
- userValidator.js – Create/update users, profile update, password change
- bookValidator.js – Book creation/update
- cartValidator.js – Add/update cart items

## 🛡️ Global Error Handling: 

- Centralized error handling middleware
- Returns proper HTTP status codes with descriptive messages
- Handles validation errors, authentication errors, and unhandled exceptions

## ⚙️ Database Models:

  User
  name, email, password, role, phone, city, address, dateOfBirth, booksBoughtAmount

  Book
  title, author, description, price, stock, publishedDate, category

  Cart
  user, items [{ book, quantity }]

  Purchase
  user, book, quantity, purchaseDate

## 💡 Notes on Purchase / Stock Management:

- Uses MongoDB transactions to avoid race conditions
- Validates that requested quantities do not exceed stock
- Automatically updates booksBoughtAmount for the user
- Cart is cleared after a successful purchase
