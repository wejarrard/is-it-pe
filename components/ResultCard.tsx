import React from 'react';
import { OwnershipResult, OwnershipType } from '@/types/types';

interface ResultCardProps {
  result: OwnershipResult;
  onReset: () => void;
}

export const ResultCard: React.FC<ResultCardProps> = ({ result, onReset }) => {
  const getTheme = (category: OwnershipType) => {
    switch (category) {
      case OwnershipType.PE_OWNED:
        return {
          bg: "bg-red-500/10",
          border: "border-red-500/30", 
          text: "text-red-200",
          icon: "bg-red-500 text-white",
          label: "Private Equity"
        };
      case OwnershipType.PUBLIC_CHAIN:
        return {
          bg: "bg-blue-500/10",
          border: "border-blue-500/30",
          text: "text-blue-200",
          icon: "bg-blue-500 text-white",
          label: "Public / Chain"
        };
      case OwnershipType.FAMILY_PRIVATE:
        return {
          bg: "bg-emerald-500/10",
          border: "border-emerald-500/30",
          text: "text-emerald-200",
          icon: "bg-emerald-500 text-white",
          label: "Family / Private"
        };
      case OwnershipType.GOVERNMENT:
        return {
          bg: "bg-amber-500/10",
          border: "border-amber-500/30",
          text: "text-amber-200",
          icon: "bg-amber-500 text-white",
          label: "Government"
        };
      case OwnershipType.NON_PROFIT:
        return {
          bg: "bg-purple-500/10",
          border: "border-purple-500/30",
          text: "text-purple-200",
          icon: "bg-purple-500 text-white",
          label: "Non-Profit"
        };
      default:
        return {
          bg: "bg-slate-500/10",
          border: "border-slate-500/30",
          text: "text-slate-200",
          icon: "bg-slate-500 text-white",
          label: "Unclear"
        };
    }
  };

  const theme = getTheme(result.category);

  return (
    <div className="w-full max-w-2xl mx-auto animate-fade-in-up">
      <div className={`glass-panel rounded-2xl overflow-hidden border ${theme.border}`}>
        {/* Header Banner */}
        <div className={`px-8 py-6 ${theme.bg} border-b ${theme.border} flex justify-between items-start`}>
          <div>
            <h2 className="text-3xl font-bold text-white tracking-tight mb-2">{result.companyName}</h2>
            <div className="flex items-center gap-2">
              <span className={`inline-flex items-center justify-center px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${theme.icon}`}>
                {theme.label}
              </span>
            </div>
          </div>
          <button 
            onClick={onReset}
            className="p-2 -mr-2 text-slate-400 hover:text-white hover:bg-white/10 rounded-full transition-colors"
            aria-label="Close"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-8">
          <div className="prose prose-invert max-w-none">
            <p className="text-lg text-slate-200 leading-relaxed">
              {result.explanation}
            </p>
          </div>

          {result.sources.length > 0 && (
            <div className="mt-8 pt-6 border-t border-slate-700/50">
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">
                Sources
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {result.sources.map((source, idx) => (
                  <a 
                    key={idx} 
                    href={source.uri}
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-start gap-3 p-3 rounded-lg bg-slate-800/40 hover:bg-slate-800/80 border border-slate-700/50 hover:border-slate-600 transition-all group"
                  >
                    <div className="mt-0.5 min-w-[16px]">
                       <svg className="w-4 h-4 text-slate-600 group-hover:text-blue-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                       </svg>
                    </div>
                    <span className="text-xs text-slate-300 line-clamp-2 font-medium leading-snug group-hover:text-blue-100">
                      {source.title}
                    </span>
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};