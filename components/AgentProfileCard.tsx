import React from 'react';
import { type Agent } from '../types';
import LyraIcon from './icons/LyraIcon';
import UserIcon from './icons/UserIcon';
import CheckCircleIcon from './icons/CheckCircleIcon';
import { DOMAINS } from '../constants';

interface AgentProfileCardProps {
  agent: Agent;
  isSelected: boolean;
  onSelect: () => void;
}

const AgentProfileCard: React.FC<AgentProfileCardProps> = ({ agent, isSelected, onSelect }) => {
  const AgentIcon = agent.name === 'Lyra' ? LyraIcon : UserIcon;
  const domainBadgeColor = agent.domain === 'Alpha' ? 'bg-red-500/20 text-red-300 border-red-500/30' 
    : agent.domain === 'Bravo' ? 'bg-teal-500/20 text-teal-300 border-teal-500/30'
    : 'bg-slate-500/20 text-slate-300 border-slate-500/30';

  const domainName = agent.domain === 'Both' ? 'Coordinator' : DOMAINS[agent.domain.toLowerCase() as 'alpha' | 'bravo'].name;

  const baseClasses = 'bg-slate-800/60 rounded-xl border transition-all duration-300 flex flex-col';
  const selectedClasses = 'border-red-500 shadow-[0_0_20px_rgba(255,255,255,0.25)]';
  const unselectedClasses = 'border-red-900/40 hover:border-red-500/50 shadow-[0_0_8px_rgba(255,255,255,0.1)] hover:shadow-[0_0_16px_rgba(255,255,255,0.15)]';

  return (
    <div className={`${baseClasses} ${isSelected ? selectedClasses : unselectedClasses}`}>
      <div className="p-5">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-4">
              <AgentIcon className="w-16 h-16 text-red-400 flex-shrink-0" />
              <div>
                <h3 className="text-xl font-bold text-slate-100">{agent.name}</h3>
                <p className="text-sm text-red-300/80 font-semibold">{agent.role}</p>
              </div>
          </div>
          <div className={`text-xs font-bold px-3 py-1 rounded-full border ${domainBadgeColor}`}>
            {domainName}
          </div>
        </div>
        
        <div className="mt-4">
          <p className="text-sm font-semibold text-slate-300">Skills:</p>
          <p className="text-sm text-slate-400 mt-1">{agent.skills.join(', ')}</p>
        </div>

        <div className="mt-4">
          <p className="text-sm font-semibold text-slate-300">Personality Directive:</p>
          <pre className="mt-2 text-xs text-slate-400 bg-slate-900/70 p-3 rounded-md font-mono whitespace-pre-wrap max-h-28 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-600 scrollbar-track-slate-800">
            {agent.personality_prompt}
          </pre>
        </div>
      </div>
      
      <div className="mt-auto p-5 pt-0">
        <button
          onClick={onSelect}
          disabled={isSelected}
          className="w-full flex items-center justify-center gap-2 px-4 py-2 text-sm font-semibold rounded-lg transition-colors duration-200 disabled:cursor-not-allowed
            border border-transparent
            text-white bg-red-600 hover:bg-red-500
            disabled:bg-slate-700 disabled:text-red-400 disabled:border-red-500"
        >
          {isSelected ? (
            <>
              <CheckCircleIcon className="w-5 h-5" />
              Active Guide
            </>
          ) : (
            'Select as Guide'
          )}
        </button>
      </div>
    </div>
  );
};

export default AgentProfileCard;