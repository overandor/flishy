
import React from 'react';
import type { ActionStep } from '../types';
import { ActionCard } from './ActionCard';
import { PlusIcon } from './icons';

interface StrategyBuilderProps {
  steps: ActionStep[];
  onAddStep: () => void;
  onRemoveStep: (id: number) => void;
  onMoveStep: (dragIndex: number, hoverIndex: number) => void;
}

export const StrategyBuilder: React.FC<StrategyBuilderProps> = ({ steps, onAddStep, onRemoveStep, onMoveStep }) => {
  return (
    <div className="p-6 bg-gray-800/50 rounded-lg border border-gray-700/50 shadow-2xl">
      <h2 className="text-xl font-bold mb-4 text-cyan-300">Strategy Sequencer</h2>
      <div className="space-y-4">
        {steps.map((step, index) => (
          <ActionCard 
            key={step.id} 
            step={step} 
            index={index}
            onRemove={() => onRemoveStep(step.id)}
            onMove={onMoveStep}
          />
        ))}
        {steps.length === 0 && (
          <div className="text-center py-10 border-2 border-dashed border-gray-600 rounded-lg">
            <p className="text-gray-400">Your strategy is empty.</p>
            <p className="text-gray-500">Click below to add your first action.</p>
          </div>
        )}
        <button 
          onClick={onAddStep}
          className="w-full flex items-center justify-center space-x-2 py-3 bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 rounded-lg border-2 border-dashed border-cyan-500/30 hover:border-cyan-500/50 transition-all duration-200"
        >
          <PlusIcon className="w-5 h-5" />
          <span>Add Action</span>
        </button>
      </div>
    </div>
  );
};
