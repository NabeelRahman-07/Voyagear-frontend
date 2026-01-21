import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import AdminNavbar from './common/AdminNavbar';
import AdminSidebar from './common/Sidebar';

function AdminLayout() {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Simple Navbar */}
      <AdminNavbar 
        toggleSidebar={() => setIsMobileSidebarOpen(true)}
      />
      
      <div className="flex pt-14"> {/* Reduced padding since navbar is simpler */}
        {/* Single Sidebar */}
        <AdminSidebar 
          isMobileOpen={isMobileSidebarOpen}
          onCloseMobile={() => setIsMobileSidebarOpen(false)}
        />
        
        {/* Main Content Area */}
        <main className="flex-1 p-4 lg:p-6 transition-all duration-300">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default AdminLayout;