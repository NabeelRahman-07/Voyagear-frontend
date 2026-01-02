import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaShoppingCart, FaBolt, FaArrowLeft, FaHeart, FaTruck, FaShieldAlt, FaUndo } from 'react-icons/fa';
import api from '../../api/axiosInstance';
import { useCart } from '../../context/CartContext';
import { toast } from 'react-toastify';
import { AuthContext } from '../../context/AuthContext';

function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const { cart,addToCart } = useCart();
  const {user}=useContext(AuthContext);

  // Fetch product details
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/products/${id}`);
        setProduct(response.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleQuantityChange = (value) => {
    if (value < 1) return;
    setQuantity(value);
  };

  const handleAddToCart = () => {
    if(!user){
      toast.error("Please login to add product to cart")
      return;
    }
    addToCart(product,quantity);
  };

  const handleBuyNow = () => {
    navigate('/checkout',{state:{product,quantity}});
  };
  
  let count=0;
  for(let i of cart){
    i.productId==id ? count+=1 : count;
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-secondary"></div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Product Not Found</h2>
          <p className="text-gray-600 mb-6">The product you're looking for doesn't exist.</p>
          <button
            onClick={() => navigate('/products')}
            className="bg-secondary text-white px-6 py-3 rounded-lg hover:bg-accent transition-colors"
          >
            <FaArrowLeft className="inline mr-2" />
            Back to Products
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <button
          onClick={() => navigate('/products')}
          className="flex items-center gap-2 text-gray-600 hover:text-secondary"
        >
          <FaArrowLeft />
          Back to Products
        </button>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-6">
            <div>
              {/* Main Image */}
              <div className="bg-white rounded-lg border border-gray-200 p-4 mb-4">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-96 object-contain"
                />
              </div>
            </div>

            {/*  Product Info */}
            <div className="space-y-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mt-1">{product.name}</h1>
              </div>

              {/* Category */}
              <div className="flex items-center gap-2">
                <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">
                  {product.category}
                </span>
              </div>

              {/* Price */}
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <span className="text-3xl font-bold text-primary">₹{product.price}</span>
                  {product['original price'] > product.price && (
                    <>
                      <span className="text-xl text-gray-400 line-through">
                        ₹{product['original price']}
                      </span>
                      <span className="bg-red-100 text-red-600 px-2 py-1 rounded text-sm font-bold">
                        Save ₹{product['original price'] - product.price}
                      </span>
                    </>
                  )}
                </div>
                {product['original price'] > product.price && (
                  <p className="text-sm text-green-600">
                    {Math.round(((product['original price'] - product.price) / product['original price']) * 100)}% OFF
                  </p>
                )}
              </div>

              {/* Stock Status */}
              <div>
                <span className={`inline-flex items-center gap-2 ${product.quantity ? 'text-green-600' : 'text-red-600'}`}>
                  <span className={`w-2 h-2 rounded-full ${product.quantity ? 'bg-green-500' : 'bg-red-500'}`}></span>
                  {product.quantity ? 'In Stock' : 'Out of Stock'}
                </span>
              </div>

              {/* Quantity Selector */}
              <div className="space-y-2">
                <p className="text-gray-700 font-medium">Quantity</p>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => handleQuantityChange(quantity - 1)}
                    disabled={quantity <= 1}
                    className="w-10 h-10 rounded-full border flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    -
                  </button>
                  <span className="text-xl font-bold w-12 text-center">{quantity}</span>
                  <button
                    onClick={() => handleQuantityChange(quantity + 1)}
                    className="w-10 h-10 rounded-full border flex items-center justify-center"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
                {count ?(<button
                  // onClick={()=>navigate('/cart')}
                  disabled={!product.quantity}
                  className={`flex items-center justify-center gap-3 px-6 py-4 rounded-lg text-lg font-medium 
                    bg-gray-200 text-gray-500 cursor-not-allowed disabled:opacity-50 disabled:cursor-not-allowed'
                    }`}
                >
                  <FaShoppingCart />
                  Item already in Cart
                </button>)
                :
                (<button
                  onClick={handleAddToCart}
                  disabled={!product.quantity}
                  className={`flex items-center justify-center gap-3 px-6 py-4 rounded-lg text-lg font-medium ${product.quantity
                    ? 'bg-gray-100 text-gray-800 hover:bg-gray-200 border border-gray-300'
                    : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                    }`}
                >
                  <FaShoppingCart />
                  Add to Cart
                </button>) }
                {/* <button
                  onClick={handleAddToCart}
                  disabled={!product.quantity}
                  className={`flex items-center justify-center gap-3 px-6 py-4 rounded-lg text-lg font-medium ${product.quantity
                    ? 'bg-gray-100 text-gray-800 hover:bg-gray-200 border border-gray-300'
                    : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                    }`}
                >
                  <FaShoppingCart />
                  Add to Cart
                </button> */}
                <button
                  onClick={handleBuyNow}
                  disabled={!product.quantity}
                  className={`flex items-center justify-center gap-3 px-6 py-4 rounded-lg text-lg font-medium ${product.quantity
                    ? 'bg-secondary text-white hover:bg-accent'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    }`}
                >
                  <FaBolt />
                  Buy Now
                </button>
              </div>
              {/* Product Features */}
              <div className="pt-8 border-t">
                <h3 className="text-lg font-bold mb-4">Product Features</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <FaTruck className="text-secondary text-xl" />
                    </div>
                    <div>
                      <p className="font-medium">Free Shipping</p>
                      <p className="text-sm text-gray-500">On orders above ₹1999</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <FaUndo className="text-secondary text-xl" />
                    </div>
                    <div>
                      <p className="font-medium">Easy Returns</p>
                      <p className="text-sm text-gray-500">30-day return policy</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <FaShieldAlt className="text-secondary text-xl" />
                    </div>
                    <div>
                      <p className="font-medium">2-Year Warranty</p>
                      <p className="text-sm text-gray-500">Quality guaranteed</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Description Section */}
          <div className="border-t p-6">
            <h3 className="text-2xl font-bold mb-6">Product Description</h3>
            <div className="prose max-w-none">
              <p className="text-gray-700 leading-relaxed">{product.description}</p>

              {/* Additional Details */}
              <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-bold text-lg mb-3">Key Features</h4>
                  <ul className="space-y-2">
                    <li className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-secondary rounded-full"></span>
                      <span>Durable and lightweight construction</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-secondary rounded-full"></span>
                      <span>Multiple compartments for organization</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-secondary rounded-full"></span>
                      <span>Weather-resistant material</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-secondary rounded-full"></span>
                      <span>Ergonomic design for comfort</span>
                    </li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-bold text-lg mb-3">Specifications</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between border-b pb-2">
                      <span className="text-gray-600">Material</span>
                      <span className="font-medium">Polyester</span>
                    </div>
                    <div className="flex justify-between border-b pb-2">
                      <span className="text-gray-600">Capacity</span>
                      <span className="font-medium">30L</span>
                    </div>
                    <div className="flex justify-between border-b pb-2">
                      <span className="text-gray-600">Weight</span>
                      <span className="font-medium">1.2 kg</span>
                    </div>
                    <div className="flex justify-between border-b pb-2">
                      <span className="text-gray-600">Dimensions</span>
                      <span className="font-medium">50 x 30 x 20 cm</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductDetails;