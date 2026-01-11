import React from 'react';
import { ResumeContent, ResumeTheme, UserProfile } from '@/types';

interface ResumePreviewProps {
  userProfile: UserProfile;
  generatedContent: ResumeContent | null;
  theme: ResumeTheme;
  onRegenerateSection?: (section: string) => void;
  isGenerating?: boolean;
}

const ResumePreview: React.FC<ResumePreviewProps> = ({ userProfile, generatedContent, theme, onRegenerateSection, isGenerating }) => {
  const p = userProfile.personalInfo;
  
  // LIVE REFLECTION LOGIC:
  // We prioritize the userProfile's live manual edits.
  
  const summary = p.summary || generatedContent?.summary || "Professional ready to impact...";
  
  // Experience live reflect: use profile structure, fallback to AI descriptions only if manual is empty or matched
  const experience = userProfile.experience.map(exp => {
    const aiMatch = generatedContent?.experience.find(ai => 
      ai.company.toLowerCase() === exp.company.toLowerCase() || 
      ai.role.toLowerCase() === exp.role.toLowerCase()
    );
    return {
      ...exp,
      description: exp.description || (aiMatch ? aiMatch.description : '')
    };
  });

  const education = userProfile.education;

  // Skills mapping logic: Ensure editor categories map nicely to resume headings
  const mapCategoryHeading = (cat: string) => {
    const lower = cat.toLowerCase();
    if (lower.includes('language')) return 'PROGRAMMING LANGUAGES';
    if (lower.includes('library') || lower.includes('framework')) return 'WEB FRAMEWORKS & LIBRARIES';
    if (lower.includes('database')) return 'DATABASES & CLOUD';
    if (lower.includes('tool') || lower.includes('platform')) return 'TOOLS & METHODOLOGIES';
    return cat.toUpperCase();
  };

  // Handle both structured categories and flat skills list from editor
  let skillCategories = userProfile.skillCategories.length > 0 
    ? userProfile.skillCategories.map(c => ({ ...c, heading: mapCategoryHeading(c.category) }))
    : (generatedContent?.skillCategories || []).map(c => ({ ...c, heading: mapCategoryHeading(c.category) }));

  // If no categories but we have flat skills, create a default category
  if (skillCategories.length === 0 && userProfile.skills && userProfile.skills.length > 0) {
    skillCategories = [{
      category: 'Skills',
      heading: 'TECHNICAL SKILLS',
      items: userProfile.skills
    }];
  }

  const projects = userProfile.projects.map(proj => {
    const aiMatch = generatedContent?.projects.find(ai => 
      ai.name.toLowerCase() === proj.name.toLowerCase()
    );
    return {
      ...proj,
      description: proj.description || (aiMatch ? aiMatch.description : '')
    };
  });

  const certifications = userProfile.certifications || [];
  const customSections = userProfile.customSections || [];

  // Consolidate Links (Array + Single Fields)
  const displayLinks = [...(p.links || [])];
  if (p.linkedin && !displayLinks.find(l => l.type === 'LinkedIn')) {
    displayLinks.push({ type: 'LinkedIn', url: p.linkedin });
  }
  if (p.website && !displayLinks.find(l => l.type === 'Portfolio')) {
    displayLinks.push({ type: 'Portfolio', url: p.website });
  }

  const getThemeStyles = () => {
    const base = "resume-container bg-white shadow-2xl mx-auto w-full min-w-[210mm] max-w-[210mm] min-h-[297mm] p-[15mm] text-black overflow-hidden relative";
    switch (theme) {
      case 'LaTeX Modern':
        return {
          container: `${base} text-[#333] leading-relaxed font-sans`,
          header: "mb-6",
          name: "text-4xl font-black text-slate-900 tracking-tight",
          sectionTitle: "text-[10px] font-black text-blue-600 uppercase tracking-[0.3em] mb-3 mt-6 flex items-center gap-4 after:content-[''] after:h-px after:bg-blue-100 after:flex-1 group/title",
          itemTitle: "flex justify-between items-baseline font-bold text-sm text-slate-900",
          bodyText: "text-[9pt]",
          skillLabel: "text-[8pt] font-black text-slate-400 uppercase tracking-widest mb-1",
          skillItems: "text-[9pt] font-bold text-slate-700 uppercase"
        };
      case 'Modern Serif':
        return {
          container: `${base} text-black font-serif`,
          header: "text-center mb-6",
          name: "text-3xl font-normal uppercase tracking-widest mb-1",
          sectionTitle: "text-[10pt] font-bold uppercase tracking-widest mb-2 mt-4 border-b border-black pb-1 group/title",
          itemTitle: "flex justify-between items-baseline font-bold text-[10pt]",
          bodyText: "text-[10pt] leading-snug",
          skillLabel: "text-[10pt] font-bold w-48 shrink-0",
          skillItems: "text-[10pt]"
        };
      case 'AltaCV':
        return {
          container: `${base} font-sans text-slate-700`,
          header: "mb-8",
          name: "text-4xl font-bold text-purple-900 uppercase tracking-tight",
          sectionTitle: "text-xl font-bold text-purple-900 uppercase mb-4",
          itemTitle: "font-bold text-slate-800",
          bodyText: "text-slate-600",
          skillLabel: "font-bold text-slate-700",
          skillItems: "bg-slate-100 px-2 py-1 rounded text-sm"
        };
      default: // Standard/Professional
        return {
          container: `${base} text-[#1a1a1a] leading-[1.5] font-serif`,
          header: "text-left mb-8 border-b-2 border-slate-900 pb-6",
          name: "text-4xl font-black tracking-tight text-slate-900 mb-1 font-sans",
          sectionTitle: "text-[9pt] font-black text-slate-900 uppercase tracking-[0.2em] mb-3 mt-6 border-b border-slate-200 pb-1 font-sans flex justify-between items-center group/title",
          itemTitle: "flex justify-between items-baseline font-bold text-[10pt] font-sans",
          bodyText: "text-[10pt] text-slate-800",
          skillLabel: "text-[8pt] font-black text-slate-500 uppercase tracking-widest",
          skillItems: "text-[9pt] font-bold text-slate-900 uppercase"
        };
    }
  };

  const s = getThemeStyles();

  const RegenerateButton = ({ section }: { section: string }) => {
    if (!onRegenerateSection) return null;
    return (
      <button 
        disabled={isGenerating}
        onClick={() => onRegenerateSection(section)}
        className="ml-auto opacity-0 group-hover/title:opacity-100 transition-all p-1 bg-blue-50 text-blue-600 rounded-md hover:bg-blue-600 hover:text-white shadow-sm no-print disabled:opacity-30"
      >
        <svg className={`w-3 h-3 ${isGenerating ? 'animate-spin' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
      </button>
    );
  };

  return (
    <div className="relative group">
      <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-all flex gap-2 z-[60] no-print">
        <button onClick={() => window.print()} className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 shadow-lg"><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" /></svg></button>
      </div>

      <div className={s.container}>
        <header className={s.header}>
          <h1 className={s.name}>
            {p.fullName || `${p.firstName || 'First'} ${p.lastName || 'Last'}`}
          </h1>
          
          {theme === 'Modern Serif' ? (
            <>
              <div className="text-[10pt] mb-1">{p.title || 'Job Title'}</div>
              <div className="text-[9pt] flex justify-center flex-wrap gap-x-1 text-black">
                {p.email && <span>{p.email}</span>}
                {p.phone && <span>| {p.phone}</span>}
                {p.location && <span>| {p.location}</span>}
              </div>
              <div className="flex justify-center flex-wrap gap-x-1 text-[9pt] mt-1">
                {displayLinks.map((l, i) => (
                  <span key={i}>
                    {i > 0 && " | "}
                    <span className="cursor-pointer hover:underline">{l.type}</span>
                  </span>
                ))}
              </div>
            </>
          ) : (
            <>
              <div className="flex flex-wrap gap-x-4 gap-y-1 text-[9pt] font-bold text-slate-500 uppercase tracking-wider mt-2">
                <span>{p.title || 'Job Title'}</span>
                {p.email && <span>• {p.email}</span>}
                {p.phone && <span>• {p.phone}</span>}
                {p.location && <span>• {p.location}</span>}
              </div>
              <div className="flex gap-4 mt-2 text-[8pt] text-blue-600 font-bold">
                {displayLinks.map((l, i) => (
                  l.url && <span key={i} className="hover:underline cursor-pointer">{l.type}: {l.url.replace(/^https?:\/\/(www\.)?/, '')}</span>
                ))}
              </div>
            </>
          )}
        </header>

        {theme === 'Modern Serif' ? (
          // Modern Serif Layout
          <>
            <section className="mb-4">
              <h2 className={s.sectionTitle}>Education</h2>
              <div className="space-y-2">
                {education.map((edu, i) => (
                  <div key={i}>
                    <div className="flex justify-between font-bold text-[10pt]">
                      <span>{edu.institution}</span>
                      <span>{edu.location}</span>
                    </div>
                    <div className="flex justify-between text-[10pt] italic">
                      <span>{edu.degree || edu.degreeType} {edu.field}</span>
                      <span>{edu.graduationDate || edu.gradMonthYear}</span>
                    </div>
                    {edu.scoreValue && (
                      <div className="text-[10pt]">
                        {edu.scoreType === 'GPA' ? 'CGPA' : 'Percentage'}: {edu.scoreValue}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>

            <section className="mb-4">
              <h2 className={s.sectionTitle}>Experience</h2>
              <div className="space-y-4">
                {experience.map((exp, i) => (
                  <div key={i}>
                    <div className="flex justify-between font-bold text-[10pt]">
                      <span>{exp.company} | {exp.role}</span>
                      <span>{exp.location || 'Remote'} | {exp.startDate} - {exp.current ? 'Present' : exp.endDate}</span>
                    </div>
                    <ul className="list-disc ml-5 mt-1 space-y-0.5">
                      {(exp.description || '').split('\n').filter(l => l.trim()).map((line, idx) => (
                        <li key={idx} className="text-[10pt] pl-1">{line.replace(/^[•-]\s*/, '')}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </section>

            <section className="mb-4">
              <h2 className={s.sectionTitle}>Skills</h2>
              <div className="space-y-1">
                {skillCategories.map((cat, i) => (
                  <div key={i} className="flex">
                    <span className="font-bold w-48 shrink-0 text-[10pt]">{(cat as any).heading || cat.category}:</span>
                    <span className="text-[10pt]">{cat.items.join(', ')}</span>
                  </div>
                ))}
              </div>
            </section>

            <section className="mb-4">
              <h2 className={s.sectionTitle}>Projects / Open-Source</h2>
              <div className="space-y-3">
                {projects.map((proj, i) => (
                  <div key={i}>
                    <div className="font-bold text-[10pt]">{proj.name}</div>
                    <div className="text-[10pt] italic mb-1">{proj.technologies}</div>
                    <div className="text-[10pt]">{proj.description}</div>
                  </div>
                ))}
              </div>
            </section>
          </>
        ) : theme === 'AltaCV' ? (
          // AltaCV Layout
          <div className="grid grid-cols-12 gap-8 h-full">
            {/* Left/Main Column (60%) */}
            <div className="col-span-7 space-y-6">
              <section>
                <h2 className={s.sectionTitle}>Experience</h2>
                <div className="space-y-5">
                  {experience.map((exp, i) => (
                    <div key={i}>
                      <div className="font-bold text-[11pt] text-slate-800">{exp.role}</div>
                      <div className="font-bold text-[10pt] text-purple-900 mb-1">{exp.company}</div>
                      <div className="flex gap-3 text-[9pt] text-slate-500 mb-2 font-medium">
                        <span className="flex items-center gap-1">
                          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24"><path d="M19 4h-1V2h-2v2H8V2H6v2H5c-1.11 0-1.99.9-1.99 2L3 20a2 2 0 002 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V10h14v10zm0-12H5V6h14v2zm-7 5h5v5h-5v-5z"/></svg>
                          {exp.startDate} – {exp.current ? 'Present' : exp.endDate}
                        </span>
                        <span className="flex items-center gap-1">
                          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 010-5 2.5 2.5 0 010 5z"/></svg>
                          {exp.location || 'Remote'}
                        </span>
                      </div>
                      <ul className="list-disc ml-4 space-y-1">
                        {(exp.description || '').split('\n').filter(l => l.trim()).map((line, idx) => (
                          <li key={idx} className="text-[9.5pt] text-slate-600 leading-snug pl-1 marker:text-slate-400">
                            {line.replace(/^[•-]\s*/, '')}
                          </li>
                        ))}
                      </ul>
                      {i < experience.length - 1 && <div className="h-px bg-slate-200 mt-4 w-1/2" />}
                    </div>
                  ))}
                </div>
              </section>

              <section>
                <h2 className={s.sectionTitle}>Projects</h2>
                <div className="space-y-4">
                  {projects.map((proj, i) => (
                    <div key={i}>
                      <div className="font-bold text-[10pt] text-slate-800 flex items-center gap-2">
                        {proj.name}
                        {proj.technologies && <span className="text-[8pt] font-normal text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">{proj.technologies}</span>}
                      </div>
                      <p className="text-[9.5pt] text-slate-600 mt-1 leading-snug">{proj.description}</p>
                      {i < projects.length - 1 && <div className="h-px bg-slate-200 mt-3 w-1/2" />}
                    </div>
                  ))}
                </div>
              </section>
            </div>

            {/* Right/Side Column (40%) */}
            <div className="col-span-5 space-y-6 bg-slate-50/50 p-4 rounded-xl -my-4 h-full">
              <section>
                <h2 className={s.sectionTitle}>Education</h2>
                <div className="space-y-4">
                  {education.map((edu, i) => (
                    <div key={i}>
                      <div className="font-bold text-[10pt] text-slate-800 leading-tight">
                        {edu.degree || edu.degreeType} {edu.field}
                      </div>
                      <div className="text-[9pt] text-purple-900 font-medium mt-0.5">{edu.institution}</div>
                      <div className="text-[9pt] text-slate-500 mt-0.5 flex items-center gap-1">
                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24"><path d="M19 4h-1V2h-2v2H8V2H6v2H5c-1.11 0-1.99.9-1.99 2L3 20a2 2 0 002 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V10h14v10zm0-12H5V6h14v2zm-7 5h5v5h-5v-5z"/></svg>
                        {edu.graduationDate || edu.gradMonthYear}
                      </div>
                      {i < education.length - 1 && <div className="h-px bg-slate-200 mt-3" />}
                    </div>
                  ))}
                </div>
              </section>

              <section>
                <h2 className={s.sectionTitle}>Skills</h2>
                <div className="space-y-4">
                  {skillCategories.map((cat, i) => (
                    <div key={i}>
                      <div className="font-bold text-[9pt] text-slate-400 uppercase tracking-wider mb-2">{(cat as any).heading || cat.category}</div>
                      <div className="flex flex-wrap gap-2">
                        {cat.items.map((item, idx) => (
                          <span key={idx} className="px-2 py-1 bg-slate-200 text-slate-700 rounded text-[8.5pt] font-medium">
                            {item}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {certifications.length > 0 && (
                <section>
                  <h2 className={s.sectionTitle}>Certifications</h2>
                  <div className="space-y-2">
                    {certifications.map((cert, i) => (
                      <div key={i} className="text-[9.5pt]">
                        <div className="font-bold text-slate-700">{cert.name}</div>
                        <div className="text-slate-500 text-[8.5pt]">{cert.issuedBy}</div>
                      </div>
                    ))}
                  </div>
                </section>
              )}
            </div>
          </div>
        ) : (
          // Standard Layout
          <>
            <section className="mb-6">
              <h2 className={s.sectionTitle}>Profile Summary <RegenerateButton section="Summary" /></h2>
              <p className={s.bodyText}>{summary}</p>
            </section>

            <section className="mb-6">
              <h2 className={s.sectionTitle}>Experience <RegenerateButton section="Experience" /></h2>
              <div className="space-y-4">
                {experience.length > 0 ? experience.map((exp, i) => (
                  <div key={i}>
                    <div className={s.itemTitle}>
                      <span>{exp.company || 'Company'} — {exp.role || 'Role'}</span>
                      <span className="text-[8pt] font-black text-slate-400 italic">{exp.startDate} – {exp.current ? 'Present' : exp.endDate}</span>
                    </div>
                    <ul className="list-disc ml-4 mt-1 space-y-0.5">
                      {(exp.description || '').split('\n').filter(l => l.trim()).map((line, idx) => (
                        <li key={idx} className={`${s.bodyText} text-slate-700 leading-snug`}>{line.replace(/^[•-]\s*/, '')}</li>
                      ))}
                    </ul>
                  </div>
                )) : <p className="text-slate-300 italic text-sm">Add experience history in the editor.</p>}
              </div>
            </section>

            <div className="grid grid-cols-12 gap-10">
              <div className="col-span-4">
                <section className="mb-6">
                  <h2 className={s.sectionTitle}>Education</h2>
                  <div className="space-y-4">
                    {education.length > 0 ? education.map((edu, i) => (
                      <div key={i} className="space-y-0.5">
                        <h3 className="text-[9pt] font-black uppercase text-slate-900 leading-tight">{edu.institution || 'University'}</h3>
                        <p className="text-[8pt] font-bold text-slate-600 italic leading-tight">
                          {edu.degree || edu.degreeType} {edu.field}
                        </p>
                        <p className="text-[8pt] font-black text-slate-400">{edu.graduationDate || edu.gradMonthYear}</p>
                      </div>
                    )) : <p className="text-slate-300 italic text-sm">Add education records.</p>}
                  </div>
                </section>
              </div>
              <div className="col-span-8">
                <section className="mb-6">
                  <h2 className={s.sectionTitle}>Skills <RegenerateButton section="Skills" /></h2>
                  <div className="space-y-3">
                    {skillCategories.length > 0 ? skillCategories.map((cat, i) => (
                      <div key={i} className="mb-3">
                        <p className={`${s.skillLabel} mb-1`}>{(cat as any).heading || cat.category.toUpperCase()}</p>
                        <div className="flex flex-wrap gap-x-3 gap-y-1">
                          {cat.items.map((item, idx) => (
                            <span key={idx} className={s.skillItems}>{item}</span>
                          ))}
                        </div>
                      </div>
                    )) : <p className="text-slate-300 italic text-sm">Add skill categories.</p>}
                  </div>
                </section>
              </div>
            </div>

            {projects.length > 0 && (
              <section className="mb-6">
                <h2 className={s.sectionTitle}>Projects <RegenerateButton section="Projects" /></h2>
                <div className="space-y-4">
                  {projects.map((proj, i) => (
                    <div key={i}>
                      <div className={s.itemTitle}>
                        <span>{proj.name || 'Project Name'}</span>
                        <span className="text-[8pt] font-bold text-slate-400">{proj.technologies}</span>
                      </div>
                      <p className={`${s.bodyText} text-slate-600 mt-1`}>{proj.description}</p>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {certifications.length > 0 && (
              <section className="mb-6">
                <h2 className={s.sectionTitle}>Certifications</h2>
                <div className="space-y-2">
                  {certifications.map((cert, i) => (
                    <div key={i} className="flex justify-between items-baseline">
                      <span className={`${s.bodyText} font-bold text-slate-800`}>{cert.name}</span>
                      <span className="text-[8pt] text-slate-500 italic">{cert.issuedBy}</span>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {customSections.map((section, i) => (
              <section key={i} className="mb-6">
                <h2 className={s.sectionTitle}>{section.title}</h2>
                <ul className="list-disc ml-4 space-y-1">
                  {section.items.map((item, idx) => (
                    <li key={idx} className={`${s.bodyText} text-slate-700`}>{item.title}</li>
                  ))}
                </ul>
              </section>
            ))}
          </>
        )}

        <div className="absolute bottom-8 left-0 w-full text-center text-[7pt] text-slate-300 font-bold uppercase tracking-[0.2em] no-print">
          Synthesized by ResuMaster AI • Optimized for Standard Protocol
        </div>
      </div>
    </div>
  );
};

export default ResumePreview;
