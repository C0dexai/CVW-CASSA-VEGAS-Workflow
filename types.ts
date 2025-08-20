export interface ChatMessage {
  role: 'user' | 'model' | 'meta' | 'system';
  content: string;
  suggestions?: Suggestion[];
}

export interface Suggestion {
  text: string;
  prompt: string;
}

export interface RegistryItem {
  id: string;
  name: string;
  description: string;
  domainAffinity: 'Alpha' | 'Bravo' | 'Both';
}

export interface BuildConfig {
  template: string | null;
  ui: string[];
  datastore: string | null;
  service: string | null;
}

export interface BuildStep {
  id: string;
  action: string;
  details: Record<string, string | string[]>;
  status: 'pending' | 'success' | 'error';
  timestamp: string;
  by: string;
}


export interface Spark {
  id: string;
  title: string;
  history: ChatMessage[];
  currentDomainId: 'alpha' | 'bravo';
  origin?: {
    domainId: 'alpha' | 'bravo';
    stageId: string;
    agentName: string;
  }
  buildConfig: BuildConfig;
  buildHistory: BuildStep[];
  status: 'unconfigured' | 'configured' | 'building' | 'built' | 'error';
}

export interface Stage {
  id:string;
  title: string;
  description: string;
  sparks: Spark[];
  color: string;
}

export interface Agent {
  name: string;
  gender: 'Male' | 'Female';
  role: string;
  skills: string[];
  voice_style: string;
  personality: string;
  personality_prompt: string;
  domain: 'Alpha' | 'Bravo' | 'Both';
}