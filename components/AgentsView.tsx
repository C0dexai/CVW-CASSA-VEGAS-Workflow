
import React from 'react';
import { type Agent } from '../types';
import AgentProfileCard from './AgentProfileCard';

interface AgentsViewProps {
  agents: Agent[];
  activeAgentName: string;
  onSelectAgent: (agentName: string) => void;
}

const AgentsView: React.FC<AgentsViewProps> = ({ agents, activeAgentName, onSelectAgent }) => {
  return (
    <div className="animate-fade-in">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-slate-100 sm:text-4xl">Meet the Crew</h2>
        <p className="mt-2 text-slate-400 max-w-2xl mx-auto">
          Select a member of the family to be your active guide. Their unique personality and skills will shape the AI's assistance across the workflow.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {agents.map(agent => (
          <AgentProfileCard
            key={agent.name}
            agent={agent}
            isSelected={activeAgentName === agent.name}
            onSelect={() => onSelectAgent(agent.name)}
          />
        ))}
      </div>
    </div>
  );
};

export default AgentsView;
