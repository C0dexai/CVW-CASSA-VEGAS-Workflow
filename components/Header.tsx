import React from 'react';
import LyraIcon from './icons/LyraIcon';
import SettingsIcon from './icons/SettingsIcon';
import UserIcon from './icons/UserIcon';
import { type Agent } from '../types';
import { DOMAINS } from '../constants';

interface HeaderProps {
  onOpenSettings: () => void;
  activeAgent: Agent;
  view: 'workflow' | 'agents';
  setView: (view: 'workflow' | 'agents') => void;
  activeDomainId: 'alpha' | 'bravo';
  setActiveDomainId: (domainId: 'alpha' | 'bravo') => void;
}

const Header: React.FC<HeaderProps> = ({ onOpenSettings, activeAgent, view, setView, activeDomainId, setActiveDomainId }) => {
  const AgentIcon = activeAgent.name === 'Lyra' ? LyraIcon : UserIcon;

  const navButtonClasses = (buttonView: 'workflow' | 'agents') =>
    `px-4 py-2 rounded-t-lg text-sm font-semibold transition-colors duration-200 ${
      view === buttonView
        ? 'text-red-400 bg-slate-800/60 backdrop-blur-sm'
        : 'text-slate-400 hover:text-red-400 hover:bg-slate-800/30'
    }`;
  
  const domainTabClasses = (domainId: 'alpha' | 'bravo') =>
    `px-5 py-2 rounded-t-lg text-sm font-bold tracking-wider transition-colors duration-300 ${
      activeDomainId === domainId
        ? `bg-slate-800/60 backdrop-blur-sm ${domainId === 'alpha' ? 'text-red-400' : 'text-teal-400'}`
        : 'text-slate-500 hover:text-white'
    }`;


  return (
    <header className="relative border-b border-slate-700/50">
      <div className="text-center p-6 sm:p-8">
        <div className="flex justify-center items-center gap-4 mb-2">
          <AgentIcon className="w-12 h-12 text-red-500" />
          <h1 className="text-4xl sm:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-purple-500">
            CASSA VEGAS
          </h1>
        </div>
        <p className="text-slate-400 max-w-2xl mx-auto font-semibold tracking-wider">
          Family First. Code Second. All In.
        </p>
      </div>
      
      <div className="px-6 sm:px-8 flex justify-between items-end -mb-px">
        <div className="flex items-center gap-1">
            <button onClick={() => setActiveDomainId('alpha')} className={domainTabClasses('alpha')}>
                {DOMAINS.alpha.name}
            </button>
            <button onClick={() => setActiveDomainId('bravo')} className={domainTabClasses('bravo')}>
                {DOMAINS.bravo.name}
            </button>
        </div>
        <nav className="flex items-center gap-1">
          <button onClick={() => setView('workflow')} className={navButtonClasses('workflow')}>
            Workflow
          </button>
          <button onClick={() => setView('agents')} className={navButtonClasses('agents')}>
            Agents
          </button>
        </nav>
      </div>

      <button
        onClick={onOpenSettings}
        className="absolute top-4 right-4 sm:top-6 sm:right-6 p-2 rounded-full text-slate-400 hover:text-red-500 hover:bg-slate-700/50 transition-colors"
        aria-label={`Open ${activeAgent.name}'s settings`}
      >
        <SettingsIcon className="w-6 h-6" />
      </button>
    </header>
  );
};

export default Header;