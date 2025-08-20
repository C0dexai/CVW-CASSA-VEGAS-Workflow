import React from 'react';
import { type Spark, type BuildConfig, type RegistryItem } from '../types';
import { TEMPLATE_REGISTRY } from '../data/registry';
import CheckCircleIcon from './icons/CheckCircleIcon';

interface BuildTabProps {
  spark: Spark;
  onBuildConfigChange: (newConfig: BuildConfig) => void;
  onStartBuild: () => void;
  isBuilding: boolean;
  currentDomainId: 'alpha' | 'bravo';
}

const RegistryItemCard: React.FC<{
  item: RegistryItem;
  isSelected: boolean;
  onClick: () => void;
  disabled: boolean;
  currentDomainId: 'alpha' | 'bravo';
}> = ({ item, isSelected, onClick, disabled, currentDomainId }) => {
  const baseClasses = "relative w-full h-full text-left p-3 bg-slate-900/50 rounded-lg border transition-all duration-200 focus:outline-none flex flex-col";
  const ringColor = "focus-visible:ring-2 focus-visible:ring-red-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-800";
  const unselectedClasses = "border-red-900/40 hover:border-red-400/80 shadow-[0_0_4px_rgba(255,255,255,0.05)] hover:shadow-[0_0_10px_rgba(255,255,255,0.1)]";
  const selectedClasses = "border-red-400 shadow-[0_0_15px_rgba(255,255,255,0.2)]";

  const isRecommended = item.domainAffinity.toLowerCase() === currentDomainId || item.domainAffinity === 'Both';
  const affinityBadgeColor = item.domainAffinity === 'Alpha' ? 'bg-red-500/20 text-red-300' 
    : item.domainAffinity === 'Bravo' ? 'bg-teal-500/20 text-teal-300'
    : 'bg-slate-500/20 text-slate-300';

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${ringColor} ${isSelected ? selectedClasses : unselectedClasses} ${!isRecommended && 'opacity-60 hover:opacity-100'} disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:border-red-900/40`}
      title={!isRecommended ? `Recommended for ${item.domainAffinity} domain` : `Recommended for ${currentDomainId} domain`}
    >
      {isSelected && (
        <div className="absolute top-2 right-2 text-red-400">
          <CheckCircleIcon className="w-5 h-5" />
        </div>
      )}
      <div className="flex-grow">
        <h4 className="font-bold text-slate-100 pr-6">{item.name}</h4>
        <p className="text-xs text-slate-400 mt-1">{item.description}</p>
      </div>
      <div className="mt-2 pt-2 border-t border-slate-700/50">
        <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${affinityBadgeColor}`}>
          {item.domainAffinity} Domain
        </span>
      </div>
    </button>
  );
};

const BuildTab: React.FC<BuildTabProps> = ({ spark, onBuildConfigChange, onStartBuild, isBuilding, currentDomainId }) => {
  const { buildConfig, status } = spark;
  const isBuilt = status === 'built' || status === 'building' || status === 'error';

  const handleTemplateSelect = (id: string) => {
    onBuildConfigChange({ ...buildConfig, template: id });
  };

  const handleUiSelect = (id: string) => {
    const newUi = buildConfig.ui.includes(id)
      ? buildConfig.ui.filter(item => item !== id)
      : [...buildConfig.ui, id];
    onBuildConfigChange({ ...buildConfig, ui: newUi });
  };

  const handleDatastoreSelect = (id: string) => {
    onBuildConfigChange({ ...buildConfig, datastore: buildConfig.datastore === id ? null : id });
  };
  
  const handleServiceSelect = (id: string) => {
    onBuildConfigChange({ ...buildConfig, service: buildConfig.service === id ? null : id });
  };

  const handleEnvChange = (key: string, value: string) => {
    onBuildConfigChange({
        ...buildConfig,
        env: {
            ...(buildConfig.env || {}),
            [key]: value,
        }
    });
  };

  const canStartBuild = buildConfig.template && !isBuilding && status !== 'built';

  const renderSection = (title: string, items: RegistryItem[], selection: string | string[] | null, handler: (id: string) => void, selectionType: 'single' | 'multiple') => (
     <div>
        <h3 className="text-lg font-bold text-slate-200 border-b border-slate-700 pb-2 mb-3">{title}</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {items.map(item => {
            const isSelected = selectionType === 'single' ? selection === item.id : Array.isArray(selection) && selection.includes(item.id);
            return <RegistryItemCard key={item.id} item={item} isSelected={isSelected} onClick={() => handler(item.id)} disabled={isBuilt} currentDomainId={currentDomainId} />
          })}
        </div>
      </div>
  );

  return (
    <div className="p-6 space-y-6">
      {renderSection("Base Template", TEMPLATE_REGISTRY.TEMPLATES, buildConfig.template, handleTemplateSelect, 'single')}
      {renderSection("UI & Styling", TEMPLATE_REGISTRY.UI, buildConfig.ui, handleUiSelect, 'multiple')}
      {renderSection("Services", TEMPLATE_REGISTRY.SERVICES, buildConfig.service, handleServiceSelect, 'single')}
      {renderSection("Datastore", TEMPLATE_REGISTRY.DATASTORE, buildConfig.datastore, handleDatastoreSelect, 'single')}

      <div>
        <h3 className="text-lg font-bold text-slate-200 border-b border-slate-700 pb-2 mb-3">Container Environment</h3>
        <p className="text-sm text-slate-400 mb-4">Provide environment variables for the containerized service.</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
                <label htmlFor="api-name" className="block text-xs font-medium text-slate-400 mb-1">API Name</label>
                <input
                    type="text"
                    id="api-name"
                    value={buildConfig.env?.API_NAME || ''}
                    onChange={(e) => handleEnvChange('API_NAME', e.target.value)}
                    placeholder="e.g., GEMINI_API"
                    className="w-full bg-slate-700 text-sm rounded-md border-slate-600 focus:ring-red-500 focus:border-red-500 disabled:opacity-50"
                    disabled={isBuilt}
                />
            </div>
            <div>
                <label htmlFor="api-key" className="block text-xs font-medium text-slate-400 mb-1">API Key</label>
                <input
                    type="password"
                    id="api-key"
                    value={buildConfig.env?.API_KEY || ''}
                    onChange={(e) => handleEnvChange('API_KEY', e.target.value)}
                    placeholder="Enter secret key"
                    className="w-full bg-slate-700 text-sm rounded-md border-slate-600 focus:ring-red-500 focus:border-red-500 disabled:opacity-50"
                    disabled={isBuilt}
                />
            </div>
        </div>
      </div>

      <div className="pt-4 border-t border-slate-700 flex justify-end">
        <button
          onClick={onStartBuild}
          disabled={!canStartBuild}
          className="px-6 py-2 rounded-md text-white bg-red-600 hover:bg-red-500 transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {status === 'building' ? 'Building...' : status === 'built' ? 'Build Complete' : 'Start Build'}
        </button>
      </div>
    </div>
  );
};

export default BuildTab;