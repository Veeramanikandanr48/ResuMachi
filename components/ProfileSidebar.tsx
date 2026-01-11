
import React, { useState, useEffect } from 'react';
import { UserProfile, PersonalInfo, Experience, Education, Project, BookmarkedResume, Certification } from '../types';
import { ModelList } from '../features/AIModelManagement/components/ModelList';
import { PromptInput } from '../features/PromptBuilder/components/PromptInput';

interface ProfileSidebarProps {
  isOpen: boolean;
  // Fix: changed onClose from void to a function type
  onClose: () => void;
  profile: UserProfile;
  onUpdate: (profile: UserProfile) => void;
  bookmarks: BookmarkedResume[];
  onRestoreBookmark: (b: BookmarkedResume) => void;
  onDeleteBookmark: (id: string) => void;
}

const ProfileSidebar: React.FC<ProfileSidebarProps> = ({ 
  isOpen, 
  onClose, 
  profile, 
  onUpdate, 
  bookmarks,
  onRestoreBookmark,
  onDeleteBookmark
}) => {
  const [localProfile, setLocalProfile] = useState<UserProfile>(profile);
  const [activeTab, setActiveTab] = useState<'edit' | 'vault' | 'tuning'>('edit');
  const [editSection, setEditSection] = useState<'personal' | 'experience' | 'education' | 'projects' | 'skills' | 'certifications'>('personal');

  useEffect(() => {
    setLocalProfile(profile);
  }, [profile]);

  const saveAndSync = (updated: UserProfile) => {
    setLocalProfile(updated);
    onUpdate(updated);
  };

  const handlePersonalInfoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const updated = {
      ...localProfile,
      personalInfo: { ...localProfile.personalInfo, [name]: value }
    };
    saveAndSync(updated);
  };

  const sections = [
    { id: 'personal', label: 'Identity', icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' },
    { id: 'experience', label: 'Work', icon: 'M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z' },
    { id: 'education', label: 'Edu', icon: 'M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z' },
    { id: 'projects', label: 'Projects', icon: 'M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4' },
    { id: 'skills', label: 'Skills', icon: 'M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z' },
    { id: 'certifications', label: 'Certs', icon: 'M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138z' },
  ];

  return (
    <>
      {isOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[60] animate-in fade-in duration-300"
          onClick={onClose}
        />
      )}

      <div className={`fixed top-0 right-0 h-full w-full md:w-[650px] bg-white shadow-2xl z-[70] transform transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] ${isOpen ? 'translate-x-0' : 'translate-x-full'} flex flex-col border-l border-slate-200`}>
        {/* Header */}
        <div className="p-8 border-b flex justify-between items-center bg-slate-50/50">
          <div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">System Core</h2>
            <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mt-1">Professional Intelligence Command</p>
          </div>
          <button onClick={onClose} className="p-4 hover:bg-slate-200 rounded-2xl transition-all text-slate-400 hover:text-slate-900">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex px-8 bg-white border-b sticky top-0 z-10">
          {(['edit', 'vault', 'tuning'] as const).map(tab => (
            <button 
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-4 text-[10px] font-black tracking-[0.2em] uppercase transition-all ${activeTab === tab ? 'text-blue-600 border-b-4 border-blue-600' : 'text-slate-400 hover:text-slate-600'}`}
            >
              {tab === 'edit' ? 'Knowledge' : tab === 'vault' ? 'Vault' : 'Advanced'}
            </button>
          ))}
        </div>

        <div className="flex-1 overflow-hidden flex">
          {activeTab === 'edit' && (
            <div className="flex w-full overflow-hidden">
              <div className="w-20 border-r bg-slate-50 flex flex-col items-center py-6 gap-6">
                {sections.map(s => (
                  <button 
                    key={s.id}
                    onClick={() => setEditSection(s.id as any)}
                    className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all group ${editSection === s.id ? 'bg-blue-600 text-white shadow-lg shadow-blue-100' : 'bg-white text-slate-400 hover:text-slate-900 hover:bg-slate-100'}`}
                  >
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={s.icon} /></svg>
                  </button>
                ))}
              </div>

              <div className="flex-1 overflow-y-auto p-8 custom-scrollbar bg-white animate-in fade-in slide-in-from-right-4">
                {editSection === 'personal' && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="col-span-2 space-y-1">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Full Name</label>
                        <input name="fullName" value={localProfile.personalInfo.fullName} onChange={handlePersonalInfoChange} className="w-full p-4 bg-slate-50 rounded-2xl border-2 border-transparent focus:border-blue-500 focus:bg-white outline-none font-bold transition-all" />
                      </div>
                      <div className="col-span-2 space-y-1">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Job Title</label>
                        <input name="title" value={localProfile.personalInfo.title} onChange={handlePersonalInfoChange} className="w-full p-4 bg-slate-50 rounded-2xl border-2 border-transparent focus:border-blue-500 focus:bg-white outline-none font-bold transition-all" />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Email</label>
                        <input name="email" value={localProfile.personalInfo.email} onChange={handlePersonalInfoChange} className="w-full p-4 bg-slate-50 rounded-2xl border-2 border-transparent focus:border-blue-500 focus:bg-white outline-none" />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Phone</label>
                        <input name="phone" value={localProfile.personalInfo.phone} onChange={handlePersonalInfoChange} className="w-full p-4 bg-slate-50 rounded-2xl border-2 border-transparent focus:border-blue-500 focus:bg-white outline-none" />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Location</label>
                        <input name="location" value={localProfile.personalInfo.location} onChange={handlePersonalInfoChange} className="w-full p-4 bg-slate-50 rounded-2xl border-2 border-transparent focus:border-blue-500 focus:bg-white outline-none" />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">LinkedIn</label>
                        <input name="linkedin" value={localProfile.personalInfo.linkedin} onChange={handlePersonalInfoChange} className="w-full p-4 bg-slate-50 rounded-2xl border-2 border-transparent focus:border-blue-500 focus:bg-white outline-none" />
                      </div>
                    </div>
                  </div>
                )}
                
                {editSection === 'experience' && (
                  <div className="space-y-6">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">Work History</h3>
                      <button 
                        onClick={() => {
                          const newExp: Experience = { company: 'New Company', role: 'New Role', startDate: 'Start', endDate: 'Present', current: true, description: '' };
                          saveAndSync({ ...localProfile, experience: [newExp, ...localProfile.experience] });
                        }}
                        className="px-4 py-2 bg-blue-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-blue-100"
                      >
                        + Add Job
                      </button>
                    </div>
                    {localProfile.experience.map((exp, idx) => (
                      <div key={idx} className="p-6 bg-slate-50 rounded-3xl border border-slate-100 space-y-4 relative group">
                        <button 
                          onClick={() => saveAndSync({ ...localProfile, experience: localProfile.experience.filter((_, i) => i !== idx) })}
                          className="absolute top-4 right-4 text-slate-300 hover:text-red-500 p-1"
                        >
                          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                        </button>
                        <div className="grid grid-cols-2 gap-4">
                          <input placeholder="Company" className="p-3 bg-white rounded-xl text-sm font-bold border border-transparent focus:border-blue-500 outline-none" value={exp.company} onChange={e => {
                            const newExps = [...localProfile.experience];
                            newExps[idx] = { ...newExps[idx], company: e.target.value };
                            saveAndSync({ ...localProfile, experience: newExps });
                          }} />
                          <input placeholder="Role" className="p-3 bg-white rounded-xl text-sm font-bold border border-transparent focus:border-blue-500 outline-none" value={exp.role} onChange={e => {
                            const newExps = [...localProfile.experience];
                            newExps[idx] = { ...newExps[idx], role: e.target.value };
                            saveAndSync({ ...localProfile, experience: newExps });
                          }} />
                          <input placeholder="Dates" className="p-3 bg-white rounded-xl text-xs border border-transparent focus:border-blue-500 outline-none" value={`${exp.startDate} - ${exp.endDate}`} onChange={e => {
                             const [start, end] = e.target.value.split('-').map(s => s.trim());
                             const newExps = [...localProfile.experience];
                             newExps[idx] = { ...newExps[idx], startDate: start || '', endDate: end || '' };
                             saveAndSync({ ...localProfile, experience: newExps });
                          }} />
                        </div>
                        <textarea 
                          placeholder="Achievements..." 
                          className="w-full p-4 bg-white rounded-xl text-xs border border-transparent focus:border-blue-500 outline-none h-32 resize-none"
                          value={exp.description}
                          onChange={e => {
                            const newExps = [...localProfile.experience];
                            newExps[idx] = { ...newExps[idx], description: e.target.value };
                            saveAndSync({ ...localProfile, experience: newExps });
                          }}
                        />
                      </div>
                    ))}
                  </div>
                )}

                {editSection === 'education' && (
                  <div className="space-y-6">
                     <div className="flex justify-between items-center mb-4">
                      <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest"> Academic Records</h3>
                      <button 
                        onClick={() => {
                          const newEdu: Education = { institution: 'University', location: '', degreeType: '', field: 'Major', startMonthYear: '', gradMonthYear: '', scoreType: 'GPA', scoreValue: '', degree: 'Degree', graduationDate: 'Date' };
                          saveAndSync({ ...localProfile, education: [newEdu, ...localProfile.education] });
                        }}
                        className="px-4 py-2 bg-blue-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-blue-100"
                      >
                        + Add Degree
                      </button>
                    </div>
                    {localProfile.education.map((edu, idx) => (
                      <div key={idx} className="p-6 bg-slate-50 rounded-3xl border border-slate-100 space-y-4 relative group">
                        <button 
                          onClick={() => saveAndSync({ ...localProfile, education: localProfile.education.filter((_, i) => i !== idx) })}
                          className="absolute top-4 right-4 text-slate-300 hover:text-red-500 p-1"
                        >
                          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                        </button>
                        <div className="grid grid-cols-1 gap-4">
                          <input placeholder="Institution" className="p-3 bg-white rounded-xl text-sm font-bold border border-transparent focus:border-blue-500 outline-none" value={edu.institution} onChange={e => {
                            const newEdu = [...localProfile.education];
                            newEdu[idx] = { ...newEdu[idx], institution: e.target.value };
                            saveAndSync({ ...localProfile, education: newEdu });
                          }} />
                          <input placeholder="Degree / Field" className="p-3 bg-white rounded-xl text-sm border border-transparent focus:border-blue-500 outline-none" value={`${edu.degree} in ${edu.field}`} onChange={e => {
                            const [deg, field] = e.target.value.split(' in ').map(s => s.trim());
                            const newEdu = [...localProfile.education];
                            newEdu[idx] = { ...newEdu[idx], degree: deg || '', field: field || '' };
                            saveAndSync({ ...localProfile, education: newEdu });
                          }} />
                          <input placeholder="Graduation Date" className="p-3 bg-white rounded-xl text-xs border border-transparent focus:border-blue-500 outline-none" value={edu.graduationDate} onChange={e => {
                            const newEdu = [...localProfile.education];
                            newEdu[idx] = { ...newEdu[idx], graduationDate: e.target.value };
                            saveAndSync({ ...localProfile, education: newEdu });
                          }} />
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {editSection === 'projects' && (
                  <div className="space-y-6">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">Portfolio Projects</h3>
                      <button 
                        onClick={() => {
                          // Fix: provide all required properties for Project
                          const newProj: Project = { name: 'New Project', technologies: '', link: '', description: '' };
                          saveAndSync({ ...localProfile, projects: [newProj, ...localProfile.projects] });
                        }}
                        className="px-4 py-2 bg-blue-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-blue-100"
                      >
                        + Add Project
                      </button>
                    </div>
                    {localProfile.projects.map((proj, idx) => (
                      <div key={idx} className="p-6 bg-slate-50 rounded-3xl border border-slate-100 space-y-4 relative group">
                        <button 
                          onClick={() => saveAndSync({ ...localProfile, projects: localProfile.projects.filter((_, i) => i !== idx) })}
                          className="absolute top-4 right-4 text-slate-300 hover:text-red-500 p-1"
                        >
                          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                        </button>
                        <input placeholder="Project Name" className="w-full p-3 bg-white rounded-xl text-sm font-bold border border-transparent focus:border-blue-500 outline-none" value={proj.name} onChange={e => {
                          const newProjs = [...localProfile.projects];
                          newProjs[idx] = { ...newProjs[idx], name: e.target.value };
                          saveAndSync({ ...localProfile, projects: newProjs });
                        }} />
                        <textarea 
                          placeholder="Project details..." 
                          className="w-full p-4 bg-white rounded-xl text-xs border border-transparent focus:border-blue-500 outline-none h-24 resize-none"
                          value={proj.description}
                          onChange={e => {
                            const newProjs = [...localProfile.projects];
                            newProjs[idx] = { ...newProjs[idx], description: e.target.value };
                            saveAndSync({ ...localProfile, projects: newProjs });
                          }}
                        />
                      </div>
                    ))}
                  </div>
                )}

                {editSection === 'skills' && (
                   <div className="space-y-6">
                    <div className="p-8 bg-slate-50 rounded-[2.5rem] border-2 border-slate-100 space-y-6">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Skill Taxonomy</p>
                      <input 
                        placeholder="Type skill & enter" 
                        className="w-full p-4 rounded-xl shadow-inner border-2 border-transparent focus:border-blue-500 outline-none text-center font-bold"
                        onKeyDown={e => {
                          if (e.key === 'Enter') {
                            const val = (e.target as HTMLInputElement).value;
                            const newSkills = val.split(',').map(s => s.trim()).filter(s => s && !localProfile.skills.includes(s));
                            saveAndSync({ ...localProfile, skills: [...localProfile.skills, ...newSkills] });
                            (e.target as HTMLInputElement).value = '';
                          }
                        }}
                      />
                      <div className="flex flex-wrap gap-2 justify-center">
                        {localProfile.skills.map(s => (
                          <span key={s} className="px-4 py-2 bg-white text-blue-600 rounded-xl text-xs font-black border border-blue-100 flex items-center gap-2 shadow-sm">
                            {s}
                            <button onClick={() => saveAndSync({ ...localProfile, skills: localProfile.skills.filter(sk => sk !== s) })} className="text-slate-300 hover:text-red-500">×</button>
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {editSection === 'certifications' && (
                  <div className="space-y-6">
                    <div className="p-8 bg-slate-50 rounded-[2.5rem] border-2 border-slate-100 space-y-6">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Professional Credentials</p>
                      <input 
                        placeholder="Type certification (e.g. PMP, AWS Architect)" 
                        className="w-full p-4 rounded-xl shadow-inner border-2 border-transparent focus:border-emerald-500 outline-none text-center font-bold"
                        onKeyDown={e => {
                          if (e.key === 'Enter') {
                            const val = (e.target as HTMLInputElement).value;
                            const currentNames = localProfile.certifications.map(c => c.name);
                            const newCerts: Certification[] = val.split(',')
                              .map(s => s.trim())
                              .filter(s => s && !currentNames.includes(s))
                              .map(name => ({ name, link: '', issuedBy: '' }));
                            saveAndSync({ ...localProfile, certifications: [...localProfile.certifications, ...newCerts] });
                            (e.target as HTMLInputElement).value = '';
                          }
                        }}
                      />
                      <div className="flex flex-wrap gap-2 justify-center">
                        {localProfile.certifications.map((cert, idx) => (
                          <span key={idx} className="px-4 py-2 bg-white text-emerald-600 rounded-xl text-xs font-black border border-emerald-100 flex items-center gap-2 shadow-sm">
                            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 12l2 2 4-4" /></svg>
                            {cert.name}
                            <button onClick={() => saveAndSync({ ...localProfile, certifications: localProfile.certifications.filter((_, i) => i !== idx) })} className="text-slate-300 hover:text-red-500">×</button>
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'vault' && (
            <div className="flex-1 overflow-y-auto p-8 space-y-6 bg-slate-50 custom-scrollbar animate-in fade-in">
              <div className="flex justify-between items-end mb-4">
                <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">Saved Snapshots</h3>
                <span className="text-[10px] font-bold text-slate-400">{bookmarks.length} Archival Items</span>
              </div>
              
              {bookmarks.length === 0 ? (
                <div className="py-20 text-center space-y-4 opacity-50">
                  <div className="w-16 h-16 bg-slate-200 rounded-full mx-auto flex items-center justify-center">
                     <svg className="w-8 h-8 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" /></svg>
                  </div>
                  <p className="text-xs font-bold uppercase tracking-widest">Vault is empty</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-4">
                  {bookmarks.map((b) => (
                    <div key={b.id} className="group bg-white p-6 rounded-[2rem] border-2 border-transparent hover:border-blue-500 shadow-sm transition-all flex justify-between items-center">
                      <div className="space-y-1">
                        <p className="font-black text-slate-900 leading-none">{b.name}</p>
                        <div className="flex items-center gap-2">
                           <span className="text-[9px] font-black px-1.5 py-0.5 bg-slate-100 text-slate-500 rounded uppercase">{b.theme}</span>
                           <span className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">{new Date(b.timestamp).toLocaleDateString()}</span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                         <button onClick={() => onRestoreBookmark(b)} className="p-3 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-600 hover:text-white transition-all shadow-sm">
                           <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                         </button>
                         <button onClick={() => onDeleteBookmark(b.id)} className="p-3 bg-red-50 text-red-400 rounded-xl hover:bg-red-500 hover:text-white transition-all shadow-sm">
                           <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                         </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'tuning' && (
            <div className="flex-1 overflow-y-auto p-8 space-y-10 bg-slate-50 animate-in fade-in custom-scrollbar">
              <section className="space-y-6">
                <div>
                  <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-4">Core AI Engine</h3>
                  <ModelList />
                </div>

                <div>
                  <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-4">Neural Instruction Override</h3>
                  <PromptInput />
                </div>
              </section>

              <div className="pt-10 border-t border-slate-200 text-center">
                 <button 
                  onClick={() => { if(confirm("Wipe all locally stored data? This will reset your profile.")) { localStorage.clear(); window.location.reload(); } }}
                  className="w-full py-5 rounded-3xl bg-red-50 text-red-500 font-black text-xs uppercase tracking-[0.3em] hover:bg-red-500 hover:text-white transition-all shadow-sm flex items-center justify-center gap-3"
                >
                  Clear System Memory
                </button>
                <p className="mt-6 text-[9px] text-slate-400 font-black uppercase tracking-widest">ResuMaster v3.0 • Advanced Modular Framework</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default ProfileSidebar;
