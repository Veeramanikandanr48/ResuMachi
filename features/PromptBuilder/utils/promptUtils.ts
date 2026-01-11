
/**
 * Sanitizes and validates the system prompt to ensure ATS compliance
 * and professional tone injection.
 */
export const processSystemPrompt = (rawPrompt: string): string => {
  let processed = rawPrompt.trim();
  
  // Enforce structural constraints if missing
  if (!processed.toLowerCase().includes('ats')) {
    processed += "\n\nCRITICAL: Ensure all output is optimized for ATS (Applicant Tracking Systems).";
  }

  return processed;
};

export const getPromptTokenCount = (text: string): number => {
  // Rough estimation for UI feedback
  return Math.ceil(text.length / 4);
};
