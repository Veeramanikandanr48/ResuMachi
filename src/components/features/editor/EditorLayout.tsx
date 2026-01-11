import React, { useState, useEffect, useCallback } from 'react';
import { UserProfile, ResumeWork } from '@/types';
import { generateResume } from '@/lib/services/geminiService';
import JSZip from 'jszip';
import { generateLatex } from '@/lib/utils/latexGenerator';
import EditorControls from './EditorControls';
import EditorHeader from './EditorHeader';
import ResumePreview from '@/components/features/resume/ResumePreview';
import ScorePanel from './ScorePanel';
import { Button } from '@/components/ui/button';

interface EditorLayoutProps {
  workId: string;
  initialWork: ResumeWork;
  initialProfile: UserProfile;
  onUpdateWork: (work: ResumeWork) => void;
  onUpdateProfile: (profile: UserProfile) => void;
  onBack: () => void;
}

const EditorLayout: React.FC<EditorLayoutProps> = ({
  workId,
  initialWork,
  initialProfile,
  onUpdateWork,
  onUpdateProfile,
  onBack
}) => {
  const [work, setWork] = useState<ResumeWork>(initialWork);
  const [profile, setProfile] = useState<UserProfile>(initialProfile);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [scale, setScale] = useState(0.65);
  const [activeTab, setActiveTab] = useState("details");

  useEffect(() => {
    setWork(initialWork);
  }, [initialWork]);

  useEffect(() => {
    setProfile(initialProfile);
  }, [initialProfile]);

  const handleGenerate = useCallback(async (section?: string) => {
    setIsGenerating(true);
    try {
      const result = await generateResume(
        profile, 
        work.jobDescription, 
        work.tone, 
        work.conciseness, 
        section
      );
      const updatedWork = { ...work, generatedResume: result, updatedAt: Date.now() };
      setWork(updatedWork);
      onUpdateWork(updatedWork);
    } catch (err) {
      console.error(err);
      alert("Failed to sync with AI. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  }, [profile, work, onUpdateWork]);

  const handleDownloadPdf = () => {
    window.print();
  };

  const handleDownloadLatex = async () => {
    const files = generateLatex(profile, work.theme);
    const fileNames = Object.keys(files);

    if (fileNames.length === 1) {
      const latex = files[fileNames[0]];
      const blob = new Blob([latex], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${work.name.replace(/\s+/g, '_')}_Resume.tex`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } else {
      const zip = new JSZip();
      fileNames.forEach(name => {
        zip.file(name, files[name]);
      });
      
      const content = await zip.generateAsync({ type: 'blob' });
      const url = URL.createObjectURL(content);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${work.name.replace(/\s+/g, '_')}_Resume_Source.zip`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  };

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-slate-50">
      <EditorHeader 
        resumeName={work.name}
        setResumeName={(n) => {
          const updated = { ...work, name: n };
          setWork(updated);
          onUpdateWork(updated);
        }}
        onDownloadPdf={handleDownloadPdf}
        onDownloadLatex={handleDownloadLatex}
        onAiReview={() => handleGenerate()}
        onChangeTemplate={() => setActiveTab('matcher')}
      />

      <div className="flex flex-1 overflow-hidden">
        <EditorControls 
          jobDescription={work.jobDescription}
          setJobDescription={(jd) => {
            const updated = { ...work, jobDescription: jd };
            setWork(updated);
            onUpdateWork(updated);
          }}
          tone={work.tone}
          setTone={(t) => {
            const updated = { ...work, tone: t };
            setWork(updated);
            onUpdateWork(updated);
          }}
          conciseness={work.conciseness}
          setConciseness={(c) => {
            const updated = { ...work, conciseness: c };
            setWork(updated);
            onUpdateWork(updated);
          }}
          theme={work.theme}
          setTheme={(t) => {
            console.log('EditorLayout setting theme:', t);
            const updated = { ...work, theme: t };
            setWork(updated);
            onUpdateWork(updated);
          }}
          onGenerate={() => handleGenerate()}
          isGenerating={isGenerating}
          profile={profile}
          onUpdateProfile={(p) => {
            setProfile(p);
            onUpdateProfile(p);
          }}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
        />

        <div className="flex-1 relative overflow-hidden flex flex-col">
          {/* Zoom Controls */}
          <div className="absolute top-6 right-8 z-40 flex gap-4">
            <div className="bg-white/80 backdrop-blur-md p-2 rounded-xl shadow-sm border border-slate-200 flex items-center gap-2">
              <Button variant="ghost" size="icon" onClick={() => setScale(s => Math.max(0.3, s - 0.1))} className="h-8 w-8 rounded-lg">-</Button>
              <span className="text-xs font-black w-12 text-center">{Math.round(scale * 100)}%</span>
              <Button variant="ghost" size="icon" onClick={() => setScale(s => Math.min(1.5, s + 0.1))} className="h-8 w-8 rounded-lg">+</Button>
            </div>
          </div>

          {/* Preview Area */}
          <div className="flex-1 overflow-auto bg-slate-100/50 flex items-start justify-center p-20 custom-scrollbar">
            <div 
              style={{ transform: `scale(${scale})`, transformOrigin: 'top center', transition: 'transform 0.2s' }}
              className="shadow-[0_50px_100px_-20px_rgba(0,0,0,0.15)]"
            >
              <ResumePreview 
                userProfile={profile} 
                generatedContent={work.generatedResume?.resume_content || null}
                theme={work.theme}
                onRegenerateSection={handleGenerate}
                isGenerating={isGenerating}
              />
            </div>
          </div>

          {work.generatedResume && (
            <ScorePanel 
              score={work.generatedResume.ats_score} 
              suggestions={work.generatedResume.optimization_suggestions}
              reasoning={work.generatedResume.selected_template.reason}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default EditorLayout;
