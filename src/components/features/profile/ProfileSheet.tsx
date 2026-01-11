import React, { useState, useEffect } from 'react';
import { UserProfile, BookmarkedResume } from '@/types';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { X, User, Briefcase, GraduationCap, Folder, Wrench, Award, Trash2, RotateCcw } from 'lucide-react';
import ProfileForm from './ProfileForm';

interface ProfileSheetProps {
  isOpen: boolean;
  onClose: () => void;
  profile: UserProfile;
  onUpdate: (profile: UserProfile) => void;
  bookmarks: BookmarkedResume[];
  onRestoreBookmark: (b: BookmarkedResume) => void;
  onDeleteBookmark: (id: string) => void;
}

const ProfileSheet: React.FC<ProfileSheetProps> = ({ 
  isOpen, 
  onClose, 
  profile, 
  onUpdate, 
  bookmarks,
  onRestoreBookmark,
  onDeleteBookmark
}) => {
  const [activeTab, setActiveTab] = useState<'edit' | 'vault' | 'tuning'>('edit');

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <SheetContent side="right" className="w-full sm:max-w-[650px] p-0 flex flex-col bg-background border-l border-border">
        <div className="p-8 border-b border-border flex justify-between items-center bg-muted/30">
          <div>
            <h2 className="text-2xl font-black text-foreground tracking-tight">System Core</h2>
            <p className="text-xs text-muted-foreground font-bold uppercase tracking-widest mt-1">Professional Intelligence Command</p>
          </div>
          {/* Close button is handled by Sheet primitive, but we can add a custom one if needed or rely on the default X */}
        </div>

        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)} className="flex-1 flex flex-col overflow-hidden">
          <div className="px-8 border-b border-border bg-background">
            <TabsList className="w-full justify-start h-auto p-0 bg-transparent gap-8">
              {(['edit', 'vault', 'tuning'] as const).map(tab => (
                <TabsTrigger 
                  key={tab}
                  value={tab}
                  className="rounded-none border-b-4 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent py-4 text-[10px] font-black tracking-[0.2em] uppercase transition-all text-muted-foreground data-[state=active]:text-primary"
                >
                  {tab === 'edit' ? 'Knowledge' : tab === 'vault' ? 'Vault' : 'Advanced'}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>

          <div className="flex-1 overflow-hidden">
            <TabsContent value="edit" className="h-full m-0 data-[state=active]:flex">
              <ProfileForm profile={profile} onUpdate={onUpdate} />
            </TabsContent>

            <TabsContent value="vault" className="h-full m-0">
              <ScrollArea className="h-full p-8">
                <div className="flex justify-between items-end mb-4">
                  <h3 className="text-sm font-black text-foreground uppercase tracking-widest">Saved Snapshots</h3>
                  <span className="text-[10px] font-bold text-muted-foreground">{bookmarks.length} Archival Items</span>
                </div>
                
                {bookmarks.length === 0 ? (
                  <div className="py-20 text-center space-y-4 opacity-50">
                    <div className="w-16 h-16 bg-muted rounded-full mx-auto flex items-center justify-center">
                       <Folder className="w-8 h-8 text-muted-foreground" />
                    </div>
                    <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Vault is empty</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-4">
                    {bookmarks.map((b) => (
                      <div key={b.id} className="group bg-card p-6 rounded-[2rem] border border-border hover:border-primary shadow-sm transition-all flex justify-between items-center">
                        <div className="space-y-1">
                          <p className="font-black text-foreground leading-none">{b.name}</p>
                          <div className="flex items-center gap-2">
                             <span className="text-[9px] font-black px-1.5 py-0.5 bg-muted text-muted-foreground rounded uppercase">{b.theme}</span>
                             <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-tighter">{new Date(b.timestamp).toLocaleDateString()}</span>
                          </div>
                        </div>
                        <div className="flex gap-2">
                           <Button size="icon" variant="ghost" onClick={() => onRestoreBookmark(b)} className="bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white rounded-xl">
                             <RotateCcw className="w-5 h-5" />
                           </Button>
                           <Button size="icon" variant="ghost" onClick={() => onDeleteBookmark(b.id)} className="bg-red-50 text-red-400 hover:bg-red-500 hover:text-white rounded-xl">
                             <Trash2 className="w-5 h-5" />
                           </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </ScrollArea>
            </TabsContent>

            <TabsContent value="tuning" className="h-full m-0">
              <ScrollArea className="h-full p-8">
                <div className="space-y-10">
                  <section className="space-y-6">
                    <div>
                      <h3 className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.3em] mb-4">Core AI Engine</h3>
                      <div className="p-4 bg-muted/50 rounded-xl border border-border text-sm text-muted-foreground">
                        Model selection coming soon.
                      </div>
                    </div>

                    <div>
                      <h3 className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.3em] mb-4">Neural Instruction Override</h3>
                      <div className="p-4 bg-muted/50 rounded-xl border border-border text-sm text-muted-foreground">
                         Prompt builder coming soon.
                      </div>
                    </div>
                  </section>

                  <div className="pt-10 border-t border-border text-center">
                     <Button 
                      variant="destructive"
                      onClick={() => { if(confirm("Wipe all locally stored data? This will reset your profile.")) { localStorage.clear(); window.location.reload(); } }}
                      className="w-full py-6 rounded-3xl font-black text-xs uppercase tracking-[0.3em] shadow-sm flex items-center justify-center gap-3"
                    >
                      Clear System Memory
                    </Button>
                    <p className="mt-6 text-[9px] text-muted-foreground font-black uppercase tracking-widest">ResuMaster v3.0 • Advanced Modular Framework</p>
                  </div>
                </div>
              </ScrollArea>
            </TabsContent>
          </div>
        </Tabs>
      </SheetContent>
    </Sheet>
  );
};

export default ProfileSheet;
