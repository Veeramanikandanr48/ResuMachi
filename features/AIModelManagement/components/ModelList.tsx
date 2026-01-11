
import React, { useEffect, useState } from 'react';
import { fetchAvailableModels, AIModel } from '../services/modelService';

export const ModelList: React.FC = () => {
  const [models, setModels] = useState<AIModel[]>([]);
  const [selectedId, setSelectedId] = useState('gemini-3-pro-preview');

  useEffect(() => {
    fetchAvailableModels().then(setModels);
  }, []);

  return (
    <div className="space-y-4">
      <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Active Neural Nodes</h3>
      <div className="grid grid-cols-1 gap-3">
        {models.map(model => (
          <div 
            key={model.id} 
            onClick={() => setSelectedId(model.id)}
            className={`p-4 bg-white border-2 rounded-2xl transition-all cursor-pointer group shadow-sm ${selectedId === model.id ? 'border-blue-500 ring-4 ring-blue-50' : 'border-slate-100 hover:border-slate-200'}`}
          >
            <div className="flex justify-between items-start mb-2">
              <div className="flex items-center gap-2">
                <span className={`text-sm font-black transition-colors ${selectedId === model.id ? 'text-blue-600' : 'text-slate-900'}`}>
                  {model.name}
                </span>
                <span className={`text-[8px] px-1.5 py-0.5 rounded font-black uppercase ${model.type === 'Pro' ? 'bg-indigo-100 text-indigo-600' : 'bg-amber-100 text-amber-600'}`}>
                  {model.type}
                </span>
              </div>
              {selectedId === model.id && (
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
              )}
            </div>
            <div className="flex flex-wrap gap-1">
              {model.capabilities.map(cap => (
                <span key={cap} className="text-[9px] text-slate-400 font-medium px-1.5 py-0.5 bg-slate-50 rounded">
                  {cap}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
