
import React, { useState } from 'react';
import { Header } from './components/Header';
import { StrategyBuilder } from './components/StrategyBuilder';
import { ExecutionPanel } from './components/ExecutionPanel';
import type { ActionStep } from './types';
import { AddActionModal } from './components/AddActionModal';

const App: React.FC = () => {
  const [strategySteps, setStrategySteps] = useState<ActionStep[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const addStep = (step: Omit<ActionStep, 'id'>) => {
    setStrategySteps(prev => [...prev, { ...step, id: Date.now() }]);
    setIsModalOpen(false);
  };

  const removeStep = (id: number) => {
    setStrategySteps(prev => prev.filter(step => step.id !== id));
  };
  
  const moveStep = (dragIndex: number, hoverIndex: number) => {
    const draggedStep = strategySteps[dragIndex];
    const newSteps = [...strategySteps];
    newSteps.splice(dragIndex, 1);
    newSteps.splice(hoverIndex, 0, draggedStep);
    setStrategySteps(newSteps);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 selection:bg-cyan-500 selection:text-gray-900">
      <div 
        className="absolute top-0 left-0 w-full h-full bg-cover bg-center opacity-10" 
        style={{backgroundImage: "url('https://picsum.photos/1920/1080?grayscale&blur=2')"}}
      ></div>
      <div className="relative z-10">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <StrategyBuilder 
                steps={strategySteps} 
                onAddStep={() => setIsModalOpen(true)}
                onRemoveStep={removeStep}
                onMoveStep={moveStep}
              />
            </div>
            <div>
              <ExecutionPanel steps={strategySteps} />
            </div>
          </div>
        </main>
        {isModalOpen && (
          <AddActionModal 
            onClose={() => setIsModalOpen(false)}
            onSave={addStep}
          />
        )}
      </div>
    </div>
  );
};

export default App;
