import React from 'react';
import { useContext } from 'react';
import { Link } from 'react-router-dom';
import { FaTrash, FaShoppingCart } from 'react-icons/fa';
import { useWishlist } from '../../context/WishlistContext';
import { useCart } from '../../context/CartContext';
import { AuthContext } from '../../context/AuthContext';

function Wishlist() {
  const { wishlist, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();
  const { user } = useContext(AuthContext);

  const handleMoveToCart = (item) => {
    addToCart({
      id: item.productId,
      name: item.name,
      price: item.price,
      image: item.image
    });
    removeFromWishlist(item.productId);
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">❤️</div>
          <h2 className="text-2xl font-bold mb-4">Please Login</h2>
          <p className="text-gray-600 mb-6">You need to be logged in to view your wishlist</p>
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
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold mb-2">My Wishlist</h1>
          <p className="text-gray-600">
            {wishlist.length} item{wishlist.length !== 1 ? 's' : ''} saved
          </p>
        </div>

        {/* Wishlist Items */}
        {wishlist.length === 0 ? (
          <div className="text-center py-12 bg-white rounded shadow">
            <div className="text-4xl mb-4">❤️</div>
            <h2 className="text-xl font-bold mb-4">Wishlist is empty</h2>
            <p className="text-gray-600 mb-6">Save products you like</p>
            <Link
              to="/products"
              className="bg-secondary text-white px-4 py-2 rounded hover:bg-accent"
            >
              Browse Products
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {wishlist.map((item) => (
              <div key={item.productId} className="bg-white rounded shadow overflow-hidden">
                {/* Image */}
                <div className="h-48 overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Info */}
                <div className="p-4">
                  <h3 className="font-bold mb-1">{item.name}</h3>
                  <p className="text-xl font-bold text-primary mb-4">₹{item.price}</p>

                  <div className="flex gap-2">
                    <button
                      onClick={() => removeFromWishlist(item.productId)}
                      className="flex-1 flex items-center justify-center gap-2 text-red-500 hover:text-red-700"
                    >
                      <FaTrash />
                      Remove
                    </button>
                    <button
                      onClick={() => handleMoveToCart(item)}
                      className="flex-1 flex items-center justify-center gap-2 bg-secondary text-white px-3 py-2 rounded hover:bg-accent"
                    >
                      <FaShoppingCart />
                      Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Wishlist;