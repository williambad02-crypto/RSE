import { AppData, ActionStatus, IndicatorType, MaturityLevel } from '../types';

export const MOCK_DATA: AppData = {
  meta: {
    version: '2.0.0',
    lastExported: new Date().toISOString(),
  },
  settings: {
    companyName: 'EcoTech Solutions',
    projectName: 'Vision 2030',
    icon: 'Leaf',
    primaryColor: '#10b981', // Emerald-500
    startYear: 2023,
    duration: 5,
    endYear: 2028,
    isConfigured: true,
    createdAt: '2023-01-01T00:00:00Z',
    updatedAt: '2023-01-01T00:00:00Z',
  },
  actors: [
    { id: 'u1', firstName: 'Alice', lastName: 'Dupont', role: 'Responsable RSE', email: 'alice@ecotech.com', isArchived: false },
    { id: 'u2', firstName: 'Bob', lastName: 'Martin', role: 'Directeur RH', email: 'bob@ecotech.com', isArchived: false },
    { id: 'u3', firstName: 'Charlie', lastName: 'Kone', role: 'Directeur Ops', email: 'charlie@ecotech.com', isArchived: false },
  ],
  axes: [
    { id: 'ax1', title: 'Environnement', description: 'Réduire notre empreinte carbone', color: '#10b981', order: 1, isArchived: false },
    { id: 'ax2', title: 'Social', description: 'Améliorer le bien-être au travail', color: '#3b82f6', order: 2, isArchived: false },
    { id: 'ax3', title: 'Gouvernance', description: 'Assurer une éthique irréprochable', color: '#8b5cf6', order: 3, isArchived: false },
  ],
  objectives: [
    { id: 'obj1', axisId: 'ax1', title: 'Réduire les émissions de CO2', order: 1, isArchived: false },
    { id: 'obj2', axisId: 'ax1', title: 'Optimiser la gestion des déchets', order: 2, isArchived: false },
    { id: 'obj3', axisId: 'ax2', title: 'Diversité et Inclusion', order: 1, isArchived: false },
    { id: 'obj4', axisId: 'ax3', title: 'Transparence financière', order: 1, isArchived: false },
  ],
  indicators: [
    { 
      id: 'ind1', 
      objectiveId: 'obj1', 
      title: 'Émissions Scopes 1 & 2', 
      type: 'QUANTITATIVE', 
      quantitativeConfig: { unit: 'tCO2e', direction: 'DECREASE' },
      order: 1,
      isArchived: false 
    },
    { 
      id: 'ind2', 
      objectiveId: 'obj2', 
      title: 'Taux de recyclage', 
      type: 'QUANTITATIVE', 
      quantitativeConfig: { unit: '%', direction: 'INCREASE' },
      order: 2,
      isArchived: false 
    },
    { 
      id: 'ind3', 
      objectiveId: 'obj3', 
      title: 'Index Égalité F/H', 
      type: 'STRUCTURAL', 
      structuralConfig: { maturityMatrixId: 'default' },
      order: 1,
      isArchived: false 
    },
    { 
      id: 'ind4', 
      objectiveId: 'obj4', 
      title: 'Rapport RSE publié', 
      type: 'ANNUAL', 
      annualConfig: {},
      order: 1,
      isArchived: false 
    },
  ],
  targets: {
    'ind1': { indicatorId: 'ind1', targetValue: 50 }, // Cible: 50 tCO2e
    'ind2': { indicatorId: 'ind2', targetValue: 85 }, // Cible: 85%
    'ind3': { indicatorId: 'ind3', targetMaturityLevel: 5 }, // Cible: Niveau 5
  },
  entries: {
    'ind1-2023': { id: 'e1', indicatorId: 'ind1', year: 2023, numericValue: 120, updatedAt: '2023-12-31' },
    'ind1-2024': { id: 'e2', indicatorId: 'ind1', year: 2024, numericValue: 110, updatedAt: '2024-12-31' },
    'ind2-2023': { id: 'e3', indicatorId: 'ind2', year: 2023, numericValue: 40, updatedAt: '2023-12-31' },
    'ind4-2023': { id: 'e4', indicatorId: 'ind4', year: 2023, achieved: true, updatedAt: '2023-12-31' },
  },
  actions: [
    { id: 'act1', indicatorId: 'ind1', title: 'Installer des panneaux solaires', status: 'IN_PROGRESS', year: 2024, responsibleId: 'u3', isArchived: false, createdAt: '2023-01-01', updatedAt: '2023-01-01' },
    { id: 'act2', indicatorId: 'ind2', title: 'Audit des déchets', status: 'DONE', year: 2023, responsibleId: 'u1', isArchived: false, completionDate: '2023-11-15', createdAt: '2023-01-01', updatedAt: '2023-01-01' },
    { id: 'act3', indicatorId: 'ind3', title: 'Formation management inclusif', status: 'TODO', year: 2024, responsibleId: 'u2', isArchived: false, dueDate: '2024-03-01', createdAt: '2023-01-01', updatedAt: '2023-01-01' },
  ],
  maturityMatrix: [
    { level: 1, label: 'Initial', description: 'Aucune démarche structurée.', pointsRequired: 0 },
    { level: 2, label: 'Engagé', description: 'Premières actions isolées.', pointsRequired: 20 },
    { level: 3, label: 'Confirmé', description: 'Démarche structurée et pilotée.', pointsRequired: 50 },
    { level: 4, label: 'Avancé', description: 'Résultats probants et mesurés.', pointsRequired: 80 },
    { level: 5, label: 'Exemplaire', description: 'Leader inspirant sur le sujet.', pointsRequired: 100 },
  ],
};
