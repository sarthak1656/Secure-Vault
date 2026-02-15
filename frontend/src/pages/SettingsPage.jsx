import React, { useState, useEffect } from 'react';
import { User, Shield, Smartphone, HardDrive, LogOut, Phone, Monitor, Save, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// Shared Components
import DashboardLayout from '../components/layout/DashboardLayout';
import Header from '../components/layout/Header';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import Badge from '../components/common/Badge';
import Loader from '../components/common/Loader';
import ConfirmDialog from '../components/common/ConfirmDialog';

// API Services
import { userAPI, authAPI } from '../services/api';
import { useToast } from '../context/ToastContext';

const SettingsPage = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const { success: showSuccess, error: showError } = useToast();
  const navigate = useNavigate();

  const handleDeleteAccount = async () => {
    try {
      // In a real app, you might prompt for password here
      await userAPI.deleteAccount(); 
      showSuccess("Account deleted successfully");
      navigate('/login');
    } catch (err) {
      showError(err.message || "Failed to delete account");
    }
  };

  return (
    <DashboardLayout>
      <Header title="Settings & Profile" showSearch={false} />

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* --- Sidebar Navigation --- */}
        <div className="lg:col-span-1 space-y-2">
          <NavButton icon={User} label="Profile" active={activeTab === 'profile'} onClick={() => setActiveTab('profile')} />
          <NavButton icon={Shield} label="Security" active={activeTab === 'security'} onClick={() => setActiveTab('security')} />
          <NavButton icon={Smartphone} label="Active Sessions" active={activeTab === 'sessions'} onClick={() => setActiveTab('sessions')} />
          <NavButton icon={HardDrive} label="Storage" active={activeTab === 'billing'} onClick={() => setActiveTab('billing')} />
          
          <div className="pt-4 border-t border-slate-200 mt-4">
             <button 
              onClick={() => setIsDeleteModalOpen(true)}
              className="flex items-center gap-3 w-full px-4 py-3 text-sm font-medium text-red-500 hover:bg-red-50 rounded-xl transition"
             >
               <LogOut className="w-4 h-4" /> Delete Account
             </button>
          </div>
        </div>

        {/* --- Main Content Area --- */}
        <div className="lg:col-span-3">
          {activeTab === 'profile' && <ProfileSection />}
          {activeTab === 'security' && <SecuritySection />}
          {activeTab === 'sessions' && <SessionsSection />}
          {activeTab === 'billing' && <BillingSection />}
        </div>
      </div>

      <ConfirmDialog 
        isOpen={isDeleteModalOpen}
        title="Delete Account"
        message="Are you sure you want to delete your account? This will permanently remove all your encrypted files. This action cannot be undone."
        isDangerous={true}
        onConfirm={handleDeleteAccount}
        onCancel={() => setIsDeleteModalOpen(false)}
      />
    </DashboardLayout>
  );
};

/* --- Sub-Sections --- */

