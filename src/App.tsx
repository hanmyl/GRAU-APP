import React, { useState, useEffect } from 'react';
import { Proposal, Announcement } from './types';
import { INITIAL_PROPOSALS, INITIAL_ANNOUNCEMENTS } from './data/initialData';
import StudentPortal from './components/StudentPortal';
import AdminDashboard from './components/AdminDashboard';
import ProjectInfo from './components/ProjectInfo';

// High fidelity sub-modules created from the templates
import CreateProposal from './components/CreateProposal';
import VotingCenter from './components/VotingCenter';
import AdvancedStats from './components/AdvancedStats';
import InstitutionalRules from './components/InstitutionalRules';
import MessagingPanel from './components/MessagingPanel';
import AlertSettings from './components/AlertSettings';
import ProposalTracking from './components/ProposalTracking';
import SupportCenter from './components/SupportCenter';
import ClassroomIntegration from './components/ClassroomIntegration';

import { motion, AnimatePresence } from 'motion/react';

export default function App() {
  const [activeTab, setActiveTab] = useState<
    'propuestas' | 'crear' | 'votaciones' | 'seguimiento' | 'estadisticas' | 'reglamento' | 'mensajes' | 'alertas' | 'soporte' | 'admin' | 'proyecto' | 'classroom'
  >('propuestas');
  
  // State loaded from localStorage for local persistence
  const [proposals, setProposals] = useState<Proposal[]>(() => {
    const saved = localStorage.getItem('grau_app_proposals');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error("Error parsing saved proposals", e);
      }
    }
    return INITIAL_PROPOSALS;
  });

  const [announcements, setAnnouncements] = useState<Announcement[]>(() => {
    const saved = localStorage.getItem('grau_app_announcements');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error("Error parsing saved announcements", e);
      }
    }
    return INITIAL_ANNOUNCEMENTS;
  });

  // Sync proposals with localStorage
  useEffect(() => {
    localStorage.setItem('grau_app_proposals', JSON.stringify(proposals));
  }, [proposals]);

  // Sync announcements with localStorage
  useEffect(() => {
    localStorage.setItem('grau_app_announcements', JSON.stringify(announcements));
  }, [announcements]);

  // Handle Google OAuth popup redirect callback
  useEffect(() => {
    if (window.opener && window.location.hash) {
      const hash = window.location.hash;
      if (hash.includes('access_token')) {
        window.opener.postMessage({ type: 'GOOGLE_OAUTH_SUCCESS', hash }, window.location.origin);
        window.close();
      }
    }
  }, []);

  // Proposal actions
  const handleAddProposal = (newProp: Omit<Proposal, 'id' | 'votes' | 'votedBy' | 'createdAt' | 'status' | 'comments'>) => {
    const proposal: Proposal = {
      ...newProp,
      id: `prop-${Date.now()}`,
      votes: 1, // Author starts with 1 vote automatically
      votedBy: ['user-author'], // Author counts as voted
      createdAt: new Date().toISOString(),
      status: 'Pendiente',
      comments: []
    };
    setProposals(prev => [proposal, ...prev]);
  };

  const handleVote = (id: string) => {
    setProposals(prev => prev.map(p => {
      if (p.id === id) {
        // Toggle vote
        const alreadyVoted = p.votedBy.includes('current-session-user');
        const nextVotedBy = alreadyVoted 
          ? p.votedBy.filter(u => u !== 'current-session-user')
          : [...p.votedBy, 'current-session-user'];
        const nextVotes = alreadyVoted ? p.votes - 1 : p.votes + 1;
        
        return {
          ...p,
          votes: nextVotes,
          votedBy: nextVotedBy
        };
      }
      return p;
    }));
  };

  const handleAddComment = (proposalId: string, commentText: string, author: string) => {
    setProposals(prev => prev.map(p => {
      if (p.id === proposalId) {
        const newComment = {
          id: `comment-${Date.now()}`,
          author,
          text: commentText,
          createdAt: new Date().toISOString()
        };
        return {
          ...p,
          comments: [...p.comments, newComment]
        };
      }
      return p;
    }));
  };

  // Administration actions
  const handleChangeStatus = (id: string, nextStatus: Proposal['status']) => {
    setProposals(prev => prev.map(p => {
      if (p.id === id) {
        return {
          ...p,
          status: nextStatus
        };
      }
      return p;
    }));
  };

  const handleAddAnnouncement = (newAnn: { title: string; content: string; category: Announcement['category']; author: string }) => {
    const ann: Announcement = {
      ...newAnn,
      id: `ann-${Date.now()}`,
      date: new Date().toISOString()
    };
    setAnnouncements(prev => [ann, ...prev]);
  };

  const handleDeleteAnnouncement = (id: string) => {
    setAnnouncements(prev => prev.filter(ann => ann.id !== id));
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans flex relative">
      
      {/* 1. Left Side Navigation Drawer/Shell */}
      <aside className="h-screen w-64 fixed left-0 top-0 bg-slate-900 border-r border-slate-800 flex flex-col py-6 px-4 z-50 justify-between shrink-0 select-none">
        
        <div className="space-y-6">
          {/* Logo Brand */}
          <div className="flex items-center space-x-3 px-2">
            <div className="bg-red-500 p-2.5 rounded-xl text-slate-950 shadow-lg shadow-red-500/10">
              <span className="material-symbols-outlined text-2xl font-bold animate-pulse">campaign</span>
            </div>
            <div>
              <div className="flex items-center space-x-1">
                <h1 className="text-sm font-headline tracking-wider text-red-400 leading-none">MIGUEL GRAU</h1>
              </div>
              <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold mt-1">Portal Estudiantil</p>
            </div>
          </div>

          {/* Navigation Links list */}
          <nav className="space-y-1">
            <button
              onClick={() => setActiveTab('propuestas')}
              className={`w-full flex items-center gap-3.5 py-2.5 px-3.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-200 cursor-pointer ${
                activeTab === 'propuestas' 
                  ? 'bg-red-500 text-slate-950 shadow-md shadow-red-500/10' 
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-950/40'
              }`}
            >
              <span className="material-symbols-outlined text-[20px]">forum</span>
              <span>Comunidad</span>
            </button>

            <button
              onClick={() => setActiveTab('crear')}
              className={`w-full flex items-center gap-3.5 py-2.5 px-3.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-200 cursor-pointer ${
                activeTab === 'crear' 
                  ? 'bg-red-500 text-slate-950 shadow-md shadow-red-500/10' 
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-950/40'
              }`}
            >
              <span className="material-symbols-outlined text-[20px]">edit_note</span>
              <span>Nueva Propuesta</span>
            </button>

            <button
              onClick={() => setActiveTab('votaciones')}
              className={`flex items-center gap-3.5 w-full p-3 rounded-lg transition-colors duration-200 ${
                activeTab === 'votaciones' 
                  ? 'bg-red-500/10 text-red-400 border-l-4 border-red-500' 
                  : 'text-slate-400 hover:bg-slate-900/50 hover:text-slate-200'
              }`}
            >
              <span className="material-symbols-outlined text-[20px]">how_to_vote</span>
              <span className="text-xs font-bold uppercase tracking-wider">Votaciones</span>
            </button>

            <button
              onClick={() => setActiveTab('seguimiento')}
              className={`flex items-center gap-3 p-3 rounded-lg transition-colors duration-200 ${
                activeTab === 'seguimiento' 
                  ? 'bg-red-500/10 text-red-400 border-l-4 border-red-500' 
                  : 'text-slate-400 hover:bg-slate-900/40 hover:text-slate-200'
              }`}
            >
              <span className="material-symbols-outlined text-[20px]">analytics</span>
              <span className="text-xs font-bold uppercase tracking-wider">Seguimiento</span>
            </button>

            <button
              onClick={() => setActiveTab('estadisticas')}
              className={`flex items-center gap-3 p-3 rounded-lg transition-colors duration-200 ${
                activeTab === 'estadisticas' 
                  ? 'bg-red-500/10 text-red-400 border-l-4 border-red-500' 
                  : 'text-slate-400 hover:bg-slate-900/40 hover:text-slate-200'
              }`}
            >
              <span className="material-symbols-outlined text-[20px]">bar_chart</span>
              <span className="text-xs font-bold uppercase tracking-wider">Estadísticas</span>
            </button>

            <button
              onClick={() => setActiveTab('reglamento')}
              className={`flex items-center gap-3 p-3 rounded-lg transition-colors duration-200 ${
                activeTab === 'reglamento' 
                  ? 'bg-red-500/10 text-red-400 border-l-4 border-red-500' 
                  : 'text-slate-400 hover:bg-slate-900/40 hover:text-slate-200'
              }`}
            >
              <span className="material-symbols-outlined text-[20px]">gavel</span>
              <span className="text-xs font-bold uppercase tracking-wider">Reglamento</span>
            </button>

            <button
              onClick={() => setActiveTab('classroom')}
              className={`flex items-center gap-3 p-3 rounded-lg transition-colors duration-200 ${
                activeTab === 'classroom' 
                  ? 'bg-red-500/10 text-red-400 border-l-4 border-red-500' 
                  : 'text-slate-400 hover:bg-slate-900/40 hover:text-slate-200'
              }`}
            >
              <span className="material-symbols-outlined text-[20px]">school</span>
              <span className="text-xs font-bold uppercase tracking-wider">Classroom</span>
            </button>

            <button
              onClick={() => setActiveTab('mensajes')}
              className={`flex items-center gap-3 p-3 rounded-lg transition-colors duration-200 relative ${
                activeTab === 'mensajes' 
                  ? 'bg-red-500/10 text-red-400 border-l-4 border-red-500' 
                  : 'text-slate-400 hover:bg-slate-900/40 hover:text-slate-200'
              }`}
            >
              <span className="material-symbols-outlined text-[20px]">mail</span>
              <span className="text-xs font-bold uppercase tracking-wider">Mensajes</span>
              <span className="absolute right-3 w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
            </button>
          </nav>
        </div>

        {/* Low Navigation Group */}
        <div className="space-y-1.5 border-t border-slate-800/80 pt-4">
          <button
            onClick={() => setActiveTab('alertas')}
            className={`flex items-center gap-3 p-3 w-full rounded-lg transition-colors duration-200 ${
              activeTab === 'alertas' 
                ? 'bg-red-500/10 text-red-400 border-l-4 border-red-500' 
                : 'text-slate-400 hover:bg-slate-900/40'
            }`}
          >
            <span className="material-symbols-outlined text-[20px]">settings</span>
            <span className="text-xs font-bold uppercase tracking-wider">Alertas</span>
          </button>

          <button
            onClick={() => setActiveTab('soporte')}
            className={`flex items-center gap-3 p-3 w-full rounded-lg transition-colors duration-200 ${
              activeTab === 'soporte' 
                ? 'bg-red-500/10 text-red-400 border-l-4 border-red-500' 
                : 'text-slate-400 hover:bg-slate-900/40'
            }`}
          >
            <span className="material-symbols-outlined text-[20px]">help</span>
            <span className="text-xs font-bold uppercase tracking-wider">Soporte</span>
          </button>

          <button
            onClick={() => setActiveTab('admin')}
            className={`flex items-center gap-3 p-3 w-full rounded-lg transition-colors duration-200 ${
              activeTab === 'admin' 
                ? 'bg-red-500/10 text-red-400 border-l-4 border-red-500' 
                : 'text-slate-400 hover:bg-slate-900/40'
            }`}
          >
            <span className="material-symbols-outlined text-[20px]">shield</span>
            <span className="text-xs font-bold uppercase tracking-wider">Plana Directora</span>
          </button>

          <button
            onClick={() => setActiveTab('proyecto')}
            className={`flex items-center gap-3 p-3 w-full rounded-lg transition-colors duration-200 ${
              activeTab === 'proyecto' 
                ? 'bg-red-500/10 text-red-400 border-l-4 border-red-500' 
                : 'text-slate-400 hover:bg-slate-900/40'
            }`}
          >
            <span className="material-symbols-outlined text-[20px]">info</span>
            <span className="text-xs font-bold uppercase tracking-wider">Equipo / Costos</span>
          </button>
        </div>

      </aside>

      {/* 2. Top Navigation Header Shell (calc 100% - 16rem) */}
      <div className="flex-1 min-h-screen ml-64 flex flex-col justify-between overflow-x-hidden">
        
        {/* Top Header Ticker */}
        <header className="fixed top-0 right-0 w-[calc(100%-16rem)] h-16 bg-slate-950/80 backdrop-blur-md border-b border-slate-900 z-40 flex items-center justify-between px-8 shadow-sm">
          <div className="flex items-center space-x-3 truncate max-w-md">
            <span className="text-[9px] bg-red-500 text-slate-950 font-bold px-2 py-0.5 rounded uppercase shrink-0 animate-pulse">
              Ticker Oficial
            </span>
            <p className="text-xs text-slate-400 truncate">
              {announcements[0]?.title}: "{announcements[0]?.content}"
            </p>
          </div>

          <div className="flex items-center space-x-6">
            <div className="flex gap-4 items-center border-r border-slate-800 pr-6">
              <button 
                onClick={() => setActiveTab('alertas')}
                className="relative text-slate-400 hover:text-red-400 transition-colors flex items-center"
              >
                <span className="material-symbols-outlined text-[22px]">notifications</span>
                <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
              <button 
                onClick={() => setActiveTab('seguimiento')}
                className="text-slate-400 hover:text-red-400 transition-colors flex items-center"
              >
                <span className="material-symbols-outlined text-[22px]">history</span>
              </button>
            </div>

            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <p className="text-xs font-bold text-slate-200 leading-none">Estudiante Demo</p>
                <p className="text-[10px] text-slate-500 mt-1">ID: #45290</p>
              </div>
              <img 
                alt="Avatar" 
                className="w-10 h-10 rounded-full border border-red-500/20 object-cover cursor-pointer"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCvMYbLGrt1jxnySd_A4gRm5TtYsrNRrjYaN9odT83JVSxaZrOftuOajqdAk7b7HfH5l20oc_GhwRha2rCsC_yJ2RUvx8oz7Ibx1SI2964EdJkFd9RUnU2MJnonHw4Z8_RohnzD98rpvn0lBj3_-8PWYmFBALwTLuG8ZTK8GL2OT61Atf2i5LPEEOXjdL8wfHE4mfvebKgaBdKoYquA6htH92Msy8kW52EVPWFAECyPXyyMcTS576Wthn9vxc2fESW9FZoPjp1fFNY"
              />
            </div>
          </div>
        </header>

        {/* 3. Main Stage Container with transitions */}
        <main className="flex-1 pt-24 px-8 pb-12 w-full max-w-[1400px] mx-auto z-10">
          <AnimatePresence mode="wait">
            
            {activeTab === 'propuestas' && (
              <motion.div
                key="propuestas-tab"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                <StudentPortal 
                  proposals={proposals}
                  onAddProposal={handleAddProposal}
                  onVote={handleVote}
                  onAddComment={handleAddComment}
                />
              </motion.div>
            )}

            {activeTab === 'crear' && (
              <motion.div
                key="crear-tab"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                <CreateProposal 
                  onAddProposal={handleAddProposal} 
                  setActiveTab={setActiveTab}
                />
              </motion.div>
            )}

            {activeTab === 'votaciones' && (
              <motion.div
                key="votaciones-tab"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                <VotingCenter 
                  proposals={proposals} 
                  onVote={handleVote} 
                />
              </motion.div>
            )}

            {activeTab === 'seguimiento' && (
              <motion.div
                key="seguimiento-tab"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                <ProposalTracking proposals={proposals} />
              </motion.div>
            )}

            {activeTab === 'estadisticas' && (
              <motion.div
                key="estadisticas-tab"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                <AdvancedStats 
                  proposalsCount={proposals.length} 
                  totalVotes={proposals.reduce((sum, p) => sum + p.votes, 0)} 
                />
              </motion.div>
            )}

            {activeTab === 'reglamento' && (
              <motion.div
                key="reglamento-tab"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                <InstitutionalRules />
              </motion.div>
            )}

            {activeTab === 'mensajes' && (
              <motion.div
                key="mensajes-tab"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                <MessagingPanel />
              </motion.div>
            )}

            {activeTab === 'alertas' && (
              <motion.div
                key="alertas-tab"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                <AlertSettings />
              </motion.div>
            )}

            {activeTab === 'soporte' && (
              <motion.div
                key="soporte-tab"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                <SupportCenter />
              </motion.div>
            )}

            {activeTab === 'admin' && (
              <motion.div
                key="admin-tab"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                <AdminDashboard 
                  proposals={proposals}
                  onChangeStatus={handleChangeStatus}
                  announcements={announcements}
                  onAddAnnouncement={handleAddAnnouncement}
                  onDeleteAnnouncement={handleDeleteAnnouncement}
                />
              </motion.div>
            )}

            {activeTab === 'proyecto' && (
              <motion.div
                key="proyecto-tab"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                <ProjectInfo />
              </motion.div>
            )}

            {activeTab === 'classroom' && (
              <motion.div
                key="classroom-tab"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                <ClassroomIntegration proposals={proposals} />
              </motion.div>
            )}

          </AnimatePresence>
        </main>

        {/* 4. Footer credit panel */}
        <footer className="bg-slate-900/40 border-t border-slate-900 py-6 mt-12 shrink-0">
          <div className="px-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-center md:text-left">
              <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">© 2026 I.E. Miguel Grau • Municipio Escolar</p>
              <p className="text-[10px] text-slate-600 mt-0.5">Desarrollado de forma transparente bajo estándares de bajo costo.</p>
            </div>
            
            <div className="flex gap-2">
              <span className="text-[10px] text-emerald-500 bg-emerald-950/40 border border-emerald-500/10 px-3 py-1 rounded-full font-bold">
                ✓ Autoguardado Activo (LocalStorage)
              </span>
            </div>
          </div>
        </footer>

      </div>

    </div>
  );
}
