import React from 'react';
import { ArrowRight, CheckCircle, FolderOpen } from 'lucide-react';

const Hero = () => {
  return (
    <header className="bg-gradient-to-br from-blue-600 to-indigo-700 text-white pt-20 pb-24 px-4">
      <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">
        <div className="space-y-8">
          <h1 className="text-4xl md:text-5xl font-extrabold leading-tight">
            Secure Cloud File Storage with End-to-End Encryption
          </h1>
          <p className="text-blue-100 text-lg md:text-xl max-w-lg leading-relaxed">
            Store, share, and manage your files with military-grade encryption. Only you control access to your data.
          </p>
          <div className="flex flex-wrap gap-4">
            <button className="bg-slate-900 text-white px-8 py-3.5 rounded-lg font-semibold hover:bg-slate-800 transition flex items-center gap-2 shadow-lg">
              Start Free <ArrowRight className="w-4 h-4" />
            </button>
            <button className="bg-white/10 backdrop-blur-sm border border-white/30 text-white px-8 py-3.5 rounded-lg font-semibold hover:bg-white/20 transition">
              Learn More
            </button>
          </div>
          
          <div className="pt-4 flex items-center gap-4 text-sm text-blue-200">
            <span className="flex items-center gap-1"><CheckCircle className="w-4 h-4" /> No credit card required</span>
            <span className="flex items-center gap-1"><CheckCircle className="w-4 h-4" /> 14-day free trial</span>
          </div>
        </div>

        {/* Hero Image Mockup */}
        <div className="relative">
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 shadow-2xl transform rotate-2 hover:rotate-0 transition duration-500">
             <div className="bg-white rounded-lg shadow-inner overflow-hidden aspect-[4/3] flex items-center justify-center bg-slate-50">
                <div className="text-center">
                  <div className="bg-blue-100 p-4 rounded-full inline-block mb-3">
                    <FolderOpen className="w-12 h-12 text-blue-600" />
                  </div>
                  <p className="text-slate-400 font-medium">Drag & Drop files here</p>
                </div>
             </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Hero;