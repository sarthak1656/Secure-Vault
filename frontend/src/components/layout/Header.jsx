import React, { useState, useRef, useEffect } from 'react';
import { Search, Bell, Menu, LogOut, User, Settings, ChevronDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Header = ({ title, onMenuClick, showSearch = true }) => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('authToken'); // Clear token
    navigate('/login'); // Redirect to login
  };

  return (
    <header className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4 relative z-20">
      
      {/* Left Side: Mobile Menu + Title/Search */}
      <div className="flex items-center gap-4 w-full md:w-auto">
        <button 
          onClick={onMenuClick} 
          className="md:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
        >
          <Menu className="w-6 h-6" />
        </button>
        
        {/* If we have a search bar, show it. Otherwise show the Page Title */}
        {showSearch ? (
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
            <input 
              type="text" 
              placeholder="Search files..." 
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-sm transition-all shadow-sm"
            />
          </div>
        ) : (
          <h1 className="text-2xl font-bold text-slate-900">{title}</h1>
        )}
      </div>

      {/* Right Side: Icons & Profile */}
      <div className="flex items-center gap-4 w-full md:w-auto justify-end">
        <button className="relative p-2 text-slate-500 hover:bg-slate-100 rounded-full transition-colors">
          <Bell className="w-6 h-6" />
          <span className="absolute top-2 right-2.5 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
        </button>
        
        {/* Profile Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button 
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            className="flex items-center gap-2 hover:bg-slate-50 p-1.5 pr-3 rounded-full transition-colors border border-transparent hover:border-slate-100"
          >
            <div className="w-9 h-9 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-700 font-bold border-2 border-indigo-50 shadow-sm">
              JD
            </div>
            <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${isProfileOpen ? 'rotate-180' : ''}`} />
          </button>

          {/* Dropdown Menu */}
          {isProfileOpen && (
            <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-slate-100 py-2 z-50 animate-in fade-in zoom-in-95 duration-200">
              <div className="px-4 py-3 border-b border-slate-50 mb-1">
                <p className="text-sm font-bold text-slate-900">John Doe</p>
                <p className="text-xs text-slate-500 truncate">john.doe@example.com</p>
              </div>
              
              <button 
                onClick={() => {
                  navigate('/settings');
                  setIsProfileOpen(false);
                }}
                className="w-full text-left px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 hover:text-blue-600 flex items-center gap-2 transition-colors"
              >
                <Settings className="w-4 h-4" /> Settings
              </button>
              
              <button 
                onClick={() => setIsProfileOpen(false)}
                className="w-full text-left px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 hover:text-blue-600 flex items-center gap-2 transition-colors"
              >
                <User className="w-4 h-4" /> Profile
              </button>

              <div className="my-1 border-t border-slate-50"></div>

              <button 
                onClick={handleLogout} 
                className="w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2 transition-colors"
              >
                <LogOut className="w-4 h-4" /> Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;