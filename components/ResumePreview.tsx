
import React from 'react';
import { ResumeContent, PersonalInfo, ResumeTheme, UserProfile } from '../types';

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

  const skillCategories = userProfile.skillCategories.length > 0 
    ? userProfile.skillCategories.map(c => ({ ...c, heading: mapCategoryHeading(c.category) }))
    : (generatedContent?.skillCategories || []).map(c => ({ ...c, heading: mapCategoryHeading(c.category) }));

  const projects = userProfile.projects.map(proj => {
    const aiMatch = generatedContent?.projects.find(ai => 
      ai.name.toLowerCase() === proj.name.toLowerCase()
    );
    return {
      ...proj,
      description: proj.description || (aiMatch ? aiMatch.description : '')
    };
  });

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
          <h1 className={s.name}>{p.firstName || 'First'} {p.lastName || 'Last'}</h1>
          <div className="flex flex-wrap gap-x-4 gap-y-1 text-[9pt] font-bold text-slate-500 uppercase tracking-wider mt-2">
            <span>{p.title || 'Job Title'}</span>
            {p.email && <span>• {p.email}</span>}
            {p.phone && <span>• {p.phone}</span>}
            {p.location && <span>• {p.location}</span>}
          </div>
          <div className="flex gap-4 mt-2 text-[8pt] text-blue-600 font-bold">
            {p.links.map((l, i) => (
              l.url && <span key={i} className="hover:underline cursor-pointer">{l.type}: {l.url.replace(/^https?:\/\/(www\.)?/, '')}</span>
            ))}
          </div>
        </header>

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
                    <p className="text-[8pt] font-bold text-slate-600 italic leading-tight">{edu.degreeType} {edu.field}</p>
                    <p className="text-[8pt] font-black text-slate-400">{edu.gradMonthYear}</p>
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

        <div className="absolute bottom-8 left-0 w-full text-center text-[7pt] text-slate-300 font-bold uppercase tracking-[0.2em] no-print">
          Synthesized by ResuMaster AI • Optimized for Standard Protocol
        </div>
      </div>
    </div>
  );
};

export default ResumePreview;
