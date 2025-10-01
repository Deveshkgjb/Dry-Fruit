# Dynamic Product Pages System

## Overview
The dynamic product pages system allows administrators to create new product category pages through the admin panel without requiring code changes. These pages are automatically accessible via their routes and display products from the corresponding category.

## Features

### 1. Dynamic Route Generation
- **Catch-all Route**: `/:slug` route in `App.jsx` handles all new product pages
- **Automatic Routing**: New pages are immediately accessible via their defined routes
- **No Code Changes**: No need to modify `App.jsx` for new product pages

### 2. Admin Panel Integration
- **Page Management**: Create, edit, and delete product pages through admin interface
- **Route Definition**: Specify custom routes for each product page
- **Content Management**: Edit page content, meta descriptions, and SEO settings

### 3. Dynamic Product Display
- **Category-based Filtering**: Products are automatically filtered by category
- **Search and Filter**: Full search and filtering capabilities
- **Responsive Design**: Mobile-friendly product grid layout

## Implementation

### Frontend Components

#### 1. DynamicProductPage.jsx
```javascript
// Main component for rendering dynamic product pages
const DynamicProductPage = () => {
  const { slug } = useParams();
  // Fetches products based on category slug
  // Provides search, filter, and sort functionality
  // Renders product grid with consistent styling
};
```

#### 2. App.jsx Route Configuration
```javascript
// Catch-all route for dynamic product pages (must be last)
<Route path="/:slug" element={<DynamicProductPage />} />
```

#### 3. PageManagement.jsx Updates
- Added `dynamicProductPages` state
- Integrated with `pageAPI.getProductPages()`
- Displays both static and dynamic product pages
- Handles creation, editing, and deletion of dynamic pages

### Backend Integration

#### 1. pageAPI.js Updates
```javascript
// Store product pages in localStorage (development)
createProductPage: async (productData) => {
  const existingPages = JSON.parse(localStorage.getItem('productPages') || '[]');
  const newPage = {
    id: Date.now().toString(),
    ...productData,
    route: productData.route || `/${productData.name.toLowerCase().replace(/\s+/g, '-')}`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  existingPages.push(newPage);
  localStorage.setItem('productPages', JSON.stringify(existingPages));
  return { success: true, product: newPage };
}
```

#### 2. Product API Integration
- Fetches products by category slug
- Supports filtering, sorting, and search
- Provides fallback data for development

## Usage Instructions

### Creating a New Product Page

1. **Access Admin Panel**
   - Go to `/admin-login`
   - Login with admin credentials
   - Navigate to "Page Management" tab

2. **Add New Product Page**
   - Click "Add New Product Page" button
   - Fill in the form:
     - **Product Name**: e.g., "Macadamia Nuts"
     - **Category**: Select from dropdown
     - **Route**: e.g., "/macadamia-nuts" (auto-generated)
     - **Description**: Brief description
     - **Page Title**: SEO title
     - **Meta Description**: SEO description

3. **Save and Access**
   - Click "Create Product Page"
   - The page is immediately accessible at the defined route
   - Use "Preview Page" to test the new page

### Managing Existing Pages

1. **Edit Page Settings**
   - Click "Edit Page" on any product page card
   - Modify name, category, route, or description
   - Save changes

2. **Edit Content**
   - Click "Edit Content" to modify page content
   - Update SEO settings, descriptions, etc.

3. **Preview and Delete**
   - Use "Preview Page" to open the page in a new tab
   - Use "Delete" to remove the page (with confirmation)

## Route Structure

### Static Routes (Hardcoded)
- `/almonds` → Almonds component
- `/cashews` → Cashews component
- `/pistachios` → Pistachios component
- etc.

### Dynamic Routes (Generated)
- `/macadamia-nuts` → DynamicProductPage component
- `/hazelnuts` → DynamicProductPage component
- `/pecans` → DynamicProductPage component
- etc.

## Product Display Features

### 1. Search and Filter
- **Search Bar**: Search by product name or description
- **Price Range**: Slider for price filtering
- **Size Filter**: Checkbox filters for different sizes
- **Category Filter**: Dropdown for category selection

### 2. Sorting Options
- **Featured**: Default sorting
- **Price: Low to High**: Ascending price order
- **Price: High to Low**: Descending price order
- **Customer Rating**: Sort by average rating
- **Newest**: Sort by creation date

### 3. Product Cards
- **Product Image**: Main product image with fallback
- **Product Name**: Truncated with full name on hover
- **Price Display**: Current price with original price (if on sale)
- **Size Information**: Available sizes and pricing
- **Rating Display**: Star rating with review count
- **Badges**: Best seller, popular, premium badges
- **Add to Cart**: Direct add to cart functionality

## Data Storage

### Development (localStorage)
- Product pages stored in `localStorage` as JSON
- Key: `'productPages'`
- Persists across browser sessions
- Easy to inspect and debug

### Production (Backend)
- Product pages stored in database
- API endpoints for CRUD operations
- User authentication and authorization
- Data validation and error handling

## Benefits

1. **No Code Deployment**: Create new pages without code changes
2. **Consistent Design**: All pages use the same responsive layout
3. **SEO Friendly**: Custom meta titles and descriptions
4. **Admin Friendly**: Easy-to-use interface for content management
5. **Scalable**: Can handle unlimited product categories
6. **Maintainable**: Single component handles all dynamic pages

## Future Enhancements

1. **Backend Integration**: Move from localStorage to database
2. **Custom Layouts**: Allow different page layouts per category
3. **Banner Management**: Custom banners and promotional content
4. **Analytics**: Track page views and user interactions
5. **A/B Testing**: Test different page layouts and content
6. **Bulk Operations**: Import/export product page configurations

## Troubleshooting

### Common Issues

1. **Page Not Loading**
   - Check if route is correctly defined
   - Verify the dynamic route is placed last in `App.jsx`
   - Check browser console for errors

2. **Products Not Showing**
   - Verify category name matches product categories
   - Check if products exist for the category
   - Review API response in browser network tab

3. **Admin Panel Issues**
   - Clear localStorage if pages don't appear
   - Check browser console for JavaScript errors
   - Verify pageAPI functions are working

### Debug Steps

1. **Check localStorage**
   ```javascript
   console.log(JSON.parse(localStorage.getItem('productPages')));
   ```

2. **Verify Route Registration**
   - Check `App.jsx` for dynamic route placement
   - Ensure route is after all specific routes

3. **Test API Calls**
   - Check network tab for failed requests
   - Verify API endpoints are responding
   - Check for CORS issues

## Security Considerations

1. **Route Validation**: Validate route format and prevent conflicts
2. **Input Sanitization**: Sanitize all user inputs
3. **Access Control**: Ensure only admins can create/edit pages
4. **Rate Limiting**: Prevent abuse of page creation
5. **Data Validation**: Validate all form inputs server-side
