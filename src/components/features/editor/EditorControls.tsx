import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ResumeTheme, Tone, UserProfile } from '@/types';
import ProfileForm from '@/components/features/profile/ProfileForm';
import { FileText, Palette, Wand2 } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';

interface EditorControlsProps {
  jobDescription: string;
  setJobDescription: (jd: string) => void;
  tone: Tone;
  setTone: (t: Tone) => void;
  conciseness: number;
  setConciseness: (c: number) => void;
  theme: ResumeTheme;
  setTheme: (t: ResumeTheme) => void;
  onGenerate: () => void;
  isGenerating: boolean;
  profile: UserProfile;
  onUpdateProfile: (profile: UserProfile) => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const EditorControls: React.FC<EditorControlsProps> = ({
  jobDescription,
  setJobDescription,
  tone,
  setTone,
  conciseness,
  setConciseness,
  theme,
  setTheme,
  onGenerate,
  isGenerating,
  profile,
  onUpdateProfile,
  activeTab,
  setActiveTab
}) => {
  return (
    <div className="w-[400px] bg-white border-r border-border flex flex-col h-full shrink-0 z-20 shadow-xl">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col overflow-hidden">
        <div className="px-6 pt-6 pb-2">
          <TabsList className="w-full grid grid-cols-2 h-12 p-1 bg-slate-100 rounded-xl">
            <TabsTrigger 
              value="details" 
              className="rounded-lg text-xs font-bold uppercase tracking-wider data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-sm transition-all"
            >
              Resume Details
            </TabsTrigger>
            <TabsTrigger 
              value="matcher" 
              className="rounded-lg text-xs font-bold uppercase tracking-wider data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-sm transition-all"
            >
              Resume Matcher
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="details" className="flex-1 overflow-hidden mt-0 bg-white">
          <ProfileForm profile={profile} onUpdate={onUpdateProfile} />
        </TabsContent>

        <TabsContent value="matcher" className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-8 mt-0 bg-white">
          {/* Job Description */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-blue-500" />
              <Label className="text-xs font-black uppercase tracking-widest text-muted-foreground">Target Role Context</Label>
            </div>
            <Textarea 
              placeholder="Paste Job Description here..." 
              className="min-h-[150px] resize-none bg-slate-50 border-slate-200 focus:border-primary text-xs leading-relaxed"
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
            />
          </div>

          {/* AI Controls */}
          <div className="space-y-6">
            <div className="flex items-center gap-2">
              <Wand2 className="w-4 h-4 text-purple-500" />
              <Label className="text-xs font-black uppercase tracking-widest text-muted-foreground">Neural Parameters</Label>
            </div>
            
            <div className="space-y-4 pl-6 border-l-2 border-slate-100">
              <div className="space-y-3">
                <Label className="text-[10px] font-bold uppercase text-muted-foreground">Tone Calibration</Label>
                <div className="grid grid-cols-3 gap-2">
                  {(['Professional', 'Impactful', 'Startup-friendly'] as Tone[]).map(t => (
                    <button
                      key={t}
                      onClick={() => setTone(t)}
                      className={`px-2 py-2 rounded-lg text-[9px] font-black uppercase tracking-tight border transition-all ${tone === t ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-slate-500 border-slate-200 hover:border-slate-400'}`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between">
                  <Label className="text-[10px] font-bold uppercase text-muted-foreground">Conciseness Threshold</Label>
                  <span className="text-[10px] font-black text-primary">{conciseness}%</span>
                </div>
                <input 
                  type="range" 
                  min="0" 
                  max="100" 
                  value={conciseness} 
                  onChange={(e) => setConciseness(parseInt(e.target.value))}
                  className="w-full h-1 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-primary"
                />
              </div>
            </div>
          </div>

          {/* Theme */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Palette className="w-4 h-4 text-emerald-500" />
              <Label className="text-xs font-black uppercase tracking-widest text-muted-foreground">Visual Protocol</Label>
            </div>
            <div className="grid grid-cols-2 gap-3 pl-6 border-l-2 border-slate-100">
              {(['Standard', 'LaTeX Modern', 'Modern Serif', 'AltaCV'] as ResumeTheme[]).map(t => (
                <button
                  key={t}
                  type="button"
                  onClick={() => {
                    console.log('Theme selected:', t);
                    setTheme(t);
                  }}
                  className={`p-3 rounded-xl text-left border-2 transition-all ${theme === t ? 'border-blue-500 bg-blue-50/50' : 'border-slate-100 bg-white hover:border-slate-300'}`}
                >
                  <div className={`w-full h-12 rounded mb-2 ${t === 'Standard' ? 'bg-slate-200' : 'bg-slate-900'}`} />
                  <span className="text-[10px] font-black uppercase tracking-tight block text-slate-700">{t}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="pt-6 border-t border-slate-100">
            <Button 
              onClick={onGenerate} 
              disabled={isGenerating || !jobDescription}
              className="w-full py-6 rounded-2xl font-black text-xs uppercase tracking-[0.3em] shadow-lg shadow-blue-500/20 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              {isGenerating ? (
                <span className="flex items-center gap-3">
                  <Wand2 className="w-4 h-4 animate-spin" /> Synthesizing...
                </span>
              ) : (
                <span className="flex items-center gap-3">
                  <Wand2 className="w-4 h-4" /> Generate Resume
                </span>
              )}
            </Button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EditorControls;
