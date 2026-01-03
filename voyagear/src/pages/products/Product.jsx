import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { FaShoppingCart, FaHeart } from 'react-icons/fa';
import api from '../../api/axiosInstance';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { AuthContext } from '../../context/AuthContext';
import { toast } from 'react-toastify';

function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { addToCart } = useCart();
  const { wishlist, toggleWishlist, isInWishlist } = useWishlist();
  const { user } = useContext(AuthContext);

  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('default');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await api.get('/products');
        setProducts(response.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);
  // to get unique categories
  const categories = ['all', ...new Set(products.map(p => p.category))];

  // Filter and sort products
  const filteredProducts = products
    .filter(product => {
      if (selectedCategory !== 'all' && product.category !== selectedCategory) return false;
      if (searchTerm && !product.name.toLowerCase().includes(searchTerm.toLowerCase())) return false;
      return true;
    })
    .sort((a, b) => {
      if (sortBy === 'price-low') return a.price - b.price;
      if (sortBy === 'price-high') return b.price - a.price;
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      return 0;
    });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-secondary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-bold mb-2">Error Loading Products</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-secondary text-white px-4 py-2 rounded hover:bg-accent"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-primary text-white py-8">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-3xl font-bold mb-2">Travel Products</h1>
          <p className="text-white/90">Premium gear for your adventures</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8 space-y-4">
          <div className="flex flex-wrap gap-2">
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded ${selectedCategory === category
                  ? 'bg-secondary text-white'
                  : 'bg-gray-100 hover:bg-gray-200'
                  }`}
              >
                {category === 'all' ? 'All Products' : category}
              </button>
            ))}
          </div>

          {/* Search and sort */}
          <div className="flex flex-col md:flex-row gap-4">
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-secondary"
            />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-secondary"
            >
              <option value="default">Sort By</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="name">Name: A-Z</option>
            </select>
          </div>
        </div>

        {/* Results info */}
        <p className="text-gray-600 mb-6">
          {filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''} found
          {selectedCategory !== 'all' && ` in ${selectedCategory}`}
        </p>

        {/* Products grid */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-12 bg-white rounded shadow">
            <div className="text-4xl mb-4">🧭</div>
            <h3 className="text-xl font-bold mb-2">No Products Found</h3>
            <p className="text-gray-600">Try different search or filter</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map(product => (
              <div key={product.id} className="bg-white rounded shadow overflow-hidden flex flex-col hover:shadow-lg transition-shadow relative group">
                {/* Wishlist heart */}
                <button
                  onClick={() => {
                      if (!user) {
                        toast.error("Please login to add product to wishlist.")
                        return;
                      }
                      toggleWishlist(product)
                    }}
                  className="absolute top-3 right-3 z-10 p-2 bg-white/80 backdrop-blur-sm rounded-full hover:bg-white transition-colors"
                >
                  <FaHeart
                    className={`text-lg ${isInWishlist(product.id) ? 'text-red-500 fill-red-500' : 'text-gray-400'}`}
                  />
                </button>

                {/* Image */}
                <div className="relative h-48 bg-gray-100 overflow-hidden flex items-center justify-center">
                  <Link to={`/products/${product.id}`} className="w-full h-full flex items-center justify-center">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="max-h-full max-w-full object-scale-down hover:scale-105 transition-transform duration-300"
                      style={{
                        maxHeight: '180px',
                        maxWidth: '90%',
                        width: 'auto',
                        height: 'auto'
                      }}
                    />
                  </Link>
                  {product['original price'] > product.price && (
                    <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded text-sm">
                      Sale
                    </div>
                  )}
                </div>

                {/* Product Info */}
                <div className="p-4 flex-grow flex flex-col">
                  <Link to={`/products/${product.id}`}>
                    <h3 className="font-bold hover:text-secondary text-lg mb-1">{product.name}</h3>
                  </Link>
                  <p className="text-gray-500 text-sm mb-2">{product.category}</p>

                  {/* Price */}
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-xl font-bold text-primary">
                      ₹{product.price}
                    </span>
                    {product['original price'] > product.price && (
                      <span className="text-gray-400 line-through">
                        ₹{product['original price']}
                      </span>
                    )}
                  </div>

                  {/* Stock Status */}
                  <div className="mb-4">
                    <span className={`text-sm ${product.stock ? 'text-green-600' : 'text-red-600'}`}>
                      {product.stock ? '✓ In Stock' : '✗ Out of Stock'}
                    </span>
                  </div>

                  {/* Add to Cart */}
                  <button
                    onClick={() => {
                      if (!user) {
                        toast.error("Please login to add product to cart.")
                        return;
                      }
                      addToCart(product)
                    }}
                    disabled={!product.stock}
                    className={`w-full flex items-center justify-center gap-2 px-3 py-2 rounded font-medium ${product.stock
                      ? 'bg-secondary text-white hover:bg-accent transition-colors'
                      : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                      }`}
                  >
                    <FaShoppingCart />
                    Add to Cart
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Products;