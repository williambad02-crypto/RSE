import React from 'react';
import { cn } from '../../utils/cn';

interface OnboardingLayoutProps {
  children: React.ReactNode;
  step: number;
  totalSteps: number;
  title: string;
  description?: string;
  onBack?: () => void;
  onSkip?: () => void;
  canGoBack?: boolean;
}

export function OnboardingLayout({ 
  children, 
  step, 
  totalSteps, 
  title, 
  description, 
  onBack, 
  onSkip,
  canGoBack 
}: OnboardingLayoutProps) {
  const progress = (step / totalSteps) * 100;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg rounded-xl bg-white shadow-2xl animate-in zoom-in-95 duration-200 overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Progress Bar */}
        <div className="h-1.5 w-full bg-gray-100">
          <div 
            className="h-full bg-primary transition-all duration-500 ease-out" 
            style={{ width: `${progress}%` }} 
          />
        </div>

        {/* Header */}
        <div className="px-6 pt-8 pb-4 text-center">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Étape {step} / {totalSteps}
            </span>
            <div className="flex gap-4">
              {onSkip && (
                <button 
                  onClick={onSkip}
                  className="text-xs font-medium text-gray-400 hover:text-gray-600 underline underline-offset-2"
                >
                  Passer
                </button>
              )}
              {canGoBack && (
                <button 
                  onClick={onBack}
                  className="text-xs font-medium text-gray-500 hover:text-gray-900 underline underline-offset-2"
                >
                  Retour
                </button>
              )}
            </div>
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-gray-900">{title}</h2>
          {description && (
            <p className="mt-2 text-sm text-muted-foreground">{description}</p>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-6 pb-8">
          {children}
        </div>
      </div>
    </div>
  );
}
