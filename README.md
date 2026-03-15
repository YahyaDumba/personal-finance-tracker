# Personal Finance Tracker - Complete Documentation

## Table of Contents
1. Project Overview
2. Tech Stack
3. Architecture
4. Database Schema
5. Client-Side Structure
6. Server-Side Structure
7. API Endpoints
8. Setup & Deployment

---

## Project Overview

**Personal Finance Tracker** is a full-stack web application that enables users to manage their personal finances effectively. Users can track income and expenses, organize them by categories, set monthly budgets, and visualize their financial data through an interactive dashboard.

### Key Features
- **User Authentication**: Secure registration, login, and email verification
- **Transaction Management**: Create, edit, and delete income/expense transactions
- **Category Management**: Organize transactions with custom categories
- **Budget Tracking**: Set and monitor monthly budget limits by category
- **Dashboard Analytics**: Visualize financial data with charts and statistics
- **Email Verification**: Secure account verification via email

---

## Tech Stack

### Frontend
| Technology | Purpose |
|---|---|
| **React 19.2.4** | UI component library |
| **Vite 6.3.5** | Build tool & dev server |
| **React Router 7.13.1** | Client-side routing |
| **Zustand 5.0.11** | State management |
| **Tailwind CSS 4.1.8** | Utility-first CSS framework |
| **Axios 1.13.6** | HTTP client |
| **Recharts 3.8.0** | Chart visualization library |
| **Lucide React 0.469.0** | Icon library |
| **React Hot Toast 2.6.0** | Toast notifications |

### Backend
| Technology | Purpose |
|---|---|
| **Node.js** | JavaScript runtime |
| **Express 5.2.1** | Web framework |
| **MySQL2 3.11.0** | Database driver |
| **bcryptjs 3.0.3** | Password hashing |
| **jsonwebtoken 9.0.3** | JWT authentication |
| **express-validator 7.3.1** | Input validation |
| **CORS 2.8.6** | Cross-origin requests |
| **Resend 6.9.3** | Email service |
| **UUID 9.0.1** | Unique ID generation |
| **Jest 30.3.0** | Testing framework |

---

## Architecture

### System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                    CLIENT (React + Vite)                    │
├─────────────────────────────────────────────────────────────┤
│  Pages: Landing, Login, Register, Dashboard, Transactions   │
│  Components: Sidebar, Budget Module, Transaction Module     │
│  State: Zustand Store (authStore)                           │
└────────────────────┬────────────────────────────────────────┘
                     │
                     │ HTTP/REST
                     │
┌────────────────────▼────────────────────────────────────────┐
│                  SERVER (Express.js)                         │
├─────────────────────────────────────────────────────────────┤
│  Routes: Auth, Transactions, Budgets, Categories, Dashboard │
│  Controllers: Handle request logic                           │
│  Services: Business logic & database operations             │
│  Middleware: Authentication (JWT), Validation               │
│  Utilities: Response formatting, Token generation           │
└────────────────────┬────────────────────────────────────────┘
                     │
                     │ MySQL Connection
                     │
