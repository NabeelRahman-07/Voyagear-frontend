import React from 'react';
import { useContext } from 'react';
import { Link } from 'react-router-dom';
import { FaBox, FaCheckCircle, FaShippingFast, FaHome, FaCalendarAlt } from 'react-icons/fa';
import { AuthContext } from '../../context/AuthContext';

function Orders() {
  const { user } = useContext(AuthContext);

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center bg-white p-8 rounded-xl shadow-lg max-w-md">
          <div className="text-5xl mb-4">🔐</div>
          <h2 className="text-2xl font-bold mb-3">Login Required</h2>
          <p className="text-gray-600 mb-6">Please login to view your orders</p>
          <Link
            to="/login"
            className="bg-secondary text-white px-6 py-3 rounded-lg font-medium hover:bg-accent transition-colors"
          >
            Login to Continue
          </Link>
        </div>
      </div>
    );
  }

  const orders = user.orders || [];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <FaBox className="text-3xl text-secondary" />
            <h1 className="text-3xl font-bold text-gray-800">My Orders</h1>
          </div>
          <p className="text-gray-600">
            {orders.length} order{orders.length !== 1 ? 's' : ''} found
          </p>
        </div>

        {orders.length === 0 ? (
          // Empty Orders State
          <div className="bg-white rounded-xl shadow-lg p-12 text-center">
            <div className="text-6xl mb-6">📦</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">No Orders Yet</h2>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              You haven't placed any orders yet. Start shopping to see your orders here.
            </p>
            <Link
              to="/products"
              className="bg-secondary text-white px-8 py-3 rounded-lg font-medium hover:bg-accent transition-colors"
            >
              Start Shopping
            </Link>
          </div>
        ) : (
          // Orders List
          <div className="space-y-6">
            {orders.map((order, index) => (
              <div key={order.orderId} className="bg-white rounded-xl shadow-lg overflow-hidden">
                {/* Order Header */}
                <div className="p-6 border-b">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <FaCheckCircle className="text-green-500 text-xl" />
                        <h3 className="text-xl font-bold text-gray-800">Order #{order.orderId}</h3>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <div className="flex items-center gap-2">
                          <FaCalendarAlt />
                          <span>{new Date(order.createdAt).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <FaShippingFast />
                          <span className="capitalize">{order.paymentMethod}</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-primary">₹{order.totalAmount}</div>
                      <div className={`text-sm font-medium px-3 py-1 rounded-full inline-block mt-2 ${
                        order.orderStatus === 'Delivered' ? 'bg-green-100 text-green-800' :
                        order.orderStatus === 'Shipped' ? 'bg-blue-100 text-blue-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {order.orderStatus || 'Processing'}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Order Items */}
                <div className="p-6">
                  <h4 className="font-bold text-gray-700 mb-4">Items ({order.items.length})</h4>
                  <div className="space-y-4">
                    {order.items.map((item, itemIndex) => (
                      <div key={itemIndex} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-16 h-16 object-contain bg-white p-2 rounded"
                        />
                        <div className="flex-1">
                          <h5 className="font-medium text-gray-800">{item.name}</h5>
                          <div className="flex justify-between items-center mt-2">
                            <div className="text-sm text-gray-600">
                              Qty: {item.quantity} × ₹{item.price}
                            </div>
                            <div className="font-bold">₹{item.price * item.quantity}</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Order Footer */}
                {order.shippingAddress && (
                  <div className="p-6 bg-gray-50 border-t">
                    <div className="flex items-start gap-3">
                      <FaHome className="text-gray-500 mt-1" />
                      <div>
                        <h4 className="font-bold text-gray-700 mb-2">Shipping Address</h4>
                        <div className="text-gray-600">
                          <p>{order.shippingAddress.name}</p>
                          <p>{order.shippingAddress.street}</p>
                          <p>{order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.pincode}</p>
                          <p>Phone: {order.shippingAddress.phone}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Order Status Guide */}
        {orders.length > 0 && (
          <div className="mt-12 bg-white rounded-xl shadow-lg p-6">
            <h3 className="font-bold text-lg mb-4">Order Status Guide</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="text-center p-4 border rounded-lg">
                <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-2">
                  <span className="text-yellow-600 font-bold">1</span>
                </div>
                <p className="font-medium">Placed</p>
                <p className="text-sm text-gray-600">Order received</p>
              </div>
              <div className="text-center p-4 border rounded-lg">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                  <span className="text-blue-600 font-bold">2</span>
                </div>
                <p className="font-medium">Processing</p>
                <p className="text-sm text-gray-600">Preparing order</p>
              </div>
              <div className="text-center p-4 border rounded-lg">
                <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-2">
                  <span className="text-purple-600 font-bold">3</span>
                </div>
                <p className="font-medium">Shipped</p>
                <p className="text-sm text-gray-600">On the way</p>
              </div>
              <div className="text-center p-4 border rounded-lg">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                  <span className="text-green-600 font-bold">4</span>
                </div>
                <p className="font-medium">Delivered</p>
                <p className="text-sm text-gray-600">Order received</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Orders;