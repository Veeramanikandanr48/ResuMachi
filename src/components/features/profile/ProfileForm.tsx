import React from 'react';
import { UserProfile, Experience, Education, Project, Certification } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Accordion, 
  AccordionContent, 
  AccordionItem, 
  AccordionTrigger 
} from '@/components/ui/accordion';
import { 
  User, 
  Briefcase, 
  GraduationCap, 
  Folder, 
  Wrench, 
  Award, 
  X, 
  Plus,
  MoreHorizontal,
  Trash2
} from 'lucide-react';

interface ProfileFormProps {
  profile: UserProfile;
  onUpdate: (profile: UserProfile) => void;
}

const ProfileForm: React.FC<ProfileFormProps> = ({ profile, onUpdate }) => {
  const saveAndSync = (updated: UserProfile) => {
    onUpdate(updated);
  };

  const handlePersonalInfoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    let updatedPersonalInfo = { ...profile.personalInfo, [name]: value };

    if (name === 'firstName' || name === 'lastName') {
      updatedPersonalInfo.fullName = `${updatedPersonalInfo.firstName || ''} ${updatedPersonalInfo.lastName || ''}`.trim();
    }

    const updated = {
      ...profile,
      personalInfo: updatedPersonalInfo
    };
    saveAndSync(updated);
  };

  return (
    <ScrollArea className="h-full">
      <div className="p-6">
        <Accordion type="single" collapsible className="w-full space-y-4" defaultValue="personal">
          
          {/* Personal Info */}
          <AccordionItem value="personal" className="border rounded-xl px-4 bg-white shadow-sm">
            <AccordionTrigger className="hover:no-underline py-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">
                  <User className="w-4 h-4" />
                </div>
                <span className="font-bold text-sm text-slate-700">Personal Info</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="pt-2 pb-6">
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">First Name</Label>
                    <Input 
                      name="firstName" 
                      value={profile.personalInfo.firstName} 
                      onChange={handlePersonalInfoChange} 
                      className="font-bold" 
                      placeholder="e.g. John"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Last Name</Label>
                    <Input 
                      name="lastName" 
                      value={profile.personalInfo.lastName} 
                      onChange={handlePersonalInfoChange} 
                      className="font-bold" 
                      placeholder="e.g. Doe"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Email</Label>
                    <Input 
                      name="email" 
                      value={profile.personalInfo.email} 
                      onChange={handlePersonalInfoChange} 
                      placeholder="john@example.com"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Phone</Label>
                    <Input 
                      name="phone" 
                      value={profile.personalInfo.phone} 
                      onChange={handlePersonalInfoChange} 
                      placeholder="+1 234 567 890"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Address</Label>
                    <Input 
                      name="address" 
                      value={profile.personalInfo.address || ''} 
                      onChange={handlePersonalInfoChange} 
                      placeholder="City, Country"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Job Title</Label>
                    <Input 
                      name="title" 
                      value={profile.personalInfo.title} 
                      onChange={handlePersonalInfoChange} 
                      placeholder="Software Engineer"
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <Label className="text-xs font-bold text-slate-700">Links ({profile.personalInfo.links?.length || 0} / 5)</Label>
                  </div>
                  <div className="space-y-3">
                    {(profile.personalInfo.links || []).map((link, idx) => (
                      <div key={idx} className="flex gap-2 items-start">
                        <div className="flex-1 grid grid-cols-3 gap-2">
                          <Input 
                            value={link.url}
                            onChange={(e) => {
                              const newLinks = [...(profile.personalInfo.links || [])];
                              newLinks[idx] = { ...newLinks[idx], url: e.target.value };
                              saveAndSync({
                                ...profile,
                                personalInfo: { ...profile.personalInfo, links: newLinks }
                              });
                            }}
                            placeholder="https://..."
                            className="col-span-2 text-xs"
                          />
                          <select
                            value={link.type}
                            onChange={(e) => {
                              const newLinks = [...(profile.personalInfo.links || [])];
                              newLinks[idx] = { ...newLinks[idx], type: e.target.value as any };
                              saveAndSync({
                                ...profile,
                                personalInfo: { ...profile.personalInfo, links: newLinks }
                              });
                            }}
                            className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-xs ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            <option value="GitHub">GitHub</option>
                            <option value="LinkedIn">LinkedIn</option>
                            <option value="HackerRank">HackerRank</option>
                            <option value="Portfolio">Portfolio</option>
                            <option value="Other">Other</option>
                          </select>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            const newLinks = [...(profile.personalInfo.links || [])];
                            newLinks.splice(idx, 1);
                            saveAndSync({
                              ...profile,
                              personalInfo: { ...profile.personalInfo, links: newLinks }
                            });
                          }}
                          className="h-10 w-10 text-muted-foreground hover:text-destructive"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                    {(profile.personalInfo.links?.length || 0) < 5 && (
                      <Button
                        variant="outline"
                        className="w-full border-dashed"
                        onClick={() => {
                          const newLinks = [...(profile.personalInfo.links || []), { type: 'GitHub', url: '' }];
                          saveAndSync({
                            ...profile,
                            personalInfo: { ...profile.personalInfo, links: newLinks as any[] }
                          });
                        }}
                      >
                        <Plus className="w-4 h-4 mr-2" /> Add Link
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Education */}
          <AccordionItem value="education" className="border rounded-xl px-4 bg-white shadow-sm">
            <AccordionTrigger className="hover:no-underline py-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-purple-50 flex items-center justify-center text-purple-600">
                  <GraduationCap className="w-4 h-4" />
                </div>
                <span className="font-bold text-sm text-slate-700">Education</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="pt-2 pb-6 space-y-6">
              <div className="p-3 bg-blue-50 text-blue-700 text-xs rounded-lg font-medium">
                Max limit reached. Consider removing high school grades, perhaps?
              </div>
              
              {profile.education.map((edu, idx) => (
                <div key={idx} className="p-4 bg-white rounded-xl border border-slate-200 relative group space-y-4">
                  <div className="flex justify-between items-center">
                    <h4 className="font-bold text-sm text-slate-700">{edu.institution || 'New Education'}</h4>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => saveAndSync({ ...profile, education: profile.education.filter((_, i) => i !== idx) })}
                        className="h-8 w-8 text-muted-foreground hover:text-destructive"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                      <Accordion type="single" collapsible>
                        <AccordionItem value="item-1" className="border-none">
                          <AccordionTrigger className="py-0 hover:no-underline"></AccordionTrigger>
                        </AccordionItem>
                      </Accordion>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Institution</Label>
                      <Input 
                        value={edu.institution} 
                        onChange={e => {
                          const newEdu = [...profile.education];
                          newEdu[idx] = { ...newEdu[idx], institution: e.target.value };
                          saveAndSync({ ...profile, education: newEdu });
                        }}
                        className="font-bold"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Location</Label>
                      <Input 
                        value={edu.location} 
                        onChange={e => {
                          const newEdu = [...profile.education];
                          newEdu[idx] = { ...newEdu[idx], location: e.target.value };
                          saveAndSync({ ...profile, education: newEdu });
                        }}
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Degree Type</Label>
                      <Input 
                        value={edu.degreeType} 
                        onChange={e => {
                          const newEdu = [...profile.education];
                          newEdu[idx] = { ...newEdu[idx], degreeType: e.target.value };
                          saveAndSync({ ...profile, education: newEdu });
                        }}
                        placeholder="Bachelors/Masters/Doctorate"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Field of Study</Label>
                      <Input 
                        value={edu.field} 
                        onChange={e => {
                          const newEdu = [...profile.education];
                          newEdu[idx] = { ...newEdu[idx], field: e.target.value };
                          saveAndSync({ ...profile, education: newEdu });
                        }}
                        className="font-bold"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Start Month / Year</Label>
                      <Input 
                        value={edu.startMonthYear} 
                        onChange={e => {
                          const newEdu = [...profile.education];
                          newEdu[idx] = { ...newEdu[idx], startMonthYear: e.target.value };
                          saveAndSync({ ...profile, education: newEdu });
                        }}
                        placeholder="2022"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Grad Month / Year</Label>
                      <Input 
                        value={edu.gradMonthYear} 
                        onChange={e => {
                          const newEdu = [...profile.education];
                          newEdu[idx] = { ...newEdu[idx], gradMonthYear: e.target.value };
                          saveAndSync({ ...profile, education: newEdu });
                        }}
                        placeholder="July 2023"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Scores</Label>
                      <div className="flex gap-2">
                        <select
                          value={edu.scoreType}
                          onChange={e => {
                            const newEdu = [...profile.education];
                            newEdu[idx] = { ...newEdu[idx], scoreType: e.target.value as any };
                            saveAndSync({ ...profile, education: newEdu });
                          }}
                          className="flex h-10 w-[140px] items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-xs ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          <option value="PERCENTAGE">PERCENTAGE</option>
                          <option value="GPA">GPA</option>
                        </select>
                        <Input 
                          value={edu.scoreValue} 
                          onChange={e => {
                            const newEdu = [...profile.education];
                            newEdu[idx] = { ...newEdu[idx], scoreValue: e.target.value };
                            saveAndSync({ ...profile, education: newEdu });
                          }}
                          className="flex-1"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              <Button 
                variant="outline" 
                className="w-full border-dashed border-2 py-6 text-muted-foreground hover:text-primary hover:border-primary/50"
                onClick={() => {
                  const newEdu: Education = { 
                    institution: 'New University', 
                    location: '', 
                    degreeType: '', 
                    field: 'Major', 
                    startMonthYear: '', 
                    gradMonthYear: '', 
                    scoreType: 'GPA', 
                    scoreValue: '', 
                    degree: '', 
                    graduationDate: '' 
                  };
                  saveAndSync({ ...profile, education: [newEdu, ...profile.education] });
                }}
              >
                <Plus className="w-4 h-4 mr-2" /> Add Education
              </Button>
            </AccordionContent>
          </AccordionItem>

          {/* Experience */}
          <AccordionItem value="experience" className="border rounded-xl px-4 bg-white shadow-sm">
            <AccordionTrigger className="hover:no-underline py-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600">
                  <Briefcase className="w-4 h-4" />
                </div>
                <span className="font-bold text-sm text-slate-700">Experience</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="pt-2 pb-6 space-y-6">
              {profile.experience.map((exp, idx) => (
                <div key={idx} className="p-4 bg-white rounded-xl border border-slate-200 relative group space-y-4">
                  <div className="flex justify-between items-center">
                    <h4 className="font-bold text-sm text-slate-700">{exp.company || 'New Experience'}</h4>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => saveAndSync({ ...profile, experience: profile.experience.filter((_, i) => i !== idx) })}
                      className="h-8 w-8 text-muted-foreground hover:text-destructive"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Employer</Label>
                      <Input 
                        value={exp.company} 
                        onChange={e => {
                          const newExps = [...profile.experience];
                          newExps[idx] = { ...newExps[idx], company: e.target.value };
                          saveAndSync({ ...profile, experience: newExps });
                        }}
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Job Title</Label>
                      <Input 
                        value={exp.role} 
                        onChange={e => {
                          const newExps = [...profile.experience];
                          newExps[idx] = { ...newExps[idx], role: e.target.value };
                          saveAndSync({ ...profile, experience: newExps });
                        }}
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Start Month / Year</Label>
                      <Input 
                        value={exp.startDate} 
                        onChange={e => {
                          const newExps = [...profile.experience];
                          newExps[idx] = { ...newExps[idx], startDate: e.target.value };
                          saveAndSync({ ...profile, experience: newExps });
                        }}
                        placeholder="Mar 2024"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">End Month / Year</Label>
                      <Input 
                        value={exp.endDate} 
                        onChange={e => {
                          const newExps = [...profile.experience];
                          newExps[idx] = { ...newExps[idx], endDate: e.target.value };
                          saveAndSync({ ...profile, experience: newExps });
                        }}
                        placeholder="Present"
                      />
                    </div>
                    <div className="col-span-2 space-y-1.5">
                      <Label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Location</Label>
                      <Input 
                        placeholder="Remote"
                        value={exp.location || ''}
                        onChange={e => {
                          const newExps = [...profile.experience];
                          newExps[idx] = { ...newExps[idx], location: e.target.value };
                          saveAndSync({ ...profile, experience: newExps });
                        }}
                      /> 
                    </div>
                    <div className="col-span-2 space-y-1.5">
                      <Label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Description</Label>
                      <Textarea 
                        placeholder="Key achievements..." 
                        className="min-h-[100px] resize-none bg-white text-xs leading-relaxed"
                        value={exp.description}
                        onChange={e => {
                          const newExps = [...profile.experience];
                          newExps[idx] = { ...newExps[idx], description: e.target.value };
                          saveAndSync({ ...profile, experience: newExps });
                        }}
                      />
                      <p className="text-[10px] text-muted-foreground text-right">Markdown is supported (Cheat codes)</p>
                    </div>
                  </div>
                </div>
              ))}
              <Button 
                variant="outline" 
                className="w-full border-dashed border-2 py-6 text-muted-foreground hover:text-primary hover:border-primary/50"
                onClick={() => {
                  const newExp: Experience = { company: 'New Company', role: 'Role', startDate: '2023', endDate: 'Present', current: true, description: '' };
                  saveAndSync({ ...profile, experience: [newExp, ...profile.experience] });
                }}
              >
                <Plus className="w-4 h-4 mr-2" /> Add Experience
              </Button>
            </AccordionContent>
          </AccordionItem>

          {/* Skillsets */}
          <AccordionItem value="skills" className="border rounded-xl px-4 bg-white shadow-sm">
            <AccordionTrigger className="hover:no-underline py-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-orange-50 flex items-center justify-center text-orange-600">
                  <Wrench className="w-4 h-4" />
                </div>
                <span className="font-bold text-sm text-slate-700">Skillsets</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="pt-2 pb-6 space-y-6">
              {[
                { label: 'Add languages', category: 'Languages', placeholder: 'C++, Java, Python' },
                { label: 'Add libraries / frameworks', category: 'Libraries / Frameworks', placeholder: 'React, Node.js' },
                { label: 'Add tools / platforms', category: 'Tools / Platforms', placeholder: 'Git, VS Code' },
                { label: 'Add databases', category: 'Databases', placeholder: 'SQL, MongoDB' }
              ].map((section) => {
                const categoryItems = profile.skillCategories.find(c => c.category === section.category)?.items || [];
                
                return (
                  <div key={section.category} className="space-y-3">
                    <Label className="text-xs text-slate-600">{section.label}</Label>
                    <Input 
                      placeholder={section.placeholder}
                      className="bg-white"
                      onKeyDown={e => {
                        if (e.key === 'Enter') {
                          const val = (e.target as HTMLInputElement).value;
                          if (!val.trim()) return;
                          
                          const newItems = val.split(',').map(s => s.trim()).filter(s => s && !categoryItems.includes(s));
                          
                          // Update or create category
                          const newCategories = [...profile.skillCategories];
                          const catIndex = newCategories.findIndex(c => c.category === section.category);
                          
                          if (catIndex >= 0) {
                            newCategories[catIndex] = { 
                              ...newCategories[catIndex], 
                              items: [...newCategories[catIndex].items, ...newItems] 
                            };
                          } else {
                            newCategories.push({ category: section.category, items: newItems });
                          }
                          
                          saveAndSync({ ...profile, skillCategories: newCategories });
                          (e.target as HTMLInputElement).value = '';
                        }
                      }}
                    />
                    <div className="flex flex-wrap gap-2">
                      {categoryItems.map(item => (
                        <span key={item} className="px-3 py-1.5 bg-slate-100 text-slate-700 rounded-lg text-xs font-medium border border-slate-200 flex items-center gap-2">
                          {item}
                          <button 
                            onClick={() => {
                              const newCategories = [...profile.skillCategories];
                              const catIndex = newCategories.findIndex(c => c.category === section.category);
                              if (catIndex >= 0) {
                                newCategories[catIndex] = {
                                  ...newCategories[catIndex],
                                  items: newCategories[catIndex].items.filter(i => i !== item)
                                };
                                saveAndSync({ ...profile, skillCategories: newCategories });
                              }
                            }} 
                            className="text-slate-400 hover:text-destructive"
                          >
                            ×
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>
                );
              })}
            </AccordionContent>
          </AccordionItem>

          {/* Projects */}
          <AccordionItem value="projects" className="border rounded-xl px-4 bg-white shadow-sm">
            <AccordionTrigger className="hover:no-underline py-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-pink-50 flex items-center justify-center text-pink-600">
                  <Folder className="w-4 h-4" />
                </div>
                <span className="font-bold text-sm text-slate-700">Projects</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="pt-2 pb-6 space-y-6">
              <div className="font-bold text-sm text-slate-700">Open Source / Personal Projects</div>
              
              {profile.projects.map((proj, idx) => (
                <div key={idx} className="p-4 bg-white rounded-xl border border-slate-200 relative group space-y-4">
                  <div className="flex justify-between items-center">
                    <h4 className="font-bold text-sm text-slate-700">{proj.name || 'New Project'}</h4>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => saveAndSync({ ...profile, projects: profile.projects.filter((_, i) => i !== idx) })}
                      className="h-8 w-8 text-muted-foreground hover:text-destructive"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-1.5">
                      <Label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Project Name</Label>
                      <Input 
                        value={proj.name} 
                        onChange={e => {
                          const newProjs = [...profile.projects];
                          newProjs[idx] = { ...newProjs[idx], name: e.target.value };
                          saveAndSync({ ...profile, projects: newProjs });
                        }}
                        className="font-bold"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Technologies Used</Label>
                      <Input 
                        value={proj.technologies} 
                        onChange={e => {
                          const newProjs = [...profile.projects];
                          newProjs[idx] = { ...newProjs[idx], technologies: e.target.value };
                          saveAndSync({ ...profile, projects: newProjs });
                        }}
                        placeholder="React, Node.js, etc."
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Project Link / GitHub Repository</Label>
                      <Input 
                        value={proj.link} 
                        onChange={e => {
                          const newProjs = [...profile.projects];
                          newProjs[idx] = { ...newProjs[idx], link: e.target.value };
                          saveAndSync({ ...profile, projects: newProjs });
                        }}
                        placeholder="https://github.com/..."
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Description</Label>
                      <Textarea 
                        placeholder="Project description..." 
                        className="min-h-[80px] resize-none bg-white text-xs leading-relaxed"
                        value={proj.description}
                        onChange={e => {
                          const newProjs = [...profile.projects];
                          newProjs[idx] = { ...newProjs[idx], description: e.target.value };
                          saveAndSync({ ...profile, projects: newProjs });
                        }}
                      />
                      <p className="text-[10px] text-muted-foreground text-right">Markdown is supported (Cheat codes)</p>
                    </div>
                  </div>
                </div>
              ))}
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  className="flex-1 border-dashed border-2 py-6 text-muted-foreground hover:text-primary hover:border-primary/50"
                  onClick={() => {
                    const newProj: Project = { name: 'New Project', technologies: '', link: '', description: '' };
                    saveAndSync({ ...profile, projects: [newProj, ...profile.projects] });
                  }}
                >
                  <Plus className="w-4 h-4 mr-2" /> Add Contribution / Project
                </Button>
                <Button variant="outline" className="py-6 px-6 border-dashed border-2 text-muted-foreground hover:text-primary hover:border-primary/50">
                  Import
                </Button>
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Certifications */}
          <AccordionItem value="certifications" className="border rounded-xl px-4 bg-white shadow-sm">
            <AccordionTrigger className="hover:no-underline py-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-violet-50 flex items-center justify-center text-violet-600">
                  <Award className="w-4 h-4" />
                </div>
                <span className="font-bold text-sm text-slate-700">Certifications</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="pt-2 pb-6 space-y-6">
              {profile.certifications.map((cert, idx) => (
                <div key={idx} className="p-4 bg-white rounded-xl border border-slate-200 relative group space-y-4">
                  <div className="flex justify-between items-center">
                    <h4 className="font-bold text-sm text-slate-700">{cert.name || 'Certificate Name'}</h4>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => saveAndSync({ ...profile, certifications: profile.certifications.filter((_, i) => i !== idx) })}
                      className="h-8 w-8 text-muted-foreground hover:text-destructive"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-1.5">
                      <Label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Certificate Name</Label>
                      <Input 
                        value={cert.name} 
                        onChange={e => {
                          const newCerts = [...profile.certifications];
                          newCerts[idx] = { ...newCerts[idx], name: e.target.value };
                          saveAndSync({ ...profile, certifications: newCerts });
                        }}
                        placeholder="Game Development Workshop using Python"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Certificate Link</Label>
                      <Input 
                        value={cert.link} 
                        onChange={e => {
                          const newCerts = [...profile.certifications];
                          newCerts[idx] = { ...newCerts[idx], link: e.target.value };
                          saveAndSync({ ...profile, certifications: newCerts });
                        }}
                        placeholder="drive.google.com/..."
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Issued by</Label>
                      <Input 
                        value={cert.issuedBy} 
                        onChange={e => {
                          const newCerts = [...profile.certifications];
                          newCerts[idx] = { ...newCerts[idx], issuedBy: e.target.value };
                          saveAndSync({ ...profile, certifications: newCerts });
                        }}
                        placeholder="HackerRank, Udemy, Coursera, etc"
                      />
                    </div>
                  </div>
                </div>
              ))}
              <Button 
                variant="outline" 
                className="w-full border-dashed border-2 py-6 text-muted-foreground hover:text-primary hover:border-primary/50"
                onClick={() => {
                  const newCert: Certification = { name: 'New Certificate', link: '', issuedBy: '' };
                  saveAndSync({ ...profile, certifications: [newCert, ...profile.certifications] });
                }}
              >
                <Plus className="w-4 h-4 mr-2" /> Add Certificate
              </Button>
            </AccordionContent>
          </AccordionItem>

          {/* Additional */}
          <AccordionItem value="additional" className="border rounded-xl px-4 bg-white shadow-sm">
            <AccordionTrigger className="hover:no-underline py-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center text-gray-600">
                  <MoreHorizontal className="w-4 h-4" />
                </div>
                <span className="font-bold text-sm text-slate-700">Additional</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="pt-2 pb-6 space-y-6">
              <div className="font-bold text-sm text-slate-700">Honors & Awards</div>
              
              {/* We'll use customSections for this, specifically looking for one with id 'honors' or creating it */}
              {(() => {
                const honorsSection = profile.customSections.find(s => s.id === 'honors') || { id: 'honors', title: 'Honors & Awards', items: [] };
                const otherSections = profile.customSections.filter(s => s.id !== 'honors');
                
                return (
                  <div className="space-y-3">
                    {honorsSection.items.map((item, idx) => (
                      <div key={idx} className="flex gap-2 items-center">
                        <Input 
                          value={item.title} 
                          onChange={e => {
                            const newItems = [...honorsSection.items];
                            newItems[idx] = { ...newItems[idx], title: e.target.value };
                            const newCustomSections = [
                              ...otherSections,
                              { ...honorsSection, items: newItems }
                            ];
                            saveAndSync({ ...profile, customSections: newCustomSections });
                          }}
                          placeholder="Award description..."
                        />
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            const newItems = honorsSection.items.filter((_, i) => i !== idx);
                            const newCustomSections = [
                              ...otherSections,
                              { ...honorsSection, items: newItems }
                            ];
                            saveAndSync({ ...profile, customSections: newCustomSections });
                          }}
                          className="h-10 w-10 text-muted-foreground hover:text-destructive"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                    <Button 
                      variant="outline" 
                      className="w-full border-dashed border-2 py-6 text-muted-foreground hover:text-primary hover:border-primary/50"
                      onClick={() => {
                        const newItems = [...honorsSection.items, { title: '', description: '' }];
                        const newCustomSections = [
                          ...otherSections,
                          { ...honorsSection, items: newItems }
                        ];
                        saveAndSync({ ...profile, customSections: newCustomSections });
                      }}
                    >
                      <Plus className="w-4 h-4 mr-2" /> Add Honor / Award
                    </Button>
                  </div>
                );
              })()}
            </AccordionContent>
          </AccordionItem>



        </Accordion>
      </div>
    </ScrollArea>
  );
};

export default ProfileForm;