┌────────────────────▼────────────────────────────────────────┐
│            DATABASE (MySQL/Railway)                          │
├─────────────────────────────────────────────────────────────┤
│  Tables: users, categories, transactions, budgets           │
│  Relationships: Users → Categories, Transactions, Budgets   │
└─────────────────────────────────────────────────────────────┘
```

---

## Database Schema

### Users Table
```sql
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    fullName VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    hashedPassword VARCHAR(255) NOT NULL,
    isVerified BOOLEAN DEFAULT FALSE,
    verificationToken VARCHAR(255),
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```
- **Purpose**: Stores user account information and authentication data
- **Key Fields**: 
  - `isVerified`: Tracks email verification status
  - `verificationToken`: Used for email verification links

---

### Categories Table
```sql
CREATE TABLE categories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    userId INT,
    name VARCHAR(100) NOT NULL,
    type ENUM('expense', 'income') NOT NULL,
    FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
);
```
- **Purpose**: Allows users to create custom categories for organizing transactions
- **Key Fields**:
  - `type`: Differentiates between income and expense categories
  - `userId`: Ensures user-specific categories

---

### Transactions Table
```sql
CREATE TABLE transactions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    userId INT NOT NULL,
    categoryId INT,
    type ENUM('expense', 'income') NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    description VARCHAR(255),
    frequency ENUM('one-time','weekly','monthly') DEFAULT 'one-time',
    transactionDate DATE NOT NULL,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (categoryId) REFERENCES categories(id) ON DELETE SET NULL
);
```
- **Purpose**: Records all financial transactions (income and expenses)
- **Key Fields**:
  - `frequency`: Supports recurring transactions
  - `categoryId`: Can be NULL (transactions exist without category assignment)

---

### Budgets Table
```sql
CREATE TABLE budgets (
    id INT AUTO_INCREMENT PRIMARY KEY,
    userId INT NOT NULL,
    categoryId INT NOT NULL,
    monthlyLimit DECIMAL(10,2) NOT NULL,
    month INT NOT NULL,
    year INT NOT NULL,
    FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (categoryId) REFERENCES categories(id) ON DELETE CASCADE
);
```
- **Purpose**: Tracks monthly spending limits per category
- **Key Fields**:
  - `monthlyLimit`: Budget ceiling for the category-month combination
  - `month` + `year`: Composite key for specific budget period

---

### Entity Relationship Diagram
```
┌─────────────────────┐
│      USERS          │
├─────────────────────┤
│ id (PK)             │
│ fullName            │
│ email (UNIQUE)      │
│ hashedPassword      │
│ isVerified          │
│ verificationToken   │
│ createdAt           │
└──────┬──────────────┘
       │ 1:Many
       │
       ├─────────────────────────┬─────────────────────────┐
       │                         │                         │
       │ 1:Many                  │ 1:Many                  │ 1:Many
       ▼                         ▼                         ▼
┌────────────────┐       ┌──────────────────┐      ┌──────────────┐
│  CATEGORIES    │       │  TRANSACTIONS    │      │   BUDGETS    │
├────────────────┤       ├──────────────────┤      ├──────────────┤
│ id (PK)        │       │ id (PK)          │      │ id (PK)      │
│ userId (FK)    │       │ userId (FK)      │      │ userId (FK)  │
│ name           │       │ categoryId (FK)  │      │ categoryId   │
│ type           │       │ type             │      │ monthlyLimit │
└────────────────┘       │ amount           │      │ month        │
                         │ description      │      │ year         │
                         │ frequency        │      └──────────────┘
                         │ transactionDate  │
                         │ createdAt        │
                         └──────────────────┘
```

---

## Client-Side Structure

### Folder Organization
```
client/
├── src/
│   ├── pages/                 # Page components (route-level)
│   │   ├── Landing.jsx       # Public landing page
│   │   ├── Login.jsx         # Login page
│   │   ├── Register.jsx      # Registration page
│   │   ├── VerifyEmail.jsx   # Email verification page
│   │   ├── Dashboard.jsx     # Main dashboard (protected)
│   │   ├── Transactions.jsx  # Transaction management (protected)
│   │   └── Budgets.jsx       # Budget management (protected)
│   │
│   ├── components/           # Reusable UI components
│   │   ├── common/
│   │   │   └── Sidebar.jsx   # Navigation sidebar
│   │   ├── dashboard/        # Dashboard-specific components
│   │   ├── transactions/     # Transaction components
│   │   └── budget/           # Budget-related components
│   │
│   ├── store/                # State management
│   │   └── authStore.js      # Zustand auth store (user, token)
│   │
│   ├── services/             # API communication
│   │   └── api.js            # Axios instance and API calls
│   │
│   ├── hooks/                # Custom React hooks
│   ├── utils/                # Utility functions
│   ├── assets/               # Images and static files
│   ├── App.jsx               # Root component & routing
│   ├── App.css               # App-level styles
│   ├── main.jsx              # React entry point
│   └── global.css            # Global styles
│
├── index.html                # HTML template
├── package.json              # Dependencies
├── vite.config.js            # Vite configuration
├── eslint.config.js          # Linting rules
├── vercel.json               # Vercel deployment config
└── README.md
```

### Authentication Flow
```
1. User visits /register → Register.jsx
   └─ Enters: fullName, email, password
   └─ API Call: POST /api/auth/register
   └─ Response: Verification email sent

