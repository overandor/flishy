
import React from 'react';

export const Header: React.FC = () => {
  return (
    <header className="bg-gray-900/50 backdrop-blur-sm border-b border-gray-700/50">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <svg className="w-8 h-8 text-cyan-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="m3.75 13.5 10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75Z" />
          </svg>
          <h1 className="text-2xl font-bold tracking-wider text-white">
            Flash<span className="text-cyan-400">Force</span> Executor
          </h1>
        </div>
        <button className="px-4 py-2 bg-gray-700 hover:bg-cyan-500 hover:text-gray-900 border border-gray-600 rounded-md font-semibold transition-all duration-200">
          Connect Wallet
        </button>
      </div>
    </header>
  );
};
