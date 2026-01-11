import { UserProfile } from '@/types';

export const generateJakesResume = (profile: UserProfile): string => {
  const p = profile.personalInfo;
  
  const esc = (str: string | undefined) => {
    if (!str) return '';
    return str
      .replace(/\\/g, '\\textbackslash{}')
      .replace(/&/g, '\\&')
      .replace(/%/g, '\\%')
      .replace(/\$/g, '\\$')
      .replace(/#/g, '\\#')
      .replace(/_/g, '\\_')
      .replace(/{/g, '\\{')
      .replace(/}/g, '\\}')
      .replace(/~/g, '\\textasciitilde{}')
      .replace(/\^/g, '\\textasciicircum{}');
  };

  const header = `
\\documentclass[letterpaper,11pt]{article}

\\usepackage{latexsym}
\\usepackage[empty]{fullpage}
\\usepackage{titlesec}
\\usepackage{marvosym}
\\usepackage[usenames,dvipsnames]{color}
\\usepackage{verbatim}
\\usepackage{enumitem}
\\usepackage[hidelinks]{hyperref}
\\usepackage{fancyhdr}
\\usepackage[english]{babel}
\\usepackage{tabularx}
\\input{glyphtounicode}

\\pagestyle{fancy}
\\fancyhf{} 
\\fancyfoot{}
\\renewcommand{\\headrulewidth}{0pt}
\\renewcommand{\\footrulewidth}{0pt}

\\addtolength{\\oddsidemargin}{-0.5in}
\\addtolength{\\evensidemargin}{-0.5in}
\\addtolength{\\textwidth}{1in}
\\addtolength{\\topmargin}{-.5in}
\\addtolength{\\textheight}{1.0in}

\\urlstyle{same}

\\raggedbottom
\\raggedright
\\setlength{\\tabcolsep}{0in}

\\titleformat{\\section}{
  \\vspace{-4pt}\\scshape\\raggedright\\large
}{}{0em}{}[\\color{black}\\titlerule \\vspace{-5pt}]

\\pdfgentounicode=1

\\newcommand{\\resumeItem}[1]{
  \\item\\small{
    {#1 \\vspace{-2pt}}
  }
}

\\newcommand{\\resumeSubheading}[4]{
  \\vspace{-1pt}\\item
    \\begin{tabular*}{0.97\\textwidth}[t]{l@{\\extracolsep{\\fill}}r}
      \\textbf{#1} & #2 \\\\
      \\textit{\\small#3} & \\textit{\\small #4} \\\\
    \\end{tabular*}\\vspace{-7pt}
}

\\newcommand{\\resumeProjectHeading}[2]{
    \\item
    \\begin{tabular*}{0.97\\textwidth}{l@{\\extracolsep{\\fill}}r}
      \\small#1 & #2 \\\\
    \\end{tabular*}\\vspace{-7pt}
}

\\newcommand{\\resumeSubItem}[1]{\\resumeItem{#1}\\vspace{-4pt}}

\\renewcommand\\labelitemii{$\\vcenter{\\hbox{\\tiny$\\bullet$}}$}

\\newcommand{\\resumeSubHeadingListStart}{\\begin{itemize}[leftmargin=0.15in, label={}]}
\\newcommand{\\resumeSubHeadingListEnd}{\\end{itemize}}
\\newcommand{\\resumeItemListStart}{\\begin{itemize}}
\\newcommand{\\resumeItemListEnd}{\\end{itemize}\\vspace{-5pt}}

\\begin{document}

%----------HEADING----------
\\begin{center}
    \\textbf{\\Huge \\scshape ${esc(p.fullName || p.firstName + ' ' + p.lastName)}} \\\\ \\vspace{1pt}
    \\small ${esc(p.phone)} $|$ \\href{mailto:${p.email}}{\\underline{${esc(p.email)}}} $|$ 
    \\href{${p.linkedin}}{\\underline{linkedin.com/in/${esc(p.linkedin?.split('/').pop())}}} $|$
    \\href{${p.website}}{\\underline{${esc(p.website?.replace(new RegExp('^https?://'), ''))}}}
\\end{center}
`;

  let education = '';
  if (profile.education.length > 0) {
    education = `
%-----------EDUCATION-----------
\\section{Education}
  \\resumeSubHeadingListStart
    ${profile.education.map(edu => `
      \\resumeSubheading
        {${esc(edu.institution)}}{${esc(edu.gradMonthYear || edu.graduationDate)}}
        {${esc(edu.degree || edu.degreeType)} ${esc(edu.field)}}{${esc(edu.location)}}
    `).join('')}
  \\resumeSubHeadingListEnd
`;
  }

  let experience = '';
  if (profile.experience.length > 0) {
    experience = `
%-----------EXPERIENCE-----------
\\section{Experience}
  \\resumeSubHeadingListStart
    ${profile.experience.map(exp => `
      \\resumeSubheading
        {${esc(exp.company)}}{${esc(exp.startDate)} -- ${exp.current ? 'Present' : esc(exp.endDate)}}
        {${esc(exp.role)}}{${esc(exp.location || 'Remote')}}
      \\resumeItemListStart
        ${(exp.description || '').split('\n').filter(l => l.trim()).map(line => `
          \\resumeItem{${esc(line.replace(/^[•-]\s*/, ''))}}
        `).join('')}
      \\resumeItemListEnd
    `).join('')}
  \\resumeSubHeadingListEnd
`;
  }

  let projects = '';
  if (profile.projects.length > 0) {
    projects = `
%-----------PROJECTS-----------
\\section{Projects}
    \\resumeSubHeadingListStart
      ${profile.projects.map(proj => `
        \\resumeProjectHeading
          {\\textbf{${esc(proj.name)}} $|$ \\emph{${esc(proj.technologies)}}}{}
          \\resumeItemListStart
            \\resumeItem{${esc(proj.description)}}
          \\resumeItemListEnd
      `).join('')}
    \\resumeSubHeadingListEnd
`;
  }

  let skills = '';
  if (profile.skillCategories.length > 0) {
    skills = `
%-----------PROGRAMMING SKILLS-----------
\\section{Technical Skills}
 \\begin{itemize}[leftmargin=0.15in, label={}]
    \\small{\\item{
     ${profile.skillCategories.map(cat => `
      \\textbf{${esc(cat.category)}}{: ${esc(cat.items.join(', '))}} \\\\
     `).join('')}
    }}
 \\end{itemize}
`;
  }

  const footer = `
\\end{document}
`;

  return header + education + experience + projects + skills + footer;
};
