import React from 'react';
import { Shield } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-slate-900 text-slate-400 py-12 px-4">
      <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-8 text-sm">
        <div className="col-span-1 md:col-span-2">
          <div className="flex items-center gap-2 mb-4">
            <Shield className="w-6 h-6 text-white" />
            <span className="font-bold text-xl text-white">Secure Vault</span>
          </div>
          <p className="max-w-xs">Making cloud storage secure, simple, and accessible for everyone.</p>
        </div>
        <div>
          <h4 className="text-white font-semibold mb-4">Product</h4>
          <ul className="space-y-2">
            <li><a href="#" className="hover:text-white">Features</a></li>
            <li><a href="#" className="hover:text-white">Security</a></li>
            <li><a href="#" className="hover:text-white">Pricing</a></li>
          </ul>
        </div>
        <div>
          <h4 className="text-white font-semibold mb-4">Company</h4>
          <ul className="space-y-2">
            <li><a href="#" className="hover:text-white">About Us</a></li>
            <li><a href="#" className="hover:text-white">Careers</a></li>
            <li><a href="#" className="hover:text-white">Contact</a></li>
          </ul>
        </div>
      </div>
      <div className="max-w-7xl mx-auto mt-12 pt-8 border-t border-slate-800 text-center">
        &copy; 2026 Secure Vault. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;