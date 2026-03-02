import React from 'react';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { useOnboardingStore } from '../../store/useOnboardingStore';
import { companySchema } from '../../utils/onboardingSchemas';

interface StepCompanyProps {
  onNext: () => void;
  onBack: () => void;
}

export function StepCompany({ onNext, onBack }: StepCompanyProps) {
  const { config, setConfig } = useOnboardingStore();
  const [error, setError] = React.useState<string | null>(null);

  const handleNext = () => {
    try {
      companySchema.parse(config.companyName);
      onNext();
    } catch (e: any) {
      setError(e.errors[0].message);
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <label className="text-sm font-medium">Nom de l'entreprise</label>
        <Input 
          value={config.companyName || ''} 
          onChange={(e) => {
            setConfig({ companyName: e.target.value });
            setError(null);
          }}
          placeholder="Ex: Ma Société SAS"
          autoFocus
          className={error ? 'border-red-500' : ''}
        />
        {error && <p className="text-xs text-red-500">{error}</p>}
      </div>
      <div className="flex justify-between pt-4">
        <Button variant="ghost" onClick={onBack}>Précédent</Button>
        <Button onClick={handleNext} disabled={!config.companyName}>Suivant</Button>
      </div>
    </div>
  );
}
