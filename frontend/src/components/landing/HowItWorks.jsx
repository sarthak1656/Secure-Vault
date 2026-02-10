import React from 'react';

const Step = ({ number, title, desc }) => (
  <div className="relative z-10 bg-white p-6 rounded-xl md:bg-transparent md:p-0">
    <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-lg mx-auto mb-6 shadow-lg shadow-blue-200">
      {number}
    </div>
    <h3 className="text-lg font-bold text-slate-900 mb-2">{title}</h3>
    <p className="text-sm text-slate-600">{desc}</p>
  </div>
);

const HowItWorks = () => {
  return (
    <section id="how-it-works" className="py-24 px-4 bg-white">
      <div className="max-w-7xl mx-auto text-center">
        <h2 className="text-3xl font-bold text-slate-900 mb-16">How It Works</h2>
        
        <div className="grid md:grid-cols-4 gap-8 relative">
          {/* Connecting Line (Desktop Only) */}
          <div className="hidden md:block absolute top-1/2 left-0 w-full h-0.5 bg-slate-100 -translate-y-1/2 z-0" />

          <Step number="1" title="Upload" desc="Select files from your device or drag & drop." />
          <Step number="2" title="Encrypt" desc="Files encrypted with AES-256 before storing." />
          <Step number="3" title="Store" desc="Secure storage in our encrypted database." />
          <Step number="4" title="Share" desc="Share with expiring links or direct access." />
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;