import React from 'react';
import { motion } from 'framer-motion';
import { useAppStore } from '../store/useAppStore';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { ArrowRight, TrendingUp, AlertCircle, CheckCircle, Calendar, Target as TargetIcon } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ActionPlanItem } from '../types';

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};

export default function Dashboard() {
  const { settings, actions, indicators, entries } = useAppStore();

  const isOverdue = (action: ActionPlanItem) => {
    if (action.status === 'DONE' || action.status === 'CANCELLED') return false;
    if (!action.dueDate) return action.year < new Date().getFullYear();
    return new Date(action.dueDate) < new Date();
  };

  const overdueActions = actions.filter(a => !a.isArchived && isOverdue(a));
  const pendingActions = actions.filter(a => !a.isArchived && (a.status === 'TODO' || a.status === 'IN_PROGRESS'));
  const completedActions = actions.filter(a => !a.isArchived && a.status === 'DONE');

  const completionRate = actions.length > 0 
    ? Math.round((completedActions.length / actions.filter(a => !a.isArchived).length) * 100) 
    : 0;

  return (
    <motion.div 
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-8"
    >
      <div className="flex flex-col gap-2">
        <motion.h1 variants={item} className="text-4xl font-extrabold tracking-tight text-slate-900">Tableau de bord</motion.h1>
        <motion.p variants={item} className="text-lg text-slate-500">
          Bienvenue sur le pilotage RSE de <span className="font-bold text-emerald-600">{settings.companyName}</span>.
        </motion.p>
      </div>

      {/* KPI Cards */}
      <motion.div variants={container} className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <motion.div variants={item}>
          <Card className="border-l-4 border-l-blue-500">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs font-bold uppercase tracking-wider text-slate-400">Score Global (Est.)</CardTitle>
              <TrendingUp className="h-5 w-5 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-black text-slate-800">-- / 100</div>
              <p className="text-xs font-medium text-slate-400 mt-1">Calcul à venir en V3</p>
            </CardContent>
          </Card>
        </motion.div>
        
        <motion.div variants={item}>
          <Card className="border-l-4 border-l-red-500">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs font-bold uppercase tracking-wider text-slate-400">Actions en retard</CardTitle>
              <AlertCircle className="h-5 w-5 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-black text-red-600">{overdueActions.length}</div>
              <p className="text-xs font-medium text-slate-400 mt-1">Attention immédiate requise</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={item}>
          <Card className="border-l-4 border-l-amber-500">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs font-bold uppercase tracking-wider text-slate-400">Actions en cours</CardTitle>
              <div className="h-5 w-5 rounded-full bg-amber-500 shadow-lg shadow-amber-200" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-black text-slate-800">{pendingActions.length}</div>
              <p className="text-xs font-medium text-slate-400 mt-1">Sur {actions.filter(a => !a.isArchived).length} actions totales</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={item}>
          <Card className="border-l-4 border-l-emerald-500">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs font-bold uppercase tracking-wider text-slate-400">Taux d'avancement</CardTitle>
              <CheckCircle className="h-5 w-5 text-emerald-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-black text-slate-800">{completionRate}%</div>
              <div className="h-2.5 w-full bg-slate-100 rounded-full mt-3 overflow-hidden ring-1 ring-slate-200">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${completionRate}%` }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    className="h-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.4)]" 
                  />
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        {/* Trajectory Chart Placeholder */}
        <motion.div variants={item} className="lg:col-span-4">
          <Card className="h-full">
            <CardHeader>
              <div className="flex items-center gap-2 mb-1">
                <Calendar className="h-4 w-4 text-primary" />
                <CardTitle>Trajectoire RSE</CardTitle>
              </div>
              <CardDescription>Évolution de votre performance sur la période {settings.startYear}-{settings.endYear}.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[350px] flex flex-col items-center justify-center bg-slate-50/50 rounded-2xl border-2 border-dashed border-slate-200 group transition-colors hover:bg-slate-50 hover:border-primary/30">
                <div className="h-16 w-16 rounded-full bg-white shadow-sm flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <TrendingUp className="h-8 w-8 text-slate-300 group-hover:text-primary transition-colors" />
                </div>
                <p className="text-slate-400 font-semibold">Graphique de trajectoire</p>
                <p className="text-slate-400 text-xs mt-1">Disponible en Phase 3</p>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Recent Actions */}
        <motion.div variants={item} className="lg:col-span-3">
          <Card className="h-full flex flex-col">
            <CardHeader>
              <div className="flex items-center gap-2 mb-1">
                <TargetIcon className="h-4 w-4 text-primary" />
                <CardTitle>Dernières actions</CardTitle>
              </div>
              <CardDescription>Activités récentes sur le plan d'action.</CardDescription>
            </CardHeader>
            <CardContent className="flex-1">
              <div className="space-y-5">
                {actions.filter(a => !a.isArchived).length === 0 ? (
                  <div className="text-center py-10">
                    <p className="text-slate-400 text-sm italic">Aucune action définie pour le moment.</p>
                  </div>
                ) : (
                  actions.filter(a => !a.isArchived).slice(0, 5).map((action, idx) => (
                    <motion.div 
                      key={action.id} 
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 + (idx * 0.05) }}
                      className="flex items-center p-3 rounded-xl hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100 group"
                    >
                      <div className="space-y-1 flex-1 min-w-0">
                        <p className="text-sm font-bold text-slate-700 truncate group-hover:text-primary transition-colors">{action.title}</p>
                        <p className="text-xs font-medium text-slate-400 truncate">
                          {indicators.find(i => i.id === action.indicatorId)?.title}
                        </p>
                      </div>
                      <div className="ml-4 shrink-0">
                        {action.status === 'DONE' ? (
                            <Badge className="bg-emerald-50 text-emerald-700 border-emerald-100 font-bold px-2.5 py-0.5">Terminé</Badge>
                        ) : isOverdue(action) ? (
                            <Badge variant="destructive" className="bg-red-50 text-red-700 border-red-100 font-bold px-2.5 py-0.5">Retard</Badge>
                        ) : (
                            <Badge variant="secondary" className="bg-slate-100 text-slate-600 border-slate-200 font-bold px-2.5 py-0.5">En cours</Badge>
                        )}
                      </div>
                    </motion.div>
                  ))
                )}
              </div>
            </CardContent>
            <div className="p-6 pt-0 mt-auto">
              <Link to="/action-plan">
                <Button variant="outline" className="w-full rounded-xl border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-primary hover:border-primary/30 font-bold py-6">
                    Voir tout le plan <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  );
}
