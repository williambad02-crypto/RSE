import { create } from 'zustand';
import { AppData, ProjectSettings, ActionPlanItem, YearEntry, Axis, Objective, Indicator, Actor, MaturityLevelDefinition } from '../types';
import { MOCK_DATA } from '../data/mock';

interface AppState extends AppData {
  // Actions
  reset: () => void;
  updateSettings: (settings: Partial<ProjectSettings>) => void;
  
  // Actors
  addActor: (actor: Actor) => void;
  updateActor: (id: string, updates: Partial<Actor>) => void;
  archiveActor: (id: string) => void;

  // Structure
  addAxis: (axis: Axis) => void;
  updateAxis: (id: string, updates: Partial<Axis>) => void;
  archiveAxis: (id: string) => void;

  addObjective: (objective: Objective) => void;
  updateObjective: (id: string, updates: Partial<Objective>) => void;
  archiveObjective: (id: string) => void;

  addIndicator: (indicator: Indicator) => void;
  updateIndicator: (id: string, updates: Partial<Indicator>) => void;
  archiveIndicator: (id: string) => void;

  // Entries & Targets
  updateTarget: (indicatorId: string, target: any) => void;
  updateEntry: (indicatorId: string, year: number, updates: Partial<YearEntry>) => void;

  // Actions Plan
  addAction: (action: ActionPlanItem) => void;
  updateAction: (id: string, updates: Partial<ActionPlanItem>) => void;
  deleteAction: (id: string) => void;
  archiveAction: (id: string) => void;

  // Maturity
  updateMaturityMatrix: (matrix: MaturityLevelDefinition[]) => void;

  importData: (data: AppData) => void;
  
  // Server Sync
  saveToServer: () => Promise<void>;
}

const initialState: AppData = {
  meta: { version: '2.0.0' },
  settings: {
    companyName: '',
    projectName: '',
    icon: 'Target',
    primaryColor: '#3b82f6',
    startYear: new Date().getFullYear(),
    duration: 5,
    endYear: new Date().getFullYear() + 5,
    isConfigured: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  actors: [],
  axes: [],
  objectives: [],
  indicators: [],
  targets: {},
  entries: {},
  actions: [],
  maturityMatrix: [
    { level: 1, label: 'Initial', description: 'Aucune démarche structurée.', pointsRequired: 0 },
    { level: 2, label: 'Engagé', description: 'Premières actions isolées.', pointsRequired: 20 },
    { level: 3, label: 'Confirmé', description: 'Démarche structurée et pilotée.', pointsRequired: 50 },
    { level: 4, label: 'Avancé', description: 'Résultats probants et mesurés.', pointsRequired: 80 },
    { level: 5, label: 'Exemplaire', description: 'Leader inspirant sur le sujet.', pointsRequired: 100 },
  ],
};

// Helper to save data to server
const syncWithServer = async (state: AppData) => {
  try {
    await fetch('/api/data', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(state),
      credentials: 'include',
    });
  } catch (error) {
    console.error('Failed to sync with server', error);
  }
};

