import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../store/useAppStore';
import { useOnboardingStore, OnboardingStep } from '../store/useOnboardingStore';
import { OnboardingLayout } from '../components/onboarding/OnboardingLayout';
import { StepChoice } from '../components/onboarding/StepChoice';
import { StepImport } from '../components/onboarding/StepImport';
import { StepCompany } from '../components/onboarding/StepCompany';
import { StepProject } from '../components/onboarding/StepProject';
import { StepIcon } from '../components/onboarding/StepIcon';
import { StepColor } from '../components/onboarding/StepColor';
import { StepYear } from '../components/onboarding/StepYear';
import { StepDuration } from '../components/onboarding/StepDuration';
import { StepSummary } from '../components/onboarding/StepSummary';

const STEPS_ORDER: OnboardingStep[] = [
  'CHOICE', 
  'COMPANY', 
  'PROJECT', 
  'ICON', 
  'COLOR', 
  'YEAR', 
  'DURATION', 
  'SUMMARY'
];

export default function Onboarding() {
  const navigate = useNavigate();
  const { updateSettings, settings } = useAppStore();
  const { step, setStep, config, reset } = useOnboardingStore();

  // Redirect if already configured
  useEffect(() => {
    if (settings.isConfigured) {
      navigate('/dashboard');
    }
  }, [settings.isConfigured, navigate]);

  // Calculate current step index (excluding IMPORT which is a branch)
  const currentStepIndex = STEPS_ORDER.indexOf(step) + 1;
  const totalSteps = STEPS_ORDER.length;

  const handleNext = () => {
    const currentIndex = STEPS_ORDER.indexOf(step);
    if (currentIndex < STEPS_ORDER.length - 1) {
      setStep(STEPS_ORDER[currentIndex + 1]);
    }
  };

  const handleBack = () => {
    const currentIndex = STEPS_ORDER.indexOf(step);
    if (currentIndex > 0) {
      setStep(STEPS_ORDER[currentIndex - 1]);
    }
  };

  const handleStart = () => {
    if (
      config.companyName && 
      config.projectName && 
      config.startYear && 
      config.duration
    ) {
      updateSettings({
        companyName: config.companyName,
        projectName: config.projectName,
        icon: config.icon || 'Target',
        primaryColor: config.primaryColor || '#10b981',
        startYear: config.startYear,
        duration: config.duration as 3 | 5 | 7,
        endYear: config.startYear + config.duration,
        isConfigured: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
      
      // Reset onboarding store
      reset();
      
      // Redirect to dashboard with tour flag
      navigate('/dashboard?tour=true');
    }
  };

  const handleSkip = () => {
    updateSettings({
      companyName: 'Ma Structure RSE',
      projectName: 'Mon Projet RSE',
      icon: 'Target',
      primaryColor: '#10b981',
      startYear: new Date().getFullYear(),
      duration: 5,
      endYear: new Date().getFullYear() + 5,
      isConfigured: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
    reset();
    navigate('/dashboard?tour=true');
  };

  const renderStep = () => {
    switch (step) {
      case 'CHOICE':
        return <StepChoice onNext={handleNext} onImport={() => setStep('IMPORT')} />;
      case 'IMPORT':
        return <StepImport onBack={() => setStep('CHOICE')} />;
      case 'COMPANY':
        return <StepCompany onNext={handleNext} onBack={handleBack} />;
      case 'PROJECT':
        return <StepProject onNext={handleNext} onBack={handleBack} />;
      case 'ICON':
        return <StepIcon onNext={handleNext} onBack={handleBack} />;
      case 'COLOR':
        return <StepColor onNext={handleNext} onBack={handleBack} />;
      case 'YEAR':
        return <StepYear onNext={handleNext} onBack={handleBack} />;
      case 'DURATION':
        return <StepDuration onNext={handleNext} onBack={handleBack} />;
      case 'SUMMARY':
        return <StepSummary onStart={handleStart} onBack={handleBack} />;
      default:
        return null;
    }
  };

  const getStepTitle = () => {
    switch (step) {
      case 'CHOICE': return 'Bienvenue sur RSE Pilot';
      case 'IMPORT': return 'Importer un projet';
      case 'COMPANY': return 'Identité de l\'entreprise';
      case 'PROJECT': return 'Nom du projet';
      case 'ICON': return 'Choisissez une icône';
      case 'COLOR': return 'Couleur principale';
      case 'YEAR': return 'Calendrier';
      case 'DURATION': return 'Durée de la mission';
      case 'SUMMARY': return 'Récapitulatif';
      default: return '';
    }
  };

  const getStepDescription = () => {
    switch (step) {
      case 'CHOICE': return 'Commencez par configurer votre projet ou importez une sauvegarde existante.';
      case 'IMPORT': return 'Sélectionnez un fichier JSON valide.';
      case 'COMPANY': return 'Quel est le nom de votre structure ?';
      case 'PROJECT': return 'Donnez un nom inspirant à votre démarche RSE.';
      case 'ICON': return 'Cette icône représentera votre projet dans l\'application.';
      case 'COLOR': return 'Personnalisez l\'apparence de votre espace de travail.';
      case 'YEAR': return 'Quand commence votre démarche RSE ?';
      case 'DURATION': return 'Sur combien d\'années s\'étend votre plan ?';
      case 'SUMMARY': return 'Vérifiez les informations avant de valider.';
      default: return '';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      {/* Background Pattern */}
      <div className="absolute inset-0 z-0 opacity-5 pointer-events-none" 
           style={{ backgroundImage: 'radial-gradient(#cbd5e1 1px, transparent 1px)', backgroundSize: '24px 24px' }}>
      </div>

      <OnboardingLayout
        step={step === 'IMPORT' ? 1 : currentStepIndex}
        totalSteps={totalSteps}
        title={getStepTitle()}
        description={getStepDescription()}
        onBack={step === 'IMPORT' ? () => setStep('CHOICE') : (step !== 'CHOICE' ? handleBack : undefined)}
        onSkip={step === 'CHOICE' ? handleSkip : undefined}
        canGoBack={step !== 'CHOICE'}
      >
        {renderStep()}
      </OnboardingLayout>
    </div>
  );
}
