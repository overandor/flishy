
import React, { useState } from 'react';
import type { ActionStep, GeminiAnalysis } from '../types';
import { analyzeStrategy } from '../services/geminiService';

interface ExecutionPanelProps {
  steps: ActionStep[];
}

const LoadingSpinner: React.FC = () => (
    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-cyan-300"></div>
);

export const ExecutionPanel: React.FC<ExecutionPanelProps> = ({ steps }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [analysis, setAnalysis] = useState<GeminiAnalysis | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async () => {
    setIsLoading(true);
    setError(null);
    setAnalysis(null);
    try {
      const result = await analyzeStrategy(steps);
      setAnalysis(result);
    } catch (e: any) {
      setError(e.message || "An unknown error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  const profitColor = analysis && analysis.estimatedProfitUSD >= 0 ? 'text-green-400' : 'text-red-400';

  return (
    <div className="sticky top-8 p-6 bg-gray-800/50 rounded-lg border border-gray-700/50 shadow-2xl space-y-6">
      <h2 className="text-xl font-bold text-cyan-300">Execution & Analysis</h2>
      
      <div>
        <button 
          onClick={handleAnalyze} 
          disabled={steps.length === 0 || isLoading}
          className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-gray-700 hover:bg-cyan-500 hover:text-gray-900 border border-gray-600 rounded-md font-semibold transition-all duration-200 disabled:bg-gray-800 disabled:text-gray-500 disabled:cursor-not-allowed"
        >
          {isLoading ? <LoadingSpinner/> : <svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456Z" /></svg>}
          <span>{isLoading ? "Analyzing..." : "Analyze with AI"}</span>
        </button>
      </div>
      
      {error && <div className="p-3 bg-red-500/20 text-red-300 border border-red-500/30 rounded-md text-sm">{error}</div>}

      {analysis && (
        <div className="space-y-4 animate-fade-in">
            <div className="bg-gray-900/50 p-4 rounded-lg border border-gray-700">
                <p className="text-sm text-gray-400">Estimated Net Profit</p>
                <p className={`text-3xl font-bold font-roboto-mono ${profitColor}`}>
                    {analysis.estimatedProfitUSD.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
                </p>
            </div>
          <div>
            <h3 className="font-semibold mb-2 text-yellow-300">Risks</h3>
            <ul className="list-disc list-inside space-y-1 text-sm text-gray-300">
              {analysis.risks.map((risk, i) => <li key={i}>{risk}</li>)}
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-2 text-green-300">Optimizations</h3>
            <ul className="list-disc list-inside space-y-1 text-sm text-gray-300">
              {analysis.optimizations.map((opt, i) => <li key={i}>{opt}</li>)}
            </ul>
          </div>
        </div>
      )}

      <div className="pt-6 border-t border-gray-700">
        <button 
          disabled={steps.length < 2}
          className="w-full px-4 py-3 bg-cyan-600 hover:bg-cyan-500 rounded-lg text-lg font-bold transition-colors disabled:bg-gray-700 disabled:text-gray-500 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
        >
          <svg className="w-6 h-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="m3.75 13.5 10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75Z" />
          </svg>
          <span>Execute Flash Loan</span>
        </button>
        <p className="text-center text-xs text-gray-500 mt-2">Requires at least a borrow and repay action.</p>
      </div>
    </div>
  );
};
