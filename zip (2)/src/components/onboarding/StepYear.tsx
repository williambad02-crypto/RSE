import React from 'react';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { useOnboardingStore } from '../../store/useOnboardingStore';
import { startYearSchema } from '../../utils/onboardingSchemas';

interface StepYearProps {
  onNext: () => void;
  onBack: () => void;
}

export function StepYear({ onNext, onBack }: StepYearProps) {
  const { config, setConfig } = useOnboardingStore();
  const [error, setError] = React.useState<string | null>(null);

  const handleNext = () => {
    try {
      startYearSchema.parse(config.startYear);
      onNext();
    } catch (e: any) {
      setError(e.errors[0].message);
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <label className="text-sm font-medium">Année de démarrage (T0)</label>
        <Input 
          type="number"
          value={config.startYear || new Date().getFullYear()} 
          onChange={(e) => {
            setConfig({ startYear: parseInt(e.target.value) });
            setError(null);
          }}
          placeholder="2025"
          autoFocus
          className={error ? 'border-red-500' : ''}
        />
        {error && <p className="text-xs text-red-500">{error}</p>}
        <p className="text-xs text-muted-foreground">
          C'est l'année de référence pour votre diagnostic initial.
        </p>
      </div>
      <div className="flex justify-between pt-4">
        <Button variant="ghost" onClick={onBack}>Précédent</Button>
        <Button onClick={handleNext} disabled={!config.startYear}>Suivant</Button>
      </div>
    </div>
  );
}
