import React, { useState, useEffect } from 'react';
import { FaEye, FaCheckCircle, FaTimesCircle, FaTruck, FaEdit, FaTimes } from 'react-icons/fa';
import api from '../../api/axiosInstance';
import { toast } from 'react-toastify';

function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');

  const [showStatusModal, setShowStatusModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [newStatus, setNewStatus] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);

  const openStatusModal = (order) => {
    setShowStatusModal(true);
    setSelectedOrder(order);
    setNewStatus(order.orderStatus || 'Placed');
  };

  const handleStatusUpdate = async () => {
  if (!selectedOrder || !newStatus) return;

  setIsUpdating(true);
  try {
    // 1. Get the user who placed this order
    const usersRes = await api.get('/users');
    const user = usersRes.data.find(u => 
      u.orders?.some(order => order.orderId === selectedOrder.orderId)
    );
    
    if (!user) {
      toast.error('User not found for this order');
      return;
    }
    
    // 2. Update the order in user's orders array
    const updatedOrders = user.orders.map(order => 
      order.orderId === selectedOrder.orderId 
        ? { 
            ...order, 
            orderStatus: newStatus,
            // Optional: Add updated timestamp
           // updatedAt: new Date().toISOString()
          } 
        : order
    );
    
    // 3. Update the user in JSON server
    await api.put(`/users/${user.id}`, {
      ...user,
      orders: updatedOrders
    });
    
    // 4. Update local state
    setOrders(orders.map(order => 
      order.orderId === selectedOrder.orderId 
        ? { 
            ...order, 
            orderStatus: newStatus,
            updatedAt: new Date().toISOString()
          } 
        : order
    ));
    
    // 5. Show success and close modal
    toast.success(`Order status updated to ${newStatus}`);
    setShowStatusModal(false);
    setSelectedOrder(null);
    setNewStatus('');
    
  } catch (error) {
    console.error('Error updating order status:', error);
    toast.error('Failed to update order status');
  } finally {
    setIsUpdating(false);
  }
};


  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const usersRes = await api.get('/users');
      let allOrders = [];

      // Extract orders from all users
      usersRes.data.forEach(user => {
        if (user.orders && Array.isArray(user.orders)) {
          user.orders.forEach(order => {
            allOrders.push({
              ...order,
              userId: user.id,
              userName: user.name,
              userEmail: user.email
            });
          });
        }
      });

      // Sort by date (newest first)
      allOrders.sort((a, b) => new Date(b.date || b.createdAt) - new Date(a.date || a.createdAt));

      setOrders(allOrders);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  // const updateOrderStatus = async (orderId, newStatus) => {
  //   try {
  //     // Note: In JSON server, you need to find the user first, then update the order
  //     // This is simplified - you may need to adjust based on your data structure
  //     console.log(`Update order ${orderId} to ${newStatus}`);

  //     // Refresh orders
  //     fetchOrders();
  //   } catch (error) {
  //     console.error('Error updating order:', error);
  //   }
  // };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'Placed': return 'bg-yellow-100 text-yellow-800';
      case 'Processing': return 'bg-blue-100 text-blue-800';
      case 'Shipped': return 'bg-purple-100 text-purple-800';
      case 'Delivered': return 'bg-green-100 text-green-800';
      case 'Cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case 'Delivered': return <FaCheckCircle className="text-green-500" />;
      case 'Cancelled': return <FaTimesCircle className="text-red-500" />;
      case 'Shipped': return <FaTruck className="text-purple-500" />;
      default: return null;
    }
  };

  // Filter orders by status
  const filteredOrders = statusFilter === 'all'
    ? orders
    : orders.filter(order => order.orderStatus?.toLowerCase() === statusFilter);

  // Get unique statuses for filter
  const statuses = ['all', ...new Set(orders.map(o => o.status?.toLowerCase()).filter(Boolean))];

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
    }).format(amount || 0);
  };

  return (
    <div className="p-4">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Orders</h1>
        <p className="text-gray-600">Manage customer orders</p>
      </div>

      {/* Filters */}
      <div className="bg-white border border-gray-200 rounded-lg p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4 justify-between">
          <div className="flex flex-wrap gap-2">
            {statuses.map(status => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-3 py-1 rounded-full text-sm ${statusFilter === status
                  ? 'bg-primary text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
                {status !== 'all' && ` (${orders.filter(o => o.status?.toLowerCase() === status).length})`}
              </button>
            ))}
          </div>

          <button
            onClick={fetchOrders}
            className="px-3 py-2 border border-gray-300 rounded text-sm hover:bg-gray-50"
          >
            Refresh
          </button>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        {loading ? (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="mt-2 text-gray-600">Loading orders...</p>
          </div>
        ) : filteredOrders.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Order ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="font-medium text-gray-900">
                        #{order.id || order.orderId || 'N/A'}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <div className="font-medium">{order.userName || 'Customer'}</div>
                        <div className="text-sm text-gray-500">{order.userEmail || ''}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {formatDate(order.createdAt)}
                    </td>
                    <td className="px-6 py-4 font-medium">
                      {formatCurrency(order.totalAmount)}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(order.orderStatus)}`}>
                          {order.orderStatus || 'Placed'}
                        </span>
                        {getStatusIcon(order.orderStatus)}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <button className="p-2 text-blue-600 hover:bg-blue-50 rounded">
                          <FaEye />
                        </button>

                        {/* Quick Status Update Buttons */}
                        <button
                          onClick={() => openStatusModal(order)}
                          className="p-2 text-green-600 hover:bg-green-50 rounded"
                          title="Change Status"
                        >
                          <FaEdit />
                        </button>

                        {/* {order.orderStatus?.toLowerCase() === 'processing' && (
                          <button
                            onClick={() => updateOrderStatus(order.id, 'shipped')}
                            className="px-2 py-1 text-xs bg-purple-100 text-purple-700 rounded hover:bg-purple-200"
                          >
                            Ship
                          </button>
                        )} */}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-8 text-center text-gray-500">
            No orders found
          </div>
        )}

        {/* Summary */}
        <div className="border-t border-gray-200 px-6 py-4 bg-gray-50">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">
              {filteredOrders.length} order{filteredOrders.length !== 1 ? 's' : ''} •
              Total: {formatCurrency(filteredOrders.reduce((sum, order) => sum + (order.totalAmount || 0), 0))}
            </span>
          </div>
        </div>
      </div>

      {/* Status Change Modal */}
      {showStatusModal && selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg w-full max-w-md">
            {/* Modal Header */}
            <div className="flex justify-between items-center p-6 border-b">
              <h3 className="text-xl font-bold text-gray-900">Update Order Status</h3>
              <button
                onClick={() => setShowStatusModal(false)}
                className="p-2 hover:bg-gray-100 rounded"
                disabled={isUpdating}
              >
                <FaTimes />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6">
              <div className="mb-6">
                <p className="text-gray-700 mb-2">
                  <span className="font-medium">Order ID:</span> #{selectedOrder.orderId || 'N/A'}
                </p>
                <p className="text-gray-700 mb-2">
                  <span className="font-medium">Customer:</span> {selectedOrder.userName || 'Customer'}
                </p>
                <p className="text-gray-700">
                  <span className="font-medium">Current Status:</span>
                  <span className={`ml-2 px-2 py-1 text-xs rounded ${getStatusColor(selectedOrder.orderStatus)}`}>
                    {selectedOrder.orderStatus || 'Placed'}
                  </span>
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Select New Status
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {['Placed', 'Processing', 'Shipped', 'Delivered', 'Cancelled'].map((status) => (
                    <button
                      key={status}
                      onClick={() => setNewStatus(status)}
                      className={`
                  px-4 py-3 rounded-lg border transition-all
                  ${newStatus === status
                          ? 'bg-primary border-primary text-white'
                          : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                        }
                  ${status === 'Cancelled' ? 'hover:bg-red-50' : ''}
                `}
                      disabled={isUpdating}
                    >
                      <div className="flex flex-col items-center gap-1">
                        {status === 'Delivered' && <FaCheckCircle />}
                        {status === 'Cancelled' && <FaTimesCircle />}
                        {status === 'Shipped' && <FaTruck />}
                        <span className="text-sm font-medium capitalize">{status}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Status Description */}
              {newStatus && (
                <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600">
                    {newStatus === 'Placed' && 'Order received, awaiting processing'}
                    {newStatus === 'Processing' && 'Order is being prepared for shipment'}
                    {newStatus === 'Shipped' && 'Order has been shipped to customer'}
                    {newStatus === 'Delivered' && 'Order has been successfully delivered'}
                    {newStatus === 'Cancelled' && 'Order has been cancelled'}
                  </p>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-6 border-t flex justify-end gap-3">
              <button
                onClick={() => setShowStatusModal(false)}
                className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50"
                disabled={isUpdating}
              >
                Cancel
              </button>
              <button
                onClick={handleStatusUpdate}
                disabled={isUpdating || !newStatus}
                className="px-4 py-2 bg-primary text-white rounded hover:bg-primary/90 flex items-center gap-2 disabled:opacity-50"
              >
                {isUpdating ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Updating...
                  </>
                ) : (
                  <>
                    <FaEdit />
                    Update Status
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminOrders;