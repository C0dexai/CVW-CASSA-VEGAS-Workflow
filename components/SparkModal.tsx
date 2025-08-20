import React, { useState, useEffect, useRef } from 'react';
import { type Spark, type Stage, type ChatMessage, type Agent, type Suggestion, type BuildConfig, type BuildStep } from '../types';
import { streamChatResponse } from '../services/geminiService';
import CloseIcon from './icons/CloseIcon';
import LyraIcon from './icons/LyraIcon';
import UserIcon from './icons/UserIcon';
import SendIcon from './icons/SendIcon';
import WandIcon from './icons/WandIcon';
import MetaIcon from './icons/MetaIcon';
import HandoffIcon from './icons/HandoffIcon';
import BuildIcon from './icons/BuildIcon';
import ConsoleIcon from './icons/ConsoleIcon';
import { DOMAINS } from '../constants';
import ChatMessageDisplay from './ChatMessageDisplay';
import BuildTab from './BuildTab';
import { TEMPLATE_REGISTRY } from '../data/registry';


type AllStages = { alpha: Stage[], bravo: Stage[] };

interface SparkModalProps {
  isOpen: boolean;
  onClose: () => void;
  spark: Spark;
  stage: Stage;
  onSave: (spark: Spark) => void;
  onHandoff: (spark: Spark, targetDomainId: 'alpha' | 'bravo', targetStageId: string, handoffNote: string, agentName: string) => void;
  activeAgent: Agent;
  allStages: AllStages;
  allAgents: Agent[];
}

const formatBuildDetails = (details: Record<string, string | string[]>): string => {
    return Object.entries(details)
        .map(([key, value]) => {
            const formattedKey = key.replace(/([A-Z])/g, ' $1').replace(/_/g, ' ').replace(/^./, str => str.toUpperCase());
            const formattedValue = Array.isArray(value) ? `[${value.join(', ')}]` : `"${value}"`;
            return `  - **${formattedKey}:** ${formattedValue}`;
        })
        .join('\n');
};


const SparkModal: React.FC<SparkModalProps> = ({ isOpen, onClose, spark, stage, onSave, onHandoff, activeAgent, allStages, allAgents }) => {
  const [currentSpark, setCurrentSpark] = useState<Spark>(spark);
  const [currentMessage, setCurrentMessage] = useState('');
  const [isConsulting, setIsConsulting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'console' | 'orchestration'>('console');
  
  // Handoff state
  const [isHandoffVisible, setIsHandoffVisible] = useState(false);
  const [targetDomainId, setTargetDomainId] = useState<'alpha' | 'bravo'>(spark.currentDomainId === 'alpha' ? 'bravo' : 'alpha');
  const [targetStageId, setTargetStageId] = useState('');
  const [targetAgentName, setTargetAgentName] = useState('');
  const [handoffNote, setHandoffNote] = useState('');

  const chatEndRef = useRef<HTMLDivElement>(null);
  const AgentIcon = activeAgent.name === 'Lyra' ? LyraIcon : UserIcon;

  useEffect(() => {
    setCurrentSpark(spark);
    setError(null);
    setIsConsulting(false);
    setIsHandoffVisible(false);
    setTargetDomainId(spark.currentDomainId === 'alpha' ? 'bravo' : 'alpha');
    // If spark has a title and config, but no history, start on orchestration tab
    setActiveTab(spark.title && spark.status === 'unconfigured' && spark.history.length === 0 ? 'orchestration' : 'console');
  }, [spark]);
  
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [currentSpark.history, isConsulting]);

  useEffect(() => {
    const firstStage = allStages[targetDomainId]?.[0];
    if (firstStage) setTargetStageId(firstStage.id);
    const firstAgent = allAgents.find(a => a.domain.toLowerCase() === targetDomainId);
    if (firstAgent) setTargetAgentName(firstAgent.name);
  }, [targetDomainId, allStages, allAgents]);

  const handleSendMessage = async (messageText: string, isSuggestion: boolean = false) => {
    setError(null);
    setIsConsulting(true);
    setCurrentMessage('');

    let newHistory: ChatMessage[] = [...currentSpark.history];
    if (isSuggestion) {
      newHistory.push({ role: 'user', content: `*Selected action: ${messageText}*` });
    } else {
       newHistory.push({ role: 'user', content: messageText });
    }
    
    // Remove suggestions from previous messages
    newHistory = newHistory.map(msg => ({...msg, suggestions: []}));

    newHistory.push({ role: 'model', content: '' });
    setCurrentSpark(s => ({ ...s, history: newHistory }));
    
    try {
      await streamChatResponse(
        currentSpark.history,
        messageText,
        activeAgent.personality_prompt,
        (chunk) => {
          setCurrentSpark(prev => {
            const updatedHistory = [...prev.history];
            const lastMessage = updatedHistory[updatedHistory.length - 1];
            if (lastMessage?.role === 'model') {
              lastMessage.content += chunk;
            }
            return { ...prev, history: updatedHistory };
          });
        }
      );
    } catch (e) {
      const err = e as Error;
      setError(err.message.replace('AI', activeAgent.name));
      setCurrentSpark(s => ({ ...s, history: currentSpark.history }));
    } finally {
      setIsConsulting(false);
    }
  };

  const handleSuggestionClick = (suggestion: Suggestion) => {
    handleSendMessage(suggestion.prompt, true);
  };

  const handleFollowUpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentMessage.trim() || isConsulting) return;
    handleSendMessage(currentMessage);
  };
  
  const handleSave = () => {
    if (!currentSpark.title.trim()) {
      setError("Title cannot be empty.");
      return;
    }
    onSave(currentSpark);
  };
  
  const handleBuildConfigChange = (newConfig: BuildConfig) => {
      setCurrentSpark(prev => ({
          ...prev,
          buildConfig: newConfig,
          status: prev.status === 'unconfigured' ? 'configured' : prev.status
      }));
  };

  const findAgentForTask = (taskDomain: 'Alpha' | 'Bravo' | 'Both'): Agent => {
      const suitableAgents = allAgents.filter(agent => {
          if (taskDomain === 'Both') return agent.domain === 'Both' || agent.domain === 'Alpha' || agent.domain === 'Bravo';
          return agent.domain === taskDomain;
      });
      if (suitableAgents.length === 0) return activeAgent; // Fallback
      return suitableAgents[Math.floor(Math.random() * suitableAgents.length)];
  };

  const runBuildProcess = async () => {
    const buildConfig = currentSpark.buildConfig;
    const coordinator = allAgents.find(a => a.name === 'Maestro') || activeAgent;
    
    const initialMessage = `**Orchestration Initiated by ${coordinator.name}**\n*The crew is assembling the container for "${currentSpark.title}".*`;
    setCurrentSpark(prev => ({
        ...prev,
        status: 'building',
        buildHistory: [], // Reset history for new build
        history: [...prev.history, { role: 'system', content: initialMessage }]
    }));
    setActiveTab('console');

    const dynamicSteps: { action: string; details: Record<string, string | string[]>; domain: 'Alpha' | 'Bravo' | 'Both' }[] = [];

    dynamicSteps.push({ action: 'create-container', details: { status: 'Container initialized' }, domain: 'Both' });
    dynamicSteps.push({ action: 'command', details: { command: 'npm install' }, domain: 'Both' });

    if (buildConfig.template) {
        const templateDetails = TEMPLATE_REGISTRY.TEMPLATES.find(t => t.id === buildConfig.template);
        dynamicSteps.push({ action: 'assemble-frontend', details: { template: templateDetails?.name || buildConfig.template }, domain: 'Alpha' });
    }
    if (buildConfig.ui.length > 0) {
        const uiDetails = TEMPLATE_REGISTRY.UI.filter(u => buildConfig.ui.includes(u.id));
        dynamicSteps.push({ action: 'ui-update', details: { componentsAdded: uiDetails.map(u => u.name) }, domain: 'Alpha' });
    }
    if (buildConfig.service) {
         const serviceDetails = TEMPLATE_REGISTRY.SERVICES.find(s => s.id === buildConfig.service);
        dynamicSteps.push({ action: 'service-setup', details: { service: serviceDetails?.name || buildConfig.service }, domain: 'Bravo' });
    }
    if (buildConfig.datastore) {
        const dsDetails = TEMPLATE_REGISTRY.DATASTORE.find(d => d.id === buildConfig.datastore);
        dynamicSteps.push({ action: 'datastore-integration', details: { datastore: dsDetails?.name || buildConfig.datastore }, domain: 'Bravo' });
    }

    if (buildConfig.env && (buildConfig.env.API_NAME || buildConfig.env.API_KEY)) {
        const envDetails: Record<string, string> = {};
        if (buildConfig.env.API_NAME) envDetails.API_NAME = buildConfig.env.API_NAME;
        if (buildConfig.env.API_KEY) envDetails.API_KEY_STATUS = 'Set and secured';
        dynamicSteps.push({ action: 'configure-environment', details: envDetails, domain: 'Bravo' });
    }

    dynamicSteps.push({ action: 'command', details: { command: 'npm run build' }, domain: 'Both' });
    dynamicSteps.push({ action: 'finalize-handover', details: { status: 'Deployment to local environment complete' }, domain: 'Both' });

    for (const step of dynamicSteps) {
        const assignedAgent = findAgentForTask(step.domain);
        await new Promise(res => setTimeout(res, 800 + Math.random() * 500)); // Simulate work with slight variance
        
        const newBuildStep: BuildStep = {
            id: `step-${Date.now()}`,
            action: step.action,
            details: step.details,
            status: 'success',
            timestamp: new Date().toISOString(),
            by: assignedAgent.name,
        };

        const detailsString = formatBuildDetails(step.details);
        const systemMessageContent = `**Action:** \`${step.action}\`\n**By:** *${assignedAgent.name} (${assignedAgent.domain})*\n**Details:**\n${detailsString}`;
        
        setCurrentSpark(prev => ({
            ...prev,
            buildHistory: [...prev.buildHistory, newBuildStep],
            history: [...prev.history, { role: 'system', content: systemMessageContent }]
        }));
    }
    
    await new Promise(res => setTimeout(res, 500));
    
    const suggestions: Suggestion[] = [];
    if (buildConfig.ui.length > 0) {
        suggestions.push({ text: "Refine Component UI/UX", prompt: "Let's refine the UI/UX of the main components." });
    }
     if (buildConfig.service) {
        suggestions.push({ text: "Add API Endpoint", prompt: `What's the first API endpoint we should build for the ${buildConfig.service} service?` });
    }
    suggestions.push({ text: "Deploy to Production", prompt: "What are the steps to deploy this to a production environment?" });

    const finalMessage: ChatMessage = {
        role: 'model',
        content: `Build complete. The container for **${currentSpark.title}** was successfully orchestrated by the crew and is now running. What's our next move?`,
        suggestions: suggestions
    };

    setCurrentSpark(prev => ({...prev, status: 'built', history: [...prev.history, finalMessage]}));
  };

  const executeHandoff = () => {
      if(!targetStageId || !handoffNote.trim() || !targetAgentName) {
          setError("Please select a target stage, agent, and provide a handoff note.");
          return;
      }
      onHandoff(currentSpark, targetDomainId, targetStageId, handoffNote, activeAgent.name);
  }
  
  if (!isOpen) return null;
  
  const tabClasses = (tabName: 'console' | 'orchestration') =>
      `flex items-center gap-2 px-4 py-2 rounded-t-lg text-sm font-semibold transition-colors duration-200 ${
        activeTab === tabName
          ? 'text-red-400 bg-slate-900'
          : 'text-slate-400 hover:text-red-400 hover:bg-slate-800/60'
      }`;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex justify-center items-center z-50 p-4" onClick={onClose}>
      <div className="bg-slate-800 border border-slate-700 rounded-xl shadow-2xl w-full max-w-4xl h-[90vh] flex flex-col" onClick={e => e.stopPropagation()}>
        <div className="flex justify-between items-center p-4 border-b border-slate-700 flex-shrink-0">
          <div className="flex items-center gap-4">
            <span className={`w-4 h-4 rounded-full ${stage.color.replace('border-t-4', '').replace('border-', 'bg-')}`}></span>
            <input id="spark-title" type="text" value={currentSpark.title} onChange={(e) => setCurrentSpark(s => ({...s, title: e.target.value}))} placeholder="e.g., Implement User Authentication..." className="text-xl font-bold text-slate-100 bg-transparent focus:outline-none focus:border-b border-slate-600 w-full max-w-md" disabled={isConsulting || currentSpark.status === 'building' || currentSpark.status === 'built'}/>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
            <CloseIcon className="w-6 h-6" />
          </button>
        </div>

        <div className="flex-shrink-0 px-6 pt-4 border-b border-slate-700/80 flex justify-between items-end">
          <div className="flex items-center gap-1">
            <button onClick={() => setActiveTab('console')} className={tabClasses('console')}>
                <ConsoleIcon className="w-5 h-5" />
                Console
            </button>
            <button onClick={() => setActiveTab('orchestration')} className={tabClasses('orchestration')}>
                <BuildIcon className="w-5 h-5" />
                Orchestration
            </button>
          </div>
          <div className="pb-2">
            <button 
              onClick={() => setIsHandoffVisible(v => !v)}
              className="flex items-center gap-2 text-sm text-sky-300 hover:text-sky-200 font-semibold transition-colors"
              disabled={isConsulting || currentSpark.status === 'building'}
            >
              <HandoffIcon className="w-5 h-5"/>
              Handoff Spark
            </button>
          </div>
        </div>
        
        <div className="flex-grow overflow-y-auto">
          {activeTab === 'console' ? (
              <div className="p-6 space-y-4">
                  {currentSpark.history.map((msg, index) => (
                      <ChatMessageDisplay
                          key={index}
                          message={msg}
                          agent={activeAgent}
                          onSuggestionClick={handleSuggestionClick}
                          isProcessing={isConsulting}
                      />
                  ))}
                  {isConsulting && currentSpark.history[currentSpark.history.length - 1]?.role !== 'model' && (
                       <div className="flex items-start gap-3 w-full">
                           <AgentIcon className="w-6 h-6 text-red-400 flex-shrink-0 mt-1" />
                           <div className="flex flex-col">
                               <div className="prose prose-sm prose-invert max-w-none rounded-lg py-2 px-3 bg-slate-700/50">
                                   <div className="flex items-center gap-2">
                                       <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse"></div>
                                       <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse" style={{ animationDelay: '200ms' }}></div>
                                       <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse" style={{ animationDelay: '400ms' }}></div>
                                   </div>
                               </div>
                           </div>
                       </div>
                  )}
                  <div ref={chatEndRef} />
              </div>
          ) : (
            <BuildTab 
              spark={currentSpark}
              onBuildConfigChange={handleBuildConfigChange}
              onStartBuild={runBuildProcess}
              isBuilding={currentSpark.status === 'building'}
              currentDomainId={currentSpark.currentDomainId}
            />
          )}
        </div>

        {isHandoffVisible && (
            <div className="p-4 border-t border-slate-700 bg-slate-900/50 flex-shrink-0 animate-fade-in-slow">
              <h3 className="text-md font-bold text-sky-300 mb-3">Handoff Configuration</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="targetDomain" className="block text-xs font-medium text-slate-400 mb-1">Target Domain</label>
                  <select id="targetDomain" value={targetDomainId} onChange={(e) => setTargetDomainId(e.target.value as 'alpha' | 'bravo')} className="w-full bg-slate-700 text-sm rounded-md border-slate-600 focus:ring-red-500 focus:border-red-500">
                    <option value="alpha">{DOMAINS.alpha.name}</option>
                    <option value="bravo">{DOMAINS.bravo.name}</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="targetStage" className="block text-xs font-medium text-slate-400 mb-1">Target Stage</label>
                  <select id="targetStage" value={targetStageId} onChange={(e) => setTargetStageId(e.target.value)} className="w-full bg-slate-700 text-sm rounded-md border-slate-600 focus:ring-red-500 focus:border-red-500">
                    {allStages[targetDomainId].map(s => <option key={s.id} value={s.id}>{s.title}</option>)}
                  </select>
                </div>
                <div className="md:col-span-2">
                  <label htmlFor="targetAgent" className="block text-xs font-medium text-slate-400 mb-1">Assign To</label>
                  <select id="targetAgent" value={targetAgentName} onChange={(e) => setTargetAgentName(e.target.value)} className="w-full bg-slate-700 text-sm rounded-md border-slate-600 focus:ring-red-500 focus:border-red-500">
                     {allAgents.filter(a => a.domain.toLowerCase() === targetDomainId).map(a => <option key={a.name} value={a.name}>{a.name} ({a.role})</option>)}
                  </select>
                </div>
                <div className="md:col-span-2">
                  <label htmlFor="handoffNote" className="block text-xs font-medium text-slate-400 mb-1">Handoff Note</label>
                  <textarea id="handoffNote" value={handoffNote} onChange={e => setHandoffNote(e.target.value)} rows={2} className="w-full bg-slate-700 text-sm rounded-md border-slate-600 focus:ring-red-500 focus:border-red-500" placeholder="Provide context for the next agent..."></textarea>
                </div>
              </div>
              <div className="flex justify-end mt-3">
                  <button onClick={executeHandoff} className="px-4 py-2 text-sm font-semibold rounded-md text-white bg-sky-600 hover:bg-sky-500 transition-colors">Confirm Handoff</button>
              </div>
            </div>
        )}

        {activeTab === 'console' && (
            <div className="flex-shrink-0 p-4 border-t border-slate-700">
              {error && <p className="text-red-400 text-xs mb-2 text-center">{error}</p>}
              <form onSubmit={handleFollowUpSubmit}>
                <div className="relative">
                  <input
                    type="text"
                    value={currentMessage}
                    onChange={(e) => setCurrentMessage(e.target.value)}
                    placeholder={isConsulting ? `${activeAgent.name} is thinking...` : `Consult with ${activeAgent.name}...`}
                    className="w-full bg-slate-700/80 rounded-full py-2 pl-4 pr-12 text-sm focus:ring-2 focus:ring-red-500 focus:outline-none border border-transparent focus:border-red-600"
                    disabled={isConsulting || isHandoffVisible || currentSpark.status === 'building'}
                  />
                  <button type="submit" disabled={!currentMessage.trim() || isConsulting} className="absolute inset-y-0 right-0 flex items-center justify-center w-10 text-slate-400 hover:text-red-400 disabled:text-slate-600 transition-colors">
                    <SendIcon className="w-5 h-5" />
                  </button>
                </div>
              </form>
            </div>
        )}

        <div className="flex justify-between items-center p-4 border-t border-slate-700 bg-slate-800/50 flex-shrink-0">
          <p className="text-xs text-slate-500">
            Agent: <span className="font-semibold text-slate-300">{activeAgent.name}</span> | Domain: <span className="font-semibold text-slate-300">{DOMAINS[currentSpark.currentDomainId].name}</span>
          </p>
          <div className="flex gap-2">
            <button
              onClick={handleSave}
              className="px-4 py-2 rounded-md text-sm font-semibold text-white bg-red-600 hover:bg-red-500 transition-colors disabled:opacity-50"
              disabled={isConsulting || currentSpark.status === 'building'}
            >
              {currentSpark.history.length > 0 ? 'Save & Close' : 'Save Spark'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SparkModal;