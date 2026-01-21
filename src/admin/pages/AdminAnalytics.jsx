import React, { useEffect, useState } from "react";
import {
  AreaChart, Area,
  PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  Legend
} from "recharts";
import {
  TrendingUp, Users, IndianRupeeIcon, Package,
  ShoppingCart, UserCheck, UserX, Calendar
} from "lucide-react";
import api from "../../api/axiosInstance";

function AdminAnalytics() {
  const [stats, setStats] = useState([]);
  const [userStats, setUserStats] = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [metrics, setMetrics] = useState({
    totalOrders: 0,
    totalRevenue: 0,
    avgOrderValue: 0,
    activeUsers: 0,
    blockedUsers: 0
  });

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const usersRes = await api.get("/users");
      const users = usersRes.data.filter(u => u.role !== "Admin");

      let dailyData = {};
      let blocked = 0;
      let totalOrders = 0;
      let totalRevenue = 0;
      const productSales = {};

      users.forEach(user => {
        if (user.isBlock) blocked++;

        user.orders?.forEach(order => {
          totalOrders++;
          totalRevenue += order.totalAmount || 0;
          const date = new Date(order.createdAt).toLocaleDateString();

          if (!dailyData[date]) {
            dailyData[date] = { date, orders: 0, revenue: 0 };
          }

          dailyData[date].orders += 1;
          dailyData[date].revenue += order.totalAmount || 0;

          // Track top products
          order.items?.forEach(item => {
            const productId = item.productId;
            if (!productSales[productId]) {
              productSales[productId] = {
                name: item.name,
                sales: 0,
                revenue: 0
              };
            }
            productSales[productId].sales += item.quantity;
            productSales[productId].revenue += (item.price) * (item.quantity);
          });
        });
      });

      // Sort stats by date ascending
      const sortedStats = Object.values(dailyData).sort((a, b) => 
        new Date(a.date) - new Date(b.date)
      );

      const sortedProducts = Object.values(productSales)
        .sort((a, b) => b.revenue - a.revenue)
        .slice(0, 3);

      setStats(sortedStats);
      setTopProducts(sortedProducts);
      
      setUserStats([
        { name: "Active Users", value: users.length - blocked },
        { name: "Blocked Users", value: blocked }
      ]);

      setMetrics({
        totalOrders,
        totalRevenue,
        avgOrderValue: totalOrders > 0 ? totalRevenue / totalOrders : 0,
        activeUsers: users.length - blocked,
        blockedUsers: blocked
      });

    } catch (err) {
      console.error("Analytics error", err);
    } finally {
      setLoading(false);
    }
  };

  const MetricCard = ({ title, value, icon: Icon }) => (
    <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center mb-4">
        <div className="p-3 rounded-lg bg-primary/10">
          <Icon className="h-7 w-7 text-primary" />
        </div>
      </div>
      <h3 className="text-2xl font-bold text-gray-900">{value}</h3>
      <p className="text-gray-600 text-sm mt-1">{title}</p>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin h-12 w-12 border-4 border-primary border-t-transparent rounded-full mx-auto" />
          <p className="mt-4 text-lg text-gray-600 font-medium">Loading dashboard...</p>
          <p className="text-gray-500">Fetching your business insights</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Analytics Dashboard</h1>
          <p className="text-gray-600 mt-1">Monitor your business performance</p>
        </div>
        <button
          onClick={fetchAnalytics}
          className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-gray-700 hover:bg-gray-50 flex items-center gap-2 mt-4 md:mt-0"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Refresh Data
        </button>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <MetricCard
          title="Total Revenue"
          value={`₹${metrics.totalRevenue.toLocaleString()}`}
          icon={IndianRupeeIcon}
        />
        <MetricCard
          title="Total Orders"
          value={metrics.totalOrders.toLocaleString()}
          icon={ShoppingCart}
        />
        <MetricCard
          title="Active Users"
          value={metrics.activeUsers.toLocaleString()}
          icon={UserCheck}
        />
        <MetricCard
          title="Avg Order Value"
          value={`₹${metrics.avgOrderValue.toFixed(2)}`}
          icon={TrendingUp}
        />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Orders & Revenue Chart */}
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold text-gray-900">Orders & Revenue Trend</h2>
              <p className="text-gray-600 text-sm">Daily performance overview</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-secondary mr-2"></div>
                <span className="text-sm text-gray-600">Orders</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-primary mr-2"></div>
                <span className="text-sm text-gray-600">Revenue</span>
              </div>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={stats}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis 
                dataKey="date" 
                tick={{ fill: '#666' }}
                axisLine={{ stroke: '#e5e5e5' }}
              />
              <YAxis 
                tick={{ fill: '#666' }}
                axisLine={{ stroke: '#e5e5e5' }}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'white',
                  border: '1px solid #e5e5e5',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                }}
                formatter={(value, name) => {
                  if (name === 'revenue') return [`₹${value}`, 'Revenue'];
                  return [value, 'Orders'];
                }}
              />
              <Area 
                type="monotone" 
                dataKey="orders" 
                stroke="#FF7A18" 
                fill="#FF7A18" 
                fillOpacity={0.1}
                strokeWidth={2}
              />
              <Area 
                type="monotone" 
                dataKey="revenue" 
                stroke="#0B3C5D" 
                fill="#0B3C5D" 
                fillOpacity={0.1}
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* User Distribution */}
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
          <div className="mb-6">
            <h2 className="text-xl font-bold text-gray-900">User Distribution</h2>
            <p className="text-gray-600 text-sm">Active vs Blocked users</p>
          </div>
          <div className="flex items-center justify-center">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={userStats}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  label={(entry) => `${entry.name}: ${entry.value}`}
                >
                  <Cell key="active-users" fill="#0B3C5D" />
                  <Cell key="blocked-users" fill="#FF7A18" />
                </Pie>
                <Tooltip 
                  formatter={(value) => [value, 'Users']}
                  contentStyle={{ 
                    backgroundColor: 'white',
                    border: '1px solid #e5e5e5',
                    borderRadius: '8px'
                  }}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-2 gap-4 mt-6">
            <div className="text-center p-4 rounded-lg bg-blue-50">
              <div className="text-2xl font-bold text-primary">{metrics.activeUsers}</div>
              <div className="text-sm text-gray-600">Active Users</div>
            </div>
            <div className="text-center p-4 rounded-lg bg-orange-50">
              <div className="text-2xl font-bold text-secondary">{metrics.blockedUsers}</div>
              <div className="text-sm text-gray-600">Blocked Users</div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Products */}
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold text-gray-900">Top Performing Products</h2>
              <p className="text-gray-600 text-sm">By revenue generated</p>
            </div>
            <Package className="text-gray-400" />
          </div>
          <div className="space-y-4">
            {topProducts.map((product, index) => (
              <div key={index} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors">
                <div className="flex items-center">
                  <div className="w-8 h-8 flex items-center justify-center rounded-md bg-primary/10 text-primary font-bold mr-3">
                    {index + 1}
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">{product.name}</div>
                    <div className="text-sm text-gray-500">{product.sales} units sold</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-gray-900">₹{product.revenue.toLocaleString()}</div>
                  <div className="text-sm text-gray-500">Revenue</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold text-gray-900">Recent Activity</h2>
              <p className="text-gray-600 text-sm">Latest orders performance</p>
            </div>
            <Calendar className="text-gray-400" />
          </div>
          <div className="space-y-4">
            {stats.slice(-3).reverse().map((day, index) => (
              <div key={index} className="p-4 border border-gray-200 rounded-lg hover:border-primary/30 transition-colors">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="font-medium text-gray-900">{day.date}</div>
                    <div className="text-sm text-gray-500 mt-1">
                      {day.orders} orders • ₹{day.revenue.toLocaleString()} revenue
                    </div>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                    day.orders > 10 ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                  }`}>
                    {day.orders > 10 ? 'High' : 'Normal'}
                  </div>
                </div>
                <div className="mt-3 w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-primary rounded-full h-2 transition-all duration-500"
                    style={{ width: `${Math.min(day.orders * 10, 100)}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminAnalytics;