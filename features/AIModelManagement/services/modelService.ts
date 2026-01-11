
export interface AIModel {
  id: string;
  name: string;
  type: 'Pro' | 'Flash' | 'Lite';
  capabilities: string[];
}

export const fetchAvailableModels = async (): Promise<AIModel[]> => {
  // Placeholder for future API integration
  return [
    { id: 'gemini-3-pro-preview', name: 'Gemini 3 Pro', type: 'Pro', capabilities: ['Reasoning', 'Complex Coding', 'Large Context'] },
    { id: 'gemini-3-flash-preview', name: 'Gemini 3 Flash', type: 'Flash', capabilities: ['Speed', 'Efficiency', 'Summarization'] },
    { id: 'gemini-2.5-flash-image', name: 'Gemini 2.5 Image', type: 'Flash', capabilities: ['Visual Generation', 'Editing'] }
  ];
};
