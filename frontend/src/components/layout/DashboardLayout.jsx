import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom'; // Added for auto-closing menu
import Sidebar from './Sidebar';
import { Menu, Shield } from 'lucide-react';

const DashboardLayout = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();

  // Auto-close sidebar on mobile when navigating to a new page
  useEffect(() => {
    setIsSidebarOpen(false);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen bg-slate-50">
      
      {/* --- Mobile Header --- */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-slate-900 z-40 flex items-center px-4 justify-between shadow-md">
        <div className="flex items-center gap-2 font-bold text-xl text-white tracking-tight">
          <div className="bg-blue-600 p-1.5 rounded-lg">
            <Shield className="w-5 h-5 text-white" />
          </div>
          <span>Secure Vault</span>
        </div>
        <button 
          onClick={() => setIsSidebarOpen(true)} 
          className="p-2 text-slate-300 hover:text-white transition-colors"
          aria-label="Open Menu"
        >
          <Menu className="w-6 h-6" />
        </button>
      </div>

      {/* --- Sidebar Component --- */}
      <Sidebar 
        isOpen={isSidebarOpen} 
        onClose={() => setIsSidebarOpen(false)} 
      />

      {/* --- Mobile Overlay Backdrop --- */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/60 z-40 md:hidden backdrop-blur-sm transition-opacity"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* --- Main Content Area --- */}
      <main className="flex-1 ml-0 md:ml-64 transition-all duration-200 ease-in-out">
        {/* pt-20 for mobile to clear the 16 (4rem) header + extra padding
           md:pt-8 for desktop standard padding
        */}
        <div className="p-4 md:p-8 pt-24 md:pt-8 max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;