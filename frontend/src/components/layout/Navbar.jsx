import React, { useState } from "react";
import { Shield, Menu, X } from "lucide-react";
import { Link } from "react-router-dom";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="border-b bg-white sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="bg-blue-600 p-1.5 rounded-lg">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <span className="font-bold text-xl tracking-tight text-slate-900">
              Secure Vault
            </span>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-8">
            <a
              href="#features"
              className="text-slate-600 hover:text-blue-600 transition"
            >
              Features
            </a>
            <a
              href="#how-it-works"
              className="text-slate-600 hover:text-blue-600 transition"
            >
              How it Works
            </a>
            <a
              href="#pricing"
              className="text-slate-600 hover:text-blue-600 transition"
            >
              Pricing
            </a>
            <div className="flex items-center gap-4 ml-4">
              <Link
                to="/login"
                className="text-slate-900 font-medium hover:text-blue-600"
              >
                Login
              </Link>
              <Link
                to={"/register"}
                className="bg-blue-600 text-white px-5 py-2 rounded-lg font-medium hover:bg-blue-700 transition shadow-sm hover:shadow-md"
              >
                Get Started
              </Link>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 text-slate-600"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </div>

      {/* Mobile Nav Dropdown */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t p-4 space-y-4 shadow-lg">
          <a href="#features" className="block text-slate-600">
            Features
          </a>
          <a href="#how-it-works" className="block text-slate-600">
            How it Works
          </a>
          <button className="block w-full text-left text-slate-900 font-medium">
            Login
          </button>
          <button className="block w-full bg-blue-600 text-white px-5 py-2 rounded-lg">
            Get Started
          </button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
