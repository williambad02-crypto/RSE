import React from 'react';
import { Button } from '../ui/Button';
import { Upload, Target } from 'lucide-react';

interface StepChoiceProps {
  onNext: () => void;
  onImport: () => void;
}

export function StepChoice({ onNext, onImport }: StepChoiceProps) {
  return (
    <div className="space-y-6 text-center">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
        <Button 
          variant="outline" 
          className="h-32 flex flex-col gap-4 hover:border-primary hover:bg-primary/5 transition-all" 
          onClick={onImport}
        >
          <Upload className="h-8 w-8 text-primary" />
          <span className="font-medium">Importer un projet (JSON)</span>
        </Button>
        <Button 
          variant="outline" 
          className="h-32 flex flex-col gap-4 hover:border-primary hover:bg-primary/5 transition-all" 
          onClick={onNext}
        >
          <Target className="h-8 w-8 text-primary" />
          <span className="font-medium">Créer un nouveau projet</span>
        </Button>
      </div>
    </div>
  );
}