export const useAppStore = create<AppState>((set, get) => ({
  ...initialState,

  reset: () => {
    set(initialState);
    syncWithServer(initialState);
  },

  updateSettings: (newSettings) => {
    set((state) => {
      const newState = {
        ...state,
        settings: { ...state.settings, ...newSettings, updatedAt: new Date().toISOString() },
      };
      syncWithServer(newState);
      return newState;
    });
  },

  // Actors
  addActor: (actor) => set((state) => {
    const newState = { ...state, actors: [...state.actors, actor] };
    syncWithServer(newState);
    return newState;
  }),
  updateActor: (id, updates) => set((state) => {
    const newState = {
      ...state,
      actors: state.actors.map((a) => (a.id === id ? { ...a, ...updates } : a)),
    };
    syncWithServer(newState);
    return newState;
  }),
  archiveActor: (id) => set((state) => {
    const newState = {
      ...state,
      actors: state.actors.map((a) => (a.id === id ? { ...a, isArchived: true } : a)),
    };
    syncWithServer(newState);
    return newState;
  }),

  // Structure
  addAxis: (axis) => set((state) => {
    const newState = { ...state, axes: [...state.axes, axis] };
    syncWithServer(newState);
    return newState;
  }),
  updateAxis: (id, updates) => set((state) => {
    const newState = {
      ...state,
      axes: state.axes.map((a) => (a.id === id ? { ...a, ...updates } : a)),
    };
    syncWithServer(newState);
    return newState;
  }),
  archiveAxis: (id) => set((state) => {
    const newState = {
      ...state,
      axes: state.axes.map((a) => (a.id === id ? { ...a, isArchived: true } : a)),
    };
    syncWithServer(newState);
    return newState;
  }),

  addObjective: (obj) => set((state) => {
    const newState = { ...state, objectives: [...state.objectives, obj] };
    syncWithServer(newState);
    return newState;
  }),
  updateObjective: (id, updates) => set((state) => {
    const newState = {
      ...state,
      objectives: state.objectives.map((o) => (o.id === id ? { ...o, ...updates } : o)),
    };
    syncWithServer(newState);
    return newState;
  }),
  archiveObjective: (id) => set((state) => {
    const newState = {
      ...state,
      objectives: state.objectives.map((o) => (o.id === id ? { ...o, isArchived: true } : o)),
    };
    syncWithServer(newState);
    return newState;
  }),

  addIndicator: (ind) => set((state) => {
    const newState = { ...state, indicators: [...state.indicators, ind] };
    syncWithServer(newState);
    return newState;
  }),
  updateIndicator: (id, updates) => set((state) => {
    const newState = {
      ...state,
      indicators: state.indicators.map((i) => (i.id === id ? { ...i, ...updates } : i)),
    };
    syncWithServer(newState);
    return newState;
  }),
  archiveIndicator: (id) => set((state) => {
    const newState = {
      ...state,
      indicators: state.indicators.map((i) => (i.id === id ? { ...i, isArchived: true } : i)),
    };
    syncWithServer(newState);
    return newState;
  }),

  // Entries
  updateTarget: (indicatorId, target) => set((state) => {
    const newState = {
      ...state,
      targets: { ...state.targets, [indicatorId]: { ...state.targets[indicatorId], ...target, indicatorId } }
    };
    syncWithServer(newState);
    return newState;
  }),

  updateEntry: (indicatorId, year, updates) => set((state) => {
    const key = `${indicatorId}-${year}`;
    const existing = state.entries[key];
    const entry: YearEntry = {
      id: existing?.id || crypto.randomUUID(),
      indicatorId,
      year,
      updatedAt: new Date().toISOString(),
      ...existing,
      ...updates
    };
    const newState = {
      ...state,
      entries: { ...state.entries, [key]: entry },
    };
    syncWithServer(newState);
    return newState;
  }),

  // Actions Plan
  addAction: (action) => set((state) => {
    const newState = { ...state, actions: [...state.actions, action] };
    syncWithServer(newState);
    return newState;
  }),
  updateAction: (id, updates) => set((state) => {
    const newState = {
      ...state,
      actions: state.actions.map((a) => (a.id === id ? { ...a, ...updates, updatedAt: new Date().toISOString() } : a)),
    };
    syncWithServer(newState);
    return newState;
  }),
  deleteAction: (id) => set((state) => {
    const newState = {
      ...state,
      actions: state.actions.filter((a) => a.id !== id),
    };
    syncWithServer(newState);
    return newState;
  }),
  archiveAction: (id) => set((state) => {
    const newState = {
      ...state,
      actions: state.actions.map((a) => (a.id === id ? { ...a, isArchived: true } : a)),
    };
    syncWithServer(newState);
    return newState;
  }),

  updateMaturityMatrix: (matrix) => {
    const newState = { ...get(), maturityMatrix: matrix };
    set({ maturityMatrix: matrix });
    syncWithServer(newState);
  },

  importData: (data) => set(data),

  saveToServer: async () => {
    await syncWithServer(get());
  },
}));

