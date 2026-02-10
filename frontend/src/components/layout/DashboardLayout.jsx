import React, { useState } from 'react';
import Sidebar from './Sidebar';
import { Menu } from 'lucide-react';

const DashboardLayout = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-slate-50">
      
      {/* --- Mobile Header (Visible only on small screens) --- */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-slate-900 z-40 flex items-center px-4 justify-between shadow-md">
        <div className="flex items-center gap-2 font-bold text-xl text-white tracking-tight">
          {/* You can replicate your Logo component here briefly or just text */}
          <span className="bg-blue-600 p-1 rounded-lg w-8 h-8 flex items-center justify-center">
            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
          </span>
          Secure Vault
        </div>
        <button 
          onClick={() => setIsSidebarOpen(true)} 
          className="p-2 text-slate-300 hover:text-white"
        >
          <Menu className="w-6 h-6" />
        </button>
      </div>

      {/* --- Sidebar Component --- */}
      {/* We pass the state to control visibility on mobile */}
      <Sidebar 
        isOpen={isSidebarOpen} 
        onClose={() => setIsSidebarOpen(false)} 
      />

      {/* --- Mobile Overlay Backdrop --- */}
      {/* Clicking this dark background closes the menu */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden backdrop-blur-sm"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* --- Main Content Area --- */}
      {/* Changed: 'ml-64' is now 'md:ml-64' (only on desktop). 'ml-0' on mobile. */}
      {/* Added: 'pt-16 md:pt-0' to push content down below the mobile header */}
      <main className="flex-1 ml-0 md:ml-64 transition-all duration-200 ease-in-out">
        <div className="p-4 md:p-8 pt-20 md:pt-8 max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;