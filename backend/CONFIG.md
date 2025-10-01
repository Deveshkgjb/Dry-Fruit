# Backend Configuration

The backend now serves configuration to the frontend through the `/api/config` endpoint. This allows the frontend to get all configuration values from the backend environment variables.

## Environment Variables

Create a `.env` file in the backend directory with the following variables:

```env
# Database Configuration
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/database?retryWrites=true&w=majority

# Server Configuration
PORT=5001
NODE_ENV=development

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-here
JWT_EXPIRES_IN=7d

# Cloudinary Configuration (for image uploads)
CLOUDINARY_CLOUD_NAME=your-cloudinary-cloud-name
CLOUDINARY_API_KEY=your-cloudinary-api-key
CLOUDINARY_API_SECRET=your-cloudinary-api-secret

# App Configuration
APP_NAME=Happilo
APP_VERSION=1.0.0
APP_DESCRIPTION=Premium Dry Fruits & Nuts E-commerce Platform

# Frontend Configuration
FRONTEND_URL=http://localhost:5173
API_BASE_URL=http://localhost:5001/api

# File Upload Configuration
MAX_FILE_SIZE=5000000
UPLOAD_PATH=uploads

# Cache Configuration
CACHE_DURATION=300000

# Request Configuration
REQUEST_TIMEOUT=10000

# Pagination Configuration
DEFAULT_PAGE_SIZE=12
MAX_PAGE_SIZE=100

# Feature Flags
ENABLE_ANALYTICS=false
ENABLE_DEBUG=true
ENABLE_CORS=true

# External Services
GOOGLE_ANALYTICS_ID=
STRIPE_PUBLISHABLE_KEY=
STRIPE_SECRET_KEY=
```

## Configuration Endpoint

The backend now exposes a `/api/config` endpoint that returns all configuration values to the frontend:

```json
{
  "success": true,
  "config": {
    "APP_NAME": "Happilo",
    "APP_VERSION": "1.0.0",
    "API_BASE_URL": "http://localhost:5001/api",
    "FRONTEND_URL": "http://localhost:5173",
    "MAX_FILE_SIZE": 5000000,
    "UPLOAD_PATH": "uploads",
    "CACHE_DURATION": 300000,
    "REQUEST_TIMEOUT": 10000,
    "DEFAULT_PAGE_SIZE": 12,
    "MAX_PAGE_SIZE": 100,
    "ENABLE_ANALYTICS": false,
    "ENABLE_DEBUG": true,
    "ENABLE_CORS": true,
    "NODE_ENV": "development",
    "IS_DEVELOPMENT": true,
    "IS_PRODUCTION": false
  }
}
```

## Frontend Integration

The frontend now automatically fetches configuration from the backend on startup. The configuration is merged with any frontend environment variables, with backend values taking precedence.

### How it works:

1. **App Startup**: The frontend calls `initializeConfig()` on app startup
2. **Backend Request**: Makes a request to `/api/config` endpoint
3. **Configuration Merge**: Backend config is merged with frontend fallback config
4. **Loading State**: Shows loading spinner while fetching configuration
5. **Fallback**: If backend is unavailable, uses frontend environment variables

### Benefits:

- ✅ **Centralized Configuration**: All config managed in backend environment
- ✅ **Dynamic Updates**: Can change config without rebuilding frontend
- ✅ **Environment Specific**: Different configs for dev/staging/production
- ✅ **Fallback Support**: Frontend still works if backend is unavailable
- ✅ **Security**: Sensitive config stays on backend, only public values sent to frontend

## Usage

1. Create `.env` file in backend directory with your configuration
2. Restart backend server
3. Frontend will automatically fetch and use the configuration
4. Check browser console for configuration loading logs

## Frontend Usage Examples

### Using Configuration in Components

```javascript
import config from '../config/environment.js';

// Use business configuration
const formatPrice = (price) => {
  return `${config.CURRENCY_SYMBOL}${price.toFixed(2)}`;
};

const calculateTax = (subtotal) => {
  return subtotal * config.TAX_RATE;
};

const calculateShipping = (subtotal) => {
  return subtotal >= config.SHIPPING_FREE_THRESHOLD ? 0 : config.SHIPPING_COST;
};

// Use feature flags
if (config.ENABLE_ANALYTICS) {
  // Initialize analytics
}

// Use API configuration
const apiUrl = config.API_BASE_URL;
```

### Dynamic Configuration Updates

```javascript
import { refreshConfig } from '../config/environment.js';

// Refresh configuration from backend
const updateConfig = async () => {
  try {
    const newConfig = await refreshConfig();
    console.log('Configuration updated:', newConfig);
  } catch (error) {
    console.error('Failed to update configuration:', error);
  }
};
```

### Configuration Categories

The configuration is organized into these categories:

- **App Configuration**: APP_NAME, APP_VERSION, APP_DESCRIPTION, NODE_ENV
- **API Configuration**: API_BASE_URL, FRONTEND_URL, SERVER_PORT, SERVER_HOST
- **File Upload**: MAX_FILE_SIZE, UPLOAD_PATH, UPLOAD_MAX_FILES
- **Cache & Performance**: CACHE_DURATION, REQUEST_TIMEOUT, SESSION_TIMEOUT
- **Pagination**: DEFAULT_PAGE_SIZE, MAX_PAGE_SIZE
- **Feature Flags**: ENABLE_ANALYTICS, ENABLE_DEBUG, ENABLE_CORS
- **Business Configuration**: CURRENCY, CURRENCY_SYMBOL, TAX_RATE, SHIPPING_FREE_THRESHOLD, SHIPPING_COST
- **External Services**: GOOGLE_ANALYTICS_ID, STRIPE_PUBLISHABLE_KEY
