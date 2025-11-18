import React, { useState, FormEvent } from 'react';

interface SearchBarProps {
  onSearch: (query: string) => void;
  isLoading: boolean;
}

export const SearchBar: React.FC<SearchBarProps> = ({ onSearch, isLoading }) => {
  const [input, setInput] = useState('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      onSearch(input.trim());
    }
  };

  return (
    <div className="w-full max-w-xl mx-auto text-center relative z-10">
      <div className="mb-10">
        <h1 className="text-5xl md:text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-b from-white via-slate-200 to-slate-400 mb-4 tracking-tight">
          Who owns it?
        </h1>
        <p className="text-slate-400 text-lg md:text-xl font-light max-w-md mx-auto leading-relaxed">
          Uncover the hidden owners behind your favorite brands. 
          <span className="block mt-1 text-slate-500 text-base">Private Equity? Corporate Chain? Family Business?</span>
        </p>
      </div>

      <form onSubmit={handleSubmit} className="relative w-full max-w-lg mx-auto group">
        <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl blur opacity-30 group-hover:opacity-60 transition duration-500"></div>
        <div className="relative flex items-center bg-slate-900 rounded-2xl border border-slate-700/50 shadow-2xl overflow-hidden">
          <div className="pl-5 text-slate-500">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Search company (e.g. Panera, Lego)..."
            className="w-full p-5 bg-transparent text-white placeholder-slate-500 focus:outline-none text-lg"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="mr-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-medium transition-all disabled:opacity-0 disabled:translate-x-4"
          >
            {isLoading ? '...' : 'Search'}
          </button>
        </div>
      </form>

      {/* Quick suggestions */}
      {!isLoading && (
        <div className="mt-8 flex flex-wrap justify-center gap-2">
          {['Dunkin\'', 'Rolex', 'Red Lobster', 'Trader Joe\'s'].map((item) => (
            <button
              key={item}
              onClick={() => {
                setInput(item);
                onSearch(item);
              }}
              className="px-4 py-2 text-sm text-slate-400 bg-slate-800/40 border border-slate-700/50 rounded-lg hover:bg-slate-800 hover:text-white hover:border-slate-600 transition-all hover:-translate-y-0.5"
            >
              {item}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};