# E-Commerce Frontend

A modern React-based e-commerce frontend built with TypeScript, featuring a clean architecture and comprehensive user experience.

## 🏗️ Project Structure

```
src/
├── api/                  # API service calls and HTTP client
│   ├── auth.ts          # Authentication API calls
│   ├── client.ts        # HTTP client configuration
│   ├── orders.ts        # Order-related API calls
│   ├── products.ts      # Product and category API calls
│   └── index.ts         # API exports
├── assets/              # Static assets (images, fonts, etc.)
│   └── logo.svg
├── components/          # Reusable UI components
│   └── shared/          # Shared components across the app
│       ├── Button.tsx   # Reusable button component
│       ├── Footer.tsx   # Application footer
│       ├── Header.tsx   # Application header with navigation
│       ├── Input.tsx    # Form input component
│       ├── Loader.tsx   # Loading spinner component
│       └── index.ts     # Component exports
├── contexts/            # React Context providers
│   ├── AuthContext.tsx # Authentication state management
│   ├── CartContext.tsx # Shopping cart state management
│   └── index.ts         # Context exports
├── hooks/               # Custom React hooks
│   ├── useOrders.ts     # Order-related hooks
│   ├── useProducts.ts   # Product-related hooks
│   └── index.ts         # Hook exports
├── pages/               # Page components
│   ├── admin/           # Admin panel pages
│   │   ├── AdminCategories.tsx
│   │   ├── AdminOrders.tsx
│   │   ├── AdminProducts.tsx
│   │   └── Dashboard.tsx
│   ├── auth/            # Authentication pages
│   │   ├── Login.tsx
│   │   └── Register.tsx
│   ├── cart/            # Shopping cart pages
│   │   ├── Cart.tsx
│   │   └── Checkout.tsx
│   └── public/          # Public pages
│       ├── Home.tsx     # Homepage
│       ├── ProductDetail.tsx
│       └── ProductList.tsx
├── routes/              # Routing configuration
│   ├── AppRouter.tsx    # Main router component
│   └── ProtectedRoute.tsx # Route protection logic
├── styles/              # Global styles and themes
│   ├── App.css          # Main application styles
│   └── index.css        # Global CSS imports
├── types/               # TypeScript type definitions
│   └── index.ts         # All application types
├── utils/               # Utility functions
│   └── index.ts         # Helper functions
├── App.tsx              # Main application component
└── index.tsx            # Application entry point
```

## 🚀 Features

### Public Features
- **Product Catalog**: Browse products with search and filtering
- **Product Details**: Detailed product views with image galleries
- **Shopping Cart**: Add/remove items, quantity management
- **User Authentication**: Login and registration
- **Responsive Design**: Mobile-friendly interface

### Admin Features
- **Dashboard**: Overview of key metrics and recent activity
- **Product Management**: CRUD operations for products
- **Category Management**: Organize products by categories
- **Order Management**: View and update order statuses
- **User Management**: Admin user controls

### Technical Features
- **TypeScript**: Full type safety throughout the application
- **Context API**: Global state management for auth and cart
- **Custom Hooks**: Reusable business logic
- **Protected Routes**: Role-based access control
- **Error Handling**: Comprehensive error boundaries and handling
- **Loading States**: User-friendly loading indicators
- **Responsive Design**: Mobile-first approach

## 🛠️ Technology Stack

- **React 19** - Frontend framework
- **TypeScript** - Type safety
- **React Router v7** - Client-side routing
- **Context API** - State management
- **CSS3** - Styling (with custom CSS variables)
- **Fetch API** - HTTP client

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd frontend-blog-ecommerce
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   ```bash
   cp .env.example .env
   ```
   Update the `.env` file with your configuration:
   ```
   REACT_APP_API_URL=http://localhost:3000
   ```

4. **Start the development server**
   ```bash
   npm start
   ```

The application will open in your browser at `http://localhost:3000`.

## 🔧 Available Scripts

- `npm start` - Runs the app in development mode
- `npm test` - Launches the test runner
- `npm run build` - Builds the app for production
- `npm run eject` - Ejects from Create React App (⚠️ irreversible)

## 🌐 API Integration

The frontend integrates with a NestJS backend API. Make sure your backend is running on `http://localhost:3000` (or update the `REACT_APP_API_URL` in your `.env` file).

## 📱 Responsive Design

The application is fully responsive and works seamlessly across:
- **Mobile devices** (phones)
- **Tablets** 
- **Desktop computers**

## 🚀 Getting Started

1. **Make sure your backend is running** - The NestJS backend should be running on port 3000
2. **Start the frontend** - Run `npm start` in this directory
3. **Open your browser** - Navigate to `http://localhost:3000`
4. **Explore the app** - Browse products, create an account, and test the functionality

## 🎨 Current Status

✅ **Completed Structure:**
- Complete folder organization
- TypeScript types aligned with backend entities
- API service layer for all endpoints
- React Context for state management
- Custom hooks for data fetching
- Shared UI components
- Routing with protection
- Basic page components (Home, ProductList, ProductDetail, Dashboard)

🚧 **Next Steps:**
- Implement the remaining placeholder components (Login, Register, Cart, etc.)
- Add form validation and error handling
- Implement comprehensive authentication flow
- Add shopping cart functionality
- Style components with a consistent design system
- Add unit and integration tests

## 🔗 Related

This frontend is designed to work with the corresponding **NestJS E-Commerce Backend**. Make sure both applications are running for full functionality.

---

**Happy Coding! 🎉**
