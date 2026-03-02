import React from 'react';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { useOnboardingStore } from '../../store/useOnboardingStore';
import { projectSchema } from '../../utils/onboardingSchemas';

interface StepProjectProps {
  onNext: () => void;
  onBack: () => void;
}

export function StepProject({ onNext, onBack }: StepProjectProps) {
  const { config, setConfig } = useOnboardingStore();
  const [error, setError] = React.useState<string | null>(null);

  const handleNext = () => {
    try {
      projectSchema.parse(config.projectName);
      onNext();
    } catch (e: any) {
      setError(e.errors[0].message);
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <label className="text-sm font-medium">Nom du projet RSE</label>
        <Input 
          value={config.projectName || ''} 
          onChange={(e) => {
            setConfig({ projectName: e.target.value });
            setError(null);
          }}
          placeholder="Ex: Ambition 2030"
          autoFocus
          className={error ? 'border-red-500' : ''}
        />
        
        <div className="pt-4 space-y-2">
          <label className="text-sm font-medium">Code d'identification (Optionnel)</label>
          <Input 
            value={config.projectCode || ''} 
            onChange={(e) => setConfig({ projectCode: e.target.value })}
            placeholder="Ex: RSE-2025-A"
          />
          <p className="text-xs text-muted-foreground">Utilisé pour référencer votre projet en interne.</p>
        </div>

        {error && <p className="text-xs text-red-500">{error}</p>}
      </div>
      <div className="flex justify-between pt-4">
        <Button variant="ghost" onClick={onBack}>Précédent</Button>
        <Button onClick={handleNext} disabled={!config.projectName}>Suivant</Button>
      </div>
    </div>
  );
}