2. User clicks verification link
   └─ Redirects to: /verify-email?token=...
   └─ VerifyEmail.jsx processes token
   └─ API Call: GET /api/auth/verify-email?token=...
   └─ User account verified

3. User visits /login → Login.jsx
   └─ Enters: email, password
   └─ API Call: POST /api/auth/login
   └─ Response: { user, token }
   └─ Store in Zustand & localStorage

4. Zustand authStore.login() called
   └─ Saves user & token to localStorage
   └─ Sets state { user, token }
   └─ Protected routes (useEffect checks token)

5. Protected Routes
   └─ /dashboard checks: token ? <Dashboard /> : <Navigate to="/login" />
   └─ Same for /transactions and /budgets
```

### State Management (Zustand)
```javascript
useAuthStore
├── State:
│   ├── user: JSON from localStorage (null if not logged in)
│   └── token: JWT token from localStorage
│
├── Actions:
│   ├── login(user, token): Save to localStorage & state
│   └── logout(): Clear localStorage & state
```

---

## Server-Side Structure

### Folder Organization
```
server/
├── src/
│   ├── routes/               # API route definitions
│   │   ├── authRoutes.js    # Auth endpoints
│   │   ├── transactionRoutes.js
│   │   ├── budgetRoutes.js
│   │   ├── categoryRoutes.js
│   │   └── dashboardRoutes.js
│   │
│   ├── controllers/          # Request handlers
│   │   ├── authController.js
│   │   ├── transactionController.js
│   │   ├── budgetController.js
│   │   ├── categoryController.js
│   │   └── dashboardController.js
│   │
│   ├── services/             # Business logic
│   │   ├── authService.js
│   │   ├── transactionService.js
│   │   ├── budgetService.js
│   │   ├── categoryService.js
│   │   ├── dashboardService.js
│   │   └── emailService.js
│   │
│   ├── middleware/           # Express middleware
│   │   └── authMiddleware.js # JWT verification & protection
│   │
│   ├── config/               # Configuration
│   │   └── db.js            # MySQL connection
│   │
│   ├── utils/                # Utility functions
│   │   ├── apiResponse.js    # Response formatting
│   │   └── generateToken.js  # JWT generation
│   │
│   └── app.js                # Express app setup
│
├── database/                 # Database scripts
│   ├── seeds/               # Seed data
│   └── stored-procedures/   # SQL procedures
│
├── tests/                    # Jest test files
│   ├── auth.test.js
│   ├── budget.test.js
│   └── transaction.test.js
│
├── package.json
└── README.md
```

### Request/Response Pipeline

```
HTTP Request
    ↓
Express Middleware (CORS, JSON parsing)
    ↓
Route Handler (authRoutes.js, etc.)
    ↓
Authentication Middleware (protect - verifies JWT)
    ↓
Controller (e.g., transactionController.js)
    ├─ Validate input (express-validator)
    ├─ Call Service layer
    └─ Format response
    ↓
Service Layer (e.g., transactionService.js)
    ├─ Execute business logic
    ├─ Database queries (MySQL)
    └─ Handle errors
    ↓
Response Formatter (apiResponse.js)
    ├─ successResponse(res, status, message, data)
    └─ errorResponse(res, status, message)
    ↓
