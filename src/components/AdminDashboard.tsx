import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  BarChart3, 
  Users, 
  CheckSquare, 
  FileText, 
  TrendingUp, 
  Printer, 
  Download, 
  RefreshCw, 
  Sparkles,
  MapPin,
  ChevronRight,
  ShieldCheck,
  AlertTriangle,
  Plus,
  Trash2,
  Bell
} from 'lucide-react';
import { Proposal, Announcement } from '../types';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  Cell, 
  PieChart, 
  Pie 
} from 'recharts';

interface AdminDashboardProps {
  proposals: Proposal[];
  onChangeStatus: (id: string, nextStatus: Proposal['status']) => void;
  announcements: Announcement[];
  onAddAnnouncement: (newAnn: { title: string; content: string; category: Announcement['category']; author: string }) => void;
  onDeleteAnnouncement: (id: string) => void;
}

export default function AdminDashboard({ 
  proposals, 
  onChangeStatus,
  announcements,
  onAddAnnouncement,
  onDeleteAnnouncement
}: AdminDashboardProps) {
  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [selectedUrgencyLevel, setSelectedUrgencyLevel] = useState<number>(30); // minimum votes to qualify as "Urgente"
  const [filterCategory, setFilterCategory] = useState<string>('Todas');

  // Announcement Form State
  const [annTitle, setAnnTitle] = useState('');
  const [annContent, setAnnContent] = useState('');
  const [annCategory, setAnnCategory] = useState<Announcement['category']>('General');
  const [annAuthor, setAnnAuthor] = useState('Dirección Miguel Grau');

  const handleAnnouncementSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!annTitle.trim() || !annContent.trim() || !annAuthor.trim()) return;
    onAddAnnouncement({
      title: annTitle,
      content: annContent,
      category: annCategory,
      author: annAuthor
    });
    setAnnTitle('');
    setAnnContent('');
  };

  // Total calculations
  const totalProposals = proposals.length;
  const totalVotes = proposals.reduce((sum, p) => sum + p.votes, 0);
  const resolvedProposals = proposals.filter(p => p.status === 'Resuelto').length;
  const inReviewProposals = proposals.filter(p => p.status === 'En Revisión').length;

  // Recharts Data Prep: Proposals by Category
  const categoriesMap: Record<string, number> = {
    'Infraestructura': 0,
    'Convivencia': 0,
    'Deportes': 0,
    'Académico': 0,
    'Ecología': 0,
    'Otros': 0
  };
  proposals.forEach(p => {
    if (categoriesMap[p.category] !== undefined) {
      categoriesMap[p.category]++;
    } else {
      categoriesMap['Otros']++;
    }
  });
  const categoryChartData = Object.keys(categoriesMap).map(cat => ({
    name: cat,
    cantidad: categoriesMap[cat]
  }));

  // Recharts Data Prep: Votes by Category
  const categoryVotesMap: Record<string, number> = {
    'Infraestructura': 0,
    'Convivencia': 0,
    'Deportes': 0,
    'Académico': 0,
    'Ecología': 0,
    'Otros': 0
  };
  proposals.forEach(p => {
    if (categoryVotesMap[p.category] !== undefined) {
      categoryVotesMap[p.category] += p.votes;
    } else {
      categoryVotesMap['Otros'] += p.votes;
    }
  });
  const categoryVotesData = Object.keys(categoryVotesMap).map(cat => ({
    name: cat,
    votos: categoryVotesMap[cat]
  }));

  const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ec4899', '#14b8a6', '#64748b'];

  // Sorting proposals by urgency/votes for priority report list
  const priorityProposals = [...proposals]
    .sort((a, b) => b.votes - a.votes)
    .filter(p => filterCategory === 'Todas' || p.category === filterCategory);

  const urgentProposals = proposals.filter(p => p.votes >= selectedUrgencyLevel);

  const handlePrintReport = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      
      {/* Dashboard Top Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Metric Card 1 */}
        <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-xs flex items-center space-x-4">
          <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-400 font-medium">Total Propuestas</p>
            <h3 className="text-2xl font-bold text-slate-900">{totalProposals}</h3>
          </div>
        </div>

        {/* Metric Card 2 */}
        <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-xs flex items-center space-x-4">
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-400 font-medium">Votos Emitidos</p>
            <h3 className="text-2xl font-bold text-slate-900">{totalVotes}</h3>
          </div>
        </div>

        {/* Metric Card 3 */}
        <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-xs flex items-center space-x-4">
          <div className="p-3 bg-amber-50 text-amber-600 rounded-xl">
            <RefreshCw className="w-6 h-6 animate-spin-slow" />
          </div>
          <div>
            <p className="text-xs text-slate-400 font-medium">En Revisión</p>
            <h3 className="text-2xl font-bold text-slate-900">{inReviewProposals}</h3>
          </div>
        </div>

        {/* Metric Card 4 */}
        <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-xs flex items-center space-x-4">
          <div className="p-3 bg-violet-50 text-violet-600 rounded-xl">
            <CheckSquare className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-400 font-medium">Resueltas/Aprobadas</p>
            <h3 className="text-2xl font-bold text-slate-900">{resolvedProposals}</h3>
          </div>
        </div>

      </div>

      {/* Main Grid: Charts & Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Chart 1: Proposals count by category */}
        <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-slate-900 flex items-center space-x-2">
              <BarChart3 className="w-4 h-4 text-indigo-500" />
              <span>Propuestas Creadas por Categoría</span>
            </h3>
            <span className="text-xs text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">Cantidad</span>
          </div>
          
          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryChartData} margin={{ top: 10, right: 10, left: -20, bottom: 5 }}>
                <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#64748b' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fill: '#64748b' }} axisLine={false} tickLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#fff', border: '1px solid #f1f5f9', borderRadius: '12px', fontSize: '12px' }}
                  labelStyle={{ fontWeight: 'bold', color: '#1e293b' }}
                />
                <Bar dataKey="cantidad" radius={[4, 4, 0, 0]}>
                  {categoryChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Votes accumulated by category */}
        <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-slate-900 flex items-center space-x-2">
              <Users className="w-4 h-4 text-emerald-500" />
              <span>Interés Estudiantil (Votos Acumulados)</span>
            </h3>
            <span className="text-xs text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">Votos</span>
          </div>
          
          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryVotesData} margin={{ top: 10, right: 10, left: -20, bottom: 5 }}>
                <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#64748b' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fill: '#64748b' }} axisLine={false} tickLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#fff', border: '1px solid #f1f5f9', borderRadius: '12px', fontSize: '12px' }}
                  labelStyle={{ fontWeight: 'bold', color: '#1e293b' }}
                />
                <Bar dataKey="votos" radius={[4, 4, 0, 0]}>
                  {categoryVotesData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[(index + 2) % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* Decisions & Announcements Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Decision Panel (lg:col-span-2) */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-5 border border-slate-100 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-4 mb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900 flex items-center space-x-2">
                <ShieldCheck className="w-5 h-5 text-indigo-600" />
                <span>Panel de Decisiones Administrativas</span>
              </h3>
              <p className="text-xs text-slate-400">Controla el estado de las propuestas que tus alumnos han priorizado mediante su voto.</p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center space-x-2">
                <span className="text-xs text-slate-500">Filtrar:</span>
                <select
                  id="admin-filter-category"
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                  className="text-xs border border-slate-200 rounded-lg p-1.5 bg-white text-slate-600 focus:outline-none"
                >
                  <option value="Todas">Todas</option>
                  <option value="Infraestructura">Infraestructura</option>
                  <option value="Convivencia">Convivencia</option>
                  <option value="Deportes">Deportes</option>
                  <option value="Académico">Académico</option>
                  <option value="Ecología">Ecología</option>
                  <option value="Otros">Otros</option>
                </select>
              </div>

              <button
                id="btn-gen-report"
                onClick={() => setReportModalOpen(true)}
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-xs px-3.5 py-1.5 rounded-lg flex items-center space-x-1.5 shadow-sm transition-all"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Generar Informe Oficial</span>
              </button>
            </div>
          </div>

          {/* Priority proposals table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100 text-slate-500">
                  <th className="py-3 px-4 font-bold">Título / Detalle</th>
                  <th className="py-3 px-4 font-bold">Categoría</th>
                  <th className="py-3 px-4 font-bold text-center">Votos</th>
                  <th className="py-3 px-4 font-bold">Estado Actual</th>
                  <th className="py-3 px-4 font-bold text-right">Acción</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {priorityProposals.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-slate-400 italic">No se encontraron propuestas registradas.</td>
                  </tr>
                ) : (
                  priorityProposals.map(p => (
                    <tr key={p.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="py-4 px-4 max-w-xs">
                        <p className="font-bold text-slate-900 leading-tight mb-1">{p.title}</p>
                        <p className="text-slate-400 text-[11px] line-clamp-1">Por: {p.author}</p>
                      </td>
                      <td className="py-4 px-4">
                        <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md font-medium border border-slate-200">
                          {p.category}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-center">
                        <div className="inline-flex items-center space-x-1 font-bold text-slate-800 bg-slate-100 px-2.5 py-1 rounded-lg">
                          <span className="text-indigo-600">★</span>
                          <span>{p.votes}</span>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <span className={`px-2 py-0.5 rounded-full font-medium border ${
                          p.status === 'Pendiente' ? 'bg-amber-100 text-amber-800 border-amber-200' :
                          p.status === 'En Revisión' ? 'bg-blue-100 text-blue-800 border-blue-200' :
                          p.status === 'Aprobado' ? 'bg-emerald-100 text-emerald-800 border-emerald-200' :
                          'bg-violet-100 text-violet-800 border-violet-200'
                        }`}>
                          {p.status}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-right">
                        <div className="flex justify-end gap-1">
                          <button
                            id={`action-rev-${p.id}`}
                            disabled={p.status === 'En Revisión'}
                            onClick={() => onChangeStatus(p.id, 'En Revisión')}
                            className="bg-blue-50 text-blue-700 hover:bg-blue-100 disabled:opacity-40 px-2 py-1 rounded text-[10px] font-bold border border-blue-100 transition-all cursor-pointer"
                            title="Cambiar a En Revisión"
                          >
                            Revisar
                          </button>
                          <button
                            id={`action-aprov-${p.id}`}
                            disabled={p.status === 'Aprobado'}
                            onClick={() => onChangeStatus(p.id, 'Aprobado')}
                            className="bg-emerald-50 text-emerald-700 hover:bg-emerald-100 disabled:opacity-40 px-2 py-1 rounded text-[10px] font-bold border border-emerald-100 transition-all cursor-pointer"
                            title="Cambiar a Aprobado"
                          >
                            Aprobar
                          </button>
                          <button
                            id={`action-res-${p.id}`}
                            disabled={p.status === 'Resuelto'}
                            onClick={() => onChangeStatus(p.id, 'Resuelto')}
                            className="bg-violet-50 text-violet-700 hover:bg-violet-100 disabled:opacity-40 px-2 py-1 rounded text-[10px] font-bold border border-violet-100 transition-all cursor-pointer"
                            title="Cambiar a Resuelto"
                          >
                            Resolver
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Column: Announcement Panel (lg:col-span-1) */}
        <div className="lg:col-span-1 bg-white rounded-2xl p-5 border border-slate-100 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center space-x-2 pb-3 border-b border-slate-100 mb-4">
              <Bell className="w-5 h-5 text-indigo-600" />
              <h3 className="text-sm font-bold text-slate-900">Gestión de Anuncios</h3>
            </div>
            
            <form onSubmit={handleAnnouncementSubmit} className="space-y-3">
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Título del Anuncio</label>
                <input
                  type="text"
                  required
                  value={annTitle}
                  onChange={(e) => setAnnTitle(e.target.value)}
                  placeholder="Ej: Ampliación de plazo"
                  className="w-full text-xs border border-slate-200 rounded-lg p-2 bg-slate-50 focus:outline-none focus:bg-white focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Contenido / Detalle</label>
                <textarea
                  required
                  rows={2}
                  value={annContent}
                  onChange={(e) => setAnnContent(e.target.value)}
                  placeholder="Escribe el mensaje oficial aquí..."
                  className="w-full text-xs border border-slate-200 rounded-lg p-2 bg-slate-50 focus:outline-none focus:bg-white focus:ring-1 focus:ring-indigo-500 resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Categoría</label>
                  <select
                    value={annCategory}
                    onChange={(e) => setAnnCategory(e.target.value as any)}
                    className="w-full text-xs border border-slate-200 rounded-lg p-2 bg-slate-50 focus:outline-none focus:bg-white"
                  >
                    <option value="General">General</option>
                    <option value="Urgente">Urgente</option>
                    <option value="Evento">Evento</option>
                    <option value="Logro">Logro</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Autor / Emisor</label>
                  <input
                    type="text"
                    required
                    value={annAuthor}
                    onChange={(e) => setAnnAuthor(e.target.value)}
                    placeholder="Ej: Municipio Escolar"
                    className="w-full text-xs border border-slate-200 rounded-lg p-2 bg-slate-50 focus:outline-none focus:bg-white focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-xl text-xs transition-all flex items-center justify-center space-x-1.5 shadow-sm cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Publicar Anuncio</span>
              </button>
            </form>
          </div>

          <div className="mt-6 border-t border-slate-100 pt-4">
            <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Anuncios Activos ({announcements.length})</h4>
            <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
              {announcements.map((ann) => (
                <div key={ann.id} className="p-2.5 bg-slate-50 rounded-lg border border-slate-100 flex items-start justify-between text-[11px]">
                  <div className="flex-1 min-w-0 pr-2">
                    <div className="flex items-center space-x-1 mb-0.5">
                      <span className={`text-[8px] font-bold px-1.5 py-0.2 rounded-full uppercase ${
                        ann.category === 'Urgente' ? 'bg-rose-100 text-rose-800' :
                        ann.category === 'Logro' ? 'bg-emerald-100 text-emerald-800' :
                        'bg-indigo-100 text-indigo-800'
                      }`}>
                        {ann.category}
                      </span>
                      <span className="text-slate-400 text-[9px]">
                        {new Date(ann.date).toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })}
                      </span>
                    </div>
                    <p className="font-bold text-slate-800 truncate">{ann.title}</p>
                    <p className="text-slate-500 line-clamp-1">{ann.content}</p>
                  </div>
                  <button
                    onClick={() => onDeleteAnnouncement(ann.id)}
                    className="text-slate-400 hover:text-rose-600 p-1 cursor-pointer transition-colors"
                    title="Eliminar anuncio"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>

      {/* Report Generator Modal */}
      <AnimatePresence>
        {reportModalOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4 z-50 print:p-0 print:bg-white print:fixed print:inset-0"
          >
            <motion.div
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 15 }}
              className="bg-white rounded-2xl p-6 md:p-8 max-w-3xl w-full shadow-2xl border border-slate-100 max-h-[92vh] overflow-y-auto print:max-h-full print:w-full print:border-none print:shadow-none"
            >
              
              {/* Report Header buttons (hidden during printing) */}
              <div className="flex items-center justify-between pb-4 border-b border-slate-100 print:hidden mb-6">
                <h3 className="text-sm font-bold text-indigo-950 flex items-center space-x-1.5">
                  <Sparkles className="text-indigo-600 w-4 h-4" />
                  <span>Informe de Prioridades Estudiantiles</span>
                </h3>
                <div className="flex items-center space-x-2">
                  <button
                    id="btn-print"
                    onClick={handlePrintReport}
                    className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium text-xs px-3 py-1.5 rounded-lg flex items-center space-x-1 transition-all"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span>Imprimir</span>
                  </button>
                  <button
                    id="btn-close-report"
                    onClick={() => setReportModalOpen(false)}
                    className="text-slate-400 hover:text-slate-600 text-lg font-bold p-1 ml-2"
                  >
                    &times;
                  </button>
                </div>
              </div>

              {/* REPORT BODY */}
              <div id="print-area" className="space-y-6 text-slate-800 p-2">
                
                {/* Official heading */}
                <div className="flex items-center justify-between border-b-2 border-slate-900 pb-4">
                  <div>
                    <h1 className="text-base font-bold text-slate-900 tracking-tight uppercase">I.E. Miguel Grau - Abancay</h1>
                    <p className="text-xs text-slate-500">Avenida Seoane, Abancay, Apurímac, Perú</p>
                    <p className="text-[10px] text-indigo-600 font-semibold tracking-wider uppercase">Grau App • Portal de Inteligencia Democrática</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-bold text-slate-900">REPORTE OFICIAL N° 004-2026</p>
                    <p className="text-[10px] text-slate-400">Fecha de Generación: {new Date().toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                    <p className="text-[10px] text-emerald-600 font-medium">Sostenibilidad Social: Costo S/ 0.00 (Mantenimiento: S/ 30.00)</p>
                  </div>
                </div>

                {/* Executive summary */}
                <div className="space-y-2">
                  <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">I. Resumen Ejecutivo</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    El presente informe compila las prioridades y demandas consensuadas por los estudiantes de secundaria de la I.E. Miguel Grau, registradas y validadas mediante votación democrática en la plataforma móvil <strong>Grau App</strong>. Este instrumento permite orientar la toma de decisiones directivas basándose en datos reales de urgencia y adhesión comunitaria.
                  </p>
                  
                  <div className="grid grid-cols-3 gap-4 py-3 border-y border-slate-100">
                    <div className="text-center">
                      <p className="text-[10px] text-slate-400 font-medium">Total de Ideas Recibidas</p>
                      <p className="text-base font-bold text-slate-800">{totalProposals}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-[10px] text-slate-400 font-medium">Soporte Demográfico (Votos)</p>
                      <p className="text-base font-bold text-slate-800">{totalVotes}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-[10px] text-slate-400 font-medium">Casos Urgentes (Votos &gt;= {selectedUrgencyLevel})</p>
                      <p className="text-base font-bold text-emerald-600">{urgentProposals.length}</p>
                    </div>
                  </div>
                </div>

                {/* Priority items details */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">II. Propuestas de Mayor Urgencia (Top de Interés)</h3>
                    <div className="text-[11px] text-slate-500 print:hidden flex items-center space-x-2">
                      <span>Votos Mínimos:</span>
                      <input
                        id="urgency-range"
                        type="range"
                        min="10"
                        max="60"
                        step="5"
                        value={selectedUrgencyLevel}
                        onChange={(e) => setSelectedUrgencyLevel(Number(e.target.value))}
                        className="w-20 accent-indigo-600"
                      />
                      <span className="font-bold text-indigo-700">{selectedUrgencyLevel}</span>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {urgentProposals.length === 0 ? (
                      <p className="text-xs text-slate-400 italic">No hay propuestas que alcancen el umbral de urgencia configurado de {selectedUrgencyLevel} votos.</p>
                    ) : (
                      urgentProposals.map((up, i) => (
                        <div key={up.id} className="bg-slate-50 rounded-xl p-3 border border-slate-200 flex items-start space-x-3 text-xs">
                          <span className="bg-indigo-600 text-white rounded-full w-5 h-5 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                            {i + 1}
                          </span>
                          <div className="flex-1">
                            <div className="flex justify-between">
                              <h4 className="font-bold text-slate-900">{up.title}</h4>
                              <span className="font-bold text-indigo-700">{up.votes} Estudiantes lo respaldan</span>
                            </div>
                            <p className="text-slate-500 text-[10px] mb-1">Categoría: {up.category} | Creador: {up.author}</p>
                            <p className="text-slate-600 leading-tight">{up.description}</p>
                            
                            {up.comments.length > 0 && (
                              <div className="mt-2 border-t border-slate-200 pt-1.5 space-y-1">
                                <span className="text-[9px] font-bold text-slate-400 uppercase">Comentarios Clave:</span>
                                {up.comments.slice(0, 2).map(c => (
                                  <p key={c.id} className="text-[10px] text-slate-500 leading-none italic">
                                    "{c.text}" — <span className="font-medium">{c.author}</span>
                                  </p>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                {/* Official signature block */}
                <div className="pt-8 grid grid-cols-2 gap-12 text-center text-[10px] text-slate-500">
                  <div className="border-t border-slate-300 pt-2">
                    <p className="font-bold text-slate-700">Municipio Escolar</p>
                    <p>I.E. Miguel Grau - Abancay</p>
                    <p>Canal Oficial Digital</p>
                  </div>
                  <div className="border-t border-slate-300 pt-2">
                    <p className="font-bold text-slate-700">Comisión de Innovación Tecnológica</p>
                    <p>Arian, Yohan, Rafael, Rolando, Ghio, Ayala</p>
                    <p>Equipo Creador Grau App</p>
                  </div>
                </div>

              </div>

            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
