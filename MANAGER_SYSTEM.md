# Manager System - Category-Based Product Management

## Overview
The manager system allows users with "manager" role to edit products within their assigned categories. This provides controlled access to product management without giving full admin privileges.

## Features

### 1. Role-Based Access Control
- **Admin**: Full access to all products and categories
- **Manager**: Limited access to assigned categories only
- **Customer**: Read-only access to products

### 2. Manager Authentication
- Separate login system for managers
- JWT token-based authentication
- Role verification on login

### 3. Category Assignment
- Managers are assigned specific categories they can manage
- Each manager can only see/edit products in their assigned categories
- Admin can assign categories to managers

## Backend Implementation

### User Model Updates
```javascript
role: {
  type: String,
  enum: ['customer', 'admin', 'manager'],
  default: 'customer'
},
managedCategories: [{
  type: mongoose.Schema.Types.ObjectId,
  ref: 'Category'
}]
```

### Authentication Middleware
- `managerAuth`: Checks if user is manager or admin
- `categoryAccessAuth`: Verifies manager has access to specific category

### Manager API Routes
- `GET /api/manager/categories` - Get manager's assigned categories
- `GET /api/manager/products` - Get products in manager's categories
- `POST /api/manager/products` - Create product (within assigned categories)
- `PUT /api/manager/products/:id` - Update product (within assigned categories)
- `DELETE /api/manager/products/:id` - Delete product (within assigned categories)
- `GET /api/manager/profile` - Get manager profile with categories

## Frontend Implementation

### Manager Login
- **Route**: `/manager-login`
- **Component**: `ManagerLogin.jsx`
- **Features**: 
  - Email/password authentication
  - Role verification
  - Demo credentials display

### Manager Dashboard
- **Route**: `/manager-dashboard`
- **Component**: `ManagerDashboard.jsx`
- **Features**:
  - Product management for assigned categories
  - Category overview
  - Add/edit/delete products
  - Search and filter functionality

### Manager Auth Guard
- **Component**: `ManagerAuthGuard.jsx`
- **Features**:
  - Route protection
  - Token validation
  - Automatic redirect to login

## Demo Manager Accounts

### Nuts Manager
- **Email**: `nuts.manager@happilo.com`
- **Password**: `manager123`
- **Categories**: Almonds, Cashews

### Berries Manager
- **Email**: `berries.manager@happilo.com`
- **Password**: `manager123`
- **Categories**: Blueberries, Cranberries

### Seeds Manager
- **Email**: `seeds.manager@happilo.com`
- **Password**: `manager123`
- **Categories**: Chia Seeds

## Security Features

### 1. Category Access Control
- Managers can only access products in their assigned categories
- API endpoints verify category permissions
- Frontend filters data based on user permissions

### 2. Token Management
- Separate token storage for managers
- Automatic token validation
- Secure logout functionality

### 3. Input Validation
- Server-side validation for all manager operations
- Category assignment verification
- Product data validation

## Usage Instructions

### For Managers
1. Go to `/manager-login`
2. Use demo credentials or your assigned credentials
3. Access your dashboard to manage products in assigned categories
4. Add, edit, or delete products within your scope

### For Admins
1. Use admin panel to assign categories to managers
2. Monitor manager activities
3. Override manager permissions if needed

## API Endpoints

### Authentication
```
POST /api/auth/login
GET /api/manager/profile
```

### Category Management
```
GET /api/manager/categories
```

### Product Management
```
GET /api/manager/products
GET /api/manager/products/:id
POST /api/manager/products
PUT /api/manager/products/:id
DELETE /api/manager/products/:id
```

## Benefits

1. **Controlled Access**: Managers can only edit products in their assigned categories
2. **Scalability**: Easy to add new managers with specific category assignments
3. **Security**: Role-based permissions prevent unauthorized access
4. **Efficiency**: Managers focus on their area of expertise
5. **Audit Trail**: All changes are tracked and can be monitored

## Future Enhancements

1. **Category Assignment UI**: Admin interface to assign categories to managers
2. **Activity Logs**: Track manager actions and changes
3. **Bulk Operations**: Allow managers to perform bulk updates
4. **Approval Workflow**: Require admin approval for certain changes
5. **Performance Metrics**: Track manager productivity and category performance
