"use client";

import React, { useState, useCallback } from 'react';
import { SearchBar } from '@/components/SearchBar';
import { ResultCard } from '@/components/ResultCard';
import { analyzeOwnership } from '@/services/GeminiService';
import { SearchState } from '@/types/types';

export default function App() {
  const [state, setState] = useState<SearchState>({
    isLoading: false,
    result: null,
    error: null,
  });

  const handleSearch = useCallback(async (query: string) => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      const result = await analyzeOwnership(query);
      setState({
        isLoading: false,
        result,
        error: null
      });
    } catch (error: any) {
      setState({
        isLoading: false,
        result: null,
        error: error.message || "Something went wrong. Please try again."
      });
    }
  }, []);

  const handleReset = () => {
    setState({
      isLoading: false,
      result: null,
      error: null
    });
  };

  return (
    <div className="min-h-screen w-full bg-[#0f172a] relative overflow-hidden selection:bg-blue-500/30">
      {/* Background Effects */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-600/20 rounded-full blur-[128px] pointer-events-none"></div>
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-cyan-600/10 rounded-full blur-[128px] pointer-events-none"></div>
      
      {/* Grid Pattern */}
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none"></div>

      <main className="relative container mx-auto px-4 py-12 md:py-24 flex flex-col items-center justify-center min-h-screen">
        
        {!state.result ? (
          <div className={`transition-all duration-500 ${state.isLoading ? 'opacity-50 scale-95 pointer-events-none' : 'opacity-100 scale-100'}`}>
            <SearchBar onSearch={handleSearch} isLoading={state.isLoading} />
          </div>
        ) : (
          <ResultCard result={state.result} onReset={handleReset} />
        )}

        {/* Loading State Indicator (when we have no result yet) */}
        {state.isLoading && !state.result && (
           <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
             <div className="w-16 h-16 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin mb-4"></div>
             <p className="text-blue-200 font-medium animate-pulse">Analyzing corporate structure...</p>
           </div>
        )}

        {/* Error Toast */}
        {state.error && (
          <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 glass-panel px-6 py-4 rounded-xl border-l-4 border-red-500 shadow-2xl animate-fade-in-up flex items-center gap-3">
            <svg className="w-6 h-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-red-200">{state.error}</span>
            <button 
              onClick={handleReset}
              className="ml-4 text-slate-400 hover:text-white"
            >
              Dismiss
            </button>
          </div>
        )}
        
      </main>
      
      <footer className="absolute bottom-4 w-full text-center text-slate-600 text-xs">
        <p>Made by Will Jarrared :D</p>
      </footer>
    </div>
  );
}