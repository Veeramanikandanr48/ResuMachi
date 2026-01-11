import { UserProfile, ResumeTheme } from '@/types';
import { generateJakesResume } from '../templates/jakesResume';
import { generateAltaCv, altaCvClass } from '../templates/altaCv';

export const generateLatex = (profile: UserProfile, theme: ResumeTheme): Record<string, string> => {
  switch (theme) {
    case 'AltaCV':
      return {
        'main.tex': generateAltaCv(profile),
        'altacv.cls': altaCvClass
      };
    case 'Modern Serif':
    case 'LaTeX Modern':
      return {
        'main.tex': generateJakesResume(profile)
      };
    default:
      // Default to Jake's Resume for now as a fallback for other themes
      return {
        'main.tex': generateJakesResume(profile)
      };
  }
};
