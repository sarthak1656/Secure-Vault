import React from 'react';
import { Filter, Lock, CheckCircle, AlertCircle, FileText, X, CloudUpload } from 'lucide-react';

// Components
import DashboardLayout from '../components/layout/DashboardLayout';
import Header from '../components/layout/Header';
import FileUploader from '../components/files/FileUploader';
import ProgressBar from '../components/common/ProgressBar';
import Card from '../components/common/Card';
import Button from '../components/common/Button';

const UploadPage = () => {
  return (
    <DashboardLayout>
      <Header title="Upload Files" showSearch={false} />

      <p className="text-slate-500 -mt-6 mb-8">Upload and encrypt your files securely</p>

      <div className="grid lg:grid-cols-3 gap-8">
        
        {/* --- LEFT COLUMN (2/3 width) --- */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Drag & Drop Zone (Reusable Component) */}
          <FileUploader onFileSelect={() => alert("File selection dialog would open here")} />

          {/* Limits Banner */}
          <div className="bg-amber-50 border border-amber-100 rounded-xl p-4 flex items-center gap-3 text-amber-800 text-sm">
            <Filter className="w-5 h-5 shrink-0" /> 
            <span><strong>File Upload Limits:</strong> Maximum file size: 5 GB | Total daily limit: 20 GB</span>
          </div>

          {/* Queued Files List */}
          <div>
            <h4 className="font-bold text-slate-900 mb-4">Queued Files</h4>
            <div className="bg-white border border-slate-100 rounded-2xl p-2 shadow-sm space-y-1">
              <UploadItem name="Contract.pdf" progress={75} color="bg-emerald-500" />
              <UploadItem name="Report.docx" progress={45} color="bg-emerald-500" />
              <UploadItem name="Budget.xlsx" progress={100} color="bg-emerald-500" isComplete />
            </div>
          </div>
        </div>

        {/* --- RIGHT COLUMN (1/3 width) --- */}
        <div className="space-y-6">
          
          {/* Destination Card */}
          <Card>
            <h4 className="font-bold text-slate-900 mb-4">Select Destination</h4>
            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase">Folder</label>
                <select className="w-full mt-1 p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-violet-500 text-sm">
                  <option>Root</option>
                  <option>Documents</option>
                  <option>Finance</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase">Create New Folder</label>
                <div className="flex gap-2 mt-1">
                  <input type="text" placeholder="Folder name" className="flex-1 p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none text-sm" />
                  <button className="bg-violet-600 text-white px-4 rounded-xl font-bold text-sm hover:bg-violet-700 transition">CREATE</button>
                </div>
              </div>
            </div>
          </Card>

          {/* Encryption Info Card */}
          <Card>
            <h4 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
              <Lock className="w-4 h-4 text-violet-600" /> Encryption
            </h4>
            <ul className="space-y-3 text-sm text-slate-600 mb-6">
              <li className="flex gap-2 items-center"><CheckCircle className="w-4 h-4 text-emerald-500" /> <span className="font-semibold text-slate-800">AES-256</span> encryption enabled</li>
              <li className="flex gap-2 items-center"><CheckCircle className="w-4 h-4 text-emerald-500" /> <span className="font-semibold text-slate-800">SSL/TLS</span> in transit protection</li>
              <li className="flex gap-2 items-center"><CheckCircle className="w-4 h-4 text-emerald-500" /> <span className="font-semibold text-slate-800">Zero-knowledge</span> architecture</li>
            </ul>
            <div className="bg-sky-50 p-3 rounded-lg text-xs text-sky-700 flex gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" /> Files are encrypted before being sent to our servers.
            </div>
          </Card>

          {/* Upload Summary */}
          <Card>
            <h4 className="font-bold text-slate-900 mb-4">Upload Summary</h4>
            <div className="space-y-2 text-sm mb-6">
              <div className="flex justify-between text-slate-500">
                <span>Files ready:</span>
                <span className="font-bold text-slate-900">3</span>
              </div>
              <div className="flex justify-between text-slate-500">
                <span>Total size:</span>
                <span className="font-bold text-slate-900">7.4 MB</span>
              </div>
              <div className="flex justify-between text-slate-500">
                <span>Encryption time:</span>
                <span className="font-bold text-slate-900">~2s</span>
              </div>
            </div>
            <Button variant="primary" className="w-full" icon={CloudUpload}>
              UPLOAD ALL
            </Button>
          </Card>

        </div>
      </div>
    </DashboardLayout>
  );
};

// --- Local Sub Component (UploadItem) ---
const UploadItem = ({ name, progress, color, isComplete }) => (
  <div className="flex items-center gap-4 p-4 hover:bg-slate-50 rounded-xl transition">
    <FileText className={`w-8 h-8 ${isComplete ? 'text-emerald-500' : 'text-slate-400'}`} />
    <div className="flex-1">
      <div className="flex justify-between mb-1">
        <span className="text-sm font-bold text-slate-800">{name}</span>
        {isComplete ? (
          <span className="text-xs font-bold text-emerald-600 flex items-center gap-1"><CheckCircle className="w-3 h-3" /> Uploaded</span>
        ) : (
          <button className="text-slate-400 hover:text-red-500"><X className="w-4 h-4" /></button>
        )}
      </div>
      {/* Uses the new reusable ProgressBar component */}
      <ProgressBar progress={progress} color={color} className="h-1.5" />
    </div>
  </div>
);

export default UploadPage;