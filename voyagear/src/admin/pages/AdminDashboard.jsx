import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  FaBox,
  FaShoppingCart,
  FaUsers,
  FaRupeeSign,
  FaArrowUp,
  FaCalendarAlt,
  FaFilter,
  FaEye,
  FaShoppingBag
} from 'react-icons/fa';
import api from '../../api/axiosInstance';

function AdminDashboard() {
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalOrders: 0,
    totalProducts: 0,
    totalUsers: 0,
    revenueChange: 0,
    orderChange: 0
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [recentUsers, setRecentUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('month');

  useEffect(() => {
    fetchDashboardData();
  }, [timeRange]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      // Fetch all data from your JSON server
      const [usersRes, productsRes] = await Promise.all([
        api.get('/users'),
        api.get('/products')
      ]);

      const users = usersRes.data;
      const products = productsRes.data;

      // Calculate stats from users data (orders in each user's orders array)
      let totalRevenue = 0;
      let totalOrders = 0;
      let allOrders = [];

      users.forEach(user => {
        if (user.orders && Array.isArray(user.orders)) {
          totalOrders += user.orders.length;
          user.orders.forEach(order => {
            if (order.totalAmount) {
              totalRevenue += order.totalAmount;
              allOrders.push({
                ...order,
                userName: user.name,
                userEmail: user.email
              });
            }
          });
        }
      });

      // Sort orders by date (most recent first)
      const sortedOrders = allOrders.sort((a, b) =>
        new Date(b.createdAt) - new Date(a.createdAt)
      ).slice(0, 5);

      // Get recent users (non-admin)
      const recentUsers = users
        .filter(user => user.role !== 'Admin')
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 3);


      // Calculate changes (simplified - you can add time-based filtering)
      const revenueChange = 12.5; 
      const orderChange = 8.2;

      setStats({
        totalRevenue,
        totalOrders,
        totalProducts: products.length,
        totalUsers: users.filter(user => user.role !== 'admin').length,
        revenueChange,
        orderChange
      });

      setRecentOrders(sortedOrders);
      setRecentUsers(recentUsers)
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      'Placed': { color: 'bg-yellow-100 text-yellow-800', label: 'Placed' },
      'Processing': { color: 'bg-blue-100 text-blue-800', label: 'Processing' },
      'Shipped': { color: 'bg-purple-100 text-purple-800', label: 'Shipped' },
      'Delivered': { color: 'bg-green-100 text-green-800', label: 'Delivered' },
      'Cancelled': { color: 'bg-red-100 text-red-800', label: 'Cancelled' }
    };

    const config = statusConfig[status] || { color: 'bg-gray-100 text-gray-800', label: 'Unknown' };

    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${config.color}`}>
        {config.label}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Dashboard Overview</h1>
            <p className="text-gray-600">Welcome back, Admin! Here's your store summary.</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={fetchDashboardData}
              className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 flex items-center gap-2 transition-colors"
            >
              <FaFilter />
              Refresh
            </button>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Total Revenue */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-gradient-to-r from-green-500 to-emerald-500 p-3 rounded-lg text-white">
              <FaRupeeSign className="text-2xl" />
            </div>
            <div className="flex items-center text-green-600">
              <FaArrowUp className="mr-1" />
              <span className="text-sm font-medium">+{stats.revenueChange}%</span>
            </div>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-1">{formatCurrency(stats.totalRevenue)}</h3>
          <p className="text-sm text-gray-600">Total Revenue</p>
        </div>

        {/* Total Orders */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-gradient-to-r from-blue-500 to-cyan-500 p-3 rounded-lg text-white">
              <FaShoppingCart className="text-2xl" />
            </div>
            <div className="flex items-center text-green-600">
              <FaArrowUp className="mr-1" />
              <span className="text-sm font-medium">+{stats.orderChange}%</span>
            </div>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-1">{stats.totalOrders}</h3>
          <p className="text-sm text-gray-600">Total Orders</p>
        </div>

        {/* Total Products */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-3 rounded-lg text-white">
              <FaBox className="text-2xl" />
            </div>
            <div className="flex items-center text-green-600">
              <FaArrowUp className="mr-1" />
              <span className="text-sm font-medium">+3.4%</span>
            </div>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-1">{stats.totalProducts}</h3>
          <p className="text-sm text-gray-600">Total Products</p>
        </div>

        {/* Total Customers */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-gradient-to-r from-orange-500 to-red-500 p-3 rounded-lg text-white">
              <FaUsers className="text-2xl" />
            </div>
            <div className="flex items-center text-green-600">
              <FaArrowUp className="mr-1" />
              <span className="text-sm font-medium">+15.7%</span>
            </div>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-1">{stats.totalUsers}</h3>
          <p className="text-sm text-gray-600">Total Customers</p>
        </div>
      </div>

      {/* Charts & Data Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Recent Orders */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <FaShoppingBag />
                Recent Orders
              </h2>
              <Link to="/admin/orders" className="text-primary hover:text-primary/80 text-sm font-medium">
                View All →
              </Link>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {recentOrders.length > 0 ? (
                  recentOrders.map((order) => (
                    <tr key={order.id || order.orderId} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {order.orderId}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <div>
                          <div className="font-medium">{order.userName || 'Customer'}</div>
                          <div className="text-gray-500 text-xs">{order.userEmail || ''}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatDate(order.createdAt)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                        {formatCurrency(order.totalAmount)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getStatusBadge(order.orderStatus)}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="px-6 py-8 text-center text-gray-500">
                      No orders found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Users*/}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-8">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <FaUsers />
                Recent Customers
              </h2>
              <Link to="/admin/users" className="text-primary hover:text-primary/80 text-sm font-medium">
                View All →
              </Link>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Join Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Orders</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {recentUsers.length > 0 ? (
                  recentUsers.map((user) => {
                    const orderCount = user.orders?.length || 0;
                    return (
                      <tr key={user.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-gradient-to-r from-primary to-secondary rounded-full flex items-center justify-center text-white font-medium">
                              {user.name?.charAt(0) || 'U'}
                            </div>
                            <div className="text-sm font-medium text-gray-900">{user.name}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.email}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {formatDate(user.createdAt)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                            {orderCount} orders
                          </span>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="5" className="px-6 py-8 text-center text-gray-500">
                      No customers found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;