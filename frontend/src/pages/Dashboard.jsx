import React from 'react';
import { FileText, Share, Database, Link as LinkIcon, Plus, FolderPlus, Download, Clock } from 'lucide-react';

// New Components
import DashboardLayout from '../components/layout/DashboardLayout';
import Header from '../components/layout/Header';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import StatCard from '../components/dashboard/StatCard';
import FileRow from '../components/files/FileRow';

// Local sub-component for Activity (could also move to components/dashboard/ActivityItem.jsx)
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
  return (
    <DashboardLayout>
      <Header title="Dashboard" showSearch={true} />

      {/* --- Welcome Header --- */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Welcome back, John!</h1>
        <p className="text-slate-500">
          You have <strong className="text-slate-800">5 new files</strong> and <strong className="text-slate-800">3 shared files</strong> awaiting you.
        </p>
      </div>

      {/* --- Stats Grid --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <StatCard title="Total Files" value="24" color="blue" icon={<FileText className="w-6 h-6" />} />
        <StatCard title="Shared Files" value="8" color="emerald" icon={<Share className="w-6 h-6" />} />
        <StatCard title="Storage Used" value="2.5 GB" color="purple" icon={<Database className="w-6 h-6" />} />
        <StatCard title="Secure Links" value="5" color="orange" icon={<LinkIcon className="w-6 h-6" />} />
      </div>

      {/* --- Quick Actions --- */}
      <div className="mb-10">
        <h3 className="text-lg font-bold text-slate-800 mb-4">Quick Actions</h3>
        <div className="flex flex-wrap gap-4">
          <Button variant="primary" icon={Plus}>Upload File</Button>
          <Button variant="secondary" icon={FolderPlus}>Create Folder</Button>
          <Button variant="secondary" icon={Share}>Share File</Button>
        </div>
      </div>

      {/* --- Main Content Split --- */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Recent Files */}
        <div className="lg:col-span-2">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-slate-800">Recent Files</h3>
            <button className="text-sm text-blue-600 hover:underline">View all files →</button>
          </div>
          
          <Card className="p-0 overflow-hidden">
            <FileRow name="Contract.pdf" size="2.4 MB" date="2 hours ago" type="pdf" />
            <FileRow name="Report.docx" size="1.8 MB" date="5 hours ago" type="docx" />
            <FileRow name="Budget.xlsx" size="956 KB" date="1 day ago" type="xlsx" />
            <FileRow name="Presentation.pptx" size="4.2 MB" date="2 days ago" type="pptx" />
          </Card>
        </div>

        {/* Activity Feed */}
        <div>
          <h3 className="text-lg font-bold text-slate-800 mb-6">Activity Feed</h3>
          <Card>
            <div className="space-y-8 relative">
              {/* Connecting Line */}
              <div className="absolute left-3.5 top-2 bottom-2 w-0.5 bg-slate-100"></div>

              <ActivityItem 
                icon={<Download className="w-4 h-4" />} color="bg-purple-500" 
                title="File Downloaded" desc="Contract.pdf downloaded by Mike" time="2 hours ago" 
              />
              <ActivityItem 
                icon={<Share className="w-4 h-4" />} color="bg-emerald-500" 
                title="File Shared" desc="Shared Report.docx with 2 people" time="5 hours ago" 
              />
              <ActivityItem 
                icon={<Plus className="w-4 h-4" />} color="bg-blue-500" 
                title="File Uploaded" desc="Uploaded Budget.xlsx" time="1 day ago" 
              />
              <ActivityItem 
                icon={<Clock className="w-4 h-4" />} color="bg-amber-500" 
                title="Link Expired" desc="Presentation link expired" time="2 days ago" 
              />
            </div>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;