import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar'; // Assuming your Sidebar component exists
import Header from './Header';   // Assuming your Header component exists

const Layout = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="flex bg-slate-50 min-h-screen font-sans">
      {/* The Sidebar is part of the layout, its state is managed here */}
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      
      <div className="flex-1 flex flex-col">
        {/* The Header can also be part of the layout and can control the sidebar */}
        <Header toggleSidebar={toggleSidebar} />
        
        <main className="p-4 sm:p-6 lg:p-8">
          {/* Outlet is the placeholder where your page components will be rendered */}
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;