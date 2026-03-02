import React, { useState } from 'react';
import { useAppStore } from '../store/useAppStore';
import { storageService } from '../services/storage';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { Badge } from '../components/ui/Badge';
import { Modal } from '../components/ui/Modal';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../components/ui/Tabs';
import { cn } from '../utils/cn';
import { Trash2, Plus, Save, Download, Upload, AlertTriangle, Archive, RefreshCw } from 'lucide-react';
import { Actor, Axis, Objective, Indicator, IndicatorType, MaturityLevelDefinition } from '../types';

export default function Config() {
  const { 
    settings, updateSettings, reset,
    actors, addActor, updateActor, archiveActor,
    axes, addAxis, updateAxis, archiveAxis,
    objectives, addObjective, updateObjective, archiveObjective,
    indicators, addIndicator, updateIndicator, archiveIndicator,
    maturityMatrix, updateMaturityMatrix,
    importData
  } = useAppStore();

  const [activeTab, setActiveTab] = useState('general');
  const [importFile, setImportFile] = useState<File | null>(null);

  // --- General Settings Handlers ---
  const handleExport = () => storageService.exportToJson(useAppStore.getState());
  
  const handleImport = async () => {
    if (!importFile) return;
    try {
      const data = await storageService.importFromJson(importFile);
      importData(data);
      alert('Import réussi !');
    } catch (e) {
      alert('Erreur lors de l\'import : ' + e);
    }
  };

  const handleReset = () => {
    if (confirm('ATTENTION : Cette action effacera toutes les données du projet. Êtes-vous sûr ?')) {
      reset();
      localStorage.removeItem('rse-app-storage');
      localStorage.removeItem('onboarding-temp-storage');
      window.location.href = '/onboarding';
    }
  };

  // --- Actors CRUD ---
  const [isActorModalOpen, setIsActorModalOpen] = useState(false);
  const [editingActor, setEditingActor] = useState<Partial<Actor>>({});

  const saveActor = () => {
    if (editingActor.id) {
      updateActor(editingActor.id, editingActor);
    } else {
      addActor({ ...editingActor, id: crypto.randomUUID(), isArchived: false } as Actor);
    }
    setIsActorModalOpen(false);
  };

  // --- Structure CRUD ---
  const [isStructureModalOpen, setIsStructureModalOpen] = useState(false);
  const [structureType, setStructureType] = useState<'AXIS' | 'OBJECTIVE' | 'INDICATOR'>('AXIS');
  const [editingItem, setEditingItem] = useState<any>({});

  const openStructureModal = (type: 'AXIS' | 'OBJECTIVE' | 'INDICATOR', item?: any) => {
    setStructureType(type);
    setEditingItem(item || {});
    setIsStructureModalOpen(true);
  };

  const saveStructureItem = () => {
    const id = editingItem.id || crypto.randomUUID();
    const isNew = !editingItem.id;
    const common = { ...editingItem, id, isArchived: false };

    if (structureType === 'AXIS') {
      isNew ? addAxis(common) : updateAxis(id, common);
    } else if (structureType === 'OBJECTIVE') {
      isNew ? addObjective(common) : updateObjective(id, common);
    } else if (structureType === 'INDICATOR') {
      // Ensure config objects exist based on type
      const ind = { ...common };
      if (ind.type === 'QUANTITATIVE' && !ind.quantitativeConfig) ind.quantitativeConfig = { unit: '', direction: 'INCREASE' };
      if (ind.type === 'STRUCTURAL' && !ind.structuralConfig) ind.structuralConfig = { maturityMatrixId: 'default' };
      if (ind.type === 'ANNUAL' && !ind.annualConfig) ind.annualConfig = {};
      
      isNew ? addIndicator(ind) : updateIndicator(id, ind);
    }
    setIsStructureModalOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Configuration</h1>
        <p className="text-muted-foreground">Gérez les paramètres globaux et la structure de votre projet RSE.</p>
      </div>

      <Tabs defaultValue="general" className="w-full" onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4 lg:w-[600px]">
          <TabsTrigger value="general">Général</TabsTrigger>
          <TabsTrigger value="actors">Acteurs</TabsTrigger>
          <TabsTrigger value="structure">Structure</TabsTrigger>
          <TabsTrigger value="maturity">Maturité</TabsTrigger>
        </TabsList>

        {/* --- GENERAL TAB --- */}
        <TabsContent value="general" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Paramètres du projet</CardTitle>
              <CardDescription>Informations générales sur l'entreprise et la mission.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Nom de l'entreprise</label>
                  <Input value={settings.companyName} onChange={(e) => updateSettings({ companyName: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Nom du projet</label>
                  <Input value={settings.projectName} onChange={(e) => updateSettings({ projectName: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Année de départ (T0)</label>
                  <Input type="number" value={settings.startYear} onChange={(e) => updateSettings({ startYear: parseInt(e.target.value) })} />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Durée (ans)</label>
                  <Select value={settings.duration} onChange={(e) => updateSettings({ duration: parseInt(e.target.value) as 3|5|7 })}>
                    <option value={3}>3 ans</option>
                    <option value={5}>5 ans</option>
                    <option value={7}>7 ans</option>
                  </Select>
                </div>
              </div>
              <div className="pt-4 border-t flex justify-between items-center">
                 <div className="text-sm text-gray-500">
                    Année de fin calculée (Tf) : <span className="font-bold text-gray-900">{settings.startYear + settings.duration}</span>
                 </div>
                 <Button onClick={() => alert('Paramètres sauvegardés automatiquement')}>
                    <Save className="mr-2 h-4 w-4" /> Enregistrer
                 </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Gestion des données</CardTitle>
              <CardDescription>Import, export et réinitialisation.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-4">
                <Button variant="outline" onClick={handleExport}>
                  <Download className="mr-2 h-4 w-4" /> Exporter JSON
                </Button>
                <div className="flex items-center gap-2">
                  <Input type="file" accept=".json" onChange={(e) => setImportFile(e.target.files?.[0] || null)} />
                  <Button variant="secondary" onClick={handleImport} disabled={!importFile}>
                    <Upload className="mr-2 h-4 w-4" /> Importer
                  </Button>
                </div>
              </div>
              <div className="pt-4 border-t">
                <Button variant="destructive" onClick={handleReset}>
                  <AlertTriangle className="mr-2 h-4 w-4" /> Réinitialiser tout le projet
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* --- ACTORS TAB --- */}
        <TabsContent value="actors" className="space-y-6 mt-6">
          <div className="flex justify-end">
            <Button onClick={() => { setEditingActor({}); setIsActorModalOpen(true); }}>
              <Plus className="mr-2 h-4 w-4" /> Ajouter un acteur
            </Button>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {actors.filter(a => !a.isArchived).map(actor => (
              <Card key={actor.id}>
                <CardContent className="pt-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold">{actor.firstName} {actor.lastName}</h3>
                      <p className="text-sm text-muted-foreground">{actor.role}</p>
                      <p className="text-xs text-gray-400 mt-1">{actor.email}</p>
                    </div>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => { setEditingActor(actor); setIsActorModalOpen(true); }}>
                        <RefreshCw className="h-3 w-3" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-red-400" onClick={() => archiveActor(actor.id)}>
                        <Archive className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          
          <Modal isOpen={isActorModalOpen} onClose={() => setIsActorModalOpen(false)} title="Éditer un acteur" footer={<><Button variant="outline" onClick={() => setIsActorModalOpen(false)}>Annuler</Button><Button onClick={saveActor}>Enregistrer</Button></>}>
             <div className="space-y-4">
                <Input placeholder="Prénom" value={editingActor.firstName || ''} onChange={e => setEditingActor({...editingActor, firstName: e.target.value})} />
                <Input placeholder="Nom" value={editingActor.lastName || ''} onChange={e => setEditingActor({...editingActor, lastName: e.target.value})} />
                <Input placeholder="Rôle / Poste" value={editingActor.role || ''} onChange={e => setEditingActor({...editingActor, role: e.target.value})} />
                <Input placeholder="Email" value={editingActor.email || ''} onChange={e => setEditingActor({...editingActor, email: e.target.value})} />
             </div>
          </Modal>
        </TabsContent>

        {/* --- STRUCTURE TAB --- */}
        <TabsContent value="structure" className="space-y-6 mt-6">
           <div className="flex justify-end mb-4">
              <Button onClick={() => openStructureModal('AXIS')}>
                  <Plus className="mr-2 h-4 w-4" /> Nouvel Axe
              </Button>
           </div>

           <div className="space-y-8">
              {axes.filter(a => !a.isArchived).map(axis => (
                  <div key={axis.id} className="border rounded-lg p-4 bg-white shadow-sm">
                      <div className="flex items-center justify-between mb-4 pb-2 border-b">
                          <h3 className="text-lg font-bold flex items-center gap-2" style={{ color: axis.color }}>
                              <div className="w-4 h-4 rounded-full" style={{ backgroundColor: axis.color }} />
                              {axis.title}
                          </h3>
                          <div className="flex gap-2">
                              <Button variant="ghost" size="sm" onClick={() => openStructureModal('AXIS', axis)}>Modifier</Button>
                              <Button variant="ghost" size="sm" onClick={() => openStructureModal('OBJECTIVE', { axisId: axis.id })}>+ Objectif</Button>
                              <Button variant="ghost" size="sm" className="text-red-400" onClick={() => archiveAxis(axis.id)}><Archive className="h-4 w-4"/></Button>
                          </div>
                      </div>

                      <div className="pl-6 space-y-6">
                          {objectives.filter(o => o.axisId === axis.id && !o.isArchived).map(obj => (
                              <div key={obj.id} className="relative border-l-2 border-gray-200 pl-4">
                                  <div className="flex items-center justify-between mb-2">
                                      <h4 className="font-semibold text-gray-800">{obj.title}</h4>
                                      <div className="flex gap-1 opacity-50 hover:opacity-100 transition-opacity">
                                          <Button variant="ghost" size="xs" onClick={() => openStructureModal('OBJECTIVE', obj)}>Edit</Button>
                                          <Button variant="ghost" size="xs" onClick={() => openStructureModal('INDICATOR', { objectiveId: obj.id })}>+ Ind.</Button>
                                          <Button variant="ghost" size="xs" className="text-red-400" onClick={() => archiveObjective(obj.id)}><Archive className="h-3 w-3"/></Button>
                                      </div>
                                  </div>

                                  <div className="grid gap-2 sm:grid-cols-2">
                                      {indicators.filter(i => i.objectiveId === obj.id && !i.isArchived).map(ind => (
                                          <div key={ind.id} className="flex items-center justify-between bg-gray-50 p-2 rounded border text-sm group">
                                              <div className="flex items-center gap-2">
                                                  <Badge variant="outline" className="text-[10px] h-5 px-1">{ind.type.slice(0,1)}</Badge>
                                                  <span className="truncate max-w-[200px]" title={ind.title}>{ind.title}</span>
                                              </div>
                                              <div className="flex gap-1 opacity-0 group-hover:opacity-100">
                                                  <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => openStructureModal('INDICATOR', ind)}><RefreshCw className="h-3 w-3"/></Button>
                                                  <Button variant="ghost" size="icon" className="h-6 w-6 text-red-400" onClick={() => archiveIndicator(ind.id)}><Archive className="h-3 w-3"/></Button>
                                              </div>
                                          </div>
                                      ))}
                                  </div>
                              </div>
                          ))}
                      </div>
                  </div>
              ))}
           </div>

           <Modal isOpen={isStructureModalOpen} onClose={() => setIsStructureModalOpen(false)} title={`Éditer ${structureType}`} footer={<><Button variant="outline" onClick={() => setIsStructureModalOpen(false)}>Annuler</Button><Button onClick={saveStructureItem}>Enregistrer</Button></>}>
              <div className="space-y-4">
                  <Input placeholder="Titre" value={editingItem.title || ''} onChange={e => setEditingItem({...editingItem, title: e.target.value})} />
                  <Input placeholder="Description" value={editingItem.description || ''} onChange={e => setEditingItem({...editingItem, description: e.target.value})} />
                  
                  {structureType === 'AXIS' && (
                      <div className="flex items-center gap-2">
                          <label className="text-sm">Couleur :</label>
                          <Input type="color" className="w-12 h-8 p-0" value={editingItem.color || '#000000'} onChange={e => setEditingItem({...editingItem, color: e.target.value})} />
                      </div>
                  )}

                  {structureType === 'INDICATOR' && (
                      <div className="space-y-4 border-t pt-4">
                          <div className="space-y-2">
                              <label className="text-sm font-medium">Type d'indicateur</label>
                              <Select value={editingItem.type || 'QUANTITATIVE'} onChange={e => setEditingItem({...editingItem, type: e.target.value as IndicatorType})}>
                                  <option value="QUANTITATIVE">Quantitatif</option>
                                  <option value="STRUCTURAL">Structurel</option>
                                  <option value="ANNUAL">Annuel (Oui/Non)</option>
                              </Select>
                          </div>
                          
                          {editingItem.type === 'QUANTITATIVE' && (
                              <div className="grid grid-cols-2 gap-4 bg-gray-50 p-3 rounded">
                                  <Input placeholder="Unité (ex: tCO2)" value={editingItem.quantitativeConfig?.unit || ''} onChange={e => setEditingItem({...editingItem, quantitativeConfig: { ...editingItem.quantitativeConfig, unit: e.target.value }})} />
                                  <Select value={editingItem.quantitativeConfig?.direction || 'INCREASE'} onChange={e => setEditingItem({...editingItem, quantitativeConfig: { ...editingItem.quantitativeConfig, direction: e.target.value }})}>
                                      <option value="INCREASE">Augmenter</option>
                                      <option value="DECREASE">Diminuer</option>
                                      <option value="MAINTAIN">Maintenir</option>
                                  </Select>
                              </div>
                          )}
                      </div>
                  )}
              </div>
           </Modal>
        </TabsContent>

        {/* --- MATURITY TAB --- */}
        <TabsContent value="maturity" className="space-y-6 mt-6">
            <Card>
                <CardHeader>
                    <CardTitle>Matrice de Maturité</CardTitle>
                    <CardDescription>Définition des niveaux pour les indicateurs structurels.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {maturityMatrix.map((level, idx) => (
                            <div key={level.level} className="flex gap-4 items-start p-4 border rounded-lg bg-gray-50">
                                <div className="flex-none w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xl">
                                    {level.level}
                                </div>
                                <div className="flex-1 space-y-2">
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <Input 
                                            value={level.label} 
                                            onChange={(e) => {
                                                const newMatrix = [...maturityMatrix];
                                                newMatrix[idx].label = e.target.value;
                                                updateMaturityMatrix(newMatrix);
                                            }}
                                            className="font-semibold"
                                        />
                                        <Input 
                                            type="number"
                                            placeholder="Points requis"
                                            value={level.pointsRequired}
                                            onChange={(e) => {
                                                const newMatrix = [...maturityMatrix];
                                                newMatrix[idx].pointsRequired = parseInt(e.target.value);
                                                updateMaturityMatrix(newMatrix);
                                            }}
                                        />
                                    </div>
                                    <textarea 
                                        className="w-full min-h-[60px] rounded-md border border-input bg-background px-3 py-2 text-sm"
                                        value={level.description}
                                        onChange={(e) => {
                                            const newMatrix = [...maturityMatrix];
                                            newMatrix[idx].description = e.target.value;
                                            updateMaturityMatrix(newMatrix);
                                        }}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
