import { type RegistryItem } from '../types';

interface Registry {
  TEMPLATES: RegistryItem[];
  UI: RegistryItem[];
  SERVICES: RegistryItem[];
  DATASTORE: RegistryItem[];
}

export const TEMPLATE_REGISTRY: Registry = {
  TEMPLATES: [
    { id: "REACT", name: "React + Vite", description: "Modern frontend SPA. Ideal for complex, interactive user interfaces.", domainAffinity: 'Alpha' },
    { id: "VUE", name: "Vue.js", description: "A progressive, approachable frontend framework.", domainAffinity: 'Alpha' },
    { id: "TYPESCRIPT", name: "TypeScript App", description: "A basic TypeScript project for type-safe applications.", domainAffinity: 'Both' },
    { id: "VANILLA", name: "Vanilla JS", description: "A simple, framework-less setup for lightweight projects.", domainAffinity: 'Both' },
  ],
  UI: [
    { id: "SHADCN", name: "shadcn/ui", description: "Beautifully designed, accessible UI components.", domainAffinity: 'Alpha' },
    { id: "TAILWIND", name: "Tailwind CSS", description: "A utility-first CSS framework for rapid UI development.", domainAffinity: 'Alpha' },
  ],
  SERVICES: [
    { id: "NODE_EXPRESS", name: "Node.js Express API", description: "Build a scalable backend service for handling business logic and data.", domainAffinity: 'Bravo' },
  ],
  DATASTORE: [
    { id: "IndexedDB", name: "IndexedDB", description: "Browser-based key-value store for client-side data persistence.", domainAffinity: 'Both' },
    { id: "JSONStore", name: "JSON Store", description: "Simple file-based JSON storage for non-relational data.", domainAffinity: 'Bravo' },
  ],
};