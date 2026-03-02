import { useState } from 'react';
import { Outlet, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '../../store/useAppStore';
import { 
  LayoutDashboard, 
  Target, 
  ListTodo, 
  PenTool, 
  Settings, 
  Info, 
  Menu, 
  X,
  LogOut,
  PanelLeftClose,
  PanelLeftOpen,
  ChevronRight
} from 'lucide-react';
import { cn } from '../../utils/cn';
import { Button } from '../ui/Button';
import { GuidedTour } from '../GuidedTour';

export default function AppLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // Mobile
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false); // Desktop
  const { settings, reset } = useAppStore();
  const navigate = useNavigate();
  const location = useLocation();

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const toggleDesktopSidebar = () => setIsSidebarCollapsed(!isSidebarCollapsed);

  const handleLogout = async () => {
      if(confirm("Êtes-vous sûr de vouloir vous déconnecter ?")) {
          try {
            await fetch('/api/auth/logout', { 
              method: 'POST',
              credentials: 'include'
            });
            reset(); // Clear store
            navigate('/');
          } catch (error) {
            console.error('Logout failed', error);
          }
      }
  }

  const navItems = [
    { to: '/dashboard', icon: LayoutDashboard, label: 'Tableau de bord' },
    { to: '/indicators', icon: Target, label: 'Indicateurs' },
    { to: '/action-plan', icon: ListTodo, label: 'Plan d\'action' },
    { to: '/data-entry', icon: PenTool, label: 'Saisie' },
    { to: '/config', icon: Settings, label: 'Configuration' },
    { to: '/info', icon: Info, label: 'Informations' },
  ];

  return (
    <div className="flex h-screen bg-background text-foreground font-sans overflow-hidden">
      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm lg:hidden"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside 
        id="app-sidebar"
        className={cn(
          "fixed inset-y-0 left-0 z-50 transform bg-white border-r border-slate-200 transition-all duration-300 ease-in-out lg:static lg:translate-x-0 overflow-hidden flex flex-col shadow-xl lg:shadow-none",
          isSidebarOpen ? "translate-x-0 w-72" : "-translate-x-full lg:translate-x-0",
          isSidebarCollapsed ? "lg:w-0 lg:border-r-0" : "lg:w-72"
        )}
      >
        <div className="flex h-20 items-center px-6 shrink-0 border-b border-slate-100">
          <div className="flex items-center gap-3 font-bold text-xl text-primary w-full">
            <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0 shadow-inner">
                <Target className="h-6 w-6" />
            </div>
            <span className="truncate flex-1 tracking-tight">{settings.projectName || 'RSE App'}</span>
          </div>
        </div>

        <nav id="app-nav" className="flex-1 space-y-1.5 px-4 py-6 overflow-y-auto">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={() => setIsSidebarOpen(false)}
              className={({ isActive }) =>
                cn(
                  "group flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200 whitespace-nowrap relative overflow-hidden",
                  isActive
                    ? "bg-primary text-white shadow-lg shadow-primary/20"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                )
              }
            >
              <item.icon className={cn("h-5 w-5 shrink-0 transition-transform duration-200 group-hover:scale-110")} />
              <span className={cn("transition-all duration-300", isSidebarCollapsed ? "opacity-0 translate-x-4" : "opacity-100 translate-x-0")}>
                {item.label}
              </span>
              {!isSidebarCollapsed && (
                <ChevronRight className={cn("ml-auto h-4 w-4 opacity-0 -translate-x-2 transition-all duration-200 group-hover:opacity-40 group-hover:translate-x-0")} />
              )}
            </NavLink>
          ))}
        </nav>

        <div className="mt-auto border-t border-slate-100 p-6 shrink-0 bg-slate-50/50">
          <div className="mb-6 px-2">
             <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Structure</p>
             <p className="text-sm font-semibold text-slate-700 truncate">{settings.companyName || 'Non configuré'}</p>
          </div>
          <Button 
            variant="ghost" 
            className="w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-50 rounded-xl px-4 py-3 h-auto font-semibold transition-all active:scale-95" 
            onClick={handleLogout}
          >
            <LogOut className="mr-3 h-5 w-5 shrink-0" />
            <span className="truncate">Quitter</span>
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex flex-1 flex-col overflow-hidden w-full bg-background relative">
        <GuidedTour />
        
        <header className="flex h-20 items-center justify-between border-b border-slate-100 bg-white/80 backdrop-blur-md px-6 lg:px-10 shrink-0 sticky top-0 z-30">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" className="lg:hidden rounded-xl" onClick={toggleSidebar}>
              <Menu className="h-6 w-6" />
            </Button>
            <Button variant="ghost" size="icon" className="hidden lg:flex text-slate-400 hover:text-slate-900 rounded-xl transition-colors" onClick={toggleDesktopSidebar}>
              {isSidebarCollapsed ? <PanelLeftOpen className="h-5 w-5" /> : <PanelLeftClose className="h-5 w-5" />}
            </Button>
            <div className="h-6 w-px bg-slate-200 mx-2 hidden lg:block" />
            <h1 className="text-lg font-semibold text-slate-800 hidden sm:block">
              {navItems.find(item => location.pathname.startsWith(item.to))?.label || 'Espace RSE'}
            </h1>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex flex-col items-end hidden md:flex">
              <span className="text-sm font-semibold text-slate-900">Administrateur</span>
              <span className="text-xs text-slate-500">Session active</span>
            </div>
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center text-sm font-bold text-white shadow-lg shadow-emerald-200 ring-2 ring-white">
              AD
            </div>
          </div>
        </header>

        <main id="app-main" className="flex-1 overflow-y-auto p-6 lg:p-10 relative scroll-smooth">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="max-w-7xl mx-auto"
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}