HTTP Response (JSON)
```

---

## API Endpoints

### Authentication Endpoints

#### POST /api/auth/register
**Register a new user**
- **Request Body:**
  ```json
  {
    "fullName": "John Doe",
    "email": "john@example.com",
    "password": "password123"
  }
  ```
- **Response:**
  ```json
  {
    "success": true,
    "message": "Please check your email for verification link"
  }
  ```
- **Status Codes:** 
  - 201 Created
  - 409 Conflict (email exists)
  - 400 Bad Request (missing fields)
  - 500 Server Error

---

#### GET /api/auth/verify-email
**Verify user email with token**
- **Query Parameters:**
  - `token` (required): Email verification token
- **Response:**
  ```json
  {
    "success": true,
    "message": "Verification success"
  }
  ```
- **Status Codes:**
  - 200 OK
  - 403 Forbidden (invalid/expired token)
  - 400 Bad Request (missing token)

---

#### POST /api/auth/login
**Authenticate user and receive JWT token**
- **Request Body:**
  ```json
  {
    "email": "john@example.com",
    "password": "password123"
  }
  ```
- **Response:**
  ```json
  {
    "success": true,
    "message": "Login success",
    "data": {
      "user": { "id": 1, "fullName": "John Doe", "email": "john@example.com" },
      "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
    }
  }
  ```
- **Status Codes:**
  - 201 Created
  - 401 Unauthorized (invalid credentials)
  - 403 Forbidden (email not verified)
  - 400 Bad Request (missing fields)

---

### Transaction Endpoints

#### POST /api/transactions
**Create a new transaction**
- **Authentication:** Required (Bearer token)
- **Request Body:**
  ```json
  {
    "categoryId": 1,
    "type": "expense",
    "amount": 150.50,
    "description": "Grocery shopping",
    "frequency": "one-time",
    "transactionDate": "2026-03-15"
  }
  ```
- **Response:** Transaction object with ID
- **Status Codes:** 201 Created, 401 Unauthorized, 400 Bad Request

---

#### GET /api/transactions
**Fetch all transactions for authenticated user**
- **Authentication:** Required
- **Response:**
  ```json
  {
    "success": true,
    "data": [
      {
        "id": 1,
        "userId": 1,
        "categoryId": 1,
        "type": "expense",
        "amount": 150.50,
        "description": "Grocery shopping",
        "frequency": "one-time",
        "transactionDate": "2026-03-15",
        "createdAt": "2026-03-15T10:30:00Z"
      }
    ]
  }
  ```
- **Status Codes:** 200 OK, 401 Unauthorized

---

#### PUT /api/transactions/:id
**Edit an existing transaction**
- **Authentication:** Required
- **Parameters:** 
  - `id` (required): Transaction ID
- **Request Body:** Same as POST with fields to update
- **Response:** Updated transaction object
- **Status Codes:** 200 OK, 401 Unauthorized, 404 Not Found

---

#### DELETE /api/transactions/:id
**Delete a transaction**
- **Authentication:** Required
- **Parameters:**
  - `id` (required): Transaction ID
- **Response:**
  ```json
  {
    "success": true,
    "message": "Transaction deleted"
  }
  ```
- **Status Codes:** 200 OK, 401 Unauthorized, 404 Not Found

---

### Category Endpoints

#### POST /api/categories
**Create a new category**
- **Authentication:** Required
- **Request Body:**
  ```json
  {
    "name": "Groceries",
    "type": "expense"
  }
  ```
- **Response:** Category object with ID
- **Status Codes:** 201 Created, 401 Unauthorized

---

#### GET /api/categories
**Fetch all categories for authenticated user**
- **Authentication:** Required
- **Response:**
  ```json
  {
    "success": true,
    "data": [
      {
        "id": 1,
        "userId": 1,
        "name": "Groceries",
        "type": "expense"
      }
    ]
  }
  ```
- **Status Codes:** 200 OK, 401 Unauthorized

---

#### DELETE /api/categories/:id
**Delete a category**
- **Authentication:** Required
- **Parameters:**
  - `id` (required): Category ID
- **Process:**
  1. Generates database transaction
  2. Sets transactions.categoryId to NULL
  3. Deletes associated budgets
  4. Deletes the category
- **Response:**
  ```json
  {
    "success": true,
    "message": "Category deleted"
  }
  ```
- **Status Codes:** 200 OK, 401 Unauthorized, 404 Not Found

---

### Budget Endpoints

#### POST /api/budgets
**Create or update a budget**
- **Authentication:** Required
- **Request Body:**
  ```json
  {
    "categoryId": 1,
    "monthlyLimit": 500.00,
    "month": 3,
    "year": 2026
  }
  ```
- **Response:** Budget object
- **Status Codes:** 201 Created, 200 OK (update), 401 Unauthorized

---

#### GET /api/budgets
**Fetch all budgets for authenticated user**
- **Authentication:** Required
- **Response:**
  ```json
  {
    "success": true,
    "data": [
      {
        "id": 1,
        "userId": 1,
        "categoryId": 1,
        "monthlyLimit": 500.00,
        "month": 3,
        "year": 2026
      }
    ]
  }
  ```
- **Status Codes:** 200 OK, 401 Unauthorized

---

#### DELETE /api/budgets/:id
**Delete a budget**
- **Authentication:** Required
- **Parameters:**
  - `id` (required): Budget ID
- **Response:**
  ```json
  {
    "success": true,
    "message": "Budget deleted"
  }
  ```
- **Status Codes:** 200 OK, 401 Unauthorized, 404 Not Found

---

### Dashboard Endpoints

#### GET /api/dashboard
**Fetch dashboard data (analytics)**
- **Authentication:** Required
- **Response:**
  ```json
  {
    "success": true,
    "data": {
      "totalIncome": 5000.00,
      "totalExpense": 2500.00,
      "balance": 2500.00,
      "categoryBreakdown": [
        { "category": "Groceries", "amount": 500, "percentage": 20 }
      ],
      "monthlyTrend": [
        { "month": "Jan", "income": 5000, "expense": 2000 }
      ]
    }
  }
  ```
- **Status Codes:** 200 OK, 401 Unauthorized

---

## Setup & Deployment

### Local Development Setup

#### Prerequisites
- Node.js 16+ and npm
- MySQL Server 8.0+
- Git

#### Backend Setup
```bash
# 1. Navigate to server directory
cd server

