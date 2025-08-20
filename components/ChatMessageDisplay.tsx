import React from 'react';
import { marked } from 'marked';
import { type ChatMessage, type Agent, type Suggestion } from '../types';
import LyraIcon from './icons/LyraIcon';
import UserIcon from './icons/UserIcon';
import MetaIcon from './icons/MetaIcon';

interface ChatMessageDisplayProps {
  message: ChatMessage;
  agent: Agent;
  onSuggestionClick: (suggestion: Suggestion) => void;
  isProcessing: boolean;
}

const ChatMessageDisplay: React.FC<ChatMessageDisplayProps> = ({ message, agent, onSuggestionClick, isProcessing }) => {
  const isModel = message.role === 'model';
  const isMeta = message.role === 'meta';
  const isSystem = message.role === 'system';
  
  const contentHtml = marked.parse(message.content, { async: false }) as string;
  const AgentIcon = agent.name === 'Lyra' ? LyraIcon : UserIcon;

  if (isSystem) {
    return (
      <div className="text-center text-xs text-slate-400/80 my-2 py-2 border-y border-slate-700/50 flex items-center justify-center gap-2">
        <p className="whitespace-pre-wrap" dangerouslySetInnerHTML={{ __html: contentHtml }}></p>
      </div>
    );
  }

  return (
    <div className={`flex items-start gap-3 w-full ${!isModel && !isMeta ? 'ml-auto flex-row-reverse' : ''}`}>
      {(isModel || isMeta) && (
        isMeta 
        ? <MetaIcon className="w-6 h-6 text-yellow-400 flex-shrink-0 mt-1" />
        : <AgentIcon className="w-6 h-6 text-red-400 flex-shrink-0 mt-1" />
      )}
      <div className="flex flex-col max-w-[85%]">
        <div
          className={`prose prose-sm prose-invert max-w-none rounded-lg py-2 px-3 ${
            isModel ? 'bg-slate-700/50' : isMeta ? 'bg-yellow-900/40' : 'bg-red-900/40'
          }`}
          dangerouslySetInnerHTML={{ __html: contentHtml }}
        />
        {message.suggestions && message.suggestions.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-2" role="group" aria-label="AI Suggestions">
            {message.suggestions.map((suggestion, i) => (
              <button
                key={i}
                onClick={() => onSuggestionClick(suggestion)}
                disabled={isProcessing}
                className="px-3 py-1 text-xs font-semibold text-sky-300 bg-sky-900/50 border border-sky-800/70 rounded-full hover:bg-sky-900/80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {suggestion.text}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatMessageDisplay;
