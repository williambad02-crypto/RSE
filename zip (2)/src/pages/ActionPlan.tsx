import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '../store/useAppStore';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { Badge } from '../components/ui/Badge';
import { Modal } from '../components/ui/Modal';
import { Plus, Search, Filter, Calendar, User, AlertCircle, Edit2, Trash2, Archive, ChevronRight } from 'lucide-react';
import { ActionStatus, ActionPlanItem } from '../types';
import { cn } from '../utils/cn';

export default function ActionPlan() {
  const { actions, actors, indicators, axes, objectives, addAction, updateAction, archiveAction } = useAppStore();
  const [filterStatus, setFilterStatus] = useState<ActionStatus | 'ALL'>('ALL');
  const [filterResponsible, setFilterResponsible] = useState<string | 'ALL'>('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAction, setEditingAction] = useState<Partial<ActionPlanItem>>({});

  const isOverdue = (action: ActionPlanItem) => {
    if (action.status === 'DONE' || action.status === 'CANCELLED') return false;
    if (!action.dueDate) return action.year < new Date().getFullYear();
    return new Date(action.dueDate) < new Date();
  };

  const filteredActions = actions.filter(action => {
    if (action.isArchived) return false;
    const matchesStatus = filterStatus === 'ALL' || action.status === filterStatus;
    const matchesResponsible = filterResponsible === 'ALL' || action.responsibleId === filterResponsible;
    const matchesSearch = action.title.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesResponsible && matchesSearch;
  });

  const getStatusBadge = (status: ActionStatus) => {
    switch (status) {
      case 'TODO': return <Badge className="bg-slate-100 text-slate-600 border-slate-200 font-bold px-3 py-1">À faire</Badge>;
      case 'IN_PROGRESS': return <Badge className="bg-blue-50 text-blue-700 border-blue-100 font-bold px-3 py-1">En cours</Badge>;
      case 'DONE': return <Badge className="bg-emerald-50 text-emerald-700 border-emerald-100 font-bold px-3 py-1">Terminé</Badge>;
      case 'CANCELLED': return <Badge className="bg-red-50 text-red-700 border-red-100 font-bold px-3 py-1">Annulé</Badge>;
      default: return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getIndicatorName = (id: string) => indicators.find(i => i.id === id)?.title || 'Inconnu';
  const getAxisColor = (indicatorId: string) => {
      const ind = indicators.find(i => i.id === indicatorId);
      const obj = objectives.find(o => o.id === ind?.objectiveId);
      const axis = axes.find(a => a.id === obj?.axisId);
      return axis?.color || '#ccc';
  };

  const handleEdit = (action: ActionPlanItem) => {
    setEditingAction(action);
    setIsModalOpen(true);
  };

  const handleCreate = () => {
    setEditingAction({
      title: '',
      status: 'TODO',
      year: new Date().getFullYear(),
      indicatorId: indicators[0]?.id // Default to first available
    });
    setIsModalOpen(true);
  };

  const handleSave = () => {
    if (!editingAction.title || !editingAction.indicatorId) return;

    const actionData = {
      ...editingAction,
      updatedAt: new Date().toISOString(),
    } as ActionPlanItem;

    if (editingAction.id) {
      updateAction(editingAction.id, actionData);
    } else {
      addAction({
        ...actionData,
        id: crypto.randomUUID(),
        createdAt: new Date().toISOString(),
        isArchived: false,
      });
    }
    setIsModalOpen(false);
  };

  const handleArchive = (id: string) => {
    if (confirm('Voulez-vous vraiment archiver cette action ?')) {
      archiveAction(id);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight text-slate-900">Plan d'action</h1>
          <p className="text-lg text-slate-500 mt-1">Suivi des initiatives ({filteredActions.length} actions actives)</p>
        </div>
        <Button onClick={handleCreate} className="rounded-xl px-6 py-6 h-auto font-bold shadow-lg shadow-primary/20 transition-all active:scale-95">
          <Plus className="mr-2 h-5 w-5" />
          Nouvelle action
        </Button>
      </div>

      {/* Filters */}
      <Card className="border-none shadow-md bg-white/50 backdrop-blur-sm">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
              <Input
                placeholder="Rechercher une action..."
                className="pl-11 h-12 rounded-xl border-slate-200 focus:ring-primary/20 transition-all"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="w-full md:w-[220px]">
              <Select 
                value={filterStatus} 
                onChange={(e) => setFilterStatus(e.target.value as ActionStatus | 'ALL')}
                className="h-12 rounded-xl border-slate-200 font-semibold text-slate-600"
              >
                <option value="ALL">Tous les statuts</option>
                <option value="TODO">À faire</option>
                <option value="IN_PROGRESS">En cours</option>
                <option value="DONE">Terminé</option>
                <option value="CANCELLED">Annulé</option>
              </Select>
            </div>
            <div className="w-full md:w-[220px]">
               <Select 
                value={filterResponsible} 
                onChange={(e) => setFilterResponsible(e.target.value)}
                className="h-12 rounded-xl border-slate-200 font-semibold text-slate-600"
              >
                <option value="ALL">Tous les responsables</option>
                {actors.filter(a => !a.isArchived).map(a => (
                    <option key={a.id} value={a.id}>{a.firstName} {a.lastName}</option>
                ))}
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Actions Table */}
      <div className="rounded-3xl border border-slate-200 bg-white shadow-xl overflow-hidden">
        <div className="relative w-full overflow-auto">
          <table className="w-full caption-bottom text-sm">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/50">
                <th className="h-16 px-6 text-left align-middle font-bold text-slate-400 uppercase tracking-widest text-[10px] w-[45%]">Action & Indicateur</th>
                <th className="h-16 px-6 text-left align-middle font-bold text-slate-400 uppercase tracking-widest text-[10px]">Responsable</th>
                <th className="h-16 px-6 text-left align-middle font-bold text-slate-400 uppercase tracking-widest text-[10px]">Échéance</th>
                <th className="h-16 px-6 text-left align-middle font-bold text-slate-400 uppercase tracking-widest text-[10px]">Statut</th>
                <th className="h-16 px-6 text-right align-middle font-bold text-slate-400 uppercase tracking-widest text-[10px]">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              <AnimatePresence mode="popLayout">
                {filteredActions.length > 0 ? (
                  filteredActions.map((action, idx) => (
                    <motion.tr 
                      key={action.id} 
                      layout
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.2, delay: idx * 0.03 }}
                      className="group hover:bg-slate-50/80 transition-colors"
                    >
                      <td className="px-6 py-5 align-middle">
                        <div className="flex items-start gap-4">
                            <div className="w-1.5 h-12 rounded-full shrink-0 mt-1 shadow-sm" style={{ backgroundColor: getAxisColor(action.indicatorId) }} />
                            <div className="flex flex-col gap-1.5 min-w-0">
                                <span className="font-bold text-slate-800 text-base group-hover:text-primary transition-colors truncate">{action.title}</span>
                                <div className="flex items-center text-xs font-bold text-slate-400 uppercase tracking-tight">
                                    <ChevronRight className="h-3 w-3 mr-1 text-primary" />
                                    <span className="truncate">{getIndicatorName(action.indicatorId)}</span>
                                </div>
                                {isOverdue(action) && (
                                    <span className="text-[10px] text-red-600 flex items-center font-black bg-red-50 w-fit px-2 py-0.5 rounded-lg uppercase tracking-wider border border-red-100">
                                        <AlertCircle className="h-3 w-3 mr-1" /> En retard
                                    </span>
                                )}
                            </div>
                        </div>
                      </td>
                      <td className="px-6 py-5 align-middle">
                        <div className="flex items-center gap-2.5 text-slate-600 font-bold">
                            <div className="h-7 w-7 rounded-lg bg-slate-100 flex items-center justify-center text-[10px] text-slate-500">
                                <User className="h-3.5 w-3.5" />
                            </div>
                            <span className="text-sm">
                              {actors.find(a => a.id === action.responsibleId)?.firstName || 'Non assigné'}
                            </span>
                        </div>
                      </td>
                      <td className="px-6 py-5 align-middle">
                        <div className="flex items-center gap-2.5 text-slate-500 font-bold">
                            <Calendar className="h-4 w-4 text-slate-300" />
                            <span className="text-sm">
                              {action.dueDate ? new Date(action.dueDate).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' }) : action.year}
                            </span>
                        </div>
                      </td>
                      <td className="px-6 py-5 align-middle">
                        {getStatusBadge(action.status)}
                      </td>
                      <td className="px-6 py-5 align-middle text-right">
                        <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all duration-200 -translate-x-2 group-hover:translate-x-0">
                            <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl hover:bg-white hover:shadow-md hover:text-primary transition-all" onClick={() => handleEdit(action)}>
                                <Edit2 className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl hover:bg-red-50 hover:shadow-md hover:text-red-600 transition-all" onClick={() => handleArchive(action.id)}>
                                <Archive className="h-4 w-4" />
                            </Button>
                        </div>
                      </td>
                    </motion.tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="h-48 text-center align-middle">
                      <div className="flex flex-col items-center justify-center text-slate-400 gap-2">
                        <Search className="h-8 w-8 opacity-20" />
                        <p className="font-bold uppercase tracking-widest text-xs">Aucune action trouvée</p>
                      </div>
                    </td>
                  </tr>
                )}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit/Create Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingAction.id ? "Modifier l'action" : "Nouvelle action"}
        footer={
            <>
                <Button variant="outline" onClick={() => setIsModalOpen(false)}>Annuler</Button>
                <Button onClick={handleSave}>Enregistrer</Button>
            </>
        }
      >
        <div className="space-y-4">
            <div className="space-y-2">
                <label className="text-sm font-medium">Titre</label>
                <Input 
                    value={editingAction.title || ''} 
                    onChange={e => setEditingAction({...editingAction, title: e.target.value})}
                    placeholder="Intitulé de l'action"
                />
            </div>
            
            <div className="space-y-2">
                <label className="text-sm font-medium">Indicateur lié</label>
                <Select 
                    value={editingAction.indicatorId || ''} 
                    onChange={e => setEditingAction({...editingAction, indicatorId: e.target.value})}
                >
                    {indicators.filter(i => !i.isArchived).map(i => (
                        <option key={i.id} value={i.id}>{i.title}</option>
                    ))}
                </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <label className="text-sm font-medium">Responsable</label>
                    <Select 
                        value={editingAction.responsibleId || ''} 
                        onChange={e => setEditingAction({...editingAction, responsibleId: e.target.value})}
                    >
                        <option value="">Non assigné</option>
                        {actors.filter(a => !a.isArchived).map(a => (
                            <option key={a.id} value={a.id}>{a.firstName} {a.lastName}</option>
                        ))}
                    </Select>
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-medium">Statut</label>
                    <Select 
                        value={editingAction.status || 'TODO'} 
                        onChange={e => setEditingAction({...editingAction, status: e.target.value as ActionStatus})}
                    >
                        <option value="TODO">À faire</option>
                        <option value="IN_PROGRESS">En cours</option>
                        <option value="DONE">Terminé</option>
                        <option value="CANCELLED">Annulé</option>
                    </Select>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                 <div className="space-y-2">
                    <label className="text-sm font-medium">Année cible</label>
                    <Input 
                        type="number"
                        value={editingAction.year || new Date().getFullYear()} 
                        onChange={e => setEditingAction({...editingAction, year: parseInt(e.target.value)})}
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-medium">Date d'échéance</label>
                    <Input 
                        type="date"
                        value={editingAction.dueDate || ''} 
                        onChange={e => setEditingAction({...editingAction, dueDate: e.target.value})}
                    />
                </div>
            </div>
            
            <div className="space-y-2">
                <label className="text-sm font-medium">Description / Notes</label>
                <textarea 
                    className="w-full min-h-[80px] rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    value={editingAction.description || ''}
                    onChange={e => setEditingAction({...editingAction, description: e.target.value})}
                    placeholder="Détails supplémentaires..."
                />
            </div>
        </div>
      </Modal>
    </div>
  );
}
