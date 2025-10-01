import React, { useState, useEffect } from 'react';
import { productsAPI, adminAPI } from '../../services/api.js';
import { useNotification } from '../Common/NotificationProvider.jsx';
import config from '../../config/environment.js';

const CategoryManagement = () => {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [editingProduct, setEditingProduct] = useState(null);
  const [showProductForm, setShowProductForm] = useState(false);
  const { showSuccess, showError } = useNotification();

  const [categoryForm, setCategoryForm] = useState({
    name: '',
    description: '',
    icon: '🍇',
    parentCategory: 'nuts',
    healthBenefits: [],
    usageTips: [],
    nutritionalInfo: {}
  });

  const [productForm, setProductForm] = useState({
    name: '',
    description: '',
    categorySlug: '',
    images: [],
    sizes: [{ size: '', price: '', originalPrice: '', stock: '' }],
    badges: [],
    features: [],
    isBestSeller: false,
    isFeatured: false,
    brand: 'Happilo'
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${config.API_BASE_URL}/categories`);
      const data = await response.json();
      setCategories(data.categories || []);
    } catch (error) {
      console.error('Error fetching categories:', error);
      showError('Failed to load categories');
    } finally {
      setLoading(false);
    }
  };

  const fetchProducts = async (categorySlug) => {
    try {
      const response = await fetch(`${config.API_BASE_URL}/products/category/${categorySlug}`);
      const data = await response.json();
      setProducts(data.products || []);
    } catch (error) {
      console.error('Error fetching products:', error);
      showError('Failed to load products');
    }
  };

  const handleCategorySubmit = async (e) => {
    e.preventDefault();
    try {
      const url = editingCategory ? `${config.API_BASE_URL}/categories/${editingCategory._id}` : `${config.API_BASE_URL}/categories`;
      const method = editingCategory ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        },
        body: JSON.stringify(categoryForm)
      });

      const data = await response.json();

      if (data.success) {
        showSuccess(editingCategory ? 'Category updated successfully' : 'Category created successfully');
        setShowAddForm(false);
        setEditingCategory(null);
        setCategoryForm({
          name: '',
          description: '',
          icon: '🍇',
          parentCategory: 'nuts',
          healthBenefits: [],
          usageTips: [],
          nutritionalInfo: {}
        });
        fetchCategories();
      } else {
        showError(data.message || 'Failed to save category');
      }
    } catch (error) {
      console.error('Error saving category:', error);
      showError('Failed to save category');
    }
  };

  const handleProductSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = editingProduct ? `${config.API_BASE_URL}/products/${editingProduct._id}` : `${config.API_BASE_URL}/products`;
      const method = editingProduct ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        },
        body: JSON.stringify(productForm)
      });

      const data = await response.json();

      if (data.success || data.product) {
        showSuccess(editingProduct ? 'Product updated successfully' : 'Product created successfully');
        setShowProductForm(false);
        setEditingProduct(null);
        setProductForm({
          name: '',
          description: '',
          categorySlug: '',
          images: [],
          sizes: [{ size: '', price: '', originalPrice: '', stock: '' }],
          badges: [],
          features: [],
          isBestSeller: false,
          isFeatured: false,
          brand: 'Happilo'
        });
        if (selectedCategory) {
          fetchProducts(selectedCategory.slug);
        }
      } else {
        showError(data.message || 'Failed to save product');
      }
    } catch (error) {
      console.error('Error saving product:', error);
      showError('Failed to save product');
    }
  };

  const handleDeleteCategory = async (categoryId) => {
    if (!window.confirm('Are you sure you want to delete this category?')) return;

    try {
      const response = await fetch(`${config.API_BASE_URL}/categories/${categoryId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        }
      });

      const data = await response.json();

      if (data.success) {
        showSuccess('Category deleted successfully');
        fetchCategories();
      } else {
        showError(data.message || 'Failed to delete category');
      }
    } catch (error) {
      console.error('Error deleting category:', error);
      showError('Failed to delete category');
    }
  };

  const handleDeleteProduct = async (productId) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;

    try {
      const response = await fetch(`${config.API_BASE_URL}/products/${productId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        }
      });

      const data = await response.json();

      if (data.message) {
        showSuccess('Product deleted successfully');
        if (selectedCategory) {
          fetchProducts(selectedCategory.slug);
        }
      } else {
        showError(data.message || 'Failed to delete product');
      }
    } catch (error) {
      console.error('Error deleting product:', error);
      showError('Failed to delete product');
    }
  };

  const addSize = () => {
    setProductForm({
      ...productForm,
      sizes: [...productForm.sizes, { size: '', price: '', originalPrice: '', stock: '' }]
    });
  };

  const removeSize = (index) => {
    const newSizes = productForm.sizes.filter((_, i) => i !== index);
    setProductForm({ ...productForm, sizes: newSizes });
  };

  const updateSize = (index, field, value) => {
    const newSizes = [...productForm.sizes];
    newSizes[index][field] = value;
    setProductForm({ ...productForm, sizes: newSizes });
  };

  const addBadge = () => {
    setProductForm({
      ...productForm,
      badges: [...productForm.badges, { text: '', color: 'red' }]
    });
  };

  const removeBadge = (index) => {
    const newBadges = productForm.badges.filter((_, i) => i !== index);
    setProductForm({ ...productForm, badges: newBadges });
  };

  const updateBadge = (index, field, value) => {
    const newBadges = [...productForm.badges];
    newBadges[index][field] = value;
    setProductForm({ ...productForm, badges: newBadges });
  };

  const addFeature = () => {
    setProductForm({
      ...productForm,
      features: [...productForm.features, '']
    });
  };

  const removeFeature = (index) => {
    const newFeatures = productForm.features.filter((_, i) => i !== index);
    setProductForm({ ...productForm, features: newFeatures });
  };

  const updateFeature = (index, value) => {
    const newFeatures = [...productForm.features];
    newFeatures[index] = value;
    setProductForm({ ...productForm, features: newFeatures });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg text-gray-600">Loading categories...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Category & Product Management</h2>
        <div className="space-x-2">
          <button
            onClick={() => setShowAddForm(true)}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            Add Category
          </button>
          <button
            onClick={() => setShowProductForm(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Add Product
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Categories Section */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">Categories</h3>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {categories.map((category) => (
              <div key={category._id} className="border rounded-lg p-4 hover:bg-gray-50">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-medium flex items-center gap-2">
                      <span>{category.icon}</span>
                      {category.name}
                    </h4>
                    <p className="text-sm text-gray-600 mt-1">{category.description}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      Parent: {category.parentCategory} | Products: {category.productCount || 0}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setEditingCategory(category);
                        setCategoryForm({
                          name: category.name,
                          description: category.description,
                          icon: category.icon,
                          parentCategory: category.parentCategory,
                          healthBenefits: category.healthBenefits || [],
                          usageTips: category.usageTips || [],
                          nutritionalInfo: category.nutritionalInfo || {}
                        });
                        setShowAddForm(true);
                      }}
                      className="text-blue-600 hover:text-blue-800 text-sm"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => {
                        setSelectedCategory(category);
                        fetchProducts(category.slug);
                      }}
                      className="text-green-600 hover:text-green-800 text-sm"
                    >
                      View Products
                    </button>
                    <button
                      onClick={() => handleDeleteCategory(category._id)}
                      className="text-red-600 hover:text-red-800 text-sm"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Products Section */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">
            Products {selectedCategory && `- ${selectedCategory.name}`}
          </h3>
          {selectedCategory ? (
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {products.map((product) => (
                <div key={product._id} className="border rounded-lg p-4 hover:bg-gray-50">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-medium">{product.name}</h4>
                      <p className="text-sm text-gray-600 mt-1 line-clamp-2">{product.description}</p>
                      <div className="flex gap-4 mt-2 text-xs text-gray-500">
                        <span>₹{product.sizes?.[0]?.price || 'N/A'}</span>
                        <span>Rating: {product.rating?.average || 0}/5</span>
                        <span>Stock: {product.sizes?.[0]?.stock || 0}</span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          setEditingProduct(product);
                          setProductForm({
                            name: product.name,
                            description: product.description,
                            categorySlug: product.categorySlug,
                            images: product.images || [],
                            sizes: product.sizes || [{ size: '', price: '', originalPrice: '', stock: '' }],
                            badges: product.badges || [],
                            features: product.features || [],
                            isBestSeller: product.isBestSeller || false,
                            isFeatured: product.isFeatured || false,
                            brand: product.brand || 'Happilo'
                          });
                          setShowProductForm(true);
                        }}
                        className="text-blue-600 hover:text-blue-800 text-sm"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteProduct(product._id)}
                        className="text-red-600 hover:text-red-800 text-sm"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">Select a category to view products</p>
          )}
        </div>
      </div>

      {/* Category Form Modal */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-semibold mb-4">
              {editingCategory ? 'Edit Category' : 'Add New Category'}
            </h3>
            <form onSubmit={handleCategorySubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Name</label>
                <input
                  type="text"
                  value={categoryForm.name}
                  onChange={(e) => setCategoryForm({ ...categoryForm, name: e.target.value })}
                  className="w-full p-3 border rounded-lg"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Description</label>
                <textarea
                  value={categoryForm.description}
                  onChange={(e) => setCategoryForm({ ...categoryForm, description: e.target.value })}
                  className="w-full p-3 border rounded-lg h-24"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Icon</label>
                  <input
                    type="text"
                    value={categoryForm.icon}
                    onChange={(e) => setCategoryForm({ ...categoryForm, icon: e.target.value })}
                    className="w-full p-3 border rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Parent Category</label>
                  <select
                    value={categoryForm.parentCategory}
                    onChange={(e) => setCategoryForm({ ...categoryForm, parentCategory: e.target.value })}
                    className="w-full p-3 border rounded-lg"
                  >
                    <option value="nuts">Nuts</option>
                    <option value="dried-fruits">Dried Fruits</option>
                    <option value="berries">Berries</option>
                    <option value="dates">Dates</option>
                    <option value="seeds">Seeds</option>
                    <option value="mixes">Mixes</option>
                    <option value="new-launches">New Launches</option>
                  </select>
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddForm(false);
                    setEditingCategory(null);
                  }}
                  className="px-4 py-2 border rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                >
                  {editingCategory ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Product Form Modal */}
      {showProductForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-semibold mb-4">
              {editingProduct ? 'Edit Product' : 'Add New Product'}
            </h3>
            <form onSubmit={handleProductSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Name</label>
                  <input
                    type="text"
                    value={productForm.name}
                    onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                    className="w-full p-3 border rounded-lg"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Category</label>
                  <select
                    value={productForm.categorySlug}
                    onChange={(e) => setProductForm({ ...productForm, categorySlug: e.target.value })}
                    className="w-full p-3 border rounded-lg"
                    required
                  >
                    <option value="">Select Category</option>
                    {categories.map((category) => (
                      <option key={category._id} value={category.slug}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Description</label>
                <textarea
                  value={productForm.description}
                  onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                  className="w-full p-3 border rounded-lg h-24"
                  required
                />
              </div>

              {/* Sizes */}
              <div>
                <label className="block text-sm font-medium mb-2">Sizes & Prices</label>
                {productForm.sizes.map((size, index) => (
                  <div key={index} className="grid grid-cols-4 gap-2 mb-2">
                    <input
                      type="text"
                      placeholder="Size (e.g., 250g)"
                      value={size.size}
                      onChange={(e) => updateSize(index, 'size', e.target.value)}
                      className="p-2 border rounded"
                    />
                    <input
                      type="number"
                      placeholder="Price"
                      value={size.price}
                      onChange={(e) => updateSize(index, 'price', e.target.value)}
                      className="p-2 border rounded"
                    />
                    <input
                      type="number"
                      placeholder="Original Price"
                      value={size.originalPrice}
                      onChange={(e) => updateSize(index, 'originalPrice', e.target.value)}
                      className="p-2 border rounded"
                    />
                    <input
                      type="number"
                      placeholder="Stock"
                      value={size.stock}
                      onChange={(e) => updateSize(index, 'stock', e.target.value)}
                      className="p-2 border rounded"
                    />
                    {productForm.sizes.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeSize(index)}
                        className="text-red-600 hover:text-red-800"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addSize}
                  className="text-blue-600 hover:text-blue-800 text-sm"
                >
                  Add Size
                </button>
              </div>

              {/* Badges */}
              <div>
                <label className="block text-sm font-medium mb-2">Badges</label>
                {productForm.badges.map((badge, index) => (
                  <div key={index} className="grid grid-cols-3 gap-2 mb-2">
                    <input
                      type="text"
                      placeholder="Badge Text"
                      value={badge.text}
                      onChange={(e) => updateBadge(index, 'text', e.target.value)}
                      className="p-2 border rounded"
                    />
                    <select
                      value={badge.color}
                      onChange={(e) => updateBadge(index, 'color', e.target.value)}
                      className="p-2 border rounded"
                    >
                      <option value="red">Red</option>
                      <option value="blue">Blue</option>
                      <option value="green">Green</option>
                      <option value="yellow">Yellow</option>
                      <option value="purple">Purple</option>
                      <option value="orange">Orange</option>
                      <option value="pink">Pink</option>
                    </select>
                    <button
                      type="button"
                      onClick={() => removeBadge(index)}
                      className="text-red-600 hover:text-red-800"
                    >
                      Remove
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addBadge}
                  className="text-blue-600 hover:text-blue-800 text-sm"
                >
                  Add Badge
                </button>
              </div>

              {/* Features */}
              <div>
                <label className="block text-sm font-medium mb-2">Features</label>
                {productForm.features.map((feature, index) => (
                  <div key={index} className="flex gap-2 mb-2">
                    <input
                      type="text"
                      placeholder="Feature"
                      value={feature}
                      onChange={(e) => updateFeature(index, e.target.value)}
                      className="flex-1 p-2 border rounded"
                    />
                    <button
                      type="button"
                      onClick={() => removeFeature(index)}
                      className="text-red-600 hover:text-red-800"
                    >
                      Remove
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addFeature}
                  className="text-blue-600 hover:text-blue-800 text-sm"
                >
                  Add Feature
                </button>
              </div>

              <div className="flex gap-4">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={productForm.isBestSeller}
                    onChange={(e) => setProductForm({ ...productForm, isBestSeller: e.target.checked })}
                    className="mr-2"
                  />
                  Best Seller
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={productForm.isFeatured}
                    onChange={(e) => setProductForm({ ...productForm, isFeatured: e.target.checked })}
                    className="mr-2"
                  />
                  Featured
                </label>
              </div>

              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowProductForm(false);
                    setEditingProduct(null);
                  }}
                  className="px-4 py-2 border rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  {editingProduct ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoryManagement;
