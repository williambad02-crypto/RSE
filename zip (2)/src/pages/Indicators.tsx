import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '../store/useAppStore';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { ChevronDown, ChevronRight, BarChart2, Info, Target, TrendingUp } from 'lucide-react';
import { cn } from '../utils/cn';

export default function Indicators() {
  const { axes, objectives, indicators, entries, targets, settings } = useAppStore();
  const [expandedObjectives, setExpandedObjectives] = useState<Record<string, boolean>>({});
  const [selectedIndicatorId, setSelectedIndicatorId] = useState<string | null>(null);

  const toggleObjective = (id: string) => {
    setExpandedObjectives(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const selectedIndicator = indicators.find(i => i.id === selectedIndicatorId);
  const years = Array.from({ length: (settings.duration || 5) + 1 }, (_, i) => (settings.startYear || 2025) + i);

  return (
    <div className="flex h-[calc(100vh-8rem)] gap-8">
      {/* Sidebar Navigation */}
      <div className="w-80 shrink-0 overflow-y-auto pr-4 space-y-8 scrollbar-hide">
        <div className="space-y-1">
           <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">Indicateurs</h1>
           <p className="text-slate-500 font-medium text-sm">Navigation par axe stratégique</p>
        </div>

        <div className="space-y-6">
          {axes.filter(a => !a.isArchived).map(axis => (
            <div key={axis.id} className="space-y-3">
              <h3 className="font-black text-[10px] uppercase tracking-[0.2em] flex items-center gap-2 px-2" style={{ color: axis.color }}>
                <div className="w-2 h-2 rounded-full shadow-sm" style={{ backgroundColor: axis.color }} />
                {axis.title}
              </h3>
              <div className="space-y-1.5">
                {objectives.filter(o => o.axisId === axis.id && !o.isArchived).map(obj => (
                  <div key={obj.id} className="space-y-1">
                    <button
                      onClick={() => toggleObjective(obj.id)}
                      className={cn(
                        "flex items-center w-full text-left text-sm font-bold py-2 px-3 rounded-xl transition-all group",
                        expandedObjectives[obj.id] ? "text-slate-900 bg-slate-50 shadow-sm" : "text-slate-500 hover:bg-slate-50 hover:text-slate-700"
                      )}
                    >
                      <div className={cn("transition-transform duration-200", expandedObjectives[obj.id] ? "rotate-90" : "")}>
                        <ChevronRight className="h-4 w-4 mr-2 text-slate-300 group-hover:text-primary" />
                      </div>
                      <span className="truncate">{obj.title}</span>
                    </button>
                    
                    <AnimatePresence>
                      {expandedObjectives[obj.id] && (
                        <motion.div 
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="pl-7 space-y-1 overflow-hidden"
                        >
                          {indicators.filter(i => i.objectiveId === obj.id && !i.isArchived).map(ind => (
                            <button
                              key={ind.id}
                              onClick={() => setSelectedIndicatorId(ind.id)}
                              className={cn(
                                "block w-full text-left text-xs py-2 px-3 rounded-lg transition-all truncate font-bold",
                                selectedIndicatorId === ind.id 
                                  ? "bg-primary text-white shadow-md shadow-primary/20" 
                                  : "text-slate-400 hover:bg-slate-50 hover:text-slate-600"
                              )}
                            >
                              {ind.title}
                            </button>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto pr-2">
        {selectedIndicator ? (
          <motion.div 
            key={selectedIndicator.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8 pb-10"
          >
            <div className="flex justify-between items-start gap-6">
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Badge className="bg-slate-100 text-slate-600 border-slate-200 font-bold px-3 py-1 uppercase tracking-tighter text-[10px]">{selectedIndicator.type}</Badge>
                  {selectedIndicator.type === 'QUANTITATIVE' && (
                    <Badge className="bg-emerald-50 text-emerald-700 border-emerald-100 font-bold px-3 py-1 uppercase tracking-tighter text-[10px]">{selectedIndicator.quantitativeConfig?.unit}</Badge>
                  )}
                </div>
                <h2 className="text-4xl font-black text-slate-900 tracking-tight leading-tight">{selectedIndicator.title}</h2>
                <p className="text-lg text-slate-500 font-medium max-w-2xl leading-relaxed">{selectedIndicator.description || "Aucune description détaillée n'a été fournie pour cet indicateur."}</p>
              </div>
              <Button variant="outline" className="rounded-xl border-slate-200 font-bold h-12 px-6 hover:bg-slate-50 hover:text-primary transition-all">
                <Info className="mr-2 h-5 w-5" /> Détails techniques
              </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Chart Placeholder */}
              <Card className="lg:col-span-2 shadow-lg border-none">
                <CardHeader className="border-b border-slate-50 pb-4">
                  <CardTitle className="text-sm font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-primary" />
                    Évolution temporelle
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-8">
                  <div className="h-80 bg-slate-50/50 rounded-3xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-slate-400 gap-3">
                    <div className="h-12 w-12 rounded-2xl bg-white shadow-sm flex items-center justify-center">
                       <BarChart2 className="h-6 w-6 text-slate-300" />
                    </div>
                    <p className="font-bold uppercase tracking-widest text-[10px]">Visualisation dynamique (Phase 3)</p>
                  </div>
                </CardContent>
              </Card>

              {/* Target Card */}
              <Card className="shadow-lg border-none bg-emerald-600 text-white">
                 <CardHeader>
                    <CardTitle className="text-sm font-black uppercase tracking-widest text-emerald-100/60 flex items-center gap-2">
                      <Target className="h-4 w-4" />
                      Objectif Final
                    </CardTitle>
                 </CardHeader>
                 <CardContent className="flex flex-col items-center justify-center py-10 space-y-4">
                    <div className="text-6xl font-black tracking-tighter">
                       {targets[selectedIndicator.id]?.targetValue || 'N/A'}
                    </div>
                    <div className="text-sm font-bold text-emerald-100 uppercase tracking-widest">
                       {selectedIndicator.quantitativeConfig?.unit || 'Unité'} à horizon {settings.endYear}
                    </div>
                    <div className="w-full h-1 bg-white/20 rounded-full mt-6 overflow-hidden">
                       <motion.div 
                         initial={{ width: 0 }}
                         animate={{ width: '65%' }}
                         className="h-full bg-white shadow-[0_0_15px_rgba(255,255,255,0.5)]"
                       />
                    </div>
                    <p className="text-[10px] font-bold text-emerald-100/60 uppercase tracking-widest">Progression estimée : 65%</p>
                 </CardContent>
              </Card>
            </div>

            {/* History Table */}
            <Card className="shadow-lg border-none overflow-hidden">
              <CardHeader className="border-b border-slate-50 bg-slate-50/30">
                <CardTitle className="text-sm font-black uppercase tracking-widest text-slate-400">Historique des relevés</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-slate-50/50">
                        <th className="h-14 px-8 text-left font-bold text-slate-400 uppercase tracking-widest text-[10px]">Période</th>
                        <th className="h-14 px-8 text-left font-bold text-slate-400 uppercase tracking-widest text-[10px]">Valeur mesurée</th>
                        <th className="h-14 px-8 text-left font-bold text-slate-400 uppercase tracking-widest text-[10px]">Cible annuelle</th>
                        <th className="h-14 px-8 text-left font-bold text-slate-400 uppercase tracking-widest text-[10px]">Statut</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                      {years.map(year => {
                        const entry = entries[`${selectedIndicator.id}-${year}`];
                        const target = targets[selectedIndicator.id];
                        const hasValue = entry !== undefined;
                        
                        let displayValue = '-';
                        if (selectedIndicator.type === 'QUANTITATIVE') displayValue = entry?.numericValue?.toString() ?? '-';
                        if (selectedIndicator.type === 'ANNUAL') displayValue = entry?.achieved ? 'Oui' : 'Non';
                        if (selectedIndicator.type === 'STRUCTURAL') displayValue = entry?.maturityLevel ? `Niveau ${entry.maturityLevel}` : '-';

                        return (
                          <tr key={year} className="hover:bg-slate-50/50 transition-colors group">
                            <td className="px-8 py-5 font-bold text-slate-700">{year}</td>
                            <td className="px-8 py-5 font-black text-slate-900 text-base">{displayValue}</td>
                            <td className="px-8 py-5 text-slate-400 font-bold">
                                {selectedIndicator.type === 'QUANTITATIVE' ? target?.targetValue ?? '-' : '-'}
                            </td>
                            <td className="px-8 py-5">
                              {hasValue ? (
                                <Badge className="bg-emerald-50 text-emerald-700 border-emerald-100 font-bold px-3 py-1">Validé</Badge>
                              ) : (
                                <Badge className="bg-slate-50 text-slate-300 border-slate-100 font-bold px-3 py-1">En attente</Badge>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-center space-y-6">
            <div className="p-10 bg-slate-50 rounded-[40px] shadow-inner border border-slate-100">
              <BarChart2 className="h-20 w-20 text-slate-200" />
            </div>
            <div className="space-y-2">
              <h3 className="text-2xl font-black text-slate-900 tracking-tight">Sélectionnez un indicateur</h3>
              <p className="text-slate-500 font-medium max-w-xs mx-auto">Utilisez le menu latéral pour explorer vos données de performance par axe et objectif.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
