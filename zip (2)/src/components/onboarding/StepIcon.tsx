import React from 'react';
import { Button } from '../ui/Button';
import { useOnboardingStore } from '../../store/useOnboardingStore';
import { Target, Leaf, Globe, Zap, Heart, Shield } from 'lucide-react';
import { cn } from '../../utils/cn';

const ICONS = [
  { id: 'Target', icon: Target, label: 'Cible' },
  { id: 'Leaf', icon: Leaf, label: 'Écologie' },
  { id: 'Globe', icon: Globe, label: 'Monde' },
  { id: 'Zap', icon: Zap, label: 'Énergie' },
  { id: 'Heart', icon: Heart, label: 'Social' },
  { id: 'Shield', icon: Shield, label: 'Gouvernance' },
];

interface StepIconProps {
  onNext: () => void;
  onBack: () => void;
}

export function StepIcon({ onNext, onBack }: StepIconProps) {
  const { config, setConfig } = useOnboardingStore();

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-3 gap-4">
        {ICONS.map(({ id, icon: Icon, label }) => (
          <button
            key={id}
            onClick={() => setConfig({ icon: id })}
            className={cn(
              "flex flex-col items-center justify-center p-4 rounded-lg border transition-all hover:bg-gray-50",
              config.icon === id ? "border-primary bg-primary/10 text-primary ring-2 ring-primary ring-offset-2" : "border-gray-200"
            )}
          >
            <Icon className="h-8 w-8 mb-2" />
            <span className="text-xs font-medium">{label}</span>
          </button>
        ))}
      </div>
      <div className="flex justify-between pt-4">
        <Button variant="ghost" onClick={onBack}>Précédent</Button>
        <Button onClick={onNext} disabled={!config.icon}>Suivant</Button>
      </div>
    </div>
  );
}
