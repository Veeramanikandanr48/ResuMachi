import React from 'react';
import { Button } from '@/components/ui/button';
import { Share2, Download, Wand2, Edit2, Home } from 'lucide-react';
import { Input } from '@/components/ui/input';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"

interface EditorHeaderProps {
  resumeName: string;
  setResumeName: (name: string) => void;
  onDownloadPdf: () => void;
  onDownloadLatex: () => void;
  onAiReview: () => void;
  onChangeTemplate: () => void;
}

const EditorHeader: React.FC<EditorHeaderProps> = ({
  resumeName,
  setResumeName,
  onDownloadPdf,
  onDownloadLatex,
  onAiReview,
  onChangeTemplate
}) => {
  return (
    <div className="h-20 border-b border-border bg-background flex items-center justify-between px-8 shrink-0 z-30 shadow-sm">
      <div className="flex flex-col gap-1.5">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/dashboard" className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors">
                <Home className="w-3 h-3" />
                Dashboard
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage className="text-[10px] font-bold uppercase tracking-widest text-primary">Resume Builder</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        
        <div className="flex items-center gap-4">
          <div className="relative group flex items-center gap-2">
            <Input 
              value={resumeName}
              onChange={(e) => setResumeName(e.target.value)}
              className="h-auto p-0 text-xl font-black uppercase tracking-tight border-none shadow-none focus-visible:ring-0 w-[400px] bg-transparent truncate text-foreground placeholder:text-muted-foreground/50"
              placeholder="Untitled Resume"
            />
            <Edit2 className="w-3.5 h-3.5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer hover:text-primary" />
          </div>
          <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50/80 border border-emerald-100 px-2.5 py-1 rounded-full flex items-center gap-1.5 shadow-sm">
            <span className="relative flex h-1.5 w-1.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
            </span>
            Saved just now
          </span>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <Button 
          variant="ghost" 
          onClick={onChangeTemplate}
          className="text-xs font-bold text-muted-foreground hover:text-primary hover:bg-primary/5 transition-all"
        >
          Change Template
        </Button>
        
        <div className="h-8 w-px bg-border/60 mx-2" />

        <Button variant="outline" size="icon" className="rounded-xl w-10 h-10 border-border hover:border-primary/30 hover:bg-primary/5 hover:text-primary transition-all shadow-sm">
          <Share2 className="w-4 h-4" />
        </Button>

        <Button 
          variant="outline" 
          onClick={onAiReview}
          className="rounded-xl h-10 px-4 text-xs font-bold gap-2 border-primary/20 hover:bg-primary/5 hover:text-primary hover:border-primary/50 transition-all shadow-sm"
        >
          <Wand2 className="w-3.5 h-3.5" />
          Submit for AI Review
        </Button>

        <div className="flex gap-1">
          <Button 
            onClick={onDownloadPdf}
            className="rounded-l-xl rounded-r-none h-10 px-4 text-xs font-bold gap-2 bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/30 transition-all border-r border-emerald-700"
          >
            PDF
            <Download className="w-3.5 h-3.5" />
          </Button>
          <Button 
            onClick={onDownloadLatex}
            className="rounded-r-xl rounded-l-none h-10 px-3 text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/30 transition-all"
            title="Download LaTeX Source"
          >
            TeX
          </Button>
        </div>
      </div>
    </div>
  );
};

export default EditorHeader;
