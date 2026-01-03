import React, { useState, useEffect } from 'react';
import { FaEye, FaUserEdit, FaEnvelope, FaCalendar, FaShoppingCart, FaBan, FaCheckCircle, FaTimes } from 'react-icons/fa';
import api from '../../api/axiosInstance';

function AdminCustomers() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  
  // Modal states
  const [showUserModal, setShowUserModal] = useState(false);
  const [showBlockModal, setShowBlockModal] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      const response = await api.get('/users');
      const customerUsers = response.data.filter(user =>
        user.role !== 'Admin'
      );
      setCustomers(customerUsers);
    } catch (error) {
      console.error('Error fetching customers:', error);
    } finally {
      setLoading(false);
    }
  };

  const getTotalOrders = (customer) => {
    return customer.orders?.length || 0;
  };

  const getTotalSpent = (customer) => {
    if (!customer.orders) return 0;
    return customer.orders.reduce((total, order) => total + (order.totalAmount || 0), 0);
  };

  const filteredCustomers = customers.filter(customer =>
    customer.name?.toLowerCase().includes(search.toLowerCase()) ||
    customer.email?.toLowerCase().includes(search.toLowerCase())
  );

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  // Modal functions
  const handleViewDetails = (customer) => {
    setSelectedCustomer(customer);
    setShowUserModal(true);
  };

  const handleBlockClick = (customer) => {
    setSelectedCustomer(customer);
    setShowBlockModal(true);
  };

  const handleBlockConfirm = async () => {
    if (!selectedCustomer) return;
    
    try {
      await api.put(`/users/${selectedCustomer.id}`, {
        ...selectedCustomer,
        isBlock: !selectedCustomer.isBlock
      });
      fetchCustomers();
      setShowBlockModal(false);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div className="p-4">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Customers</h1>
        <p className="text-gray-600">Manage your customer accounts</p>
      </div>

      {/* Search Bar */}
      <div className="bg-white border border-gray-200 rounded-lg p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search customers by name or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
            />
          </div>
          <button
            onClick={fetchCustomers}
            className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50"
          >
            Refresh
          </button>
        </div>
      </div>

      {/* Customers Table - ADDED STATUS COLUMN */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        {loading ? (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="mt-2 text-gray-600">Loading customers...</p>
          </div>
        ) : filteredCustomers.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th> 
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Contact</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Joined</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Orders</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total Spent</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredCustomers.map((customer) => (
                  <tr key={customer.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="h-10 w-10 rounded-full bg-gradient-to-r from-primary to-secondary flex items-center justify-center text-white font-medium">
                          {customer.name?.charAt(0) || 'C'}
                        </div>
                        <div className="ml-4">
                          <div className="font-medium text-gray-900">{customer.name || 'Customer'}</div>
                          <div className="text-sm text-gray-500">ID: {customer.id}</div>
                        </div>
                      </div>
                    </td>
                    {/* NEW STATUS COLUMN */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        {/* <div className={`w-2 h-2 rounded-full ${customer.isBlock ? 'bg-red-500' : 'bg-green-500'}`}></div> */}
                        <span className={`px-2 py-1 text-xs rounded-full ${customer.isBlock ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
                          {customer.isBlock ? 'Blocked' : 'Active'}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-sm">
                        <FaEnvelope className="text-gray-400" />
                        <span>{customer.email}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      <div className="flex items-center gap-2">
                        <FaCalendar className="text-gray-400" />
                        {formatDate(customer.createdAt || customer.joinedDate)}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <FaShoppingCart className="text-gray-400" />
                        <span className="font-medium">{getTotalOrders(customer)}</span>
                        <span className="text-sm text-gray-500">orders</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-medium">
                      {formatCurrency(getTotalSpent(customer))}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <button 
                          onClick={() => handleViewDetails(customer)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                          title="View Details"
                        >
                          <FaEye />
                        </button>
                        <button 
                          onClick={() => handleBlockClick(customer)}
                          className={`p-2 rounded ${customer.isBlock ? 'text-green-600 hover:bg-green-50' : 'text-red-600 hover:bg-red-50'}`}
                          title={customer.isBlock ? 'Unblock User' : 'Block User'}
                        >
                          {customer.isBlock ? <FaCheckCircle /> : <FaBan />}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-8 text-center text-gray-500">
            No customers found
          </div>
        )}

        {/* Summary */}
        <div className="border-t border-gray-200 px-6 py-4 bg-gray-50">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">
              {filteredCustomers.length} customer{filteredCustomers.length !== 1 ? 's' : ''}
            </span>
            <div className="text-sm text-gray-600">
              Total Revenue: {formatCurrency(
                customers.reduce((total, customer) => total + getTotalSpent(customer), 0)
              )}
            </div>
          </div>
        </div>
      </div>

      {/*User Details Modal */}
      {showUserModal && selectedCustomer && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl w-full max-w-md shadow-xl">
            <div className="flex justify-between items-center p-6 border-b">
              <div>
                <h3 className="text-xl font-bold text-gray-900">Customer Profile</h3>
                <p className="text-sm text-gray-600 mt-1">ID: {selectedCustomer.id}</p>
              </div>
              <button 
                onClick={() => setShowUserModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <FaTimes />
              </button>
            </div>

            <div className="p-6">
              <div className="flex items-center gap-4 mb-6">
                <div className="h-16 w-16 rounded-full bg-gradient-to-r from-primary to-secondary flex items-center justify-center text-white text-2xl font-bold shadow-lg">
                  {selectedCustomer.name?.charAt(0) || 'C'}
                </div>
                <div className="flex-1">
                  <h4 className="text-lg font-bold text-gray-900">{selectedCustomer.name}</h4>
                  <p className="text-gray-600 flex items-center gap-2 mt-1">
                    <FaEnvelope className="text-sm" />
                    {selectedCustomer.email}
                  </p>
                  <div className="flex items-center gap-3 mt-2">
                    <span className={`px-3 py-1 text-sm rounded-full font-medium ${selectedCustomer.isBlock ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
                      {selectedCustomer.isBlock ? 'Blocked' : 'Active'}
                    </span>
                    <span className="px-3 py-1 bg-gray-100 text-gray-800 text-sm rounded-full">
                      {selectedCustomer.role}
                    </span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="text-2xl font-bold text-primary">{getTotalOrders(selectedCustomer)}</div>
                  <div className="text-sm text-gray-600">Total Orders</div>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="text-2xl font-bold text-primary">{formatCurrency(getTotalSpent(selectedCustomer))}</div>
                  <div className="text-sm text-gray-600">Total Spent</div>
                </div>
              </div>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between py-2 border-b">
                  <span className="text-gray-600">Joined Date</span>
                  <span className="font-medium">{formatDate(selectedCustomer.createdAt || selectedCustomer.joinedDate)}</span>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span className="text-gray-600">Account Status</span>
                  <span className={`font-medium ${selectedCustomer.isBlock ? 'text-red-600' : 'text-green-600'}`}>
                    {selectedCustomer.isBlock ? 'Blocked' : 'Active'}
                  </span>
                </div>
              </div>
            </div>

            <div className="p-6 border-t flex gap-3">
              <button
                onClick={() => {
                  setShowUserModal(false);
                  handleBlockClick(selectedCustomer);
                }}
                className={`flex-1 py-3 rounded-lg font-medium transition-colors ${selectedCustomer.isBlock ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'} text-white`}
              >
                {selectedCustomer.isBlock ? 'Unblock Account' : 'Block Account'}
              </button>
              <button
                onClick={() => setShowUserModal(false)}
                className="flex-1 py-3 border border-gray-300 rounded-lg font-medium hover:bg-gray-50 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/*Block Confirmation Modal */}
      {showBlockModal && selectedCustomer && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl w-full max-w-md shadow-xl">
            <div className="p-6 border-b">
              <div className="flex items-center gap-4 mb-4">
                <div className={`h-12 w-12 rounded-full flex items-center justify-center ${selectedCustomer.isBlock ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                  {selectedCustomer.isBlock ? <FaCheckCircle className="text-xl" /> : <FaBan className="text-xl" />}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900">
                    {selectedCustomer.isBlock ? 'Unblock Customer' : 'Block Customer'}
                  </h3>
                  <p className="text-gray-600">{selectedCustomer.name}</p>
                </div>
              </div>
            </div>

            <div className="p-6">
              <div className="mb-6">
                <p className="text-gray-700 mb-4">
                  {selectedCustomer.isBlock 
                    ? 'This will restore access to their account. The user will be able to login and place orders again.'
                    : 'This will prevent the user from logging in or placing new orders. Existing orders will not be affected.'
                  }
                </p>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Current Status:</span>
                    <span className={`px-3 py-1 rounded-full text-sm ${selectedCustomer.isBlock ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
                      {selectedCustomer.isBlock ? 'Blocked' : 'Active'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowBlockModal(false)}
                  className="flex-1 py-3 border border-gray-300 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleBlockConfirm}
                  className={`flex-1 py-3 rounded-lg font-medium text-white transition-colors ${selectedCustomer.isBlock ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'}`}
                >
                  {selectedCustomer.isBlock ? 'Unblock User' : 'Block User'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
    </div>
  );
}

export default AdminCustomers;