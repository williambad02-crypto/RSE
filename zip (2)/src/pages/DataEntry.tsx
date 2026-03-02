import React, { useState } from 'react';
import { useAppStore } from '../store/useAppStore';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { Badge } from '../components/ui/Badge';
import { Modal } from '../components/ui/Modal';
import { cn } from '../utils/cn';
import { ChevronRight, Save, Lock, Plus, Info } from 'lucide-react';
import { Indicator, ActionPlanItem, ActionStatus } from '../types';

type Tab = 'T0' | 'YEARS' | 'TARGET' | 'REALIZED_TF';

export default function DataEntry() {
  const { settings, axes, objectives, indicators, entries, targets, maturityMatrix, updateEntry, updateTarget, addAction, actors } = useAppStore();
  const [activeTab, setActiveTab] = useState<Tab>('YEARS');
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());
  const [isActionModalOpen, setIsActionModalOpen] = useState(false);
  const [selectedIndicatorForAction, setSelectedIndicatorForAction] = useState<string | null>(null);
  
  // Action Form State
  const [newAction, setNewAction] = useState<Partial<ActionPlanItem>>({
    title: '',
    status: 'TODO',
    year: selectedYear,
  });

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: settings.duration || 5 }, (_, i) => (settings.startYear || 2025) + i + 1);
  const visibleYears = years.filter(y => y <= currentYear);

  const handleValueChange = (indicatorId: string, value: string) => {
    const numValue = parseFloat(value);
    if (!isNaN(numValue)) {
      updateEntry(indicatorId, activeTab === 'T0' ? settings.startYear : selectedYear, { numericValue: numValue });
    }
  };

  const handleTargetChange = (indicatorId: string, field: 'targetValue' | 'targetMaturityLevel', value: any) => {
      updateTarget(indicatorId, { [field]: value });
  };

  const openActionModal = (indicatorId: string) => {
    setSelectedIndicatorForAction(indicatorId);
    setNewAction({ ...newAction, indicatorId, year: selectedYear });
    setIsActionModalOpen(true);
  };

  const handleSaveAction = () => {
    if (newAction.title && selectedIndicatorForAction) {
      addAction({
        id: crypto.randomUUID(),
        indicatorId: selectedIndicatorForAction,
        title: newAction.title!,
        status: newAction.status as ActionStatus || 'TODO',
        year: newAction.year || selectedYear,
        responsibleId: newAction.responsibleId,
        isArchived: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
      setIsActionModalOpen(false);
      setNewAction({ title: '', status: 'TODO', year: selectedYear });
    }
  };

  const renderIndicatorInput = (ind: Indicator) => {
    const entryKey = `${ind.id}-${activeTab === 'T0' ? (settings.startYear || 2025) : selectedYear}`;
    const entry = entries[entryKey];
    const target = targets[ind.id];

    // T0 View
    if (activeTab === 'T0') {
      if (ind.type === 'QUANTITATIVE') {
        return (
          <div className="flex items-center gap-2">
            <Input 
              type="number" 
              placeholder="Valeur initiale"
              value={entry?.numericValue ?? ''}
              onChange={(e) => handleValueChange(ind.id, e.target.value)}
            />
            <span className="text-sm text-gray-500 w-12">{ind.quantitativeConfig?.unit}</span>
          </div>
        );
      }
      if (ind.type === 'STRUCTURAL') {
        return (
          <Select 
            value={entry?.maturityLevel ?? ''} 
            onChange={(e) => updateEntry(ind.id, settings.startYear, { maturityLevel: parseInt(e.target.value) as any })}
          >
            <option value="">Sélectionner niveau</option>
            {maturityMatrix.map(m => (
              <option key={m.level} value={m.level}>{m.level} - {m.label}</option>
            ))}
          </Select>
        );
      }
      if (ind.type === 'ANNUAL') {
        return (
          <div className="flex items-center gap-2 h-10">
            <input 
              type="checkbox" 
              className="h-5 w-5 rounded border-gray-300 text-primary focus:ring-primary"
              checked={!!entry?.achieved}
              onChange={(e) => updateEntry(ind.id, settings.startYear, { achieved: e.target.checked })}
            />
            <span className="text-sm text-gray-600">Réalisé en T0</span>
          </div>
        );
      }
    }

    // YEARS View
    if (activeTab === 'YEARS') {
      if (ind.type === 'QUANTITATIVE') {
        return (
          <div className="flex items-center gap-2">
            <Input 
              type="number" 
              placeholder="Valeur annuelle"
              value={entry?.numericValue ?? ''}
              onChange={(e) => handleValueChange(ind.id, e.target.value)}
            />
            <span className="text-sm text-gray-500 w-12">{ind.quantitativeConfig?.unit}</span>
          </div>
        );
      }
      if (ind.type === 'ANNUAL') {
        return (
          <div className="flex items-center gap-2 h-10">
            <input 
              type="checkbox" 
              className="h-5 w-5 rounded border-gray-300 text-primary focus:ring-primary"
              checked={!!entry?.achieved}
              onChange={(e) => updateEntry(ind.id, selectedYear, { achieved: e.target.checked })}
            />
            <span className="text-sm text-gray-600">Réalisé en {selectedYear}</span>
          </div>
        );
      }
      if (ind.type === 'STRUCTURAL') {
        return (
          <div className="h-10 flex items-center justify-between text-sm bg-gray-100 px-3 rounded border border-dashed text-gray-500">
            <span>Piloté par le plan d'action</span>
            <Button variant="ghost" size="sm" className="h-6 text-xs ml-2" onClick={() => openActionModal(ind.id)}>
              <Plus className="h-3 w-3 mr-1" /> Action
            </Button>
          </div>
        );
      }
    }

    // TARGET View
    if (activeTab === 'TARGET') {
      if (ind.type === 'QUANTITATIVE') {
        return (
          <div className="space-y-2">
             <div className="flex items-center gap-2">
              <Input 
                type="number" 
                placeholder="Cible Tf"
                value={target?.targetValue ?? ''}
                onChange={(e) => handleTargetChange(ind.id, 'targetValue', parseFloat(e.target.value))}
              />
              <span className="text-sm text-gray-500 w-12">{ind.quantitativeConfig?.unit}</span>
            </div>
            <div className="text-xs text-gray-500 flex gap-2">
               <span>Sens : {ind.quantitativeConfig?.direction === 'INCREASE' ? 'Augmenter' : 'Diminuer'}</span>
            </div>
          </div>
        );
      }
      if (ind.type === 'STRUCTURAL') {
        return (
          <Select 
            value={target?.targetMaturityLevel ?? ''} 
            onChange={(e) => handleTargetChange(ind.id, 'targetMaturityLevel', parseInt(e.target.value))}
          >
            <option value="">Cible Maturité Tf</option>
            {maturityMatrix.map(m => (
              <option key={m.level} value={m.level}>{m.level} - {m.label}</option>
            ))}
          </Select>
        );
      }
      if (ind.type === 'ANNUAL') {
        return (
           <div className="h-10 flex items-center text-sm text-gray-400 italic px-2">
             Objectif implicite : 100% réalisé
           </div>
        );
      }
    }
    
    // REALIZED_TF View (Placeholder structure)
    if (activeTab === 'REALIZED_TF') {
        return (
            <div className="h-10 flex items-center text-sm text-gray-400 italic bg-gray-50 px-3 rounded border">
                Saisie finale (à venir)
            </div>
        )
    }

    return null;
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Saisie des données</h1>
        <p className="text-muted-foreground">Renseignez les valeurs pour chaque période.</p>
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 rounded-2xl bg-slate-100 p-1.5 overflow-x-auto shadow-inner border border-slate-200">
        <button
          onClick={() => setActiveTab('T0')}
          className={cn(
            "flex-1 min-w-[120px] rounded-xl px-4 py-2.5 text-sm font-bold transition-all duration-200 whitespace-nowrap",
            activeTab === 'T0' 
              ? "bg-white shadow-md text-emerald-600 ring-1 ring-slate-200" 
              : "text-slate-500 hover:text-slate-700 hover:bg-white/50"
          )}
        >
          Diagnostic (T0)
        </button>
        <button
          onClick={() => setActiveTab('YEARS')}
          className={cn(
            "flex-1 min-w-[120px] rounded-xl px-4 py-2.5 text-sm font-bold transition-all duration-200 whitespace-nowrap",
            activeTab === 'YEARS' 
              ? "bg-white shadow-md text-emerald-600 ring-1 ring-slate-200" 
              : "text-slate-500 hover:text-slate-700 hover:bg-white/50"
          )}
        >
          Suivi Annuel
        </button>
        <button
          onClick={() => setActiveTab('TARGET')}
          className={cn(
            "flex-1 min-w-[120px] rounded-xl px-4 py-2.5 text-sm font-bold transition-all duration-200 whitespace-nowrap",
            activeTab === 'TARGET' 
              ? "bg-white shadow-md text-emerald-600 ring-1 ring-slate-200" 
              : "text-slate-500 hover:text-slate-700 hover:bg-white/50"
          )}
        >
          Objectifs (Tf)
        </button>
         <button
          onClick={() => setActiveTab('REALIZED_TF')}
          className={cn(
            "flex-1 min-w-[120px] rounded-xl px-4 py-2.5 text-sm font-bold transition-all duration-200 whitespace-nowrap",
            activeTab === 'REALIZED_TF' 
              ? "bg-white shadow-md text-emerald-600 ring-1 ring-slate-200" 
              : "text-slate-500 hover:text-slate-700 hover:bg-white/50"
          )}
        >
          Réalisé (Tf)
        </button>
      </div>

      {/* Year Selector (Only for YEARS tab) */}
      {activeTab === 'YEARS' && (
        <div className="flex items-center space-x-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm overflow-x-auto">
          <span className="text-sm font-bold text-slate-500 whitespace-nowrap uppercase tracking-wider">Période :</span>
          <div className="flex space-x-2">
            {years.map(year => (
              <button
                key={year}
                onClick={() => year <= currentYear && setSelectedYear(year)}
                disabled={year > currentYear}
                className={cn(
                  "px-5 py-2.5 rounded-xl text-sm font-bold transition-all duration-200 whitespace-nowrap flex items-center gap-2",
                  selectedYear === year 
                    ? "bg-primary text-white shadow-lg shadow-primary/20 scale-105" 
                    : year > currentYear 
                      ? "bg-slate-50 text-slate-300 cursor-not-allowed border border-slate-100"
                      : "bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-100"
                )}
              >
                {year} {year > currentYear && <Lock className="h-3.5 w-3.5" />}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Data Entry Form */}
      <div className="space-y-10">
        {axes.filter(a => !a.isArchived).map(axis => (
          <Card key={axis.id} className="border-t-4 overflow-hidden" style={{ borderTopColor: axis.color }}>
            <CardHeader className="bg-slate-50/50 border-b border-slate-100 py-6">
              <CardTitle className="text-xl flex items-center gap-3">
                 <div className="w-4 h-4 rounded-full shadow-sm" style={{ backgroundColor: axis.color }} />
                 <span className="tracking-tight">{axis.title}</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-10 p-8">
              {objectives.filter(o => o.axisId === axis.id && !o.isArchived).map(obj => (
                <div key={obj.id} className="space-y-5">
                  <h3 className="font-bold text-slate-400 flex items-center text-xs uppercase tracking-[0.2em]">
                    <ChevronRight className="h-4 w-4 mr-1 text-primary" />
                    {obj.title}
                  </h3>
                  
                  <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {indicators.filter(i => i.objectiveId === obj.id && !i.isArchived).map(ind => (
                      <div key={ind.id} className="group bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md hover:border-primary/20 transition-all duration-300 space-y-4 relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                           <Info className="h-4 w-4 text-slate-300" />
                        </div>
                        
                        <div className="flex justify-between items-start gap-3 min-h-[3rem]">
                          <label className="text-sm font-bold text-slate-700 leading-snug line-clamp-2" title={ind.title}>
                            {ind.title}
                          </label>
                          <Badge variant="outline" className="text-[10px] font-bold h-5 px-1.5 shrink-0 bg-slate-50 border-slate-200 text-slate-500 uppercase tracking-tighter">{ind.type.slice(0,4)}</Badge>
                        </div>
                        
                        <div className="relative">
                          {renderIndicatorInput(ind)}
                        </div>
                        
                        {/* Contextual Info */}
                        {activeTab === 'YEARS' && ind.type === 'QUANTITATIVE' && (
                           <div className="flex justify-between items-center text-[10px] font-bold text-slate-400 pt-2 border-t border-slate-50">
                             <span className="bg-slate-50 px-1.5 py-0.5 rounded">T0: {entries[`${ind.id}-${settings.startYear}`]?.numericValue ?? '-'}</span>
                             <span className="bg-emerald-50 text-emerald-600 px-1.5 py-0.5 rounded">Cible: {targets[ind.id]?.targetValue ?? '-'}</span>
                           </div>
                        )}
                         {activeTab === 'YEARS' && ind.type === 'QUANTITATIVE' && (
                            <div className="mt-2">
                                <Button 
                                  variant="ghost" 
                                  size="sm" 
                                  className="h-8 w-full text-[10px] font-bold uppercase tracking-wider justify-center px-0 text-slate-400 hover:text-primary hover:bg-primary/5 rounded-lg border border-transparent hover:border-primary/20 transition-all" 
                                  onClick={() => openActionModal(ind.id)}
                                >
                                    <Plus className="h-3.5 w-3.5 mr-1.5" /> Ajouter une action
                                </Button>
                            </div>
                         )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Action Modal */}
      <Modal
        isOpen={isActionModalOpen}
        onClose={() => setIsActionModalOpen(false)}
        title="Ajouter une action rapide"
        footer={
          <>
            <Button variant="outline" onClick={() => setIsActionModalOpen(false)}>Annuler</Button>
            <Button onClick={handleSaveAction}>Créer l'action</Button>
          </>
        }
      >
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Titre de l'action</label>
            <Input 
              value={newAction.title} 
              onChange={(e) => setNewAction({...newAction, title: e.target.value})}
              placeholder="Ex: Mettre en place le tri..."
              autoFocus
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
                <label className="text-sm font-medium">Responsable</label>
                <Select 
                    value={newAction.responsibleId || ''} 
                    onChange={(e) => setNewAction({...newAction, responsibleId: e.target.value})}
                >
                    <option value="">Non attribué</option>
                    {actors.filter(a => !a.isArchived).map(a => (
                        <option key={a.id} value={a.id}>{a.firstName} {a.lastName}</option>
                    ))}
                </Select>
            </div>
            <div className="space-y-2">
                <label className="text-sm font-medium">Statut</label>
                <Select 
                    value={newAction.status} 
                    onChange={(e) => setNewAction({...newAction, status: e.target.value as ActionStatus})}
                >
                    <option value="TODO">À faire</option>
                    <option value="IN_PROGRESS">En cours</option>
                    <option value="DONE">Terminé</option>
                </Select>
            </div>
          </div>
        </div>
      </Modal>

      <div className="fixed bottom-6 right-6">
        <Button size="lg" className="shadow-lg">
          <Save className="mr-2 h-4 w-4" />
          Sauvegarder tout
        </Button>
      </div>
    </div>
  );
}
