
import React, { useState, useCallback, useEffect } from 'react';
import { UserProfile, ResumeWork } from './types';
import { generateResume } from './services/geminiService';
import Playground from './components/Playground';
import Dashboard from './components/Dashboard';

const DEFAULT_PROFILE: UserProfile = {
  personalInfo: { firstName: '', lastName: '', address: '', links: [], fullName: 'Guest Professional', email: '', phone: '', location: '', title: '', summary: '', linkedin: '', website: '' },
  experience: [],
  education: [],
  skillCategories: [],
  skills: [],
  projects: [],
  certifications: [],
  customSections: [],
};

const App: React.FC = () => {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [works, setWorks] = useState<ResumeWork[]>([]);
  const [activeWorkId, setActiveWorkId] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [view, setView] = useState<'dashboard' | 'editor'>('dashboard');

  // Initial Load
  useEffect(() => {
    const savedProfile = localStorage.getItem('resumaster_profile');
    const savedWorks = localStorage.getItem('resumaster_works');

    if (savedProfile) setUserProfile(JSON.parse(savedProfile));
    if (savedWorks) setWorks(JSON.parse(savedWorks));
  }, []);

  // Persistence
  useEffect(() => {
    if (userProfile) localStorage.setItem('resumaster_profile', JSON.stringify(userProfile));
  }, [userProfile]);

  useEffect(() => {
    localStorage.setItem('resumaster_works', JSON.stringify(works));
  }, [works]);

  const activeWork = works.find(w => w.id === activeWorkId);

  const handleCreateNewWork = (profileOverride?: UserProfile) => {
    const targetProfile = profileOverride || userProfile || DEFAULT_PROFILE;
    const newWork: ResumeWork = {
      id: crypto.randomUUID(),
      name: `${targetProfile.personalInfo.fullName.split(' ')[0]}'s Resume`,
      updatedAt: Date.now(),
      theme: 'Standard',
      generatedResume: null,
      jobDescription: '',
      tone: 'Professional',
      conciseness: 50,
    };
    setWorks(prev => [newWork, ...prev]);
    setActiveWorkId(newWork.id);
    setView('editor');
  };

  const handleImportComplete = (profile: UserProfile) => {
    setUserProfile(profile);
    handleCreateNewWork(profile);
  };

  const handleDeleteWork = (id: string) => {
    if (window.confirm("Are you sure you want to permanently delete this resume?")) {
      setWorks(prev => prev.filter(w => w.id !== id));
      if (activeWorkId === id) {
        setActiveWorkId(null);
        setView('dashboard');
      }
    }
  };

  const handleUpdateWork = (id: string, updates: Partial<ResumeWork>) => {
    setWorks(prev => prev.map(w => w.id === id ? { ...w, ...updates, updatedAt: Date.now() } : w));
  };

  const handleGenerate = useCallback(async (section?: string) => {
    if (!userProfile || !activeWork) return;
    setIsGenerating(true);
    try {
      const result = await generateResume(
        userProfile, 
        activeWork.jobDescription, 
        activeWork.tone, 
        activeWork.conciseness, 
        section
      );
      handleUpdateWork(activeWork.id, { generatedResume: result });
    } catch (err) {
      console.error(err);
      alert("Failed to sync with AI. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  }, [userProfile, activeWork]);

  const handleLogout = () => {
    if (window.confirm("Wipe all data and log out?")) {
      localStorage.clear();
      window.location.reload();
    }
  };

  return (
    <div className="h-screen flex flex-col bg-slate-50 overflow-hidden font-sans selection:bg-blue-100 selection:text-blue-900">
      {view !== 'dashboard' && (
        <nav className="h-16 border-b border-slate-200 bg-slate-900 flex items-center px-6 justify-between shrink-0 no-print z-[60]">
          <div className="flex items-center gap-8">
            <button 
              onClick={() => setView('dashboard')}
              className="flex items-center gap-3 cursor-pointer group outline-none"
            >
               <div className="w-9 h-9 bg-blue-600 rounded-lg flex items-center justify-center text-white font-black text-xl shadow-lg shadow-blue-500/20 group-hover:scale-105 group-active:scale-95 transition-all">R</div>
               <div className="flex flex-col text-left">
                 <span className="text-white font-bold text-lg tracking-tight leading-none">ResuMaster</span>
                 <span className="text-slate-500 font-bold text-[10px] uppercase tracking-widest mt-1">Intelligence Platform</span>
               </div>
            </button>
          </div>

          <div className="flex items-center gap-4">
             <button onClick={() => setView('dashboard')} className="px-4 py-2 text-[10px] font-black uppercase tracking-widest transition-all rounded-lg text-slate-400 hover:text-white hover:bg-slate-800">My Works</button>
             <div className="h-8 w-px bg-slate-800" />
             <div className="flex items-center gap-3 pl-2">
               <div className="text-right hidden sm:block">
                 <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Authenticated</p>
                 <p className="text-xs font-bold text-white leading-none truncate max-w-[120px]">{(userProfile || DEFAULT_PROFILE).personalInfo.fullName}</p>
               </div>
               <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-xs text-white font-black shadow-lg border border-white/10">
                 {(userProfile || DEFAULT_PROFILE).personalInfo.fullName.split(' ').map(n => n[0]).join('')}
               </div>
             </div>
          </div>
        </nav>
      )}

      <main className="flex-1 flex flex-col overflow-hidden relative">
        {view === 'dashboard' ? (
          <Dashboard 
            userProfile={userProfile || DEFAULT_PROFILE}
            onImportComplete={handleImportComplete}
            works={works} 
            onCreateNew={() => handleCreateNewWork()} 
            onDelete={handleDeleteWork} 
            onOpen={(id) => { setActiveWorkId(id); setView('editor'); }}
          />
        ) : activeWork ? (
          <Playground 
            userProfile={userProfile || DEFAULT_PROFILE}
            setUserProfile={setUserProfile as any}
            jobDescription={activeWork.jobDescription}
            setJobDescription={(jd) => handleUpdateWork(activeWork.id, { jobDescription: jd })}
            isGenerating={isGenerating}
            generatedResume={activeWork.generatedResume}
            onGenerate={handleGenerate}
            tone={activeWork.tone}
            setTone={(t) => handleUpdateWork(activeWork.id, { tone: t })}
            conciseness={activeWork.conciseness}
            setConciseness={(c) => handleUpdateWork(activeWork.id, { conciseness: c })}
            theme={activeWork.theme}
            setTheme={(th) => handleUpdateWork(activeWork.id, { theme: th })}
            resumeName={activeWork.name}
            setResumeName={(n) => handleUpdateWork(activeWork.id, { name: n })}
            onBackToDashboard={() => setView('dashboard')}
          />
        ) : (
          <div className="flex-1 flex items-center justify-center text-slate-400 font-bold uppercase tracking-widest animate-pulse">Recovering Session...</div>
        )}
      </main>
    </div>
  );
};

export default App;