# 2. Install dependencies
npm install

# 3. Create .env file
touch .env
```

**.env Configuration:**
```env
PORT=5000
DATABASE_HOST=localhost
DATABASE_USER=root
DATABASE_PASSWORD=password
DATABASE_NAME=railway
JWT_SECRET=your_jwt_secret_key
VERIFICATION_EMAIL_TOKEN=your_email_token
CLIENT_URL=http://localhost:5173
RESEND_API_KEY=your_resend_api_key
```

```bash
# 4. Run database setup script
# Execute DB_QUERIES/Create Queries.sql in MySQL

# 5. Start development server
npm run dev          # With nodemon (auto-reload)
# OR
npm start           # Direct node command

# 6. Run tests (optional)
npm test
npm run test:coverage
```

#### Frontend Setup
```bash
# 1. Navigate to client directory
cd client

# 2. Install dependencies
npm install

# 3. Create .env file (if needed for API configuration)
touch .env.local
```

**.env.local Configuration:**
```env
VITE_API_URL=http://localhost:5000
```

```bash
# 4. Start development server
npm run dev

# Server runs at http://localhost:5173
```

### Production Deployment

#### Backend (Vercel/Railway)
```bash
# 1. Ensure package.json has correct start script
"start": "node src/app.js"

# 2. Set environment variables on hosting platform:
#    - DATABASE_HOST, DATABASE_USER, DATABASE_PASSWORD, DATABASE_NAME
#    - JWT_SECRET, RESEND_API_KEY, CLIENT_URL, PORT

# 3. Deploy
# Vercel: git push to main branch
# Railway: Connect GitHub repo and auto-deploy
```

#### Frontend (Vercel)
```bash
# 1. Build production bundle
npm run build

# 2. Output in dist/ folder

# 3. Deploy to Vercel
# Option A: Via CLI
vercel deploy --prod

# Option B: Push to GitHub (Vercel auto-deploys)
git push origin main
```

**vercel.json Configuration:**
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "env": {
    "VITE_API_URL": "@api_url"
  }
}
```

### Environment Variables Complete List

**Backend (.env)**
```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database
DATABASE_HOST=railway.app
DATABASE_USER=admin
DATABASE_PASSWORD=secure_password
DATABASE_NAME=railway
DATABASE_PORT=3306

# Authentication
JWT_SECRET=secure_random_jwt_secret_key_min_32_chars
VERIFICATION_EMAIL_TOKEN=verification_token_secret

# Email Service
RESEND_API_KEY=re_xxxxxxxxxxxxx

# Client
CLIENT_URL=https://yourdomain.com
```

**Frontend (.env.local)**
```env
VITE_API_URL=https://api.yourdomain.com
VITE_APP_NAME=Personal Finance Tracker
```

---

## Key Implementation Details

### Authentication Flow
1. **Password Security**: Uses bcryptjs for hashing (salting)
2. **Email Verification**: Token-based verification via Resend API
3. **JWT Tokens**: Stateless authentication with `JsonWebToken`
4. **Protected Routes**: `authMiddleware` verifies token on protected endpoints

### Category Deletion Strategy
- Uses database transactions for data consistency
- Sets `transactions.categoryId` to NULL (not deleted)
- Cascading delete removes associated budgets
- Prevents orphaned data issues

