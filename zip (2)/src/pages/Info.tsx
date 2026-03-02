import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../utils/cn';
import { Target, ListTodo, BarChart2, Flag, ArrowRight, BookOpen, FileText, ExternalLink } from 'lucide-react';

type View = 'METHODOLOGY' | 'RESOURCES';

export default function Info() {
  const [activeView, setActiveView] = useState<View>('METHODOLOGY');

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-12">
      
      {/* Header & Toggle */}
      <div className="flex flex-col items-center justify-center space-y-6 pt-4">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">Centre d'Information</h1>
          <p className="text-muted-foreground">Comprendre la démarche et accéder aux ressources.</p>
        </div>

        {/* Sliding Toggle */}
        <div className="bg-gray-100 p-1 rounded-lg flex relative w-64">
          {/* Background Slider */}
          <motion.div 
            className="absolute top-1 bottom-1 bg-white rounded-md shadow-sm z-0"
            initial={false}
            animate={{ 
              left: activeView === 'METHODOLOGY' ? '4px' : '50%', 
              width: 'calc(50% - 4px)',
              x: activeView === 'METHODOLOGY' ? 0 : 0
            }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          />

          <button
            onClick={() => setActiveView('METHODOLOGY')}
            className={cn(
              "flex-1 relative z-10 py-2 text-sm font-medium transition-colors duration-200 text-center",
              activeView === 'METHODOLOGY' ? "text-gray-900" : "text-gray-500 hover:text-gray-700"
            )}
          >
            Méthodologie
          </button>
          <button
            onClick={() => setActiveView('RESOURCES')}
            className={cn(
              "flex-1 relative z-10 py-2 text-sm font-medium transition-colors duration-200 text-center",
              activeView === 'RESOURCES' ? "text-gray-900" : "text-gray-500 hover:text-gray-700"
            )}
          >
            Ressources
          </button>
        </div>
      </div>

      {/* Content Area */}
      <AnimatePresence mode="wait">
        {activeView === 'METHODOLOGY' ? (
          <MethodologyView key="methodology" />
        ) : (
          <ResourcesView key="resources" />
        )}
      </AnimatePresence>
    </div>
  );
}

function MethodologyView() {
  const steps = [
    {
      icon: Flag,
      color: "bg-blue-100 text-blue-600",
      title: "1. Le Diagnostic (T0)",
      description: "Tout commence par un état des lieux. L'année T0 sert de référence pour évaluer votre point de départ sur tous les indicateurs clés.",
      details: ["Saisie des données historiques", "Évaluation de la maturité initiale", "Identification des points forts et faibles"]
    },
    {
      icon: Target,
      color: "bg-emerald-100 text-emerald-600",
      title: "2. La Stratégie (Tf)",
      description: "Définissez où vous voulez aller. Fixez des objectifs ambitieux mais réalistes pour l'année finale (Tf) de votre plan.",
      details: ["Choix des axes prioritaires", "Définition des cibles quantitatives", "Ambition de maturité structurelle"]
    },
    {
      icon: ListTodo,
      color: "bg-amber-100 text-amber-600",
      title: "3. Le Plan d'Action",
      description: "Comment y arriver ? Transformez votre stratégie en actions concrètes, assignées à des responsables avec des échéances claires.",
      details: ["Création de fiches actions", "Attribution des responsabilités", "Planification dans le temps"]
    },
    {
      icon: BarChart2,
      color: "bg-purple-100 text-purple-600",
      title: "4. Le Suivi Annuel",
      description: "Mesurez vos progrès chaque année. Comparez le réalisé par rapport à la trajectoire prévue et ajustez le tir si nécessaire.",
      details: ["Saisie des campagnes annuelles", "Analyse des écarts", "Mise à jour du plan d'action"]
    }
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="space-y-12"
    >
      <div className="relative border-l-2 border-gray-200 ml-6 md:ml-12 space-y-12 py-4">
        {steps.map((step, index) => (
          <motion.div 
            key={index}
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="relative pl-8 md:pl-12"
          >
            {/* Timeline Dot */}
            <div className={cn(
              "absolute -left-[9px] top-0 w-4 h-4 rounded-full border-2 border-white shadow-sm",
              step.color.replace('text-', 'bg-').split(' ')[1] // Hacky way to get solid color
            )} />
            
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="flex items-start gap-4">
                <div className={cn("p-3 rounded-lg shrink-0", step.color)}>
                  <step.icon className="h-6 w-6" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-bold text-gray-900">{step.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{step.description}</p>
                  
                  <ul className="mt-4 space-y-2">
                    {step.details.map((detail, i) => (
                      <li key={i} className="flex items-center text-sm text-gray-500">
                        <ArrowRight className="h-3 w-3 mr-2 text-gray-300" />
                        {detail}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
      
      <div className="bg-gray-50 rounded-xl p-8 text-center space-y-4">
        <h3 className="text-lg font-semibold">Prêt à passer à l'action ?</h3>
        <p className="text-muted-foreground">Maintenant que vous avez compris la méthode, commencez par saisir votre diagnostic T0.</p>
      </div>
    </motion.div>
  );
}

function ResourcesView() {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="grid md:grid-cols-2 gap-6"
    >
      <div className="bg-white p-6 rounded-xl border shadow-sm space-y-4">
        <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center">
          <BookOpen className="h-6 w-6" />
        </div>
        <h3 className="text-lg font-bold">Qu'est-ce que la RSE ?</h3>
        <p className="text-gray-600 text-sm leading-relaxed">
          La Responsabilité Sociétale des Entreprises (RSE) est l'intégration volontaire par les entreprises de préoccupations sociales et environnementales à leurs activités commerciales et leurs relations avec les parties prenantes.
        </p>
        <p className="text-gray-600 text-sm leading-relaxed">
          Une entreprise qui pratique la RSE va donc chercher à avoir un impact positif sur la société tout en étant économiquement viable.
        </p>
      </div>

      <div className="bg-white p-6 rounded-xl border shadow-sm space-y-4">
        <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-lg flex items-center justify-center">
          <FileText className="h-6 w-6" />
        </div>
        <h3 className="text-lg font-bold">Les 7 piliers (ISO 26000)</h3>
        <ul className="space-y-2 text-sm text-gray-600">
          <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-indigo-400" /> Gouvernance de l'organisation</li>
          <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-indigo-400" /> Droits de l'homme</li>
          <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-indigo-400" /> Relations et conditions de travail</li>
          <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-indigo-400" /> Environnement</li>
          <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-indigo-400" /> Loyauté des pratiques</li>
          <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-indigo-400" /> Questions relatives aux consommateurs</li>
          <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-indigo-400" /> Communautés et développement local</li>
        </ul>
      </div>

      <div className="md:col-span-2 bg-gradient-to-r from-gray-900 to-gray-800 text-white p-8 rounded-xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <h3 className="text-xl font-bold mb-2">Besoin d'aller plus loin ?</h3>
          <p className="text-gray-300 text-sm">Consultez les ressources officielles sur le site du Ministère.</p>
        </div>
        <a 
          href="https://www.economie.gouv.fr/entreprises/responsabilite-societale-entreprises-rse" 
          target="_blank" 
          rel="noopener noreferrer"
          className="px-6 py-3 bg-white text-gray-900 rounded-lg font-medium text-sm hover:bg-gray-100 transition-colors flex items-center gap-2 whitespace-nowrap"
        >
          Site officiel <ExternalLink className="h-4 w-4" />
        </a>
      </div>
    </motion.div>
  );
}
