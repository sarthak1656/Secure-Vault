import React from 'react';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';

import Hero from '../components/landing/Hero';
import Features from '../components/landing/Features';
import HowItWorks from '../components/landing/HowItWorks';
import Testimonials from '../components/landing/Testimonials';

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-white font-sans text-slate-800">
      <Navbar />
      <Hero />
      <Features />
      <HowItWorks />
      <Testimonials />
      <Footer />
    </div>
  );
};

export default LandingPage;