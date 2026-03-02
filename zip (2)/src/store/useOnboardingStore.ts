import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { z } from 'zod';
import { projectConfigSchema } from '../utils/onboardingSchemas';

type ProjectConfig = z.infer<typeof projectConfigSchema>;

export type OnboardingStep = 
  | 'CHOICE' 
  | 'IMPORT' 
  | 'COMPANY' 
  | 'PROJECT' 
  | 'ICON' 
  | 'COLOR' 
  | 'YEAR' 
  | 'DURATION' 
  | 'SUMMARY';

interface OnboardingState {
  step: OnboardingStep;
  config: Partial<ProjectConfig>;
  isImporting: boolean;
  
  // Actions
  setStep: (step: OnboardingStep) => void;
  setConfig: (config: Partial<ProjectConfig>) => void;
  reset: () => void;
  setIsImporting: (isImporting: boolean) => void;
}

const initialState: Omit<OnboardingState, 'setStep' | 'setConfig' | 'reset' | 'setIsImporting'> = {
  step: 'CHOICE',
  config: {
    icon: 'Target',
    primaryColor: '#10b981',
    startYear: new Date().getFullYear(),
    duration: 5,
  },
  isImporting: false,
};

export const useOnboardingStore = create<OnboardingState>()(
  persist(
    (set) => ({
      ...initialState,
      setStep: (step) => set({ step }),
      setConfig: (newConfig) => set((state) => ({ config: { ...state.config, ...newConfig } })),
      reset: () => set(initialState),
      setIsImporting: (isImporting) => set({ isImporting }),
    }),
    {
      name: 'onboarding-temp-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
