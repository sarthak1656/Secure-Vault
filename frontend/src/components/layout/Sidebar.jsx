import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, FileText, Share2, UploadCloud, Settings, LogOut, Shield, X } from 'lucide-react';

const Sidebar = ({ isOpen, onClose }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    navigate('/login');
  };

  const navItems = [
    { icon: <LayoutDashboard size={20} />, label: "Dashboard", path: "/dashboard" },
    { icon: <FileText size={20} />, label: "My Files", path: "/my-files" },
    { icon: <Share2 size={20} />, label: "Shared With Me", path: "/shared", badge: 3 },
    { icon: <UploadCloud size={20} />, label: "Upload File", path: "/upload" },
    { icon: <Settings size={20} />, label: "Settings", path: "/settings" },
  ];

  return (
    <>
      {/* Sidebar Container */}
      {/* - fixed inset-y-0 left-0: Pins it to the left
         - z-50: Ensures it's above everything else
         - transform: Enables sliding
         - md:translate-x-0: Always visible (slid in) on Desktop
         - ${isOpen ? 'translate-x-0' : '-translate-x-full'}: Slides in/out on Mobile
      */}
      <aside 
        className={`
          fixed inset-y-0 left-0 z-50 w-64 bg-slate-900 text-white shadow-xl
          transform transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full'} 
          md:translate-x-0
        `}
      >
        {/* Logo Area */}
        <div className="p-6 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-blue-600 p-2 rounded-lg">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold tracking-wide">Secure Vault</span>
          </div>
          
          {/* Close Button (Mobile Only) */}
          <button 
            onClick={onClose} 
            className="md:hidden text-slate-400 hover:text-white"
          >
            <X size={24} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={() => onClose()} // Auto-close menu on mobile when a link is clicked
              className={({ isActive }) => `
                flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200
                ${isActive 
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/50' 
                  : 'text-slate-400 hover:bg-slate-800 hover:text-white'}
              `}
            >
              {item.icon}
              <span className="font-medium">{item.label}</span>
              {item.badge && (
                <span className="ml-auto bg-blue-500 text-xs font-bold px-2 py-0.5 rounded-full">
                  {item.badge}
                </span>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Storage Widget */}
        <div className="p-6 mt-auto border-t border-slate-800 bg-slate-900">
          <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700/50">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-slate-400">Storage</span>
              <span className="text-blue-400 font-bold">50%</span>
            </div>
            <div className="w-full bg-slate-700 rounded-full h-2 mb-2">
              <div className="bg-blue-500 h-2 rounded-full w-1/2 shadow-[0_0_10px_rgba(59,130,246,0.5)]"></div>
            </div>
            <div className="text-xs text-slate-500">2.5 GB / 5 GB used</div>
          </div>

          {/* Logout */}
          <button 
            onClick={handleLogout}
            className="flex items-center gap-3 text-slate-400 hover:text-white mt-6 px-2 transition-colors w-full text-left"
          >
            <LogOut size={20} />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;