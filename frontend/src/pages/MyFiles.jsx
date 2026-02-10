import React, { useState } from 'react';
import { LayoutGrid, List, UploadCloud, Plus, Folder, Home, ChevronRight } from 'lucide-react';

// Shared Components
import DashboardLayout from '../components/layout/DashboardLayout';
import Header from '../components/layout/Header';
import Modal from '../components/common/Modal';
import Button from '../components/common/Button';
import Card from '../components/common/Card';
import FileRow from '../components/files/FileRow';
import FileCard from '../components/files/FileCard'; // Import the new FileCard component

const MyFiles = () => {
  const [viewMode, setViewMode] = useState('grid');
  const [isCreateFolderOpen, setIsCreateFolderOpen] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');

  const handleCreateFolder = (e) => {
    e.preventDefault();
    console.log("Creating folder:", newFolderName);
    setIsCreateFolderOpen(false);
    setNewFolderName('');
    // Add API logic here later
  };

  return (
    <DashboardLayout>
      <Header title="My Files" showSearch={true} />

      {/* --- Page Header & Actions --- */}
      <div className="flex flex-col md:flex-row justify-between items-end mb-6 gap-4">
        <div>
          <h2 className="text-3xl font-bold text-slate-900 mb-2">My Files</h2>
          <p className="text-slate-500">Manage and organize your encrypted files</p>
        </div>
        
        <div className="flex gap-3">
          {/* View Toggles */}
          <div className="bg-white border border-slate-200 rounded-lg p-1 flex items-center h-fit">
            <button 
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-md transition ${viewMode === 'grid' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-500 hover:bg-slate-50'}`}
            >
              <LayoutGrid size={18} />
            </button>
            <button 
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-md transition ${viewMode === 'list' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-500 hover:bg-slate-50'}`}
            >
              <List size={18} />
            </button>
          </div>

          <Button variant="primary" icon={UploadCloud}>Upload Files</Button>
        </div>
      </div>

      {/* --- Breadcrumbs --- */}
      <nav className="flex items-center gap-2 text-sm text-slate-500 mb-8 overflow-x-auto whitespace-nowrap">
        <Home className="w-4 h-4 text-blue-600" />
        <ChevronRight className="w-4 h-4 text-slate-300" />
        <span className="hover:text-blue-600 cursor-pointer transition">Root</span>
        <ChevronRight className="w-4 h-4 text-slate-300" />
        <span className="font-semibold text-slate-900">Documents</span>
      </nav>

      {/* --- Folders Section --- */}
      <div className="mb-10">
        <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4">Folders</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <FolderCard name="Documents" count={5} color="text-amber-400" />
          <FolderCard name="Projects" count={8} color="text-blue-500" />
          <FolderCard name="Archive" count={3} color="text-red-500" />
          
          {/* New Folder Button */}
          <button 
            onClick={() => setIsCreateFolderOpen(true)}
            className="border-2 border-dashed border-slate-300 rounded-2xl p-6 flex flex-col items-center justify-center gap-3 hover:bg-blue-50 hover:border-blue-300 transition group h-full min-h-[140px]"
          >
            <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center group-hover:bg-blue-100 transition">
              <Plus className="w-6 h-6 text-slate-400 group-hover:text-blue-600" />
            </div>
            <span className="font-medium text-slate-600 group-hover:text-blue-600">New Folder</span>
          </button>
        </div>
      </div>

      {/* --- Files Section --- */}
      <div>
        <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4">Recent Files</h3>
        
        {viewMode === 'grid' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <FileCard name="Contract.pdf" size="2.4 MB" date="2 hours ago" type="pdf" />
            <FileCard name="Report.docx" size="1.8 MB" date="5 hours ago" type="docx" />
            <FileCard name="Budget.xlsx" size="956 KB" date="1 day ago" type="xlsx" />
            <FileCard name="Design.png" size="4.2 MB" date="2 days ago" type="png" />
          </div>
        ) : (
          <Card className="p-0 overflow-hidden">
            <FileRow name="Contract.pdf" size="2.4 MB" date="2 hours ago" type="pdf" />
            <FileRow name="Report.docx" size="1.8 MB" date="5 hours ago" type="docx" />
            <FileRow name="Budget.xlsx" size="956 KB" date="1 day ago" type="xlsx" />
          </Card>
        )}
      </div>

      {/* --- Create Folder Modal --- */}
      <Modal 
        isOpen={isCreateFolderOpen} 
        onClose={() => setIsCreateFolderOpen(false)}
        title="Create New Folder"
      >
        <form onSubmit={handleCreateFolder} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Folder Name</label>
            <input 
              type="text" 
              autoFocus
              className="w-full p-3 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g., Finance 2024"
              value={newFolderName}
              onChange={(e) => setNewFolderName(e.target.value)}
            />
          </div>
          <div className="flex gap-3 justify-end pt-2">
            <Button type="button" variant="ghost" onClick={() => setIsCreateFolderOpen(false)}>Cancel</Button>
            <Button type="submit" variant="primary">Create Folder</Button>
          </div>
        </form>
      </Modal>

    </DashboardLayout>
  );
};

// Simple local sub-component for folders
const FolderCard = ({ name, count, color }) => (
  <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition cursor-pointer group">
    <Folder className={`w-12 h-12 ${color} fill-current mb-4`} />
    <h4 className="font-bold text-slate-800 text-lg">{name}</h4>
    <p className="text-sm text-slate-500 mt-1">{count} files</p>
  </div>
);

export default MyFiles;