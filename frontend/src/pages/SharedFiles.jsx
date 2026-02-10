import React, { useState } from 'react';
import { AlertCircle } from 'lucide-react';

// Components
import DashboardLayout from '../components/layout/DashboardLayout';
import Header from '../components/layout/Header';
import SharedFileCard from '../components/files/SharedFileCard';

const SharedFiles = () => {
  const [activeTab, setActiveTab] = useState('all');

  return (
    <DashboardLayout>
      <Header title="Shared With Me" showSearch={true} />

      {/* --- Page Header & Tabs --- */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row justify-between items-end gap-4 mb-6">
          <div>
            <h2 className="text-3xl font-bold text-slate-900 mb-2">Shared Files</h2>
            <p className="text-slate-500">Files that others have shared with you</p>
          </div>
        </div>
        
        {/* Tabs */}
        <div className="flex items-center gap-6 border-b border-slate-200">
          <TabButton label="All Files" active={activeTab === 'all'} onClick={() => setActiveTab('all')} />
          <TabButton label="Expiring Soon" active={activeTab === 'expiring'} onClick={() => setActiveTab('expiring')} />
          <TabButton label="Expired" active={activeTab === 'expired'} onClick={() => setActiveTab('expired')} />
        </div>
      </div>

      {/* --- Files Grid --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        
        {/* Active File */}
        {(activeTab === 'all') && (
          <SharedFileCard 
            status="active" 
            name="Q4-Report.pdf" 
            type="pdf"
            size="3.2 MB" 
            owner="Sarah Johnson" 
            expiry="In 5 days"
            access="View Only"
          />
        )}

        {/* Expiring File */}
        {(activeTab === 'all' || activeTab === 'expiring') && (
          <SharedFileCard 
            status="expiring" 
            name="Budget-2024.xlsx" 
            type="xlsx"
            size="1.5 MB" 
            owner="Mike Chen" 
            expiry="In 1 day"
            access="Edit"
          />
        )}

        {/* Expired File */}
        {(activeTab === 'all' || activeTab === 'expired') && (
          <SharedFileCard 
            status="expired" 
            name="Presentation-v2.pptx" 
            type="pptx"
            size="2.8 MB" 
            owner="Emily Davis" 
            expiry="Expired on Dec 15"
            access="Denied"
          />
        )}
      </div>

      {/* --- Info Alert --- */}
      <div className="bg-sky-50 border border-sky-100 rounded-xl p-4 flex items-start gap-3 text-sky-800">
        <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
        <p className="text-sm">
          <strong>Tip:</strong> Access to expired files is automatically disabled. Contact the file owner to request a new share link.
        </p>
      </div>

    </DashboardLayout>
  );
};

// Local Tab Component
const TabButton = ({ label, active, onClick }) => (
  <button 
    onClick={onClick}
    className={`pb-3 text-sm font-medium transition relative ${
      active ? 'text-blue-600' : 'text-slate-500 hover:text-slate-700'
    }`}
  >
    {label}
    {active && <span className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 rounded-t-full"></span>}
  </button>
);

export default SharedFiles;