### Category SOLID Principles
- **Single Responsibility**: Controllers handle requests, Services handle logic
- **Dependency Inversion**: Services depend on abstractions via middleware
- **Separation of Concerns**: Middleware, Controllers, Services separated

---

## Testing

### Test Files Available
- **auth.test.js**: Authentication endpoints
- **budget.test.js**: Budget CRUD operations
- **transaction.test.js**: Transaction management

### Running Tests
```bash
# Run all tests with watch mode
npm test

# Run with coverage report
npm run test:coverage
```

---

## Application Flow Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                   USER ACCESS FLOW                          │
└─────────────────────────────────────────────────────────────┘

PUBLIC ROUTES:
  / (Landing) → /register → /verify-email → /login
       ↓
    Register form email → Email verification link → Verify email

AUTHENTICATED ROUTES (require JWT token):
  /dashboard  → Overview, total income/expense, trends
       ↓
  /transactions → View, create, edit, delete transactions
       ↓
  /budgets → Set monthly limits, track spending vs budget
       ↓
  /categories → Manage transaction categories

LOGOUT → Clear token from localStorage → Redirect to /login
```

---

## Performance & Best Practices

### Frontend Optimization
- **Code Splitting**: Lazy loading pages with React Router
- **State Management**: Zustand for lightweight global state
- **HTTP Caching**: Axios configuration for request/response handling
- **Styling**: Tailwind CSS for utility-first approach

### Backend Optimization
- **Service Pattern**: Separates business logic from controllers
- **Middleware**: Authentication checks on protected routes
- **Database**: Foreign key relationships for data integrity
- **Error Handling**: Consistent API response format

### Security
- **Password Hashing**: bcryptjs with salt rounds
- **JWT Tokens**: Secure, stateless authentication
- **CORS**: Controlled cross-origin access
- **Input Validation**: express-validator on all inputs
- **Environment Variables**: Sensitive data in .env files

---

## Common API Patterns

### Success Response Format
```json
{
  "success": true,
  "message": "Operation successful",
  "data": { /* actual data */ }
}
```

### Error Response Format
```json
{
  "success": false,
  "message": "Error description"
}
```

### HTTP Status Code Conventions
- **200 OK**: Successful GET request
- **201 Created**: Successful POST/PUT (resource created)
- **400 Bad Request**: Invalid input or missing fields
- **401 Unauthorized**: Missing or invalid authentication token
- **403 Forbidden**: Authenticated but not authorized
- **404 Not Found**: Resource doesn't exist
- **409 Conflict**: Resource already exists (email duplicate)
- **500 Server Error**: Internal server error

---

## Development Tips

### Debugging
1. **Backend**: Use `console.log()` or `NODE_DEBUG=* npm run dev`
2. **Frontend**: Browser DevTools, React DevTools extension
3. **Database**: MySQL Workbench or CLI queries
4. **Network**: Use Postman/Insomnia for API testing

### Common Issues & Solutions

| Issue | Solution |
|-------|----------|
| CORS Error | Check `CLIENT_URL` in .env matches frontend origin |
| JWT Verification Fails | Ensure token is sent with `Authorization: Bearer <token>` |
| Email Verification Loop | Check Resend API key and `VERIFICATION_EMAIL_TOKEN` |
| Database Connection Error | Verify DATABASE_* variables and MySQL server status |
| Category Deletion Error | Ensure transaction handling is implemented correctly |

---

## File Purpose Reference

| File | Purpose |
|------|---------|
| authStore.js | Zustand store for user authentication state |
| `authService.js` | Business logic for registration, login, verification |
| `authMiddleware.js` | JWT verification middleware for protected routes |
| `apiResponse.js` | Standardized response formatting utility |
| `generateToken.js` | JWT token generation utility |
| `db.js` | MySQL database connection configuration |
| `vite.config.js` | Vite build and dev server configuration |
| `eslint.config.js` | Code quality and style rules |
| package.json | Dependencies and scripts configuration |

---

**Last Updated:** March 15, 2026

This documentation covers the complete architecture, database schema, API endpoints, and setup instructions for the Personal Finance Tracker application. Refer to this guide for development, debugging, and deployment scenarios.
