import React from 'react';
import { Button } from '../ui/Button';
import { useOnboardingStore } from '../../store/useOnboardingStore';
import { cn } from '../../utils/cn';
import { Calendar } from 'lucide-react';

interface StepDurationProps {
  onNext: () => void;
  onBack: () => void;
}

export function StepDuration({ onNext, onBack }: StepDurationProps) {
  const { config, setConfig } = useOnboardingStore();

  const handleSelect = (duration: 3 | 5 | 7) => {
    setConfig({ duration });
  };

  const endYear = (config.startYear || new Date().getFullYear()) + (config.duration || 5);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-3 gap-4">
        {[3, 5, 7].map((d) => (
          <button
            key={d}
            onClick={() => handleSelect(d as 3 | 5 | 7)}
            className={cn(
              "flex flex-col items-center justify-center p-6 rounded-lg border transition-all hover:bg-gray-50",
              config.duration === d ? "border-primary bg-primary/10 text-primary ring-2 ring-primary ring-offset-2" : "border-gray-200"
            )}
          >
            <span className="text-2xl font-bold">{d}</span>
            <span className="text-xs uppercase tracking-wider font-medium">Ans</span>
          </button>
        ))}
      </div>

      <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 flex items-start gap-3 text-blue-800">
        <Calendar className="h-5 w-5 mt-0.5 shrink-0" />
        <div className="text-sm">
          <p className="font-semibold">Projection automatique</p>
          <p>
            Votre plan RSE s'étendra de <strong>{config.startYear}</strong> à <strong>{endYear}</strong> (Tf).
          </p>
        </div>
      </div>

      <div className="flex justify-between pt-4">
        <Button variant="ghost" onClick={onBack}>Précédent</Button>
        <Button onClick={onNext} disabled={!config.duration}>Suivant</Button>
      </div>
    </div>
  );
}
