import React from 'react';
import { Lock, Share2, FolderOpen, CloudUpload, Users, History } from 'lucide-react';

const FeatureCard = ({ icon, title, desc, color }) => (
  <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition duration-300">
    <div className={`w-12 h-12 ${color} rounded-xl flex items-center justify-center mb-6`}>
      {icon}
    </div>
    <h3 className="text-xl font-bold text-slate-900 mb-3">{title}</h3>
    <p className="text-slate-600 leading-relaxed">{desc}</p>
  </div>
);

const Features = () => {
  const featuresList = [
    {
      icon: <Lock className="w-6 h-6 text-blue-600" />,
      title: "End-to-End Encryption",
      desc: "Military-grade AES-256 encryption protects your files at rest and in transit.",
      color: "bg-blue-50"
    },
    {
      icon: <Share2 className="w-6 h-6 text-indigo-600" />,
      title: "Expiring Share Links",
      desc: "Share files with automatic expiry dates. Control who accesses what and when.",
      color: "bg-indigo-50"
    },
    {
      icon: <FolderOpen className="w-6 h-6 text-emerald-600" />,
      title: "Folder Management",
      desc: "Organize files in folders with nested directory support and instant sync.",
      color: "bg-emerald-50"
    },
    {
      icon: <CloudUpload className="w-6 h-6 text-purple-600" />,
      title: "Easy Upload",
      desc: "Drag & drop support with automatic encryption before storage.",
      color: "bg-purple-50"
    },
    {
      icon: <Users className="w-6 h-6 text-amber-600" />,
      title: "Secure Sharing",
      desc: "Share files with fine-grained permissions and detailed activity tracking.",
      color: "bg-amber-50"
    },
    {
      icon: <History className="w-6 h-6 text-rose-600" />,
      title: "Version History",
      desc: "Track changes and restore previous versions of your files anytime.",
      color: "bg-rose-50"
    }
  ];

  return (
    <section id="features" className="py-24 px-4 bg-slate-50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-slate-900 mb-4">Powerful Features</h2>
          <p className="text-slate-600 max-w-2xl mx-auto">Everything you need for secure file management in one simple platform.</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuresList.map((feature, index) => (
            <FeatureCard key={index} {...feature} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;