import React, { useState } from 'react';
import { User, Shield, Smartphone, HardDrive, LogOut, Phone, Monitor, Save } from 'lucide-react';

// Components
import DashboardLayout from '../components/layout/DashboardLayout';
import Header from '../components/layout/Header';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import Badge from '../components/common/Badge';

const SettingsPage = () => {
  const [activeTab, setActiveTab] = useState('profile');

  // Render content based on active tab
  const renderContent = () => {
    switch (activeTab) {
      case 'profile': return <ProfileSection />;
      case 'security': return <SecuritySection />;
      case 'sessions': return <SessionsSection />;
      case 'billing': return <BillingSection />;
      default: return <ProfileSection />;
    }
  };

  return (
    <DashboardLayout>
      <Header title="Settings & Profile" showSearch={false} />

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* --- Sidebar Navigation (Left) --- */}
        <div className="lg:col-span-1 space-y-2">
          <NavButton 
            icon={User} label="Profile" 
            active={activeTab === 'profile'} 
            onClick={() => setActiveTab('profile')} 
          />
          <NavButton 
            icon={Shield} label="Security" 
            active={activeTab === 'security'} 
            onClick={() => setActiveTab('security')} 
          />
          <NavButton 
            icon={Smartphone} label="Active Sessions" 
            active={activeTab === 'sessions'} 
            onClick={() => setActiveTab('sessions')} 
          />
          <NavButton 
            icon={HardDrive} label="Storage & Billing" 
            active={activeTab === 'billing'} 
            onClick={() => setActiveTab('billing')} 
          />
          
          <div className="pt-4 border-t border-slate-200 mt-4">
             <button className="flex items-center gap-3 w-full px-4 py-3 text-sm font-medium text-red-500 hover:bg-red-50 rounded-xl transition">
               <LogOut className="w-4 h-4" /> Delete Account
             </button>
          </div>
        </div>

        {/* --- Main Content Area (Right) --- */}
        <div className="lg:col-span-3">
          {renderContent()}
        </div>
      </div>
    </DashboardLayout>
  );
};

/* --- Sub-Sections (Local Components) --- */

const ProfileSection = () => (
  <Card>
    <div className="flex items-center gap-2 mb-6 border-b border-slate-50 pb-4">
      <User className="w-5 h-5 text-blue-600" />
      <h3 className="font-bold text-lg text-slate-900">Profile Information</h3>
    </div>

    {/* Avatar */}
    <div className="flex items-center gap-6 mb-8">
      <div className="w-20 h-20 bg-slate-200 rounded-2xl flex items-center justify-center text-slate-400">
        <User className="w-10 h-10" />
      </div>
      <div className="flex gap-3">
        <Button variant="primary" className="py-2 text-sm">Upload New</Button>
        <Button variant="secondary" className="py-2 text-sm">Delete</Button>
      </div>
    </div>

    {/* Form */}
    <div className="grid md:grid-cols-2 gap-6 mb-6">
      <Input label="Full Name" defaultValue="John Doe" />
      <Input label="Email Address" defaultValue="john@example.com" />
      <Input label="Phone" defaultValue="+1 234 567 8900" />
      <Input label="Organization" defaultValue="Acme Corp" />
    </div>
    
    <div className="mb-6">
      <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Bio</label>
      <textarea 
        className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none text-sm min-h-[100px] focus:ring-2 focus:ring-blue-500/20 transition" 
        defaultValue="Software Developer and security enthusiast." 
      />
    </div>

    <Button variant="primary" icon={Save}>Save Changes</Button>
  </Card>
);

