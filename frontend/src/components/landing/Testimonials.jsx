import React from 'react';

const TestimonialCard = ({ quote, author, role }) => (
  <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm">
    <div className="flex gap-1 mb-4">
      {[1, 2, 3, 4, 5].map((star) => (
        <span key={star} className="text-amber-400 text-lg">★</span>
      ))}
    </div>
    <p className="text-slate-700 italic mb-6">"{quote}"</p>
    <div className="flex items-center gap-3">
      <div className="w-10 h-10 bg-slate-200 rounded-full flex items-center justify-center text-slate-500 text-xs font-bold">
        {author.charAt(0)}
      </div>
      <div>
        <div className="font-bold text-slate-900 text-sm">{author}</div>
        <div className="text-slate-500 text-xs">{role}</div>
      </div>
    </div>
  </div>
);

const Testimonials = () => {
  return (
    <section className="py-24 px-4 bg-slate-50 border-t border-slate-200">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-slate-900 mb-4">Trusted by Teams</h2>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          <TestimonialCard 
            quote="The best secure file storage solution. Easy to use and incredibly reliable."
            author="Sarah Johnson"
            role="Product Manager"
          />
          <TestimonialCard 
            quote="We switched all our file sharing to Secure Vault. Time experts highly recommend!"
            author="Mike Chen"
            role="CTO"
          />
          <TestimonialCard 
            quote="Perfect for managing sensitive client documents. Security is top notch."
            author="Emily Davis"
            role="Lawyer"
          />
        </div>
      </div>
    </section>
  );
};

export default Testimonials;