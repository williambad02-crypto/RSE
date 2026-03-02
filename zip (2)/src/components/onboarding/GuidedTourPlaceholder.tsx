import React from 'react';
import { Button } from '../ui/Button';
import { X } from 'lucide-react';

interface GuidedTourPlaceholderProps {
  onClose: () => void;
}

export function GuidedTourPlaceholder({ onClose }: GuidedTourPlaceholderProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 animate-in fade-in duration-300">
      <div className="relative w-full max-w-md rounded-xl bg-white shadow-2xl p-6 text-center space-y-4 animate-in zoom-in-95 duration-300">
        <button 
          onClick={onClose} 
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X className="h-5 w-5" />
        </button>
        
        <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <span className="text-2xl font-bold">?</span>
        </div>
        
        <h3 className="text-xl font-bold text-gray-900">Visite Guidée (Bientôt disponible)</h3>
        <p className="text-muted-foreground">
          Cette fonctionnalité sera disponible dans la prochaine mise à jour. Elle vous guidera à travers les différentes sections de l'application : Tableau de bord, Saisie, Plan d'action, etc.
        </p>
        
        <div className="pt-4">
          <Button onClick={onClose} className="w-full">
            J'ai compris
          </Button>
        </div>
      </div>
    </div>
  );
}
