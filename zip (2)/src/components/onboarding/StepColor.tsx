import React from 'react';
import { Button } from '../ui/Button';
import { useOnboardingStore } from '../../store/useOnboardingStore';
import { cn } from '../../utils/cn';
import { Check } from 'lucide-react';

const COLORS = [
  { id: '#10b981', label: 'Émeraude' }, // Emerald-500
  { id: '#3b82f6', label: 'Bleu' }, // Blue-500
  { id: '#8b5cf6', label: 'Violet' }, // Violet-500
  { id: '#f59e0b', label: 'Ambre' }, // Amber-500
  { id: '#ef4444', label: 'Rouge' }, // Red-500
  { id: '#6366f1', label: 'Indigo' }, // Indigo-500
];

interface StepColorProps {
  onNext: () => void;
  onBack: () => void;
}

export function StepColor({ onNext, onBack }: StepColorProps) {
  const { config, setConfig } = useOnboardingStore();

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-4 justify-center">
        {COLORS.map(({ id, label }) => (
          <button
            key={id}
            onClick={() => setConfig({ primaryColor: id })}
            className={cn(
              "w-12 h-12 rounded-full border-2 transition-all flex items-center justify-center relative group",
              config.primaryColor === id ? "border-black scale-110 shadow-lg" : "border-transparent hover:scale-105"
            )}
            style={{ backgroundColor: id }}
            title={label}
          >
            {config.primaryColor === id && <Check className="text-white h-6 w-6 drop-shadow-md" />}
          </button>
        ))}
      </div>
      
      {/* Preview */}
      <div className="mt-8 p-4 rounded-lg border bg-gray-50 flex items-center gap-4">
        <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold" style={{ backgroundColor: config.primaryColor }}>
          RSE
        </div>
        <div>
          <h4 className="font-semibold text-gray-900" style={{ color: config.primaryColor }}>{config.projectName || 'Nom du projet'}</h4>
          <p className="text-xs text-muted-foreground">{config.companyName || 'Entreprise'}</p>
        </div>
      </div>

      <div className="flex justify-between pt-4">
        <Button variant="ghost" onClick={onBack}>Précédent</Button>
        <Button onClick={onNext} disabled={!config.primaryColor}>Suivant</Button>
      </div>
    </div>
  );
}