const SecuritySection = () => (
  <Card>
    <div className="flex items-center gap-2 mb-6 border-b border-slate-50 pb-4">
      <Shield className="w-5 h-5 text-blue-600" />
      <h3 className="font-bold text-lg text-slate-900">Security</h3>
    </div>

    <h4 className="font-bold text-slate-800 text-sm mb-4">Change Password</h4>
    <div className="space-y-4 mb-8">
      <Input label="Current Password" type="password" placeholder="••••••••" />
      <Input label="New Password" type="password" placeholder="••••••••" />
      <Input label="Confirm Password" type="password" placeholder="••••••••" />
    </div>
    <Button variant="primary">Update Password</Button>

    <div className="flex items-center justify-between py-4 border-t border-slate-100 mt-8">
      <div>
        <h4 className="font-bold text-slate-800 text-sm">Two-Factor Authentication</h4>
        <p className="text-xs text-slate-500">Add an extra layer of security to your account.</p>
      </div>
      {/* Toggle Switch UI */}
      <div className="w-12 h-6 bg-emerald-500 rounded-full relative cursor-pointer">
        <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full shadow-sm"></div>
      </div>
    </div>
  </Card>
);

const SessionsSection = () => (
  <Card>
    <div className="flex items-center gap-2 mb-6 border-b border-slate-50 pb-4">
      <Smartphone className="w-5 h-5 text-blue-600" />
      <h3 className="font-bold text-lg text-slate-900">Active Sessions</h3>
    </div>

    <div className="space-y-3">
      <SessionItem device="Windows PC - Chrome" ip="192.168.1.105" active />
      <SessionItem device="iPhone - Safari" ip="10.0.0.42" time="2 hours ago" />
      <SessionItem device="Macbook - Firefox" ip="172.16.0.23" time="1 day ago" />
    </div>
    
    <Button variant="secondary" className="w-full mt-6">Log Out All Devices</Button>
  </Card>
);

const BillingSection = () => (
  <Card>
    <div className="flex items-center gap-2 mb-6 border-b border-slate-50 pb-4">
      <HardDrive className="w-5 h-5 text-blue-600" />
      <h3 className="font-bold text-lg text-slate-900">Storage & Billing</h3>
    </div>

    <div className="flex justify-between text-sm mb-2 font-bold text-slate-700">
       <span>Storage Usage</span>
       <span>2.5 GB / 5 GB</span>
    </div>
    <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden mb-8">
      <div className="h-full bg-blue-600 w-1/2 rounded-full"></div>
    </div>
    
    <div className="grid md:grid-cols-2 gap-4 mb-6">
       <div className="border border-blue-200 bg-blue-50 p-4 rounded-xl">
          <div className="text-xs text-blue-600 font-bold uppercase mb-1">Current Plan</div>
          <div className="text-lg font-bold text-slate-900">Free Plan</div>
          <div className="text-xs text-slate-500">5 GB storage</div>
       </div>
       <div className="border border-slate-100 p-4 rounded-xl opacity-60">
          <div className="text-xs text-slate-500 font-bold uppercase mb-1">Suggested</div>
          <div className="text-lg font-bold text-slate-900">Pro Plan</div>
          <div className="text-xs text-slate-500">50 GB storage, $10/mo</div>
       </div>
    </div>
    <Button variant="primary" className="w-full">Upgrade Plan</Button>
  </Card>
);

/* --- Helper Components --- */

const NavButton = ({ icon: Icon, label, active, onClick }) => (
  <button 
    onClick={onClick}
    className={`flex items-center gap-3 w-full px-4 py-3 text-sm font-medium rounded-xl transition ${
      active ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-600 hover:bg-slate-100'
    }`}
  >
    <Icon className="w-4 h-4" /> {label}
  </button>
);

const SessionItem = ({ device, ip, time, active }) => (
  <div className="flex items-center justify-between p-4 border border-slate-100 rounded-xl">
    <div className="flex items-center gap-3">
      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${device.includes('iPhone') ? 'bg-amber-100 text-amber-600' : 'bg-blue-100 text-blue-600'}`}>
        {device.includes('iPhone') ? <Phone className="w-5 h-5" /> : <Monitor className="w-5 h-5" />}
      </div>
      <div>
        <div className="text-sm font-bold text-slate-900 flex items-center gap-2">
          {device} {active && <Badge variant="green">Current</Badge>}
        </div>
        <div className="text-xs text-slate-500">{ip} • {active ? 'Active now' : time}</div>
      </div>
    </div>
    <button className="text-xs font-bold text-slate-400 hover:text-red-500 transition">Revoke</button>
  </div>
);

export default SettingsPage;