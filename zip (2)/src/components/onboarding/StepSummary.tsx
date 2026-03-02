import React from 'react';
import { Button } from '../ui/Button';
import { useOnboardingStore } from '../../store/useOnboardingStore';
import { cn } from '../../utils/cn';
import { Check, ArrowRight, Target, Calendar, Building, Palette } from 'lucide-react';

interface StepSummaryProps {
  onStart: () => void;
  onBack: () => void;
}

export function StepSummary({ onStart, onBack }: StepSummaryProps) {
  const { config } = useOnboardingStore();
  const endYear = (config.startYear || 2025) + (config.duration || 5);

  return (
    <div className="space-y-8">
      <div className="flex flex-col items-center justify-center text-center space-y-4">
        <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center animate-in zoom-in duration-300">
          <Check className="h-8 w-8" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900">Tout est prêt !</h2>
        <p className="text-muted-foreground max-w-xs mx-auto">
          Vérifiez les informations ci-dessous avant de lancer votre projet RSE.
        </p>
      </div>

      <div className="bg-gray-50 rounded-xl border border-gray-200 overflow-hidden divide-y divide-gray-200">
        <div className="p-4 flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-white border flex items-center justify-center shrink-0">
            <Building className="h-5 w-5 text-gray-500" />
          </div>
          <div>
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Entreprise</p>
            <p className="font-semibold text-gray-900">{config.companyName}</p>
          </div>
        </div>

        <div className="p-4 flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-white border flex items-center justify-center shrink-0">
            <Target className="h-5 w-5 text-gray-500" />
          </div>
          <div>
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Projet</p>
            <p className="font-semibold text-gray-900">{config.projectName}</p>
          </div>
        </div>

        <div className="p-4 flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-white border flex items-center justify-center shrink-0">
            <Calendar className="h-5 w-5 text-gray-500" />
          </div>
          <div>
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Période</p>
            <p className="font-semibold text-gray-900">
              {config.startYear} <ArrowRight className="inline h-3 w-3 mx-1 text-gray-400" /> {endYear} ({config.duration} ans)
            </p>
          </div>
        </div>

        <div className="p-4 flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-white border flex items-center justify-center shrink-0">
            <Palette className="h-5 w-5 text-gray-500" />
          </div>
          <div className="flex items-center gap-3">
            <div>
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Thème</p>
              <div className="flex items-center gap-2 mt-1">
                <div className="w-4 h-4 rounded-full" style={{ backgroundColor: config.primaryColor }} />
                <span className="text-sm font-medium text-gray-700">{config.primaryColor}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-between pt-4">
        <Button variant="ghost" onClick={onBack}>Précédent</Button>
        <Button onClick={onStart} size="lg" className="px-8 shadow-lg hover:shadow-xl transition-all">
          Démarrer mon projet <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
