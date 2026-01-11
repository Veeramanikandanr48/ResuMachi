
import React, { useState } from 'react';
import { processSystemPrompt, getPromptTokenCount } from '../utils/promptUtils';

export const PromptInput: React.FC = () => {
  const [prompt, setPrompt] = useState('You are an expert AI Resume Architect. Focus on quantifiable achievements.');
  const [isSaved, setIsSaved] = useState(false);

  const handleSave = () => {
    const cleaned = processSystemPrompt(prompt);
    setPrompt(cleaned);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  return (
    <div className="space-y-4 p-6 bg-slate-900 rounded-[2rem] border border-slate-800 shadow-2xl">
      <div className="flex justify-between items-center">
        <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest">System Instructions</h3>
        <span className="text-[9px] font-bold text-slate-600">{getPromptTokenCount(prompt)} tokens used</span>
      </div>
      
      <textarea
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        className="w-full h-32 bg-slate-950 text-emerald-500 font-mono text-xs p-4 rounded-xl border border-slate-800 focus:border-emerald-500/50 outline-none transition-all resize-none custom-scrollbar"
        placeholder="Enter custom behavioral logic..."
      />

      <button 
        onClick={handleSave}
        className={`w-full py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${isSaved ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white'}`}
      >
        {isSaved ? 'Logic Updated' : 'Inject Logic'}
      </button>
    </div>
  );
};
