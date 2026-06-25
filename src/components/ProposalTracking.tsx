import React, { useState } from 'react';
import { Proposal } from '../types';
import { 
  Compass, 
  Calendar, 
  Share2, 
  Download, 
  MapPin, 
  TrendingUp, 
  Check, 
  Clock, 
  Star, 
  HelpCircle,
  MessageSquare,
  FileText
} from 'lucide-react';

interface ProposalTrackingProps {
  proposals: Proposal[];
}

export default function ProposalTracking({ proposals }: ProposalTrackingProps) {
  const [selectedProposalId, setSelectedProposalId] = useState<string>(proposals[0]?.id || '');
  const [commentText, setCommentText] = useState('');
  const [userComments, setUserComments] = useState<{ [key: string]: typeof proposals[0]['comments'] }>({});

  const selectedProposal = proposals.find(p => p.id === selectedProposalId) || proposals[0];

  const handleExportPDF = () => {
    alert(`Generando expediente oficial para ${selectedProposal?.title} (EXP-2026-${selectedProposal?.id}). Descarga iniciada.`);
  };

  const handleShare = () => {
    alert("Copiando enlace único del expediente al portapapeles. ¡Compártelo con tus compañeros!");
  };

  const handleAddLocalComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    const newComment = {
      id: `comment-track-${Date.now()}`,
      author: 'Tú (Estudiante Grau)',
      text: commentText.trim(),
      createdAt: new Date().toISOString()
    };

    setUserComments(prev => {
      const existing = prev[selectedProposal.id] || selectedProposal.comments || [];
      return {
        ...prev,
        [selectedProposal.id]: [...existing, newComment]
      };
    });

    setCommentText('');
  };

  if (!selectedProposal) {
    return (
      <div className="p-8 text-center text-slate-500 italic bg-slate-900 border border-slate-800 rounded-2xl">
        No se encontraron propuestas registradas para rastrear.
      </div>
    );
  }

  const currentComments = userComments[selectedProposal.id] || selectedProposal.comments || [];

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 space-y-6">
      
      {/* Selector of proposals for tracking */}
      <section className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col md:flex-row gap-4 items-center justify-between shadow-lg">
        <div className="space-y-1">
          <label className="block text-[10px] font-bold text-red-400 uppercase tracking-widest">Seleccionar Expediente</label>
          <p className="text-xs text-slate-400">Rastrea la viabilidad técnica y estado de tu iniciativa en tiempo real.</p>
        </div>
        
        <select
          value={selectedProposalId}
          onChange={(e) => setSelectedProposalId(e.target.value)}
          className="w-full md:w-96 bg-slate-950 border border-slate-800 rounded-xl py-3 px-4 text-xs font-semibold text-slate-200 focus:border-red-400 focus:ring-1 focus:ring-red-400 outline-none"
        >
          {proposals.map(p => (
            <option key={p.id} value={p.id}>
              EXP-2026-{p.id.split('-')[1] || '042'} | {p.title}
            </option>
          ))}
        </select>
      </section>

      {/* Breadcrumb & Header Action */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <nav className="flex text-slate-500 gap-1.5 text-xs font-semibold mb-2">
            <span className="hover:text-red-400 cursor-pointer">Propuestas</span>
            <span>/</span>
            <span className="text-red-400 font-bold">EXP-2026-{selectedProposal.id.split('-')[1] || '042'}</span>
          </nav>
          <h2 className="font-headline text-2xl md:text-3xl text-slate-100 tracking-tight leading-none uppercase">{selectedProposal.title}</h2>
          
          <div className="flex flex-wrap items-center gap-3 mt-3">
            <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5 border ${
              selectedProposal.status === 'Aprobado' ? 'bg-emerald-950/50 text-emerald-400 border-emerald-500/20' :
              selectedProposal.status === 'En Revisión' ? 'bg-blue-950/50 text-blue-400 border-blue-500/20' :
              selectedProposal.status === 'Resuelto' ? 'bg-purple-950/50 text-purple-400 border-purple-500/20' :
              'bg-yellow-950/50 text-yellow-500 border-yellow-500/20'
            }`}>
              <span className={`w-2 h-2 rounded-full ${
                selectedProposal.status === 'Aprobado' ? 'bg-emerald-400 animate-pulse' :
                selectedProposal.status === 'En Revisión' ? 'bg-blue-400 animate-pulse' :
                selectedProposal.status === 'Resuelto' ? 'bg-purple-400' :
                'bg-yellow-500 animate-pulse'
              }`}></span>
              ESTADO: {selectedProposal.status}
            </span>
            <span className="text-slate-500 text-xs flex items-center gap-1.5 font-medium">
              <Calendar className="w-3.5 h-3.5" />
              Creado: {new Date(selectedProposal.createdAt).toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' })}
            </span>
          </div>
        </div>

        <div className="flex gap-2 shrink-0 w-full md:w-auto">
          <button 
            onClick={handleShare}
            className="flex-1 md:flex-none px-4 py-2.5 rounded-xl border border-red-500/20 text-red-400 font-bold text-xs hover:bg-red-500/5 transition-all flex items-center justify-center gap-2"
          >
            <Share2 className="w-4 h-4" />
            <span>COMPARTIR</span>
          </button>
          <button 
            onClick={handleExportPDF}
            className="flex-1 md:flex-none px-4 py-2.5 rounded-xl bg-red-500 hover:bg-red-600 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 shadow-lg hover:shadow-red-500/15"
          >
            <Download className="w-4 h-4" />
            <span>EXPEDIENTE COMPLETO</span>
          </button>
        </div>
      </div>

      {/* Bento Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Details & Feedback */}
        <div className="col-span-12 lg:col-span-8 space-y-6">
          
          {/* Main Description Card */}
          <section className="bg-slate-900 border border-slate-800 p-5 rounded-2xl relative overflow-hidden shadow-xl">
            <div className="absolute top-0 left-0 w-1.5 h-full bg-red-500"></div>
            
            <h3 className="text-xs font-bold text-red-400 uppercase tracking-wider mb-4 flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px]">description</span>
              Detalles del Expediente Técnico
            </h3>
            
            <p className="text-xs lg:text-sm text-slate-300 leading-relaxed mb-6 font-medium">
              {selectedProposal.description}
            </p>

            <div className="grid grid-cols-3 gap-4">
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-center md:text-left">
                <p className="text-[10px] text-slate-500 uppercase tracking-widest mb-1 font-bold">Autor / Proponente</p>
                <p className="text-xs font-bold text-slate-200 truncate">{selectedProposal.author}</p>
              </div>
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-center md:text-left">
                <p className="text-[10px] text-slate-500 uppercase tracking-widest mb-1 font-bold">Categoría Escolar</p>
                <p className="text-xs font-bold text-red-400 truncate">{selectedProposal.category}</p>
              </div>
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-center md:text-left">
                <p className="text-[10px] text-slate-500 uppercase tracking-widest mb-1 font-bold">Votos de Comunidad</p>
                <p className="text-xs font-bold text-slate-200 flex items-center justify-center md:justify-start gap-1 font-mono">
                  <span>{selectedProposal.votes}</span>
                  <span className="text-red-400">★</span>
                </p>
              </div>
            </div>
          </section>

          {/* Official Feedback (Directiva) */}
          <section className="bg-slate-900 border border-slate-800 border-t-2 border-t-red-500 p-5 rounded-2xl shadow-xl">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-xs font-bold text-red-400 uppercase tracking-wider flex items-center gap-2">
                <span className="material-symbols-outlined text-[18px]">verified_user</span>
                Retroalimentación Oficial de Dirección
              </h3>
              <span className="text-[10px] text-slate-500 font-mono">Última Revisión</span>
            </div>

            <div className="flex gap-4 items-start">
              <div className="w-10 h-10 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-red-400 text-xl">gavel</span>
              </div>
              <div className="bg-slate-950 p-4 rounded-xl relative border border-slate-800/80 w-full">
                <p className="text-xs text-slate-400 leading-relaxed italic">
                  {selectedProposal.status === 'Aprobado' || selectedProposal.status === 'Resuelto' ? (
                    `"La mesa técnica del Municipio Escolar en coordinación con Dirección General ha revisado meticulosamente la propuesta de ${selectedProposal.author}. Consideramos que la viabilidad técnica y social es excelente. El presupuesto ha sido habilitado para iniciar operaciones a la brevedad."`
                  ) : selectedProposal.status === 'En Revisión' ? (
                    `"La propuesta para ${selectedProposal.title} se encuentra bajo evaluación por la plana docente y la Dirección de Infraestructura. El expediente cumple con los requisitos mínimos de sustentación y pasará a revisión de viabilidad presupuestaria."`
                  ) : (
                    `"La propuesta está registrada en el portal estudiantil y acumula votos del alumnado. Al superar los 30 votos de quorum, el Municipio Escolar redactará el informe para su elevación formal a Dirección."`
                  )}
                </p>
                <p className="mt-3 font-bold text-slate-200 text-xs">— Subdirección de la I.E. Miguel Grau</p>
              </div>
            </div>
          </section>

          {/* Feedback & Comments Ledger */}
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-slate-300 uppercase tracking-widest flex items-center gap-2">
                <span className="material-symbols-outlined text-[20px]">forum</span>
                Comentarios y Aportes ({currentComments.length})
              </h3>
            </div>

            <div className="space-y-2 max-h-48 overflow-y-auto pr-1 custom-scrollbar">
              {currentComments.length === 0 ? (
                <p className="p-4 text-center text-xs text-slate-600 italic bg-slate-900 border border-slate-800 rounded-xl">
                  No hay comentarios aún en esta propuesta. ¡Sé el primero en aportar!
                </p>
              ) : (
                currentComments.map((comment) => (
                  <div key={comment.id} className="bg-slate-900 border border-slate-800 p-3.5 rounded-xl flex gap-3 text-xs leading-normal">
                    <div className="w-8 h-8 rounded-full bg-slate-950 border border-slate-800 flex items-center justify-center shrink-0">
                      <span className="material-symbols-outlined text-slate-500">person</span>
                    </div>
                    <div>
                      <div className="flex justify-between items-baseline mb-1">
                        <span className="font-bold text-slate-200">{comment.author}</span>
                        <span className="text-[9px] text-slate-500 font-mono ml-4">
                          {new Date(comment.createdAt).toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })}
                        </span>
                      </div>
                      <p className="text-slate-400">{comment.text}</p>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Submit Comment */}
            <form onSubmit={handleAddLocalComment} className="flex gap-2">
              <input 
                type="text" 
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Añade tu sugerencia técnica o apoyo..."
                className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-4 py-2 text-xs text-slate-200 focus:border-red-400 focus:ring-1 focus:ring-red-400 outline-none"
              />
              <button 
                type="submit"
                className="bg-red-500 hover:bg-red-600 text-slate-950 px-5 py-2 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer"
              >
                Enviar
              </button>
            </form>
          </section>
        </div>

        {/* Right Column: Active Status Timeline tracker */}
        <div className="col-span-12 lg:col-span-4 space-y-6">
          
          <section className="bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-xl">
            <h3 className="text-xs font-bold text-slate-300 uppercase tracking-widest mb-6 flex items-center gap-2">
              <span className="material-symbols-outlined text-[20px]">analytics</span>
              Línea de Tiempo de Expediente
            </h3>

            <div className="relative pl-6 space-y-6 border-l-2 border-slate-800/80 ml-2.5">
              
              {/* Step 1: Creado */}
              <div className="relative">
                <div className="absolute -left-10 top-0.5 w-7 h-7 rounded-full bg-red-500 flex items-center justify-center border-4 border-slate-900 text-slate-950">
                  <Check className="w-3.5 h-3.5 font-bold" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-200">Propuesta Enviada</h4>
                  <p className="text-[10px] text-slate-500 mt-0.5">Fase 1 - Registro de Alumno</p>
                  <p className="text-[11px] text-slate-400 mt-1">Sometido a consideración de la Grau App con éxito.</p>
                </div>
              </div>

              {/* Step 2: Quorum / Revisión */}
              <div className="relative">
                <div className={`absolute -left-10 top-0.5 w-7 h-7 rounded-full flex items-center justify-center border-4 border-slate-900 ${
                  selectedProposal.votes >= 30 || selectedProposal.status !== 'Pendiente'
                    ? 'bg-red-500 text-slate-950' 
                    : 'bg-slate-800 text-slate-500'
                }`}>
                  {selectedProposal.votes >= 30 || selectedProposal.status !== 'Pendiente' ? (
                    <Check className="w-3.5 h-3.5 font-bold" />
                  ) : (
                    <Clock className="w-3.5 h-3.5" />
                  )}
                </div>
                <div>
                  <h4 className={`text-xs font-bold ${
                    selectedProposal.votes >= 30 || selectedProposal.status !== 'Pendiente' ? 'text-slate-200' : 'text-slate-500'
                  }`}>En Revisión de Quorum</h4>
                  <p className="text-[10px] text-slate-500 mt-0.5">Fase 2 - Filtro de Municipio ({selectedProposal.votes}/30 votos)</p>
                  <p className="text-[11px] text-slate-400 mt-1">Alcanza la consideración técnica tras la votación.</p>
                </div>
              </div>

              {/* Step 3: Aprobado */}
              <div className="relative">
                <div className={`absolute -left-10 top-0.5 w-7 h-7 rounded-full flex items-center justify-center border-4 border-slate-900 ${
                  selectedProposal.status === 'Aprobado' || selectedProposal.status === 'Resuelto'
                    ? 'bg-red-500 text-slate-950' 
                    : 'bg-slate-800 text-slate-500'
                }`}>
                  {selectedProposal.status === 'Aprobado' || selectedProposal.status === 'Resuelto' ? (
                    <Check className="w-3.5 h-3.5 font-bold" />
                  ) : (
                    <Clock className="w-3.5 h-3.5" />
                  )}
                </div>
                <div>
                  <h4 className={`text-xs font-bold ${
                    selectedProposal.status === 'Aprobado' || selectedProposal.status === 'Resuelto' ? 'text-slate-200' : 'text-slate-500'
                  }`}>Aprobado por Dirección</h4>
                  <p className="text-[10px] text-slate-500 mt-0.5">Fase 3 - Dictamen de Subdirección</p>
                  <p className="text-[11px] text-slate-400 mt-1">Considerada viable y con presupuesto aprobado para ejecución.</p>
                </div>
              </div>

              {/* Step 4: Resuelto */}
              <div className="relative">
                <div className={`absolute -left-10 top-0.5 w-7 h-7 rounded-full flex items-center justify-center border-4 border-slate-900 ${
                  selectedProposal.status === 'Resuelto'
                    ? 'bg-red-500 text-slate-950 shadow-[0_0_8px_rgba(239,68,68,0.4)] animate-pulse' 
                    : 'bg-slate-800 text-slate-500'
                }`}>
                  <Star className="w-3 h-3 font-bold fill-current" />
                </div>
                <div>
                  <h4 className={`text-xs font-bold ${selectedProposal.status === 'Resuelto' ? 'text-red-400' : 'text-slate-500'}`}>Ejecución / Resuelto</h4>
                  <p className="text-[10px] text-slate-500 mt-0.5">Fase Final - Entrega a la Comunidad</p>
                  <p className="text-[11px] text-slate-400 mt-1">El proyecto solar/infraestructura ha sido completado con éxito.</p>
                </div>
              </div>

            </div>
          </section>

          {/* Attached documents */}
          <section className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl">
            <h3 className="text-xs font-bold text-slate-300 uppercase tracking-widest mb-4">Documentación Adjunta</h3>
            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between p-3 bg-slate-950 border border-slate-800/80 rounded-xl group cursor-pointer hover:border-red-400/40 transition-all">
                <div className="flex items-center space-x-2 truncate">
                  <FileText className="w-4 h-4 text-red-400 shrink-0" />
                  <span className="text-slate-300 truncate">Plano_Campus_Este.pdf</span>
                </div>
                <span className="material-symbols-outlined text-slate-500 hover:text-slate-200">download</span>
              </div>

              <div className="flex items-center justify-between p-3 bg-slate-950 border border-slate-800/80 rounded-xl group cursor-pointer hover:border-red-400/40 transition-all">
                <div className="flex items-center space-x-2 truncate">
                  <FileText className="w-4 h-4 text-red-400 shrink-0" />
                  <span className="text-slate-300 truncate">Desglose_Costos.xlsx</span>
                </div>
                <span className="material-symbols-outlined text-slate-500 hover:text-slate-200">download</span>
              </div>
            </div>
          </section>
        </div>

      </div>

    </div>
  );
}
