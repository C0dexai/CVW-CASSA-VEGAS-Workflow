import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { type Stage, type Spark, type Agent, type ChatMessage } from './types';
import { ALPHA_WORKFLOW_STAGES, BRAVO_WORKFLOW_STAGES, DOMAINS } from './constants';
import { AGENTS } from './data/agents';
import { getStages, saveStages } from './services/db';
import Header from './components/Header';
import WorkflowStage from './components/WorkflowStage';
import SparkModal from './components/SparkModal';
import SettingsModal from './components/SettingsModal';
import AgentsView from './components/AgentsView';
import LandingPage from './components/LandingPage';

type AllStages = { alpha: Stage[], bravo: Stage[] };

const App: React.FC = () => {
  const [isEntered, setIsEntered] = useState(false);
  const [stages, setStages] = useState<AllStages>({ alpha: [], bravo: [] });
  const [isLoading, setIsLoading] = useState(true);

  // State for modals and views
  const [isSparkModalOpen, setIsSparkModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [view, setView] = useState<'workflow' | 'agents'>('workflow');
  const [activeDomainId, setActiveDomainId] = useState<'alpha' | 'bravo'>('alpha');

  // State for active items
  const [activeSpark, setActiveSpark] = useState<Spark | null>(null);
  const [activeStageId, setActiveStageId] = useState<string | null>(null);

  // State for AI configuration
  const [activeAgentName, setActiveAgentName] = useState('Lyra');

  useEffect(() => {
    if (!isEntered) return;
    const loadData = async () => {
      setIsLoading(true);
      try {
        const storedStages = await getStages();
        if (storedStages && storedStages.alpha.length > 0 && storedStages.bravo.length > 0) {
          setStages(storedStages);
        } else {
          const initialStages: AllStages = {
            alpha: ALPHA_WORKFLOW_STAGES.map(s => ({ ...s, sparks: [] })),
            bravo: BRAVO_WORKFLOW_STAGES.map(s => ({ ...s, sparks: [] })),
          };
          setStages(initialStages);
          await saveStages(initialStages);
        }
      } catch (error) {
        console.error('Failed to load or save initial stages, using defaults:', error);
        const initialStages: AllStages = {
            alpha: ALPHA_WORKFLOW_STAGES.map(s => ({ ...s, sparks: [] })),
            bravo: BRAVO_WORKFLOW_STAGES.map(s => ({ ...s, sparks: [] })),
        };
        setStages(initialStages);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, [isEntered]);

  const activeAgent = useMemo(() => {
    return AGENTS.find((agent) => agent.name === activeAgentName) || AGENTS.find((agent) => agent.name === 'Lyra')!;
  }, [activeAgentName]);

  const handleOpenSparkModal = useCallback((stageId: string, spark?: Spark) => {
    setActiveStageId(stageId);
    if (spark) {
      setActiveSpark(spark);
    } else {
      const newSpark: Spark = {
        id: `spark-${Date.now()}`,
        title: '',
        history: [],
        currentDomainId: activeDomainId,
        status: 'unconfigured',
        buildConfig: {
          template: null,
          ui: [],
          datastore: null,
          service: null,
        },
        buildHistory: [],
      };
      setActiveSpark(newSpark);
    }
    setIsSparkModalOpen(true);
  }, [activeDomainId]);

  const handleCloseSparkModal = useCallback(() => {
    setIsSparkModalOpen(false);
    setActiveSpark(null);
    setActiveStageId(null);
  }, []);

  const handleSaveSpark = useCallback((sparkToSave: Spark) => {
    setStages(prevAllStages => {
      const newAllStages = { ...prevAllStages };
      const domainStages = newAllStages[activeDomainId];

      const newDomainStages = domainStages.map(stage => {
        if (stage.id === activeStageId) {
          const sparkExists = stage.sparks.some(s => s.id === sparkToSave.id);
          const updatedSparks = sparkExists
            ? stage.sparks.map(s => s.id === sparkToSave.id ? sparkToSave : s)
            : [...stage.sparks, sparkToSave];
          return { ...stage, sparks: updatedSparks };
        }
        return stage;
      });

      newAllStages[activeDomainId] = newDomainStages;
      saveStages(newAllStages).catch(error => console.error('Failed to save stages:', error));
      return newAllStages;
    });
    handleCloseSparkModal();
  }, [activeDomainId, activeStageId, handleCloseSparkModal]);
  
  const handleHandoffSpark = useCallback((sparkToHandoff: Spark, targetDomainId: 'alpha' | 'bravo', targetStageId: string, handoffNote: string, agentName: string) => {
    setStages(prevAllStages => {
      const newAllStages = { ...prevAllStages };
      const originDomainId = sparkToHandoff.currentDomainId;

      let sparkFound = false;
      // Remove from old stage
      newAllStages[originDomainId] = newAllStages[originDomainId].map(stage => {
        if(stage.sparks.some(s => s.id === sparkToHandoff.id)) {
            sparkFound = true;
            return {...stage, sparks: stage.sparks.filter(s => s.id !== sparkToHandoff.id)};
        }
        return stage;
      });
      
      if (!sparkFound) {
        console.error("Could not find spark to handoff");
        return prevAllStages;
      }

      // Prepare spark for new stage
      const originalStage = prevAllStages[originDomainId].find(s => s.sparks.some(s => s.id === sparkToHandoff.id));

      const handoffMessage: ChatMessage = {
          role: 'system',
          content: `Spark handed off from ${agentName} @ ${originalStage?.title || 'Unknown Stage'} to ${targetDomainId.toUpperCase()} domain.\nReason: ${handoffNote}`
      };

      const handedOffSpark: Spark = {
        ...sparkToHandoff,
        history: [...sparkToHandoff.history, handoffMessage],
        currentDomainId: targetDomainId,
        origin: sparkToHandoff.origin || {
            domainId: originDomainId,
            stageId: originalStage?.id || 'unknown',
            agentName: agentName
        }
      };

      // Add to new stage
      newAllStages[targetDomainId] = newAllStages[targetDomainId].map(stage => {
          if(stage.id === targetStageId) {
              return {...stage, sparks: [...stage.sparks, handedOffSpark]};
          }
          return stage;
      });

      saveStages(newAllStages).catch(error => console.error('Failed to save stages:', error));
      return newAllStages;
    });
    handleCloseSparkModal();
  }, [handleCloseSparkModal]);


  const handleSelectAgent = (agentName: string) => {
    setActiveAgentName(agentName);
  };

  const activeStage = stages[activeDomainId].find((s) => s.id === activeStageId);
  
  if (!isEntered) {
    return <LandingPage onEnter={() => setIsEntered(true)} />;
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-900 text-slate-200 bg-[url('https://images.unsplash.com/photo-1637420425895-99DRD84c357f?q=80&w=1920&auto=format&fit=crop')] bg-cover bg-fixed filter grayscale">
        <div className="min-h-screen w-full bg-slate-900/80 backdrop-blur-sm flex justify-center items-center">
          <div className="text-center">
            <svg className="mx-auto h-12 w-12 text-red-500 animate-spin" xmlns="http://www.w.3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <p className="mt-4 text-lg font-semibold text-slate-300 tracking-wider">Loading Mission Data...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-slate-900 text-slate-200 ${DOMAINS[activeDomainId].className} bg-cover bg-fixed filter grayscale`}>
      <div className="min-h-screen w-full bg-slate-900/80 backdrop-blur-sm">
        <Header
          onOpenSettings={() => setIsSettingsModalOpen(true)}
          activeAgent={activeAgent}
          view={view}
          setView={setView}
          activeDomainId={activeDomainId}
          setActiveDomainId={setActiveDomainId}
        />
        <main className="p-4 sm:p-6 lg:p-8">
          {view === 'workflow' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
              {stages[activeDomainId].map((stage) => (
                <WorkflowStage
                  key={stage.id}
                  stage={stage}
                  onAddSpark={() => handleOpenSparkModal(stage.id)}
                  onSelectSpark={(spark) => handleOpenSparkModal(stage.id, spark)}
                  currentDomainId={activeDomainId}
                />
              ))}
            </div>
          ) : (
            <AgentsView
              agents={AGENTS}
              activeAgentName={activeAgent.name}
              onSelectAgent={handleSelectAgent}
            />
          )}
        </main>

        {isSparkModalOpen && activeSpark && activeStage && (
          <SparkModal
            isOpen={isSparkModalOpen}
            onClose={handleCloseSparkModal}
            spark={activeSpark}
            stage={activeStage}
            onSave={handleSaveSpark}
            onHandoff={handleHandoffSpark}
            activeAgent={activeAgent}
            allStages={stages}
            allAgents={AGENTS}
          />
        )}

        <SettingsModal
          isOpen={isSettingsModalOpen}
          onClose={() => setIsSettingsModalOpen(false)}
          activeAgentName={activeAgent.name}
          onSelectAgent={handleSelectAgent}
          agents={AGENTS}
        />
      </div>
    </div>
  );
};

export default App;