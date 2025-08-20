import { type Stage } from './types';

export const DOMAINS = {
  alpha: {
    id: 'alpha' as const,
    name: 'Alpha Crew',
    className: "bg-[url('https://images.unsplash.com/photo-1637420425895-99DRD84c357f?q=80&w=1920&auto=format&fit=crop')]",
  },
  bravo: {
    id: 'bravo' as const,
    name: 'Bravo Ops',
    className: "bg-[url('https://images.unsplash.com/photo-1597733336794-12d05021d510?q=80&w=1920&auto=format&fit=crop')]",
  }
};

export const ALPHA_WORKFLOW_STAGES: Omit<Stage, 'sparks'>[] = [
  {
    id: 'vision-quest',
    title: '1. Vision Quest',
    description: 'Define the "why." Understand the problem and target audience to establish a guiding north star.',
    color: 'border-red-500',
  },
  {
    id: 'blueprint-synthesis',
    title: '2. Blueprint Synthesis',
    description: 'Design architecture, choose technologies like UI component libraries (e.g. shadcn/ui), and map data flow. Think scalability.',
    color: 'border-blue-500',
  },
  {
    id: 'iterative-creation',
    title: '3. Iterative Creation',
    description: 'Develop UI/UX, test components, and integrate services. Embrace agile principles and continuous feedback.',
    color: 'border-purple-500',
  },
  {
    id: 'stardust-polish',
    title: '4. Stardust Polish',
    description: 'Establish a robust CI/CD pipeline for deployment. Monitor performance, log, and gather metrics.',
    color: 'border-pink-500',
  },
  {
    id: 'evolving-constellations',
    title: '5. Evolving Constellations',
    description: 'Maintain the application, address bugs, and introduce new features based on user feedback and demands.',
    color: 'border-amber-500',
  },
];

export const BRAVO_WORKFLOW_STAGES: Omit<Stage, 'sparks'>[] = [
  {
    id: 'intel-sync',
    title: '1. Intel Sync',
    description: 'Receive and validate cross-domain intelligence. Establish context and objectives for the operation.',
    color: 'border-teal-500',
  },
  {
    id: 'resource-allocation',
    title: '2. Resource Allocation',
    description: 'Assign assets, personnel, and backend services (e.g., Node.js APIs). Define timelines and success metrics.',
    color: 'border-cyan-500',
  },
  {
    id: 'stealth-execution',
    title: '3. Stealth Execution',
    description: 'Carry out the operation, ensuring backend services run with precision. Adapt to real-time challenges.',
    color: 'border-sky-500',
  },
  {
    id: 'exfil-analysis',
    title: '4. Exfil & Analysis',
    description: 'Extract results, analyze impact, and document key findings for the knowledge base.',
    color: 'border-indigo-500',
  },
  {
    id: 'cross-domain-debrief',
    title: '5. Cross-Domain Debrief',
    description: 'Report back to the originating domain. Integrate lessons learned and close the operational loop.',
    color: 'border-green-500',
  },
];