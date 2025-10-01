# Happilo E-commerce Backend

A comprehensive Node.js backend for the Happilo dry fruits e-commerce platform.

## Features

- **Authentication & Authorization**: JWT-based auth with role-based access
- **Product Management**: CRUD operations for products with categories and variants
- **Order Management**: Complete order lifecycle with status tracking
- **Review System**: Customer reviews with admin moderation
- **Admin Dashboard**: Analytics, inventory management, and user administration
- **Cart Management**: Shopping cart functionality
- **Search & Filtering**: Advanced product search and filtering

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (v4.4 or higher)

## Installation

1. Clone the repository and navigate to backend directory:
```bash
cd /Users/deveshfuloria/Dry-fruits/backend
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
# Copy .env file and update values as needed
cp .env.example .env
```

4. Start MongoDB:
```bash
# On macOS with Homebrew
brew services start mongodb-community

# Or manually
mongod --dbpath /path/to/your/mongodb/data
```

5. Seed the database with sample data:
```bash
npm run seed
```

6. Start the development server:
```bash
npm run dev
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile` - Update user profile

### Products
- `GET /api/products` - Get all products with filters
- `GET /api/products/:id` - Get single product
- `POST /api/products` - Create product (Admin)
- `PUT /api/products/:id` - Update product (Admin)
- `DELETE /api/products/:id` - Delete product (Admin)

### Orders
- `GET /api/orders` - Get user orders / all orders (Admin)
- `POST /api/orders` - Create new order
- `PUT /api/orders/:id/status` - Update order status (Admin)

### Reviews
- `GET /api/reviews/product/:productId` - Get product reviews
- `POST /api/reviews` - Create review
- `PUT /api/reviews/:id/status` - Update review status (Admin)

### Admin
- `GET /api/admin/dashboard` - Dashboard statistics
- `GET /api/admin/analytics` - Analytics data
- `GET /api/admin/inventory` - Inventory status

## Default Admin Credentials

```
Email: admin@happilo.com
Password: admin123
```

## Project Structure

```
backend/
├── models/          # Mongoose models
├── routes/          # Express routes
├── middleware/      # Custom middleware
├── seeders/         # Database seeders
├── uploads/         # File uploads
├── server.js        # Main server file
└── .env            # Environment variables
```

## Environment Variables

```
MONGODB_URI=mongodb://localhost:27017/happilo_ecommerce
JWT_SECRET=your_jwt_secret_here
PORT=5000
NODE_ENV=development
```

## Testing

The API can be tested using tools like Postman or curl. Sample requests:

### Register User
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","password":"password123"}'
```

### Get Products
```bash
curl http://localhost:5000/api/products
```

### Login (Admin)
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@happilo.com","password":"admin123"}'
```

## MongoDB Setup

If MongoDB is not installed:

### macOS (using Homebrew)
```bash
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb-community
```

### Ubuntu/Debian
```bash
sudo apt update
sudo apt install mongodb
sudo systemctl start mongodb
```

### Windows
Download and install from [MongoDB official website](https://www.mongodb.com/download-center/community)

## Production Deployment

1. Set NODE_ENV to 'production'
2. Use a proper MongoDB connection string (MongoDB Atlas or hosted instance)
3. Set strong JWT secret
4. Use PM2 or similar process manager
5. Set up proper logging and monitoring
6. Configure CORS for your frontend domain

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the ISC License.
