import React, { useState, useEffect } from 'react';
import { FaEdit, FaTrash, FaPlus, FaSearch, FaTimes, FaSave } from 'react-icons/fa';
import api from '../../api/axiosInstance';

function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Add product states
  const [showAddModal, setShowAddModal] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: '',
    category: '',
    description: '',
    stock: '',
    price: '',
    originalPrice: '',
    image: ''
  });

  // Edit product states
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [editedProduct, setEditedProduct] = useState({});

  // Delete product states
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);

  // Loading states
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await api.get('/products');
      setProducts(response.data);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  // Edit product functions
  const handleEditClick = (product) => {
    setSelectedProduct(product);
    setEditedProduct({ 
      ...product,
      // Ensure originalPrice is included
      originalPrice: product['original price'] || product.originalPrice || ''
    });
    setShowEditModal(true);
  };

  const handleSaveEdit = async () => {
    if (!editedProduct.name || !editedProduct.price || !editedProduct.category) {
      alert('Please fill in all required fields');
      return;
    }

    setIsSaving(true);
    try {
      // Prepare data with correct field names
      const productData = {
        ...editedProduct,
        // Ensure "original price" field matches your data structure
        'original price': editedProduct.originalPrice || editedProduct.price
      };
      
      // Remove the camelCase version if it exists
      delete productData.originalPrice;

      await api.put(`/products/${selectedProduct.id}`, productData);

      // Update local state
      setProducts(products.map(p =>
        p.id === selectedProduct.id ? productData : p
      ));

      setShowEditModal(false);
      setSelectedProduct(null);
      setEditedProduct({});
    } catch (error) {
      console.error('Error updating product:', error);
      alert('Failed to update product');
    } finally {
      setIsSaving(false);
    }
  };

  // Delete product functions
  const handleDeleteClick = (product) => {
    setProductToDelete(product);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    setIsDeleting(true);
    try {
      await api.delete(`/products/${productToDelete.id}`);

      // Update local state
      setProducts(products.filter(p => p.id !== productToDelete.id));

      setShowDeleteModal(false);
      setProductToDelete(null);
    } catch (error) {
      console.error('Error deleting product:', error);
      alert('Failed to delete product');
    } finally {
      setIsDeleting(false);
    }
  };

  // Add new product functions
  const handleAddProduct = async () => {
    // Validate required fields
    if (!newProduct.name || !newProduct.price || !newProduct.category) {
      alert('Please fill in name, price, and category');
      return;
    }

    try {
      // Prepare product data matching your structure
      const productToAdd = {
        name: newProduct.name,
        category: newProduct.category,
        description: newProduct.description || '',
        stock: parseInt(newProduct.stock) || 0,
        price: parseFloat(newProduct.price),
        'original price': parseFloat(newProduct.originalPrice) || parseFloat(newProduct.price),
        image: newProduct.image || '',
        id: Math.max(0, ...products.map(p => p.id)) + 1 // Generate new ID
      };

      const response = await api.post('/products', productToAdd);

      // Add to local state
      setProducts([...products, response.data]);

      // Reset form
      setNewProduct({
        name: '',
        category: '',
        description: '',
        stock: '',
        price: '',
        originalPrice: '',
        image: ''
      });
      setShowAddModal(false);

    } catch (error) {
      console.error('Error adding product:', error);
      alert('Failed to add product');
    }
  };

  // Get unique categories
  const categories = ['all', ...new Set(products.map(p => p.category))];

  // Filter products
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(search.toLowerCase()) ||
      (product.description && product.description.toLowerCase().includes(search.toLowerCase()));
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Calculate discount percentage
  const calculateDiscount = (price, originalPrice) => {
    if (!originalPrice || originalPrice <= price) return 0;
    return Math.round(((originalPrice - price) / originalPrice) * 100);
  };

  return (
    <>
      <div className="p-4">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Products</h1>
          <p className="text-gray-600">Manage your travel equipment products</p>
        </div>

        {/* Actions Bar */}
        <div className="bg-white border border-gray-200 rounded-lg p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search products..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                />
              </div>
            </div>

            {/* Category Filter */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
            >
              {categories.map(category => (
                <option key={category} value={category}>
                  {category === 'all' ? 'All Categories' : category.charAt(0).toUpperCase() + category.slice(1)}
                </option>
              ))}
            </select>

            {/* Add Product Button */}
            <button
              onClick={() => setShowAddModal(true)}
              className="px-4 py-2 bg-primary text-white rounded hover:bg-primary/90 flex items-center gap-2"
            >
              <FaPlus />
              Add Product
            </button>
          </div>
        </div>

        {/* Products Table - Keep your existing table structure, just update the price display */}
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          {loading ? (
            <div className="p-8 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
              <p className="mt-2 text-gray-600">Loading products...</p>
            </div>
          ) : filteredProducts.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Product</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Price</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Stock</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredProducts.map((product) => {
                    const originalPrice = product['original price'] || product.price;
                    const discount = calculateDiscount(product.price, originalPrice);
                    
                    return (
                      <tr key={product.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <div className="flex items-center">
                            <img
                              src={product.image}
                              alt={product.name}
                              className="h-10 w-10 rounded object-cover mr-3"
                              onError={(e) => {
                                e.target.src = 'https://via.placeholder.com/40';
                                e.target.onerror = null;
                              }}
                            />
                            <div>
                              <div className="font-medium text-gray-900">{product.name}</div>
                              <div className="text-sm text-gray-500 truncate max-w-xs">
                                {product.description || 'No description'}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="px-2 py-1 text-xs bg-gray-100 text-gray-800 rounded">
                            {product.category}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex flex-col">
                            <span className="font-medium">₹{product.price}</span>
                            {discount > 0 && (
                              <>
                                <span className="text-sm text-gray-500 line-through">₹{originalPrice}</span>
                                <span className="text-xs text-green-600">-{discount}%</span>
                              </>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center">
                            <span className={`px-2 py-1 text-xs rounded ${product.stock > 10 ? 'bg-green-100 text-green-800' : product.stock > 0 ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'}`}>
                              {product.stock} units
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleEditClick(product)}
                              className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                              title="Edit"
                            >
                              <FaEdit />
                            </button>
                            <button
                              onClick={() => handleDeleteClick(product)}
                              className="p-2 text-red-600 hover:bg-red-50 rounded"
                              title="Delete"
                            >
                              <FaTrash />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-8 text-center text-gray-500">
              No products found
            </div>
          )}

          {/* Summary */}
          <div className="border-t border-gray-200 px-6 py-4 bg-gray-50">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">
                Showing {filteredProducts.length} of {products.length} products
              </span>
              <button
                onClick={fetchProducts}
                className="text-sm text-primary hover:text-primary/80"
              >
                Refresh
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Product Modal - UPDATED */}
      {showEditModal && selectedProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg w-full max-w-md max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="sticky top-0 bg-white z-10 flex justify-between items-center p-6 border-b">
              <h3 className="text-xl font-bold text-gray-900">Edit Product</h3>
              <button
                onClick={() => setShowEditModal(false)}
                className="p-2 hover:bg-gray-100 rounded"
                disabled={isSaving}
              >
                <FaTimes />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Product Name *
                </label>
                <input
                  type="text"
                  value={editedProduct.name || ''}
                  onChange={(e) => setEditedProduct({ ...editedProduct, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category *
                </label>
                <input
                  type="text"
                  value={editedProduct.category || ''}
                  onChange={(e) => setEditedProduct({ ...editedProduct, category: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  value={editedProduct.description || ''}
                  onChange={(e) => setEditedProduct({ ...editedProduct, description: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                  rows="3"
                  placeholder="Product description..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Current Price (₹) *
                  </label>
                  <input
                    type="number"
                    value={editedProduct.price || ''}
                    onChange={(e) => setEditedProduct({ ...editedProduct, price: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                    required
                    min="0"
                    step="0.01"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Original Price (₹)
                  </label>
                  <input
                    type="number"
                    value={editedProduct.originalPrice || ''}
                    onChange={(e) => setEditedProduct({ ...editedProduct, originalPrice: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                    min="0"
                    step="0.01"
                    placeholder="Optional"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Stock Quantity
                </label>
                <input
                  type="number"
                  value={editedProduct.stock || ''}
                  onChange={(e) => setEditedProduct({ ...editedProduct, stock: parseInt(e.target.value) || 0 })}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                  min="0"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Image URL
                </label>
                <input
                  type="url"
                  value={editedProduct.image || ''}
                  onChange={(e) => setEditedProduct({ ...editedProduct, image: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                  placeholder="https://example.com/image.jpg"
                />
                {editedProduct.image && (
                  <div className="mt-2">
                    <img
                      src={editedProduct.image}
                      alt="Preview"
                      className="h-20 w-20 object-cover rounded border"
                      onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/80';
                        e.target.onerror = null;
                      }}
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="sticky bottom-0 bg-white border-t p-6 flex justify-end gap-3">
              <button
                onClick={() => setShowEditModal(false)}
                className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50"
                disabled={isSaving}
              >
                Cancel
              </button>
              <button
                onClick={handleSaveEdit}
                disabled={isSaving}
                className="px-4 py-2 bg-primary text-white rounded hover:bg-primary/90 flex items-center gap-2 disabled:opacity-50"
              >
                {isSaving ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Saving...
                  </>
                ) : (
                  <>
                    <FaSave />
                    Save Changes
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Product Modal - UPDATED */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg w-full max-w-md max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="sticky top-0 bg-white z-10 flex justify-between items-center p-6 border-b">
              <h3 className="text-xl font-bold text-gray-900">Add New Product</h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-2 hover:bg-gray-100 rounded"
              >
                <FaTimes />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Product Name *
                </label>
                <input
                  type="text"
                  value={newProduct.name}
                  onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                  placeholder="e.g., Adventure Backpack Pro"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category *
                </label>
                <input
                  type="text"
                  value={newProduct.category}
                  onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                  placeholder="e.g., Backpack, Tent, Camping Gear"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  value={newProduct.description}
                  onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                  rows="3"
                  placeholder="Describe the product features..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Price (₹) *
                  </label>
                  <input
                    type="number"
                    value={newProduct.price}
                    onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                    placeholder="5999"
                    required
                    min="0"
                    step="0.01"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Original Price (₹)
                  </label>
                  <input
                    type="number"
                    value={newProduct.originalPrice}
                    onChange={(e) => setNewProduct({ ...newProduct, originalPrice: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                    placeholder="6699"
                    min="0"
                    step="0.01"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Stock Quantity
                </label>
                <input
                  type="number"
                  value={newProduct.stock}
                  onChange={(e) => setNewProduct({ ...newProduct, stock: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                  placeholder="20"
                  min="0"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Image URL
                </label>
                <input
                  type="url"
                  value={newProduct.image}
                  onChange={(e) => setNewProduct({ ...newProduct, image: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                  placeholder="https://example.com/image.jpg"
                />
                {newProduct.image && (
                  <div className="mt-2">
                    <img
                      src={newProduct.image}
                      alt="Preview"
                      className="h-20 w-20 object-cover rounded border"
                      onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/80';
                        e.target.onerror = null;
                      }}
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="sticky bottom-0 bg-white border-t p-6 flex justify-end gap-3">
              <button
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleAddProduct}
                className="px-4 py-2 bg-primary text-white rounded hover:bg-primary/90 flex items-center gap-2"
              >
                <FaPlus />
                Add Product
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal - No changes needed here */}
      {showDeleteModal && productToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg w-full max-w-md">
            <div className="flex justify-between items-center p-6 border-b">
              <h3 className="text-xl font-bold text-gray-900">Delete Product</h3>
              <button
                onClick={() => setShowDeleteModal(false)}
                className="p-2 hover:bg-gray-100 rounded"
                disabled={isDeleting}
              >
                <FaTimes />
              </button>
            </div>

            <div className="p-6">
              <p className="text-gray-700 mb-4">
                Are you sure you want to delete <strong>{productToDelete.name}</strong>?
              </p>
              <p className="text-sm text-gray-600">
                This action cannot be undone. The product will be permanently removed.
              </p>
            </div>

            <div className="p-6 border-t flex justify-end gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50"
                disabled={isDeleting}
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                disabled={isDeleting}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 flex items-center gap-2 disabled:opacity-50"
              >
                {isDeleting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Deleting...
                  </>
                ) : (
                  <>
                    <FaTrash />
                    Delete Product
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default AdminProducts;