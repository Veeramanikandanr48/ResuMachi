import React, { useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { ATSScore } from '@/types';
import { ChevronUp, Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Card } from '@/components/ui/card';

interface ScorePanelProps {
  score: ATSScore;
  suggestions: string[];
  reasoning: string;
}

const ScorePanel: React.FC<ScorePanelProps> = ({ score, suggestions, reasoning }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const data = [
    { name: 'Score', value: score.overall },
    { name: 'Remaining', value: 100 - score.overall },
  ];

  const getScoreColor = (s: number) => {
    if (s >= 80) return '#10b981'; // emerald-500
    if (s >= 60) return '#f59e0b'; // amber-500
    return '#ef4444'; // red-500
  };

  return (
    <div className={cn(
      "fixed bottom-0 left-0 md:left-[420px] right-0 bg-background border-t border-border z-[55] transition-all duration-500 ease-in-out shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.1)] no-print",
      isExpanded ? 'h-[420px]' : 'h-14'
    )}>
      {/* Clickable Header Bar */}
      <div 
        onClick={() => setIsExpanded(!isExpanded)}
        className="h-14 px-8 flex items-center justify-between cursor-pointer hover:bg-accent/50 transition-colors"
      >
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3">
             <div className="w-8 h-8 rounded-lg flex items-center justify-center font-black text-xs text-white shadow-sm" style={{ backgroundColor: getScoreColor(score.overall) }}>
               {score.overall}
             </div>
             <span className="text-[10px] font-black text-foreground uppercase tracking-widest">ATS Match Score</span>
          </div>
          
          <div className="h-4 w-px bg-border" />
          
          <div className="flex items-center gap-4">
             <div className="flex flex-col">
               <div className="flex items-center gap-2">
                 <span className="text-[10px] font-black text-muted-foreground uppercase tracking-tighter">Keywords</span>
                 <span className="text-[11px] font-black text-blue-600">{score.keyword_match}%</span>
               </div>
               <div className="h-1 w-24 bg-muted rounded-full overflow-hidden mt-0.5">
                 <div className="h-full bg-blue-500 transition-all duration-1000" style={{ width: `${score.keyword_match}%` }} />
               </div>
             </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {!isExpanded && (
            <div className="hidden lg:flex gap-3">
              {score.missing_keywords.slice(0, 3).map((k, i) => (
                <span key={i} className="text-[9px] font-bold text-destructive bg-destructive/10 px-2 py-0.5 rounded uppercase tracking-tighter border border-destructive/20">Missing: {k}</span>
              ))}
            </div>
          )}
          <button className={cn("p-2 rounded-xl hover:bg-accent transition-all", isExpanded ? 'rotate-180' : '')}>
            <ChevronUp className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>
      </div>

      {/* Expanded Content Body */}
      <div className={cn(
        "px-8 pb-8 flex gap-10 h-[360px] overflow-hidden transition-opacity duration-300",
        isExpanded ? 'opacity-100 delay-200' : 'opacity-0'
      )}>
        {/* Left: Score Visuals */}
        <div className="w-56 flex flex-col items-center shrink-0 pt-4">
          <div className="h-48 w-full relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="80%"
                  startAngle={180}
                  endAngle={0}
                  innerRadius={70}
                  outerRadius={95}
                  paddingAngle={0}
                  dataKey="value"
                  animationDuration={1500}
                >
                  <Cell fill={getScoreColor(score.overall)} />
                  <Cell fill="hsl(var(--muted))" />
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-x-0 bottom-6 text-center">
              <span className="text-5xl font-black text-foreground tracking-tighter">{score.overall}</span>
              <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mt-1">Optimization Yield</p>
            </div>
          </div>
          
          <div className="w-full space-y-4 px-2">
             <div className="flex justify-between items-center bg-muted/50 p-3 rounded-2xl border border-border">
               <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Experience</span>
               <span className="text-sm font-black text-foreground">{score.sectionScores.experience}%</span>
             </div>
             <div className="flex justify-between items-center bg-muted/50 p-3 rounded-2xl border border-border">
               <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Skills Index</span>
               <span className="text-sm font-black text-foreground">{score.sectionScores.skills}%</span>
             </div>
          </div>
        </div>

        {/* Right: Feedback Analysis */}
        <div className="flex-1 flex flex-col gap-6 overflow-hidden pt-4">
          <div className="flex items-center gap-4 border-b border-border pb-4">
             <div className="px-3 py-1 bg-blue-100 text-blue-700 text-[10px] font-black rounded-lg uppercase tracking-widest shadow-sm">AI Diagnosis</div>
             <h4 className="font-black text-foreground text-sm uppercase tracking-tight">Neural Optimization Feedback</h4>
          </div>
          
          <div className="flex-1 overflow-y-auto custom-scrollbar pr-4 space-y-6">
            <div className="p-5 bg-blue-50/30 rounded-[2rem] border border-blue-100/50 shadow-inner">
               <h5 className="text-[10px] font-black text-blue-600 uppercase tracking-widest mb-2 flex items-center gap-2">
                 Strategy Reasoning
               </h5>
               <p className="text-xs text-muted-foreground leading-relaxed font-medium italic">"{reasoning}"</p>
            </div>

            <div className="space-y-4">
              <h5 className="text-[10px] font-black text-emerald-600 uppercase tracking-[0.2em] flex items-center gap-2">
                 Targeted Enhancements
              </h5>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {suggestions.map((s, i) => (
                  <div key={i} className="flex gap-3 p-3 bg-card border border-border rounded-2xl shadow-sm hover:border-emerald-200 transition-colors group">
                    <Check className="w-4 h-4 text-emerald-500 mt-0.5 group-hover:scale-125 transition-transform" />
                    <p className="text-[11px] text-muted-foreground font-bold leading-normal">{s}</p>
                  </div>
                ))}
              </div>
            </div>

            {score.missing_keywords.length > 0 && (
              <div className="space-y-4 pb-4">
                <h5 className="text-[10px] font-black text-destructive uppercase tracking-[0.2em]">Missing Domain Terminology</h5>
                <div className="flex flex-wrap gap-2">
                  {score.missing_keywords.map((k, i) => (
                    <span key={i} className="px-4 py-2 bg-destructive/10 text-destructive border border-destructive/20 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-destructive hover:text-destructive-foreground transition-all shadow-sm">
                      {k}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScorePanel;
