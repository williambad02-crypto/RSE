export type AppVersion = '2.0.0';

export type IndicatorType = 'QUANTITATIVE' | 'STRUCTURAL' | 'ANNUAL';
export type ActionStatus = 'TODO' | 'IN_PROGRESS' | 'DONE' | 'CANCELLED';
export type MaturityLevel = 1 | 2 | 3 | 4 | 5;

// --- Configuration Entities ---

export interface ProjectSettings {
  companyName: string;
  projectName: string;
  projectCode?: string;
  icon: string;
  primaryColor: string;
  startYear: number; // T0
  duration: 3 | 5 | 7;
  endYear: number; // Calculated: startYear + duration
  isConfigured: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Actor {
  id: string;
  firstName: string;
  lastName: string;
  role: string;
  email: string;
  isArchived: boolean;
}

export interface Axis {
  id: string;
  title: string;
  description?: string;
  color: string;
  order: number;
  isArchived: boolean;
}

export interface Objective {
  id: string;
  axisId: string;
  title: string;
  description?: string;
  order: number;
  isArchived: boolean;
}

// --- Indicator Configuration ---

export interface QuantitativeConfig {
  unit: string;
  direction: 'INCREASE' | 'DECREASE' | 'MAINTAIN';
}

export interface StructuralConfig {
  maturityMatrixId?: string; // Future proofing if multiple matrices
}

export interface AnnualConfig {
  // Simple boolean check, no specific config needed for now
}

export interface Indicator {
  id: string;
  objectiveId: string;
  title: string;
  description?: string;
  type: IndicatorType;
  
  // Specific configs based on type
  quantitativeConfig?: QuantitativeConfig;
  structuralConfig?: StructuralConfig;
  annualConfig?: AnnualConfig;

  order: number;
  isArchived: boolean;
}

// --- Data Entries ---

export interface IndicatorTarget {
  indicatorId: string;
  targetValue?: number; // For QUANTITATIVE
  targetMaturityLevel?: MaturityLevel; // For STRUCTURAL
  targetDescription?: string;
}

export interface YearEntry {
  id: string;
  indicatorId: string;
  year: number; // T0, T1... or actual year
  
  // Values
  numericValue?: number; // For QUANTITATIVE
  achieved?: boolean; // For ANNUAL
  maturityLevel?: MaturityLevel; // For STRUCTURAL (T0 only usually, or override)
  
  comment?: string;
  updatedAt: string;
}

// --- Action Plan ---

export interface ActionPlanItem {
  id: string;
  indicatorId: string;
  title: string;
  description?: string;
  responsibleId?: string; // Link to Actor
  status: ActionStatus;
  year: number; // Planned year
  dueDate?: string; // ISO Date YYYY-MM-DD
  completionDate?: string; // ISO Date
  
  // For structural indicators impact
  impactPoints?: number; 
  
  isArchived: boolean;
  createdAt: string;
  updatedAt: string;
}

// --- Maturity Matrix ---

export interface MaturityLevelDefinition {
  level: MaturityLevel;
  label: string;
  description: string;
  pointsRequired: number;
}

// --- Root App State ---

export interface AppData {
  meta: {
    version: AppVersion;
    lastExported?: string;
  };
  settings: ProjectSettings;
  actors: Actor[];
  axes: Axis[];
  objectives: Objective[];
  indicators: Indicator[];
  targets: Record<string, IndicatorTarget>; // Key: indicatorId
  entries: Record<string, YearEntry>; // Key: indicatorId-year
  actions: ActionPlanItem[];
  maturityMatrix: MaturityLevelDefinition[];
}
