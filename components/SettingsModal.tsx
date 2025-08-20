import React, { useState, useEffect } from 'react';
import CloseIcon from './icons/CloseIcon';
import LyraIcon from './icons/LyraIcon';
import UserIcon from './icons/UserIcon';
import { type Agent } from '../types';

interface AgentCardProps {
  agent: Agent;
  isSelected: boolean;
  onSelect: () => void;
}

const AgentCard: React.FC<AgentCardProps> = ({ agent, isSelected, onSelect }) => {
  const AgentIcon = agent.name === 'Lyra' ? LyraIcon : UserIcon;
  const ringColor = isSelected ? 'ring-2 ring-red-400 ring-offset-2 ring-offset-slate-800' : '';

  const baseClasses = 'w-full text-left p-4 bg-slate-900/50 rounded-lg border transition-all duration-200 focus:outline-none';
  
  const unselectedClasses = 'border-red-900/40 hover:border-red-400/80 shadow-[0_0_8px_rgba(255,255,255,0.1)] hover:shadow-[0_0_16px_rgba(255,255,255,0.15)]';
  const selectedClasses = 'border-red-400 shadow-[0_0_20px_rgba(255,255,255,0.25)]';

  return (
    <button
      onClick={onSelect}
      className={`${baseClasses} focus-visible:${ringColor} ${isSelected ? selectedClasses : unselectedClasses}`}
    >
      <div className="flex items-center gap-4">
        <AgentIcon className="w-12 h-12 text-red-400 flex-shrink-0" />
        <div>
          <h3 className="font-bold text-lg text-slate-100">{agent.name}</h3>
          <p className="text-sm text-slate-400">{agent.role}</p>
        </div>
      </div>
      <p className="text-xs text-slate-400 mt-3">{agent.personality}</p>
    </button>
  )
}

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeAgentName: string;
  onSelectAgent: (agentName: string) => void;
  agents: Agent[];
}

const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  activeAgentName,
  onSelectAgent,
  agents,
}) => {
  const [selectedAgentName, setSelectedAgentName] = useState(activeAgentName);

  useEffect(() => {
    setSelectedAgentName(activeAgentName);
  }, [activeAgentName, isOpen]);

  const handleSave = () => {
    onSelectAgent(selectedAgentName);
    onClose();
  };
  
  const handleCancel = () => {
    setSelectedAgentName(activeAgentName); // Reset on cancel
    onClose();
  }

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex justify-center items-center z-50 p-4" onClick={handleCancel}>
      <div className="bg-slate-800 border border-slate-700 rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col" onClick={e => e.stopPropagation()}>
        <div className="flex justify-between items-center p-4 border-b border-slate-700">
          <h2 className="text-xl font-bold text-slate-100">Select Your AI Guide</h2>
          <button onClick={handleCancel} className="text-slate-400 hover:text-white transition-colors">
            <CloseIcon className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto">
          <p className="text-sm text-slate-400 mb-6">
            Choose a member of the CASSA VEGAS crew to guide your workflow. Each member has a unique personality and set of skills.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {agents.map(agent => (
              <AgentCard
                key={agent.name}
                agent={agent}
                isSelected={selectedAgentName === agent.name}
                onSelect={() => setSelectedAgentName(agent.name)}
              />
            ))}
          </div>
        </div>

        <div className="p-4 border-t border-slate-700 flex justify-end gap-3 mt-auto">
          <button
            onClick={handleCancel}
            className="px-4 py-2 rounded-md text-slate-300 bg-slate-700 hover:bg-slate-600 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 rounded-md text-white bg-red-600 hover:bg-red-500 transition-colors font-semibold"
          >
            Select Guide
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;