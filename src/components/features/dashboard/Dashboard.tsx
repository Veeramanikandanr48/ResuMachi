import React, { useState, useEffect, useRef } from 'react';
import { ResumeWork, UserProfile } from '@/types';
import ResumePreview from '@/components/features/resume/ResumePreview';
import OnboardingStepper from '@/components/features/onboarding/OnboardingStepper';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Plus, Trash2, X } from 'lucide-react';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';

interface DashboardProps {
  userProfile: UserProfile;
  onImportComplete: (p: UserProfile) => void;
  works: ResumeWork[];
  onCreateNew: () => void;
  onDelete: (id: string) => void;
  onOpen: (id: string) => void;
}

const ScaledPreviewWrapper = ({ children }: { children: React.ReactNode }) => {
  const [scale, setScale] = useState(0.22); // Default start scale
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const updateScale = () => {
      if (containerRef.current) {
        const containerWidth = containerRef.current.offsetWidth;
        // 210mm is approx 794px at 96dpi
        const targetWidth = 794; 
        setScale(containerWidth / targetWidth);
      }
    };

    // Initial calculation
    updateScale();

    const observer = new ResizeObserver(updateScale);
    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div ref={containerRef} className="w-full h-full relative overflow-hidden pointer-events-none">
      <div 
        style={{ 
          transform: `scale(${scale})`, 
          transformOrigin: 'top left',
          width: '210mm',
          height: '297mm'
        }}
      >
        {children}
      </div>
    </div>
  );
};

const Dashboard: React.FC<DashboardProps> = ({ userProfile, onImportComplete, works, onCreateNew, onDelete, onOpen }) => {
  const [showImportWizard, setShowImportWizard] = useState(false);

  const handleWizardComplete = (profile: UserProfile) => {
    onImportComplete(profile);
    setShowImportWizard(false);
  };

  return (
    <div className="flex-1 overflow-y-auto custom-scrollbar bg-background relative h-full">
      <header className="px-12 py-6 border-b border-border flex items-center justify-between sticky top-0 bg-background z-50">
        <h1 className="text-2xl font-medium text-muted-foreground">
          Welcome <span className="text-foreground font-bold">{userProfile.personalInfo.fullName}!</span>
        </h1>
        <div className="flex items-center gap-4">
          <Button 
            variant="outline"
            onClick={() => setShowImportWizard(true)}
          >
            Import Resume
          </Button>
          <Button 
            onClick={onCreateNew}
            className="bg-[#10894a] hover:bg-[#0d6e3c] text-white"
          >
            Create New
          </Button>
        </div>
      </header>

      <div className="p-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-10">
          {works.map((work, index) => (
            <div key={work.id} className="group flex flex-col gap-6">
              <div className="flex justify-between items-end px-2">
                <h3 className="text-foreground font-medium text-lg leading-tight truncate pr-4">{work.name}</h3>
                <span className="text-muted font-bold text-4xl italic select-none">{index + 1}</span>
              </div>
              
              <div 
                onClick={() => onOpen(work.id)}
                className="relative aspect-[1/1.4] bg-card rounded-md shadow-sm group-hover:shadow-xl transition-all cursor-pointer border border-border overflow-hidden"
              >
                <div className="absolute inset-0 opacity-90 group-hover:opacity-100 transition-opacity">
                  <ScaledPreviewWrapper>
                    <ResumePreview 
                      generatedContent={work.generatedResume?.resume_content || null} 
                      userProfile={userProfile} 
                      theme={work.theme} 
                    />
                  </ScaledPreviewWrapper>
                </div>
                <div className="absolute inset-0 bg-transparent group-hover:bg-slate-900/5 transition-colors pointer-events-none" />
                <Button
                  size="icon"
                  variant="destructive"
                  onClick={(e) => { e.stopPropagation(); onDelete(work.id); }}
                  className="absolute bottom-4 right-4 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-all hover:scale-110 active:scale-95 z-20"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}

          <div className="flex flex-col gap-6">
            <div className="h-[28px]" />
            <div 
              onClick={onCreateNew}
              className="aspect-[1/1.4] bg-card rounded-md border-2 border-dashed border-muted-foreground/30 flex flex-col items-center justify-center gap-6 cursor-pointer hover:bg-accent/50 transition-all group"
            >
              <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center group-hover:scale-110 transition-transform">
                <Plus className="w-8 h-8 text-muted-foreground" />
              </div>
              <Button variant="secondary">Create New</Button>
            </div>
          </div>
        </div>
      </div>

      {showImportWizard && (
        <div 
          className="fixed inset-0 z-[100] bg-background/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-300"
          onClick={() => setShowImportWizard(false)}
        >
          <div 
            className="w-full max-w-5xl bg-card rounded-[3rem] shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-300 relative border border-border"
            onClick={e => e.stopPropagation()}
          >
            <Button
              size="icon"
              variant="ghost" 
              onClick={() => setShowImportWizard(false)}
              className="absolute top-8 right-8 rounded-full bg-muted text-muted-foreground hover:bg-accent hover:text-accent-foreground z-[110]"
            >
              <X className="w-5 h-5" />
            </Button>
            <div className="flex-1 bg-card">
              <OnboardingStepper onComplete={handleWizardComplete} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
