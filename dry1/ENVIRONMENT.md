# Environment Configuration

This document explains how to configure environment variables for the Happilo frontend application.

## Environment Files

The application uses the following environment files in order of priority:

1. `.env.local` - Local development overrides (ignored by git)
2. `.env.development` - Development environment
3. `.env.production` - Production environment
4. `.env` - Default environment variables

## Required Environment Variables

### API Configuration
```bash
VITE_API_BASE_URL=http://localhost:5000/api
```
- **Description**: Base URL for the backend API
- **Development**: `http://localhost:5000/api`
- **Production**: `https://your-api-domain.com/api`

### App Configuration
```bash
VITE_APP_NAME=Happilo
VITE_APP_VERSION=1.0.0
VITE_NODE_ENV=development
```

## Optional Environment Variables

### Debug & Development
```bash
VITE_ENABLE_DEBUG=true          # Enable debug logging
VITE_ENABLE_ANALYTICS=false     # Enable analytics tracking
```

### Request Configuration
```bash
VITE_REQUEST_TIMEOUT=10000      # API request timeout in milliseconds
VITE_DEFAULT_PAGE_SIZE=12       # Default pagination size
VITE_MAX_PAGE_SIZE=100          # Maximum pagination size
```

### File Upload
```bash
VITE_MAX_FILE_SIZE=5000000      # Maximum file size in bytes (5MB)
```

### Cache Configuration
```bash
VITE_CACHE_DURATION=300000      # Cache duration in milliseconds (5 minutes)
```

### External Services
```bash
VITE_GOOGLE_ANALYTICS_ID=your_analytics_id
VITE_STRIPE_PUBLISHABLE_KEY=your_stripe_key
```

## Setup Instructions

### Development Environment

1. Copy the example environment file:
```bash
cp .env.production.example .env.local
```

2. Update the values for your development setup:
```bash
# Edit .env.local
VITE_API_BASE_URL=http://localhost:5000/api
VITE_ENABLE_DEBUG=true
```

### Production Environment

1. Create production environment file:
```bash
cp .env.production.example .env.production
```

2. Update with production values:
```bash
# Edit .env.production
VITE_API_BASE_URL=https://your-production-api.com/api
VITE_NODE_ENV=production
VITE_ENABLE_DEBUG=false
VITE_ENABLE_ANALYTICS=true
```

## Environment Variables in Code

Access environment variables in your React components:

```javascript
import config from '../config/environment.js';

// Use configuration
const apiUrl = config.API_BASE_URL;
const isDebug = config.ENABLE_DEBUG;
const appName = config.APP_NAME;
```

## Security Notes

### Frontend Environment Variables
- All `VITE_` prefixed variables are exposed to the browser
- **Never** put sensitive data (API keys, secrets) in frontend environment variables
- Use backend environment variables for sensitive configuration

### Backend Environment Variables
- Backend variables are server-side only
- Use `.env` file in the backend directory
- Never commit sensitive data to version control

## Build Configuration

### Development Build
```bash
npm run dev
```
Uses `.env.local` and `.env.development`

### Production Build
```bash
npm run build
```
Uses `.env.production` and `.env`

## Troubleshooting

### Environment Variables Not Loading
1. Check file naming (must start with `.env`)
2. Restart the development server after changes
3. Verify variable names start with `VITE_`
4. Check for typos in variable names

### API Connection Issues
1. Verify `VITE_API_BASE_URL` is correct
2. Check if backend server is running
3. Verify CORS configuration on backend
4. Check network connectivity

### Debug Mode
Enable debug mode to see detailed API logs:
```bash
VITE_ENABLE_DEBUG=true
```

## Example Configurations

### Local Development
```bash
VITE_API_BASE_URL=http://localhost:5000/api
VITE_ENABLE_DEBUG=true
VITE_ENABLE_ANALYTICS=false
```

### Staging Environment
```bash
VITE_API_BASE_URL=https://staging-api.happilo.com/api
VITE_ENABLE_DEBUG=true
VITE_ENABLE_ANALYTICS=true
```

### Production Environment
```bash
VITE_API_BASE_URL=https://api.happilo.com/api
VITE_ENABLE_DEBUG=false
VITE_ENABLE_ANALYTICS=true
VITE_GOOGLE_ANALYTICS_ID=GA-XXXXXXXXX
```

## Best Practices

1. **Use descriptive names**: Make variable names clear and descriptive
2. **Document defaults**: Always document default values in code
3. **Validate required vars**: Check for required variables at startup
4. **Use type safety**: Parse numeric values with `parseInt()` or `parseFloat()`
5. **Environment-specific configs**: Use different configs for different environments
6. **Secure sensitive data**: Never expose secrets in frontend environment variables
