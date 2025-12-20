import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaTrash, FaPlus, FaMinus, FaShoppingCart, FaArrowLeft } from 'react-icons/fa';
import { useCart } from '../../context/CartContext';
import { AuthContext } from '../../context/AuthContext';

function Cart() {
  const { cart, removeFromCart, updateQuantity } = useCart();
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  // Calculate totals
  const subtotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  const shipping = subtotal > 1999 ? 0 : 99;
  const total = subtotal + shipping;

  // Handle quantity change
  const handleQuantityChange = (productId, newQuantity) => {
    if (newQuantity < 1) {
      removeFromCart(productId);
    } else {
      updateQuantity(productId, newQuantity);
    }
  };

  // Handle checkout
  const handleCheckout = () => {
    if (cart.length === 0) return;
    navigate('/checkout');
  };

  // Handle continue shopping
  const handleContinueShopping = () => {
    navigate('/products');
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🛒</div>
          <h2 className="text-2xl font-bold mb-4">Please Login</h2>
          <p className="text-gray-600 mb-6">You need to be logged in to view your cart</p>
          <Link
            to="/login"
            className="bg-secondary text-white px-6 py-3 rounded-lg hover:bg-accent transition-colors"
          >
            Login to Continue
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-primary text-white py-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center gap-3 mb-2">
            <FaShoppingCart className="text-2xl" />
            <h1 className="text-3xl font-bold">Shopping Cart</h1>
          </div>
          <p className="text-white/90">
            {cart.length} item{cart.length !== 1 ? 's' : ''} in your cart
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {cart.length === 0 ? (
          // Empty Cart
          <div className="bg-white rounded-xl shadow-lg p-12 text-center">
            <div className="text-8xl mb-6">🛒</div>
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Your cart is empty</h2>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              Looks like you haven't added any products to your cart yet.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={handleContinueShopping}
                className="bg-secondary text-white px-8 py-3 rounded-lg font-medium hover:bg-accent transition-colors"
              >
                Continue Shopping
              </button>
              <Link
                to="/products"
                className="border-2 border-secondary text-secondary px-8 py-3 rounded-lg font-medium hover:bg-secondary hover:text-white transition-colors"
              >
                Browse Products
              </Link>
            </div>
          </div>
        ) : (
          // Cart with Items
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {cart.map((item) => (
                <div
                  key={item.productId}
                  className="bg-white rounded-xl shadow-lg overflow-hidden"
                >
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-4 p-4">
                    {/* Product Image */}
                    <div className="md:col-span-3">
                      <Link to={`/products/${item.productId}`}>
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-40 object-contain bg-gray-50 rounded-lg p-2"
                        />
                      </Link>
                    </div>

                    {/* Product Info */}
                    <div className="md:col-span-6 flex flex-col justify-between">
                      <div>
                        <Link to={`/products/${item.productId}`}>
                          <h3 className="font-bold text-lg hover:text-secondary transition-colors">
                            {item.name}
                          </h3>
                        </Link>
                        <p className="text-gray-600 text-sm mt-1">Price: ₹{item.price}</p>
                      </div>

                      {/* Quantity Controls */}
                      <div className="flex items-center gap-4 mt-4">
                        <div className="flex items-center border rounded-lg">
                          <button
                            onClick={() => handleQuantityChange(item.productId, item.quantity - 1)}
                            className="px-3 py-2 hover:bg-gray-100"
                          >
                            <FaMinus className="text-sm" />
                          </button>
                          <span className="px-4 py-2 border-x font-medium">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => handleQuantityChange(item.productId, item.quantity + 1)}
                            className="px-3 py-2 hover:bg-gray-100"
                          >
                            <FaPlus className="text-sm" />
                          </button>
                        </div>

                        <button
                          onClick={() => removeFromCart(item.productId)}
                          className="text-red-500 hover:text-red-700 flex items-center gap-2"
                        >
                          <FaTrash />
                          Remove
                        </button>
                      </div>
                    </div>

                    {/* Price Total */}
                    <div className="md:col-span-3 flex flex-col items-end justify-between">
                      <div className="text-right">
                        <p className="text-gray-600 text-sm">Total</p>
                        <p className="text-xl font-bold text-primary">
                          ₹{item.price * item.quantity}
                        </p>
                      </div>
                      <p className="text-gray-500 text-sm">
                        ₹{item.price} × {item.quantity}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-lg p-6 sticky top-24">
                <h3 className="text-xl font-bold mb-6 pb-4 border-b">Order Summary</h3>

                {/* Price Breakdown */}
                <div className="space-y-4 mb-6">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-medium">₹{subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Shipping</span>
                    <span className={shipping === 0 ? 'text-green-600' : ''}>
                      {shipping === 0 ? 'FREE' : `₹${shipping}`}
                    </span>
                  </div>
                  <div className="flex justify-between">
                  </div>
                  <div className="border-t pt-4">
                    <div className="flex justify-between text-lg font-bold">
                      <span>Total</span>
                      <span className="text-primary">₹{total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                {/* Shipping Info */}
                {subtotal < 2000 && (
                  <div className="mb-6 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <p className="text-sm text-yellow-800">
                      Add ₹{(2000 - subtotal).toFixed(2)} more to get FREE shipping!
                    </p>
                  </div>
                )}

                {/* Checkout Button */}
                <button
                  onClick={handleCheckout}
                  className="w-full bg-secondary text-white py-3 rounded-lg font-bold text-lg hover:bg-accent transition-colors mb-4"
                >
                  Proceed to Checkout
                </button>

                {/* Continue Shopping */}
                <button
                  onClick={handleContinueShopping}
                  className="w-full flex items-center justify-center gap-2 border-2 border-secondary text-secondary py-3 rounded-lg font-medium hover:bg-secondary hover:text-white transition-colors"
                >
                  <FaArrowLeft />
                  Continue Shopping
                </button>

                {/* Additional Info */}
                <div className="mt-6 pt-6 border-t text-sm text-gray-500 space-y-2">
                  <p>✓ Free shipping on orders above ₹1999</p>
                  <p>✓ 30-day return policy</p>
                  <p>✓ Secure payment</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Cart Tips (when cart has items) */}
        {cart.length > 0 && (
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-4 rounded-lg shadow border">
              <h4 className="font-bold mb-2">Free Shipping</h4>
              <p className="text-sm text-gray-600">Orders above ₹2000 qualify for free shipping</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow border">
              <h4 className="font-bold mb-2">Easy Returns</h4>
              <p className="text-sm text-gray-600">30-day return policy for unused items</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow border">
              <h4 className="font-bold mb-2">Secure Payment</h4>
              <p className="text-sm text-gray-600">All payments are encrypted and secure</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Cart;