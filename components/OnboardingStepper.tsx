
import React, { useState, useRef } from 'react';
import { UserProfile } from '../types';
import { extractProfileFromFile } from '../services/resumeService';

interface OnboardingStepperProps {
  onComplete: (profile: UserProfile) => void;
}

type OnboardingMode = 'initial' | 'extracting' | 'linkedin_auth' | 'linkedin_sync';

const OnboardingStepper: React.FC<OnboardingStepperProps> = ({ onComplete }) => {
  const [mode, setMode] = useState<OnboardingMode>('initial');
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const initialProfile: UserProfile = {
    personalInfo: { firstName: '', lastName: '', address: '', links: [], fullName: '', email: '', phone: '', location: '', title: '', summary: '', linkedin: '', website: '' },
    experience: [],
    education: [],
    skillCategories: [],
    skills: [],
    projects: [],
    certifications: [],
    customSections: [],
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setMode('extracting');
    const reader = new FileReader();
    reader.onload = async () => {
      const base64 = (reader.result as string).split(',')[1];
      try {
        const extracted = await extractProfileFromFile(base64, file.type);
        onComplete({
          ...initialProfile,
          ...extracted,
          personalInfo: { ...initialProfile.personalInfo, ...extracted.personalInfo }
        });
      } catch (err) {
        alert("Extraction failed. Let's try entering your details manually in the editor.");
        onComplete(initialProfile);
      }
    };
    reader.onerror = () => {
        alert("File reading error.");
        setMode('initial');
    };
    reader.readAsDataURL(file);
  };

  const startLinkedInAuth = () => setMode('linkedin_auth');

  const handleLinkedInLogin = () => {
    setMode('linkedin_sync');
    setTimeout(() => {
      const mockLinkedInData: Partial<UserProfile> = {
        personalInfo: {
          firstName: 'Jane', lastName: 'Doe', fullName: 'Jane Doe', email: 'jane.doe@linkedin-example.com',
          phone: '+1 (555) 123-4567', location: 'San Francisco, CA', address: '', title: 'Senior Software Engineer',
          summary: 'Experienced frontend engineer with expertise in high-scale web architectures.',
          links: [], linkedin: 'linkedin.com/in/janedoe', website: 'janedoe.dev'
        },
        experience: [
          { company: 'Tech Solutions Inc.', role: 'Senior Frontend Engineer', startDate: 'Jan 2021', endDate: 'Present', current: true, description: 'Architected core UI components using React and TypeScript.' },
          { company: 'Creative Apps Lab', role: 'Junior Web Developer', startDate: 'Jun 2018', endDate: 'Dec 2020', current: false, description: 'Developed responsive web pages for diverse clients.' }
        ],
        skills: ['React', 'TypeScript', 'Node.js', 'AWS', 'GraphQL', 'System Design'],
        education: [{ institution: 'Stanford University', location: 'Stanford, CA', degreeType: 'B.S.', field: 'Computer Science', startMonthYear: 'Sept 2014', gradMonthYear: 'June 2018', scoreType: 'GPA', scoreValue: '3.9', degree: 'Bachelor of Science', graduationDate: '2018' }]
      };
      onComplete({
        ...initialProfile,
        ...mockLinkedInData,
        personalInfo: { ...initialProfile.personalInfo, ...mockLinkedInData.personalInfo }
      });
    }, 2000);
  };

  if (mode === 'initial') {
    return (
      <div className="p-12 md:p-20 animate-in fade-in duration-500">
        <div className="max-w-4xl mx-auto space-y-16">
          <div className="text-center space-y-4">
            <h2 className="text-4xl font-black text-slate-900 tracking-tight">Intelligence Gathering</h2>
            <p className="text-slate-500 text-lg font-medium max-w-lg mx-auto leading-relaxed">Select your professional data source to initialize the synthesis engine.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <button onClick={() => fileInputRef.current?.click()} className="group p-10 bg-white border-2 border-slate-50 hover:border-blue-500 rounded-[3rem] shadow-xl shadow-slate-200/50 hover:shadow-2xl hover:shadow-blue-100 transition-all hover:-translate-y-2 text-left flex flex-col active:scale-95">
              <div className="w-16 h-16 bg-blue-50 rounded-[1.5rem] flex items-center justify-center mb-8 group-hover:scale-110 transition-transform shadow-md">
                <svg className="w-8 h-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" /></svg>
              </div>
              <h3 className="text-xl font-black mb-3 text-slate-900 leading-tight">AI Resume Scan</h3>
              <p className="text-sm text-slate-500 leading-relaxed font-medium">Neural engine extraction from PDF/DOCX files with 99% accuracy.</p>
              <input type="file" ref={fileInputRef} className="hidden" accept=".pdf,.docx,image/*" onChange={handleFileUpload} />
              <div className="mt-auto pt-8 text-[10px] font-black text-blue-600 uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">Launch Scanner &rarr;</div>
            </button>

            <button onClick={startLinkedInAuth} className="group p-10 bg-white border-2 border-slate-50 hover:border-sky-500 rounded-[3rem] shadow-xl shadow-slate-200/50 hover:shadow-2xl hover:shadow-sky-100 transition-all hover:-translate-y-2 text-left flex flex-col active:scale-95">
              <div className="w-16 h-16 bg-sky-50 rounded-[1.5rem] flex items-center justify-center mb-8 group-hover:scale-110 transition-transform shadow-md">
                <svg className="w-8 h-8 text-sky-600" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
              </div>
              <h3 className="text-xl font-black mb-3 text-slate-900 leading-tight">LinkedIn Sync</h3>
              <p className="text-sm text-slate-500 leading-relaxed font-medium">Connect your professional identity for seamless experience syncing.</p>
              <div className="mt-auto pt-8 text-[10px] font-black text-sky-600 uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">Authenticate &rarr;</div>
            </button>

            <button onClick={() => onComplete(initialProfile)} className="group p-10 bg-white border-2 border-slate-50 hover:border-emerald-500 rounded-[3rem] shadow-xl shadow-slate-200/50 hover:shadow-2xl hover:shadow-emerald-100 transition-all hover:-translate-y-2 text-left flex flex-col active:scale-95">
              <div className="w-16 h-16 bg-emerald-50 rounded-[1.5rem] flex items-center justify-center mb-8 group-hover:scale-110 transition-transform shadow-md">
                <svg className="w-8 h-8 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
              </div>
              <h3 className="text-xl font-black mb-3 text-slate-900 leading-tight">Manual Entry</h3>
              <p className="text-sm text-slate-500 leading-relaxed font-medium">Precisely curate your accomplishments directly in the editor.</p>
              <div className="mt-auto pt-8 text-[10px] font-black text-emerald-600 uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">Go to Editor &rarr;</div>
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (mode === 'extracting' || mode === 'linkedin_sync') {
    return (
      <div className="p-24 flex flex-col items-center justify-center bg-white animate-in fade-in duration-500 text-center space-y-12">
        <div className="relative w-32 h-32">
          <div className="absolute inset-0 border-8 border-slate-50 rounded-full shadow-inner"></div>
          <div className={`absolute inset-0 border-8 ${mode === 'extracting' ? 'border-blue-600' : 'border-sky-600'} border-t-transparent rounded-full animate-spin`}></div>
        </div>
        <div className="space-y-4">
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">{mode === 'extracting' ? 'Neural Processing...' : 'Cloud Data Mapping...'}</h2>
          <p className="text-slate-500 font-medium text-lg leading-relaxed max-w-sm mx-auto">Initializing editor environment with your profile parameters.</p>
        </div>
      </div>
    );
  }

  if (mode === 'linkedin_auth') {
    return (
      <div className="p-20 text-center space-y-12 animate-in fade-in">
        <div className="w-24 h-24 bg-[#0077b5] rounded-[2rem] mx-auto flex items-center justify-center text-white shadow-2xl shadow-blue-100">
          <svg className="w-12 h-12 fill-current" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
        </div>
        <div className="space-y-4">
          <h4 className="text-3xl font-black text-slate-900 tracking-tight">Authorize Synchronization</h4>
          <p className="text-slate-500 font-medium text-lg leading-relaxed max-w-sm mx-auto">Connect your professional identity for immediate synthesis.</p>
        </div>
        <button onClick={handleLinkedInLogin} className="w-full max-w-sm py-5 bg-[#0077b5] text-white rounded-3xl font-black text-xs uppercase tracking-[0.2em] shadow-2xl shadow-blue-100 hover:bg-[#006399] transition-all">Confirm Authentication &rarr;</button>
      </div>
    );
  }

  return null;
};

export default OnboardingStepper;
