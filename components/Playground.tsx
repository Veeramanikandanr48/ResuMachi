
import React, { useState, useRef, useEffect } from 'react';
import { 
  UserProfile, Tone, GeneratedResumeResponse, ResumeTheme, 
  Experience, Education, Project, SkillCategory, Certification, CustomSection, Link 
} from '../types';
import ResumePreview from './ResumePreview';
import ScoreDashboard from './ScoreDashboard';

interface PlaygroundProps {
  userProfile: UserProfile;
  setUserProfile: React.Dispatch<React.SetStateAction<UserProfile | null>>;
  jobDescription: string;
  setJobDescription: (jd: string) => void;
  isGenerating: boolean;
  generatedResume: GeneratedResumeResponse | null;
  onGenerate: (section?: string) => void;
  tone: Tone;
  setTone: (t: Tone) => void;
  conciseness: number;
  setConciseness: (v: number) => void;
  theme: ResumeTheme;
  setTheme: (t: ResumeTheme) => void;
  resumeName: string;
  setResumeName: (n: string) => void;
  onBackToDashboard: () => void;
}

const Playground: React.FC<PlaygroundProps> = ({
  userProfile,
  setUserProfile,
  jobDescription,
  setJobDescription,
  isGenerating,
  generatedResume,
  onGenerate,
  tone,
  setTone,
  conciseness,
  setConciseness,
  theme,
  setTheme,
  resumeName,
  setResumeName,
  onBackToDashboard
}) => {
  const [activeTab, setActiveTab] = useState<'details' | 'matcher'>('details');
  const [openAccordion, setOpenAccordion] = useState<string | null>('Personal Info');
  const [zoom, setZoom] = useState(0.85);
  const [showThemeMenu, setShowThemeMenu] = useState(false);
  
  const themeMenuRef = useRef<HTMLDivElement>(null);
  const previewContainerRef = useRef<HTMLDivElement>(null);

  const isJdMissing = !jobDescription.trim();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (themeMenuRef.current && !themeMenuRef.current.contains(event.target as Node)) setShowThemeMenu(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const updateProfile = (updater: (p: UserProfile) => UserProfile) => {
    setUserProfile(prev => prev ? updater(prev) : null);
  };

  const handleZoom = (delta: number) => setZoom(prev => Math.min(Math.max(prev + delta, 0.5), 1.5));

  const Accordion = ({ title, children, icon, count }: { title: string, children: React.ReactNode, icon: React.ReactNode, count?: string }) => (
    <div className="border-b border-slate-100 last:border-0">
      <button 
        onClick={() => setOpenAccordion(openAccordion === title ? null : title)}
        className="w-full py-4 px-6 flex items-center justify-between hover:bg-slate-50 transition-colors group/acc outline-none"
      >
        <div className="flex items-center gap-4">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${openAccordion === title ? 'bg-indigo-50 text-indigo-600' : 'bg-slate-100 text-slate-400'}`}>
            {icon}
          </div>
          <span className={`text-sm font-bold transition-colors ${openAccordion === title ? 'text-slate-900' : 'text-slate-600'}`}>{title}</span>
          {count && <span className="text-[10px] text-slate-400 font-medium bg-slate-100 px-1.5 py-0.5 rounded ml-1">({count})</span>}
        </div>
        <svg className={`w-4 h-4 text-slate-300 transition-transform duration-300 ${openAccordion === title ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {openAccordion === title && (
        <div className="px-6 pb-8 pt-2 animate-in slide-in-from-top-2 duration-300">
          {children}
        </div>
      )}
    </div>
  );

  const InputField = ({ label, value, onChange, placeholder = "" }: { label: string, value: string, onChange: (v: string) => void, placeholder?: string }) => (
    <div className="space-y-1.5">
      <label className="text-xs font-medium text-slate-500">{label}</label>
      <input 
        className="w-full p-2.5 border border-slate-200 rounded-lg text-sm font-medium focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400 outline-none transition-all" 
        value={value || ''} 
        placeholder={placeholder}
        onChange={e => onChange(e.target.value)} 
      />
    </div>
  );

  const TagInput = ({ label, items, onAdd, onRemove }: { label: string, items: string[], onAdd: (v: string) => void, onRemove: (v: string) => void }) => (
    <div className="space-y-3">
      <label className="text-xs font-medium text-slate-500">{label}</label>
      <div className="relative">
        <input 
          placeholder="C++, Java, Python" 
          className="w-full p-3 pr-10 border border-slate-200 rounded-xl text-sm outline-none focus:border-indigo-400"
          onKeyDown={e => {
            if (e.key === 'Enter') {
              const val = (e.target as HTMLInputElement).value.trim();
              if (val) {
                val.split(',').forEach(v => {
                  const s = v.trim();
                  if (s) onAdd(s);
                });
                (e.target as HTMLInputElement).value = '';
              }
            }
          }}
        />
        <button className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-300 hover:text-indigo-600" onClick={(e) => {
          const input = (e.currentTarget.previousSibling as HTMLInputElement);
          const val = input.value.trim();
          if (val) {
            val.split(',').forEach(v => {
              const s = v.trim();
              if (s) onAdd(s);
            });
            input.value = '';
          }
        }}>
           <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 4v16m8-8H4" /></svg>
        </button>
      </div>
      <div className="flex flex-wrap gap-2">
        {items.map(item => (
          <span key={item} className="px-3 py-1 bg-slate-50 text-slate-600 rounded-full text-xs font-medium border border-slate-100 flex items-center gap-1.5">
            {item}
            <button onClick={() => onRemove(item)} className="hover:text-red-500 font-bold">×</button>
          </span>
        ))}
      </div>
    </div>
  );

  return (
    <div className="flex-1 flex flex-col bg-white overflow-hidden">
      {/* Action Toolbar */}
      <div className="px-8 py-3 border-b border-slate-200 flex items-center justify-between no-print bg-white z-40 shadow-sm shrink-0">
        <div className="flex items-center gap-4">
          <div className="text-[10px] font-black text-slate-400 flex items-center gap-2 uppercase tracking-[0.2em]">
            <button onClick={onBackToDashboard} className="hover:text-indigo-600 transition-colors">Dashboard</button>
            <span className="text-slate-300">/</span> 
            <span className="text-slate-800">Editor</span>
          </div>
          <div className="h-6 w-px bg-slate-100 mx-2" />
          <div className="flex items-center gap-3">
            <h2 className="text-lg font-bold text-slate-900 tracking-tight leading-none">{resumeName}</h2>
            <button onClick={() => { const n = prompt("New Resume Name:", resumeName); if(n) setResumeName(n); }} className="p-1 text-slate-300 hover:text-indigo-600 rounded-lg transition-all">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
            </button>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="relative" ref={themeMenuRef}>
            <button onClick={() => setShowThemeMenu(!showThemeMenu)} className={`flex items-center gap-3 text-xs font-bold border px-4 py-2 rounded-xl transition-all ${showThemeMenu ? 'border-indigo-600 text-indigo-600 bg-indigo-50/10' : 'border-slate-200 text-slate-600'}`}>
              Style: <span className="text-slate-900">{theme}</span>
            </button>
            {showThemeMenu && (
              <div className="absolute right-0 top-full mt-2 w-52 bg-white border border-slate-200 shadow-2xl rounded-2xl p-1 z-[100] animate-in fade-in zoom-in-95 duration-200">
                 {(['Standard', 'LaTeX Classic', 'LaTeX Modern', 'Minimalist', 'Deedy Style', 'Executive'] as ResumeTheme[]).map(t => (
                   <button key={t} onClick={() => { setTheme(t); setShowThemeMenu(false); }} className={`w-full text-left px-4 py-2 text-xs font-bold rounded-xl hover:bg-slate-50 transition-colors ${theme === t ? 'text-indigo-600 bg-indigo-50' : 'text-slate-600'}`}>{t}</button>
                 ))}
              </div>
            )}
          </div>

          <button 
            onClick={() => onGenerate()}
            disabled={isGenerating || isJdMissing}
            className={`bg-slate-900 text-white font-bold px-6 py-2 rounded-xl text-xs hover:bg-black transition-all disabled:opacity-30 flex items-center gap-2 active:scale-95`}
          >
            {isGenerating ? <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>}
            {isGenerating ? 'Synthesizing' : 'Review'}
          </button>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Left Side: Modular Inputs */}
        <div className="w-[480px] border-r border-slate-200 flex flex-col no-print bg-white shadow-sm z-10 shrink-0">
          <div className="flex bg-slate-50 p-1 border-b border-slate-100">
            <button onClick={() => setActiveTab('details')} className={`flex-1 py-2.5 text-[11px] font-bold uppercase tracking-wider rounded-lg transition-all ${activeTab === 'details' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-400'}`}>Resume Details</button>
            <button onClick={() => setActiveTab('matcher')} className={`flex-1 py-2.5 text-[11px] font-bold uppercase tracking-wider rounded-lg transition-all ${activeTab === 'matcher' ? 'bg-white text-[#10894a] shadow-sm' : 'text-slate-400'}`}>Resume Matcher</button>
          </div>

          <div className="flex-1 overflow-y-auto custom-scrollbar">
            {activeTab === 'details' ? (
              <div className="flex flex-col">
                <Accordion title="Personal Info" icon={<svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>}>
                  <div className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                      <InputField label="First Name" value={userProfile.personalInfo.firstName} onChange={v => updateProfile(p => ({ ...p, personalInfo: { ...p.personalInfo, firstName: v, fullName: `${v} ${p.personalInfo.lastName}` }}))} />
                      <InputField label="Last Name" value={userProfile.personalInfo.lastName} onChange={v => updateProfile(p => ({ ...p, personalInfo: { ...p.personalInfo, lastName: v, fullName: `${p.personalInfo.firstName} ${v}` }}))} />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <InputField label="Email" value={userProfile.personalInfo.email} onChange={v => updateProfile(p => ({ ...p, personalInfo: { ...p.personalInfo, email: v }}))} />
                      <InputField label="Phone" value={userProfile.personalInfo.phone} onChange={v => updateProfile(p => ({ ...p, personalInfo: { ...p.personalInfo, phone: v }}))} />
                    </div>
                    <InputField label="Address" value={userProfile.personalInfo.address} onChange={v => updateProfile(p => ({ ...p, personalInfo: { ...p.personalInfo, address: v }}))} />
                    <InputField label="Job Title" value={userProfile.personalInfo.title} onChange={v => updateProfile(p => ({ ...p, personalInfo: { ...p.personalInfo, title: v }}))} />
                    
                    <div className="space-y-1.5">
                      <label className="text-xs font-medium text-slate-500">Professional Summary</label>
                      <textarea 
                        className="w-full p-2.5 border border-slate-200 rounded-lg text-sm font-medium focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400 outline-none transition-all h-24 resize-none"
                        value={userProfile.personalInfo.summary || ''}
                        placeholder="Brief overview of your career and skills..."
                        onChange={e => updateProfile(p => ({ ...p, personalInfo: { ...p.personalInfo, summary: e.target.value }}))}
                      />
                    </div>

                    <div className="pt-4 border-t border-slate-100">
                      <div className="flex justify-between items-center mb-4">
                        <span className="text-xs font-black text-slate-400 uppercase tracking-widest">Links <span className="text-indigo-600">({userProfile.personalInfo.links.length} / 5)</span></span>
                      </div>
                      <div className="space-y-3">
                        {userProfile.personalInfo.links.map((link, idx) => (
                          <div key={idx} className="flex gap-2 group/link">
                            <input className="flex-1 p-2.5 border border-slate-200 rounded-lg text-xs outline-none focus:border-indigo-400" value={link.url} onChange={e => {
                                const newLinks = [...userProfile.personalInfo.links];
                                newLinks[idx].url = e.target.value;
                                updateProfile(p => ({ ...p, personalInfo: { ...p.personalInfo, links: newLinks }}));
                            }} />
                            <select className="p-2.5 border border-slate-200 rounded-lg text-xs font-bold bg-white outline-none" value={link.type} onChange={e => {
                                const newLinks = [...userProfile.personalInfo.links];
                                newLinks[idx].type = e.target.value as any;
                                updateProfile(p => ({ ...p, personalInfo: { ...p.personalInfo, links: newLinks }}));
                            }}>
                              <option>GitHub</option>
                              <option>LinkedIn</option>
                              <option>HackerRank</option>
                              <option>Portfolio</option>
                              <option>Other</option>
                            </select>
                            <button onClick={() => updateProfile(p => ({ ...p, personalInfo: { ...p.personalInfo, links: p.personalInfo.links.filter((_, i) => i !== idx) }}))} className="p-2 text-slate-300 hover:text-red-500 opacity-0 group-hover/link:opacity-100 transition-opacity">
                              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                            </button>
                          </div>
                        ))}
                        <button onClick={() => updateProfile(p => ({ ...p, personalInfo: { ...p.personalInfo, links: [...p.personalInfo.links, { type: 'Other', url: '' }] }}))} className="w-full py-2.5 border border-dashed border-slate-200 rounded-xl text-xs font-bold text-slate-500 hover:bg-slate-50 transition-colors flex items-center justify-center gap-2">
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg> Add Link
                        </button>
                      </div>
                    </div>
                  </div>
                </Accordion>

                <Accordion title="Experience" icon={<svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>}>
                   <div className="space-y-6">
                    {userProfile.experience.map((exp, idx) => (
                      <div key={idx} className="p-6 border border-slate-100 bg-slate-50/50 rounded-2xl space-y-4 relative group/item">
                        <div className="flex items-center justify-between">
                           <span className="text-sm font-bold text-slate-700">{exp.company || 'New Entry'}</span>
                           <button onClick={() => updateProfile(p => ({ ...p, experience: p.experience.filter((_, i) => i !== idx) }))} className="p-1.5 text-slate-300 hover:text-red-500 transition-all opacity-0 group-hover/item:opacity-100">
                             <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                           </button>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <InputField label="Company" value={exp.company} onChange={v => {
                            const newExp = [...userProfile.experience];
                            newExp[idx].company = v;
                            updateProfile(p => ({ ...p, experience: newExp }));
                          }} />
                          <InputField label="Role" value={exp.role} onChange={v => {
                            const newExp = [...userProfile.experience];
                            newExp[idx].role = v;
                            updateProfile(p => ({ ...p, experience: newExp }));
                          }} />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <InputField label="Start Date" value={exp.startDate} onChange={v => {
                            const newExp = [...userProfile.experience];
                            newExp[idx].startDate = v;
                            updateProfile(p => ({ ...p, experience: newExp }));
                          }} />
                          <InputField label="End Date" value={exp.endDate} onChange={v => {
                            const newExp = [...userProfile.experience];
                            newExp[idx].endDate = v;
                            updateProfile(p => ({ ...p, experience: newExp }));
                          }} />
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-xs font-medium text-slate-500">Description</label>
                          <textarea 
                            className="w-full p-2.5 border border-slate-200 rounded-lg text-sm font-medium focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400 outline-none transition-all h-32 resize-none"
                            value={exp.description}
                            onChange={e => {
                              const newExp = [...userProfile.experience];
                              newExp[idx].description = e.target.value;
                              updateProfile(p => ({ ...p, experience: newExp }));
                            }}
                          />
                        </div>
                      </div>
                    ))}
                    <button onClick={() => updateProfile(p => ({ ...p, experience: [{ company: '', role: '', startDate: '', endDate: '', current: false, description: '' }, ...p.experience] }))} className="w-full py-3 border border-dashed border-slate-200 rounded-xl text-xs font-bold text-slate-500 hover:bg-slate-50 transition-colors">+ Add Experience Entry</button>
                  </div>
                </Accordion>

                <Accordion title="Education" icon={<svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" /></svg>}>
                  <div className="space-y-6">
                    {userProfile.education.map((edu, idx) => (
                      <div key={idx} className="p-6 border border-slate-100 bg-slate-50/50 rounded-2xl space-y-4 relative group/item">
                        <div className="flex items-center justify-between">
                           <div className="flex items-center gap-3">
                              <svg className="w-4 h-4 text-slate-200" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
                              <span className="text-sm font-bold text-slate-700 truncate max-w-[200px]">{edu.institution || 'New Record'}</span>
                           </div>
                           <div className="flex items-center gap-2 opacity-0 group-hover/item:opacity-100 transition-opacity">
                             <button onClick={() => updateProfile(p => ({ ...p, education: p.education.filter((_, i) => i !== idx) }))} className="p-1.5 text-slate-300 hover:text-red-500"><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg></button>
                           </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <InputField label="Institution" value={edu.institution} onChange={v => {
                            const newEdu = [...userProfile.education];
                            newEdu[idx].institution = v;
                            updateProfile(p => ({ ...p, education: newEdu }));
                          }} />
                          <InputField label="Location" value={edu.location} onChange={v => {
                            const newEdu = [...userProfile.education];
                            newEdu[idx].location = v;
                            updateProfile(p => ({ ...p, education: newEdu }));
                          }} />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <InputField label="Degree Type" value={edu.degreeType} onChange={v => {
                            const newEdu = [...userProfile.education];
                            newEdu[idx].degreeType = v;
                            updateProfile(p => ({ ...p, education: newEdu }));
                          }} />
                          <InputField label="Field of Study" value={edu.field} onChange={v => {
                            const newEdu = [...userProfile.education];
                            newEdu[idx].field = v;
                            updateProfile(p => ({ ...p, education: newEdu }));
                          }} />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <InputField label="Grad Month / Year" value={edu.gradMonthYear} onChange={v => {
                            const newEdu = [...userProfile.education];
                            newEdu[idx].gradMonthYear = v;
                            updateProfile(p => ({ ...p, education: newEdu }));
                          }} />
                        </div>
                      </div>
                    ))}
                    <button onClick={() => updateProfile(p => ({ ...p, education: [...p.education, { institution: '', location: '', degreeType: '', field: '', startMonthYear: '', gradMonthYear: '', scoreType: 'PERCENTAGE', scoreValue: '' }] }))} className="w-full py-3 border border-dashed border-slate-200 rounded-xl text-xs font-bold text-slate-500 hover:bg-slate-50 transition-colors">+ Add Education Record</button>
                  </div>
                </Accordion>

                <Accordion title="Skillsets" icon={<svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>}>
                  <div className="space-y-6">
                    {['Languages', 'Libraries / frameworks', 'Tools / platforms', 'Databases'].map(cat => {
                       const currentCat = userProfile.skillCategories.find(c => c.category === cat) || { category: cat, items: [] };
                       return (
                        <TagInput 
                          key={cat}
                          label={cat} 
                          items={currentCat.items} 
                          onAdd={v => {
                            updateProfile(p => {
                              const existing = p.skillCategories.find(c => c.category === cat);
                              if (existing) {
                                if (existing.items.includes(v)) return p;
                                return { ...p, skillCategories: p.skillCategories.map(c => c.category === cat ? { ...c, items: [...c.items, v] } : c) };
                              }
                              return { ...p, skillCategories: [...p.skillCategories, { category: cat, items: [v] }] };
                            });
                          }} 
                          onRemove={v => {
                            updateProfile(p => ({ ...p, skillCategories: p.skillCategories.map(c => c.category === cat ? { ...c, items: c.items.filter(i => i !== v) } : c) }));
                          }} 
                        />
                       );
                    })}
                  </div>
                </Accordion>

                <Accordion title="Projects" icon={<svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" /></svg>}>
                  <div className="space-y-6">
                    {userProfile.projects.map((proj, idx) => (
                      <div key={idx} className="p-6 border border-slate-100 bg-slate-50/50 rounded-2xl space-y-4 relative group/item">
                         <div className="flex items-center justify-between">
                            <span className="text-sm font-bold text-slate-700">{proj.name || 'Project Name'}</span>
                            <button onClick={() => updateProfile(p => ({ ...p, projects: p.projects.filter((_, i) => i !== idx) }))} className="p-1.5 text-slate-300 hover:text-red-500 transition-all opacity-0 group-hover/item:opacity-100"><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg></button>
                         </div>
                         <InputField label="Project Name" value={proj.name} onChange={v => {
                            const newProjs = [...userProfile.projects];
                            newProjs[idx].name = v;
                            updateProfile(p => ({ ...p, projects: newProjs }));
                         }} />
                         <InputField label="Technologies Used" value={proj.technologies} onChange={v => {
                            const newProjs = [...userProfile.projects];
                            newProjs[idx].technologies = v;
                            updateProfile(p => ({ ...p, projects: newProjs }));
                         }} />
                         <textarea 
                           className="w-full p-4 border border-slate-200 rounded-xl text-sm h-32 outline-none focus:border-indigo-400 font-medium leading-relaxed resize-none shadow-inner"
                           value={proj.description}
                           onChange={e => {
                             const newProjs = [...userProfile.projects];
                             newProjs[idx].description = e.target.value;
                             updateProfile(p => ({ ...p, projects: newProjs }));
                           }}
                         />
                      </div>
                    ))}
                    <button onClick={() => updateProfile(p => ({ ...p, projects: [...p.projects, { name: '', technologies: '', link: '', description: '' }] }))} className="w-full py-3 border border-dashed border-slate-200 rounded-xl text-xs font-bold text-slate-500 hover:bg-slate-50 transition-colors">+ Add Project Entry</button>
                  </div>
                </Accordion>
              </div>
            ) : (
              <div className="p-8 space-y-8 animate-in fade-in">
                <textarea
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  placeholder="Paste the Job Description to initialize context..."
                  className={`w-full h-72 p-5 border border-slate-200 rounded-2xl text-sm bg-slate-50 focus:bg-white outline-none transition-all font-medium leading-relaxed resize-none shadow-inner focus:border-indigo-500`}
                />
                <div className="space-y-4">
                  <div className="flex justify-between items-center px-1">
                       <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Synthesis Density</span>
                       <span className="text-[11px] font-black text-blue-600">{conciseness}%</span>
                    </div>
                    <input type="range" min="0" max="100" value={conciseness} onChange={(e) => setConciseness(parseInt(e.target.value))} className="w-full h-1 bg-slate-200 rounded-full appearance-none cursor-pointer accent-blue-600" />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Panel: Live Viewport */}
        <div className="flex-1 bg-slate-100 relative overflow-hidden flex flex-col group/canvas">
          <div className="absolute top-6 left-1/2 -translate-x-1/2 flex items-center gap-1 p-1 bg-white/90 backdrop-blur-md rounded-2xl shadow-2xl border border-slate-200 z-50 no-print transition-all">
             <button onClick={() => handleZoom(-0.1)} className="p-2 hover:bg-slate-100 rounded-xl transition-colors text-slate-600"><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M20 12H4" /></svg></button>
             <div className="px-3 min-w-[60px] text-center text-xs font-black text-slate-900">{Math.round(zoom * 100)}%</div>
             <button onClick={() => handleZoom(0.1)} className="p-2 hover:bg-slate-100 rounded-xl transition-colors text-slate-600"><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" /></svg></button>
          </div>

          <div className="flex-1 overflow-auto custom-scrollbar bg-slate-200/50 p-12 flex items-start justify-center" ref={previewContainerRef}>
            <div 
              className="origin-top transition-transform duration-300 ease-out shadow-[0_40px_100px_-20px_rgba(0,0,0,0.15)] rounded-sm"
              style={{ transform: `scale(${zoom})` }}
            >
              <ResumePreview 
                userProfile={userProfile}
                generatedContent={generatedResume?.resume_content || null} 
                theme={theme}
                onRegenerateSection={onGenerate}
                isGenerating={isGenerating}
              />
            </div>
          </div>

          {generatedResume && (
            <ScoreDashboard 
              score={generatedResume.ats_score} 
              suggestions={generatedResume.optimization_suggestions} 
              reasoning={generatedResume.selected_template.reason}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Playground;
