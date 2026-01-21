import React, { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { 
  FaTachometerAlt,
  FaBox,
  FaUsers,
  FaShoppingCart,
  FaChartBar,
  FaChevronLeft,
  FaChevronRight,
  FaTimes
} from 'react-icons/fa';
import api from '../../api/axiosInstance';

function AdminSidebar({ 
  isMobileOpen, 
  onCloseMobile 
}) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [pendingOrdersCount, setPendingOrdersCount] = useState(0);
  const [lowStockCount, setLowStockCount] = useState(0);
  const location = useLocation();

  useEffect(() => {
    fetchCounts();
  }, []);

  const fetchCounts = async () => {
    try {
      // Fetch pending orders count
      const usersRes = await api.get('/users');
      let pendingCount = 0;
      
      usersRes.data.forEach(user => {
        if (user.orders && Array.isArray(user.orders)) {
          pendingCount += user.orders.filter(order => 
            order.status === 'pending' || order.status === 'processing'
          ).length;
        }
      });
      
      setPendingOrdersCount(pendingCount);

      // Fetch low stock products
      const productsRes = await api.get('/products');
      const lowStock = productsRes.data.filter(product => 
        (product.stock || product.quantity || 0) < 10
      ).length;
      
      setLowStockCount(lowStock);
    } catch (error) {
      console.error('Error fetching sidebar counts:', error);
    }
  };

  // Navigation items with dynamic counts
  const navItems = [
    {
      section: 'Main',
      items: [
        { 
          path: '/admin', 
          icon: <FaTachometerAlt />, 
          label: 'Dashboard',
          exact: true
        },
        { 
          path: '/admin/products', 
          icon: <FaBox />, 
          label: 'Products',
          badge: lowStockCount > 0 ? lowStockCount : null,
          badgeColor: 'bg-red-500'
        },
        { 
          path: '/admin/orders', 
          icon: <FaShoppingCart />, 
          label: 'Orders',
          badge: pendingOrdersCount > 0 ? pendingOrdersCount : null,
          badgeColor: 'bg-yellow-500'
        },
        { 
          path: '/admin/customers', 
          icon: <FaUsers />, 
          label: 'Customers'
        },
        { 
          path: '/admin/analytics', 
          icon: <FaChartBar />, 
          label: 'Analytics'
        },
      ]
    }];

  // Check if path is active
  const isActivePath = (path, exact = false) => {
    if (exact) {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  };

  // Handle navigation click
  const handleNavClick = () => {
    // Close mobile sidebar when item is clicked (on mobile)
    if (window.innerWidth < 1024) {
      onCloseMobile();
    }
  };

  // Toggle sidebar collapse
  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <>
      {/* Mobile Overlay - Only show on mobile when sidebar is open */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden transition-opacity duration-300"
          onClick={onCloseMobile}
        />
      )}

      {/* Main Sidebar - Works for both mobile and desktop */}
      <aside className={`
        fixed lg:sticky top-0 left-0 h-screen bg-white border-r border-gray-200 
        z-50 transition-all duration-300 ease-in-out overflow-y-auto
        shadow-lg lg:shadow-none
        
        /* Mobile behavior */
        ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'}
        
        /* Desktop behavior */
        lg:translate-x-0 
        ${isCollapsed ? 'lg:w-20' : 'lg:w-64'}
        
        /* Width */
        w-64 lg:w-auto
      `}>
        
        {/* Header with Logo */}
        <div className={`
          p-4 border-b border-gray-200 
          flex items-center justify-between
          ${isCollapsed ? 'lg:flex-col lg:gap-4 lg:py-6' : ''}
        `}>
          {/* Logo */}
          <div className={`flex items-center ${isCollapsed ? 'lg:flex-col' : ''}`}>
            <div className="bg-gradient-to-r from-primary to-secondary w-8 h-8 rounded-lg flex-shrink-0"></div>
            
            {!isCollapsed && (
              <div className="ml-3">
                <div className="font-bold text-gray-800 text-lg">Voyagear</div>
                <div className="text-xs text-gray-500">Admin Panel</div>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            {/* Close Button (Mobile) */}
            <button
              onClick={onCloseMobile}
              className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
              aria-label="Close sidebar"
            >
              <FaTimes />
            </button>

            {/* Collapse Toggle (Desktop) */}
            <button
              onClick={toggleCollapse}
              className="hidden lg:flex p-2 hover:bg-gray-100 rounded-lg transition-colors"
              aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
              {isCollapsed ? <FaChevronRight /> : <FaChevronLeft />}
            </button>
          </div>
        </div>

        {/* Navigation Content */}
        <div className="py-4 overflow-y-auto h-[calc(100vh-80px)]">
          {navItems.map((section, sectionIndex) => (
            <div key={section.section} className="mb-8 last:mb-0">
              {/* Section Title (Hidden when collapsed) */}
              {!isCollapsed && (
                <div className="px-4 mb-3">
                  <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    {section.section}
                  </h3>
                </div>
              )}

              {/* Navigation Items */}
              <div className="space-y-1 px-2">
                {section.items.map((item) => {
                  const isActive = isActivePath(item.path, item.exact);
                  
                  return (
                    <NavLink
                      key={item.path}
                      to={item.path}
                      onClick={handleNavClick}
                      className={`
                        flex items-center rounded-lg mx-1 px-3 py-3
                        transition-all duration-200 relative
                        ${isActive 
                          ? 'bg-gradient-to-r from-primary/10 to-secondary/10 text-primary font-medium' 
                          : 'text-gray-700 hover:bg-gray-100'
                        }
                        ${isCollapsed ? 'lg:justify-center' : ''}
                      `}
                    >
                      {/* Icon */}
                      <div className={`relative ${isCollapsed ? '' : 'mr-3'}`}>
                        {item.icon}
                        
                        {/* Badge for collapsed view */}
                        {isCollapsed && item.badge && (
                          <span className={`
                            absolute -top-1 -right-1 w-2 h-2 rounded-full
                            ${item.badgeColor}
                          `} />
                        )}
                      </div>

                      {/* Label and Badge */}
                      {!isCollapsed && (
                        <div className="flex-1 flex items-center justify-between">
                          <span>{item.label}</span>
                          
                          {/* Badge for expanded view */}
                          {item.badge && (
                            <span className={`
                              text-xs px-2 py-1 rounded-full text-white
                              ${item.badgeColor}
                            `}>
                              {item.badge}
                            </span>
                          )}
                        </div>
                      )}
                    </NavLink>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </aside>
    </>
  );
}

export default AdminSidebar;