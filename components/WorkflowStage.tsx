import React from 'react';
import { type Stage, type Spark } from '../types';
import SparkCard from './SparkCard';
import PlusIcon from './icons/PlusIcon';

interface WorkflowStageProps {
  stage: Stage;
  onAddSpark: () => void;
  onSelectSpark: (spark: Spark) => void;
  currentDomainId: 'alpha' | 'bravo';
}

const WorkflowStage: React.FC<WorkflowStageProps> = ({ stage, onAddSpark, onSelectSpark, currentDomainId }) => {
  return (
    <div className={`bg-slate-800/50 rounded-lg p-4 flex flex-col h-full border-t-4 ${stage.color} border border-red-900/40 shadow-[0_0_8px_rgba(255,255,255,0.1)] transition-all duration-300 hover:shadow-[0_0_16px_rgba(255,255,255,0.15)]`}>
      <div className="mb-4">
        <h2 className="text-xl font-bold text-slate-100">{stage.title}</h2>
        <p className="text-sm text-slate-400 mt-1">{stage.description}</p>
      </div>
      <div className="flex-grow space-y-3 overflow-y-auto pr-2 -mr-2">
        {stage.sparks.map((spark) => (
          <SparkCard 
            key={spark.id} 
            spark={spark} 
            onClick={() => onSelectSpark(spark)}
            currentDomainId={currentDomainId}
          />
        ))}
      </div>
      <button
        onClick={onAddSpark}
        className="mt-4 w-full flex items-center justify-center gap-2 text-sm text-red-400 bg-red-900/30 hover:bg-red-900/60 rounded-md p-2 transition-colors duration-200 border border-red-800/50"
      >
        <PlusIcon className="w-4 h-4" />
        Add Spark
      </button>
    </div>
  );
};

export default WorkflowStage;