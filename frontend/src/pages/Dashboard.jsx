import React, { useState, useEffect } from 'react';
import { FileText, Share, Database, Link as LinkIcon, Plus, FolderPlus, Download, Clock, Upload, Users, TrendingUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// Components
import DashboardLayout from '../components/layout/DashboardLayout';
import Header from '../components/layout/Header';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import StatCard from '../components/dashboard/StatCard';
import FileRow from '../components/files/FileRow';
import Loader from '../components/common/Loader';

// API & Context
import { dashboardAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

// Activity Item Component
const ActivityItem = ({ icon, color, title, desc, time }) => (
  <div className="relative flex items-start gap-4 z-10">
    <div className={`w-8 h-8 rounded-full ${color} flex items-center justify-center shadow-sm shrink-0 text-white`}>
      {icon}
    </div>
    <div>
      <h4 className="text-sm font-bold text-slate-800">{title}</h4>
      <p className="text-xs text-slate-500 mt-0.5">{desc}</p>
      <span className="text-[10px] text-slate-400 font-medium mt-1 block">{time}</span>
    </div>
  </div>
);

const Dashboard = () => {
  const { user } = useAuth();
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const response = await dashboardAPI.getDashboardData();
        setDashboardData(response.data);
      } catch (err) {
        console.error(err);
        setError(err.message || "Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // Helper functions
  const getActivityIcon = (type) => {
    switch (type) {
      case 'upload': return <Upload className="w-4 h-4" />;
      case 'share': return <Share className="w-4 h-4" />;
      case 'download': return <Download className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const getActivityColor = (color) => {
    switch (color) {
      case 'blue': return 'bg-violet-500';
      case 'emerald': return 'bg-emerald-500';
      case 'purple': return 'bg-purple-500';
      case 'amber': return 'bg-amber-500';
      default: return 'bg-slate-500';
    }
  };

  // Safe destructuring
  const { user: userData, stats, recentFiles, recentActivity } = dashboardData || {};

  return (
    <DashboardLayout>
      <Header title="Dashboard" showSearch={true} />

      {/* --- Welcome Header --- */}
      <div className="mb-8">
        {loading ? (
           <div className="h-8 w-64 bg-slate-100 rounded animate-pulse mb-2"></div>
        ) : (
          <h1 className="text-3xl font-bold text-slate-900 mb-2">
            Welcome back, {userData?.name || user?.name || 'User'}!
          </h1>
        )}
        <p className="text-slate-500">
          Overview of your secure cloud storage
        </p>
      </div>

      {/* --- Stats Grid --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {loading ? (
          // Stats Skeleton
          [1, 2, 3, 4].map(i => (
             <div key={i} className="h-32 bg-slate-50 border border-slate-100 rounded-2xl animate-pulse"></div>
          ))
        ) : (
          <>
            <StatCard 
              title="Total Files" 
              value={stats?.totalFiles || 0} 
              color="blue" 
              icon={<FileText className="w-6 h-6" />} 
            />
            <StatCard 
              title="Shared Files" 
              value={stats?.sharedFiles || 0} 
              color="emerald" 
              icon={<Share className="w-6 h-6" />} 
            />
            <StatCard 
              title="Storage Used" 
              value={`${stats?.storageUsed || 0} GB`} 
              color="purple" 
              icon={<Database className="w-6 h-6" />} 
            />
            <StatCard 
              title="Secure Links" 
              value={stats?.secureLinks || 0} 
              color="orange" 
              icon={<LinkIcon className="w-6 h-6" />} 
            />
          </>
        )}
      </div>

      {/* --- Quick Actions --- */}
      <div className="mb-10">
        <h3 className="text-lg font-bold text-slate-800 mb-4">Quick Actions</h3>
        <div className="flex flex-wrap gap-4">
          <Button variant="primary" icon={Plus} onClick={() => navigate('/upload')}>
            Upload File
          </Button>
          <Button variant="secondary" icon={FolderPlus} disabled>
            Create Folder
          </Button>
          <Button variant="secondary" icon={Share} onClick={() => navigate('/my-files')}>
            Share File
          </Button>
        </div>
      </div>

      {/* --- Main Content Split --- */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Recent Files */}
        <div className="lg:col-span-2">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-slate-800">Recent Files</h3>
            <button 
              onClick={() => navigate('/my-files')}
              className="text-sm text-violet-600 hover:underline"
            >
              View all files →
            </button>
          </div>
          
          <Card className="p-0 overflow-hidden min-h-[300px]">
            {loading ? (
              <div className="p-4 space-y-4">
                {[1,2,3].map(i => <div key={i} className="h-12 bg-slate-50 rounded-lg animate-pulse"></div>)}
              </div>
            ) : recentFiles?.length > 0 ? (
              recentFiles.map((file) => (
                <FileRow 
                  key={file.id}
                  file={file} // Pass entire file object
                  // Map specific props if FileRow expects them
                  name={file.name} 
                  size={file.size} 
                  date={file.date} 
                  type={file.type} 
                />
              ))
            ) : (
              <div className="p-8 text-center text-slate-500 flex flex-col items-center justify-center h-full">
                <FileText className="w-12 h-12 mx-auto mb-4 text-slate-300" />
                <p>No files uploaded yet</p>
                <Button variant="primary" className="mt-4" icon={Plus} onClick={() => navigate('/upload')}>
                  Upload Your First File
                </Button>
              </div>
            )}
          </Card>
        </div>

        {/* Activity Feed */}
        <div>
          <h3 className="text-lg font-bold text-slate-800 mb-6">Activity Feed</h3>
          <Card className="min-h-[300px]">
            <div className="space-y-8 relative">
              {/* Connecting Line */}
              <div className="absolute left-3.5 top-2 bottom-2 w-0.5 bg-slate-100"></div>

              {loading ? (
                 <div className="space-y-8">
                   {[1,2,3].map(i => (
                     <div key={i} className="flex gap-4 relative z-10">
                        <div className="w-8 h-8 rounded-full bg-slate-100 animate-pulse shrink-0"></div>
                        <div className="space-y-2 flex-1">
                          <div className="h-4 w-3/4 bg-slate-100 animate-pulse rounded"></div>
                          <div className="h-3 w-1/2 bg-slate-100 animate-pulse rounded"></div>
                        </div>
                     </div>
                   ))}
                 </div>
              ) : recentActivity?.length > 0 ? (
                recentActivity.map((activity) => (
                  <ActivityItem 
                    key={activity.id}
                    icon={getActivityIcon(activity.type)}
                    color={getActivityColor(activity.color)}
                    title={activity.title}
                    desc={activity.description}
                    time={activity.time}
                  />
                ))
              ) : (
                <div className="p-8 text-center text-slate-500">
                  <Clock className="w-12 h-12 mx-auto mb-4 text-slate-300" />
                  <p>No recent activity</p>
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;