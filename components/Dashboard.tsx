
import React, { useState } from 'react';
import { ResumeWork, UserProfile } from '../types';
import ResumePreview from './ResumePreview';
import OnboardingStepper from './OnboardingStepper';

interface DashboardProps {
  userProfile: UserProfile;
  onImportComplete: (p: UserProfile) => void;
  works: ResumeWork[];
  onCreateNew: () => void;
  onDelete: (id: string) => void;
  onOpen: (id: string) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ userProfile, onImportComplete, works, onCreateNew, onDelete, onOpen }) => {
  const [showImportWizard, setShowImportWizard] = useState(false);

  const handleWizardComplete = (profile: UserProfile) => {
    onImportComplete(profile);
    setShowImportWizard(false);
  };

  return (
    <div className="flex-1 overflow-y-auto custom-scrollbar bg-white relative">
      <header className="px-12 py-6 border-b border-slate-100 flex items-center justify-between sticky top-0 bg-white z-50">
        <h1 className="text-2xl font-medium text-slate-400">
          Welcome <span className="text-slate-600 font-bold">{userProfile.personalInfo.fullName}!</span>
        </h1>
        <div className="flex items-center gap-4">
          <button 
            className="px-6 py-2.5 border border-slate-300 text-slate-700 font-bold rounded-lg hover:bg-slate-50 transition-all text-sm"
            onClick={() => setShowImportWizard(true)}
          >
            Import Resume
          </button>
          <button 
            onClick={onCreateNew}
            className="px-6 py-2.5 bg-[#10894a] text-white font-bold rounded-lg hover:bg-[#0d6e3c] transition-all text-sm shadow-sm"
          >
            Create New
          </button>
        </div>
      </header>

      <div className="p-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-10">
          {works.map((work, index) => (
            <div key={work.id} className="group flex flex-col gap-6">
              <div className="flex justify-between items-end px-2">
                <h3 className="text-slate-700 font-medium text-lg leading-tight truncate pr-4">{work.name}</h3>
                <span className="text-slate-200 font-bold text-4xl italic select-none">{index + 1}</span>
              </div>
              
              <div 
                onClick={() => onOpen(work.id)}
                className="relative aspect-[1/1.4] bg-white rounded-md shadow-[0_5px_15px_rgba(0,0,0,0.08)] group-hover:shadow-[0_20px_40px_rgba(0,0,0,0.12)] transition-all cursor-pointer border border-slate-100 overflow-hidden"
              >
                <div className="absolute inset-0 origin-top-left transform scale-[0.22] w-[210mm] h-[297mm] pointer-events-none opacity-90 group-hover:opacity-100 transition-opacity">
                  {work.generatedResume ? (
                    <ResumePreview generatedContent={work.generatedResume.resume_content} userProfile={userProfile} theme={work.theme} />
                  ) : (
                    <div className="w-[210mm] h-[297mm] bg-white p-20 flex flex-col gap-8">
                       <div className="h-12 w-1/3 bg-slate-100 rounded" />
                       <div className="h-4 w-full bg-slate-50 rounded" />
                       <div className="h-4 w-5/6 bg-slate-50 rounded" />
                       <div className="h-32 w-full bg-slate-100/50 rounded" />
                    </div>
                  )}
                </div>
                <div className="absolute inset-0 bg-transparent group-hover:bg-slate-900/5 transition-colors pointer-events-none" />
                <button 
                  onClick={(e) => { e.stopPropagation(); onDelete(work.id); }}
                  className="absolute bottom-4 right-4 p-2 bg-white/90 text-red-400 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-all hover:text-red-600 hover:scale-110 active:scale-95 z-20"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                </button>
              </div>
            </div>
          ))}

          <div className="flex flex-col gap-6">
            <div className="h-[28px]" />
            <div 
              onClick={onCreateNew}
              className="aspect-[1/1.4] bg-white rounded-md border-2 border-[#6d8a91] border-opacity-30 flex flex-col items-center justify-center gap-6 cursor-pointer hover:bg-slate-50 transition-all group"
            >
              <div className="w-16 h-16 rounded-full bg-[#6d8a91] bg-opacity-20 flex items-center justify-center group-hover:scale-110 transition-transform">
                <svg className="w-8 h-8 text-[#6d8a91]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 4v16m8-8H4" /></svg>
              </div>
              <button className="bg-[#6d8a91] text-white px-8 py-3 rounded font-bold text-sm shadow-sm">Create New</button>
            </div>
          </div>
        </div>
      </div>

      {showImportWizard && (
        <div 
          className="fixed inset-0 z-[100] bg-slate-900/60 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-300"
          onClick={() => setShowImportWizard(false)}
        >
          <div 
            className="w-full max-w-5xl bg-white rounded-[3rem] shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-300 relative border border-slate-100"
            onClick={e => e.stopPropagation()}
          >
            <button 
              onClick={() => setShowImportWizard(false)}
              className="absolute top-8 right-8 w-10 h-10 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center hover:bg-slate-200 hover:text-slate-600 transition-all z-[110]"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
            <div className="flex-1 bg-white">
              <OnboardingStepper onComplete={handleWizardComplete} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