const ProfileSection = () => {
  const [userData, setUserData] = useState({ name: '', email: '', bio: '', organization: '', phone: '' });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { success, error } = useToast();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await userAPI.getProfile();
        setUserData(data.user || data);
      } catch (err) {
        error("Failed to load profile");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleUpdate = async () => {
    try {
      setSaving(true);
      await userAPI.updateProfile(userData);
      success("Profile updated successfully");
    } catch (err) {
      error("Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Loader />;

  return (
    <Card>
      <div className="flex items-center gap-2 mb-6 border-b pb-4">
        <User className="w-5 h-5 text-violet-600" />
        <h3 className="font-bold text-lg text-slate-900">Profile Information</h3>
      </div>
      <div className="grid md:grid-cols-2 gap-6 mb-6">
        <Input label="Full Name" value={userData.name} onChange={e => setUserData({...userData, name: e.target.value})} />
        <Input label="Email Address" value={userData.email} disabled />
        <Input label="Phone" value={userData.phone || ''} onChange={e => setUserData({...userData, phone: e.target.value})} />
        <Input label="Organization" value={userData.organization || ''} onChange={e => setUserData({...userData, organization: e.target.value})} />
      </div>
      <div className="mb-6">
        <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Bio</label>
        <textarea 
          className="w-full p-3 bg-slate-50 border rounded-xl outline-none text-sm min-h-[100px] focus:ring-2 focus:ring-violet-500/20" 
          value={userData.bio || ''} 
          onChange={e => setUserData({...userData, bio: e.target.value})}
        />
      </div>
      <Button variant="primary" icon={saving ? Loader2 : Save} onClick={handleUpdate} disabled={saving}>
        {saving ? 'Saving...' : 'Save Changes'}
      </Button>
    </Card>
  );
};

const SecuritySection = () => {
  const [passwords, setPasswords] = useState({ current: '', next: '', confirm: '' });
  const { success, error } = useToast();

  const handlePasswordChange = async () => {
    if (passwords.next !== passwords.confirm) return error("Passwords do not match");
    try {
      await userAPI.changePassword(passwords.current, passwords.next);
      success("Password updated successfully");
      setPasswords({ current: '', next: '', confirm: '' });
    } catch (err) {
      error(err.message || "Failed to update password");
    }
  };

  return (
    <Card>
      <div className="flex items-center gap-2 mb-6 border-b pb-4">
        <Shield className="w-5 h-5 text-violet-600" />
        <h3 className="font-bold text-lg text-slate-900">Security</h3>
      </div>
      <div className="space-y-4 mb-6">
        <Input label="Current Password" type="password" value={passwords.current} onChange={e => setPasswords({...passwords, current: e.target.value})} />
        <Input label="New Password" type="password" value={passwords.next} onChange={e => setPasswords({...passwords, next: e.target.value})} />
        <Input label="Confirm New Password" type="password" value={passwords.confirm} onChange={e => setPasswords({...passwords, confirm: e.target.value})} />
      </div>
      <Button variant="primary" onClick={handlePasswordChange}>Update Password</Button>
    </Card>
  );
};

const SessionsSection = () => {
  const [sessions, setSessions] = useState([]);
  const { success, error } = useToast();

  const fetchSessions = async () => {
    try {
      const data = await userAPI.getActiveSessions();
      setSessions(data.sessions || []);
    } catch (err) {
      error("Failed to load sessions");
    }
  };

  useEffect(() => { fetchSessions(); }, []);

  const revokeSession = async (id) => {
    try {
      await userAPI.logoutSession(id);
      success("Session revoked");
      fetchSessions();
    } catch (err) {
      error("Failed to revoke session");
    }
  };

  return (
    <Card>
      <div className="flex items-center gap-2 mb-6 border-b pb-4">
        <Smartphone className="w-5 h-5 text-violet-600" />
        <h3 className="font-bold text-lg text-slate-900">Active Sessions</h3>
      </div>
      <div className="space-y-3">
        {sessions.map(session => (
          <SessionItem 
            key={session._id} 
            device={session.deviceInfo || "Unknown Device"} 
            ip={session.ipAddress} 
            active={session.isCurrent} 
            onRevoke={() => revokeSession(session._id)}
          />
        ))}
      </div>
    </Card>
  );
};

const BillingSection = () => {
  const [storage, setStorage] = useState({ used: 0, limit: 5368709120 }); // Default 5GB
  
  useEffect(() => {
    const fetchStorage = async () => {
      try {
        const data = await userAPI.getStorageInfo();
        setStorage({ used: data.used, limit: data.limit });
      } catch (err) {}
    };
    fetchStorage();
  }, []);

  const usagePercent = (storage.used / storage.limit) * 100;

  return (
    <Card>
      <div className="flex items-center gap-2 mb-6 border-b pb-4">
        <HardDrive className="w-5 h-5 text-violet-600" />
        <h3 className="font-bold text-lg text-slate-900">Storage Usage</h3>
      </div>
      <div className="flex justify-between text-sm mb-2 font-bold text-slate-700">
        <span>Usage</span>
        <span>{(storage.used / (1024**3)).toFixed(2)} GB / {(storage.limit / (1024**3)).toFixed(2)} GB</span>
      </div>
      <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden mb-8">
        <div className="h-full bg-violet-600 transition-all duration-500" style={{ width: `${usagePercent}%` }}></div>
      </div>
      <div className="bg-violet-50 border border-violet-100 p-4 rounded-xl">
        <div className="text-xs text-violet-600 font-bold uppercase mb-1">Current Plan</div>
        <div className="text-lg font-bold text-slate-900">Free Tier</div>
      </div>
    </Card>
  );
};

/* --- Helper Components --- */

const NavButton = ({ icon: Icon, label, active, onClick }) => (
  <button onClick={onClick} className={`flex items-center gap-3 w-full px-4 py-3 text-sm font-medium rounded-xl transition ${active ? 'bg-violet-600 text-white shadow-lg shadow-violet-200' : 'text-slate-600 hover:bg-slate-100'}`}>
    <Icon className="w-4 h-4" /> {label}
  </button>
);

const SessionItem = ({ device, ip, active, onRevoke }) => (
  <div className="flex items-center justify-between p-4 border border-slate-100 rounded-xl">
    <div className="flex items-center gap-3">
      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${active ? 'bg-green-100 text-green-600' : 'bg-slate-100 text-slate-600'}`}>
        <Monitor className="w-5 h-5" />
      </div>
      <div>
        <div className="text-sm font-bold text-slate-900 flex items-center gap-2">
          {device} {active && <Badge variant="green">Current</Badge>}
        </div>
        <div className="text-xs text-slate-500">{ip} • {active ? 'Active Now' : 'Logged in'}</div>
      </div>
    </div>
    {!active && <button onClick={onRevoke} className="text-xs font-bold text-red-500 hover:underline">Revoke</button>}
  </div>
);

export default SettingsPage;