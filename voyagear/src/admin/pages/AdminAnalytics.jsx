import React, { useState, useEffect } from 'react';
import { 
  FaRupeeSign, 
  FaShoppingCart, 
  FaUsers, 
  FaBox, 
  FaChartLine,
  FaCalendarAlt,
  FaArrowUp,
  FaArrowDown
} from 'react-icons/fa';
import api from '../../api/axiosInstance';

function AdminAnalytics() {
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalOrders: 0,
    totalCustomers: 0,
    totalProducts: 0,
    revenueChange: 0,
    orderChange: 0
  });
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('month');

  useEffect(() => {
    fetchAnalytics();
  }, [timeRange]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const [usersRes, productsRes] = await Promise.all([
        api.get('/users'),
        api.get('/products')
      ]);

      const users = usersRes.data;
      const products = productsRes.data;

      // Calculate metrics
      let totalRevenue = 0;
      let totalOrders = 0;
      const customers = users.filter(user => 
        user.role !== 'admin' && user.role !== 'Admin'
      );

      // Calculate from user orders
      users.forEach(user => {
        if (user.orders && Array.isArray(user.orders)) {
          totalOrders += user.orders.length;
          user.orders.forEach(order => {
            if (order.total) {
              totalRevenue += order.total;
            }
          });
        }
      });

      // Mock change percentages (you can implement real calculations)
      const revenueChange = 12.5;
      const orderChange = 8.2;

      setStats({
        totalRevenue,
        totalOrders,
        totalCustomers: customers.length,
        totalProducts: products.length,
        revenueChange,
        orderChange
      });
    } catch (error) {
      console.error('Error fetching analytics:', error);
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

  // Mock data for charts (you can replace with real data)
  const monthlyData = [
    { month: 'Jan', revenue: 42000, orders: 45 },
    { month: 'Feb', revenue: 52000, orders: 58 },
    { month: 'Mar', revenue: 61000, orders: 72 },
    { month: 'Apr', revenue: 58000, orders: 65 },
    { month: 'May', revenue: 72000, orders: 81 },
    { month: 'Jun', revenue: 85000, orders: 94 },
  ];

  const topProducts = [
    { name: 'Adventure Backpack', sales: 142 },
    { name: 'Camping Tent', sales: 89 },
    { name: 'Sleeping Bag', sales: 156 },
    { name: 'Camp Chair', sales: 203 },
    { name: 'Water Bottle', sales: 312 },
  ];

  if (loading) {
    return (
      <div className="p-4">
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading analytics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4">
      {/* Header */}
      <div className="mb-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
            <p className="text-gray-600">Store performance insights</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2 bg-gray-100 rounded-lg px-3 py-2">
              <FaCalendarAlt className="text-gray-500" />
              <select 
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className="bg-transparent border-none focus:outline-none text-sm"
              >
                <option value="week">Last 7 days</option>
                <option value="month">Last 30 days</option>
                <option value="quarter">Last 3 months</option>
                <option value="year">Last year</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {/* Revenue Card */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-green-100 text-green-600 rounded-lg">
              <FaRupeeSign className="text-xl" />
            </div>
            <div className={`flex items-center ${stats.revenueChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {stats.revenueChange >= 0 ? <FaArrowUp /> : <FaArrowDown />}
              <span className="text-sm font-medium ml-1">{Math.abs(stats.revenueChange)}%</span>
            </div>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-1">{formatCurrency(stats.totalRevenue)}</h3>
          <p className="text-sm text-gray-600">Total Revenue</p>
        </div>

        {/* Orders Card */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-blue-100 text-blue-600 rounded-lg">
              <FaShoppingCart className="text-xl" />
            </div>
            <div className="flex items-center text-green-600">
              <FaArrowUp />
              <span className="text-sm font-medium ml-1">{stats.orderChange}%</span>
            </div>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-1">{stats.totalOrders}</h3>
          <p className="text-sm text-gray-600">Total Orders</p>
        </div>

        {/* Customers Card */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-purple-100 text-purple-600 rounded-lg">
              <FaUsers className="text-xl" />
            </div>
            <div className="flex items-center text-green-600">
              <FaArrowUp />
              <span className="text-sm font-medium ml-1">15.7%</span>
            </div>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-1">{stats.totalCustomers}</h3>
          <p className="text-sm text-gray-600">Total Customers</p>
        </div>

        {/* Products Card */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-orange-100 text-orange-600 rounded-lg">
              <FaBox className="text-xl" />
            </div>
            <div className="flex items-center text-green-600">
              <FaArrowUp />
              <span className="text-sm font-medium ml-1">3.4%</span>
            </div>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-1">{stats.totalProducts}</h3>
          <p className="text-sm text-gray-600">Total Products</p>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Revenue Chart */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <FaChartLine />
              Revenue Trend
            </h2>
            <span className="text-sm text-gray-500">Last 6 months</span>
          </div>
          
          {/* Simple Bar Chart */}
          <div className="space-y-4">
            {monthlyData.map((item, index) => (
              <div key={index} className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-700">{item.month}</span>
                  <span className="font-medium">{formatCurrency(item.revenue)}</span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-primary to-secondary rounded-full"
                    style={{ width: `${(item.revenue / 100000) * 100}%` }}
                  ></div>
                </div>
                <div className="text-xs text-gray-500 text-right">
                  {item.orders} orders
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Products */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">Top Products</h2>
          
          <div className="space-y-4">
            {topProducts.map((product, index) => (
              <div key={index} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                    <span className="font-bold text-gray-700">{index + 1}</span>
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">{product.name}</div>
                    <div className="text-sm text-gray-500">{product.sales} units sold</div>
                  </div>
                </div>
                <div className="w-24 h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-green-500 rounded-full"
                    style={{ width: `${(product.sales / 400) * 100}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Stats</h2>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-4">
            <div className="text-2xl font-bold text-gray-900">{formatCurrency(72000)}</div>
            <div className="text-sm text-gray-600">Avg. Monthly Revenue</div>
          </div>
          
          <div className="text-center p-4">
            <div className="text-2xl font-bold text-gray-900">₹2,450</div>
            <div className="text-sm text-gray-600">Avg. Order Value</div>
          </div>
          
          <div className="text-center p-4">
            <div className="text-2xl font-bold text-gray-900">3.2</div>
            <div className="text-sm text-gray-600">Items per Order</div>
          </div>
          
          <div className="text-center p-4">
            <div className="text-2xl font-bold text-gray-900">68%</div>
            <div className="text-sm text-gray-600">Repeat Customers</div>
          </div>
        </div>
      </div>

      {/* Refresh Button */}
      <div className="mt-6 text-center">
        <button
          onClick={fetchAnalytics}
          className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
        >
          Refresh Data
        </button>
      </div>
    </div>
  );
}

export default AdminAnalytics;