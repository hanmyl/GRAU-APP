import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Plus, 
  Search, 
  ThumbsUp, 
  MessageSquare, 
  Calendar, 
  Tag, 
  CheckCircle2, 
  AlertCircle, 
  Filter, 
  TrendingUp, 
  User, 
  Volume2,
  Hourglass,
  CheckCircle
} from 'lucide-react';
import { Proposal, Comment } from '../types';

interface StudentPortalProps {
  proposals: Proposal[];
  onAddProposal: (proposal: Omit<Proposal, 'id' | 'votes' | 'votedBy' | 'createdAt' | 'status' | 'comments'>) => void;
  onVote: (id: string) => void;
  onAddComment: (proposalId: string, commentText: string, author: string) => void;
}

export default function StudentPortal({ 
  proposals, 
  onAddProposal, 
  onVote, 
  onAddComment 
}: StudentPortalProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('Todas');
  const [selectedStatus, setSelectedStatus] = useState<string>('Todos');
  const [sortBy, setSortBy] = useState<'votos' | 'recientes'>('votos');
  
  // New proposal form state
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState<Proposal['category']>('Infraestructura');
  const [newDescription, setNewDescription] = useState('');
  const [newAuthorName, setNewAuthorName] = useState('');
  const [newAuthorGrade, setNewAuthorGrade] = useState('5to A');

  // Comment section state
  const [activeProposalIdForComments, setActiveProposalIdForComments] = useState<string | null>(null);
  const [commentText, setCommentText] = useState('');
  const [commentAuthor, setCommentAuthor] = useState('');
  const [commentGrade, setCommentGrade] = useState('5to A');

  // Filter & Search Logic
  const filteredProposals = proposals
    .filter(p => {
      const matchesSearch = p.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            p.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            p.author.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'Todas' || p.category === selectedCategory;
      const matchesStatus = selectedStatus === 'Todos' || p.status === selectedStatus;
      return matchesSearch && matchesCategory && matchesStatus;
    })
    .sort((a, b) => {
      if (sortBy === 'votos') {
        return b.votes - a.votes;
      } else {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
    });

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newDescription.trim() || !newAuthorName.trim()) {
      alert('Por favor completa todos los campos requeridos.');
      return;
    }
    
    onAddProposal({
      title: newTitle,
      category: newCategory,
      description: newDescription,
      author: `${newAuthorName} (${newAuthorGrade})`,
    });

    // Reset form
    setNewTitle('');
    setNewDescription('');
    setNewAuthorName('');
    setIsFormOpen(false);
  };

  const handleCommentSubmit = (e: React.FormEvent, proposalId: string) => {
    e.preventDefault();
    if (!commentText.trim() || !commentAuthor.trim()) {
      alert('Por favor completa los campos del comentario.');
      return;
    }

    onAddComment(proposalId, commentText, `${commentAuthor} (${commentGrade})`);
    setCommentText('');
  };

  const getStatusColor = (status: Proposal['status']) => {
    switch (status) {
      case 'Pendiente': return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'En Revisión': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Aprobado': return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'Resuelto': return 'bg-violet-100 text-violet-800 border-violet-200';
    }
  };

  const getStatusIcon = (status: Proposal['status']) => {
    switch (status) {
      case 'Pendiente': return <Hourglass className="w-3.5 h-3.5" />;
      case 'En Revisión': return <AlertCircle className="w-3.5 h-3.5" />;
      case 'Aprobado': return <CheckCircle className="w-3.5 h-3.5" />;
      case 'Resuelto': return <CheckCircle2 className="w-3.5 h-3.5" />;
    }
  };

  const categories: Array<Proposal['category']> = [
    'Infraestructura', 'Convivencia', 'Deportes', 'Académico', 'Ecología', 'Otros'
  ];

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-indigo-900 via-slate-900 to-indigo-950 rounded-2xl p-6 md:p-8 text-white shadow-xl relative overflow-hidden border border-indigo-500/20">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center space-x-2 bg-indigo-500/20 backdrop-blur-sm border border-indigo-400/30 px-3 py-1 rounded-full text-xs text-indigo-200 mb-4">
            <Volume2 className="w-3.5 h-3.5 animate-pulse" />
            <span>I.E. Miguel Grau - Abancay</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-sans font-bold tracking-tight mb-3">
            El Panel de tus Ideas Estudiantiles
          </h1>
          <p className="text-slate-300 text-sm md:text-base leading-relaxed">
            Publica tus propuestas de mejora, vota por las ideas de tus compañeros de forma democrática y ayúdanos a priorizar lo que nuestro colegio necesita con urgencia.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <button
              id="btn-open-form"
              onClick={() => setIsFormOpen(true)}
              className="bg-emerald-500 hover:bg-emerald-600 text-white font-medium px-5 py-2.5 rounded-xl shadow-lg shadow-emerald-500/20 transition-all duration-200 flex items-center space-x-2 text-sm"
            >
              <Plus className="w-4 h-4" />
              <span>Publicar Nueva Propuesta</span>
            </button>
            <button
              onClick={() => {
                const tabBtn = document.getElementById('tab-btn-proyecto');
                if (tabBtn) tabBtn.click();
              }}
              className="bg-indigo-600/30 hover:bg-indigo-600/50 text-indigo-100 border border-indigo-400/30 font-medium px-4 py-2.5 rounded-xl backdrop-blur-sm transition-all duration-200 text-sm inline-flex items-center space-x-2"
            >
              <span>Ver Información del Proyecto</span>
            </button>
          </div>
        </div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl -z-0 translate-x-20 -translate-y-20"></div>
      </div>

      {/* Control Area: Search, Filter, Sorting */}
      <div className="bg-white rounded-xl p-4 md:p-6 border border-slate-100 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          
          {/* Search Box */}
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
            <input
              id="search-input"
              type="text"
              placeholder="Buscar por propuesta, autor, salón..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl text-slate-700 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-sm"
            />
          </div>

          {/* Sorters and Category dropdowns */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center space-x-1.5 bg-slate-100 rounded-lg p-1">
              <button
                id="sort-votos"
                onClick={() => setSortBy('votos')}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
                  sortBy === 'votos' 
                    ? 'bg-white text-indigo-950 shadow-sm' 
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Más Votados
              </button>
              <button
                id="sort-recientes"
                onClick={() => setSortBy('recientes')}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
                  sortBy === 'recientes' 
                    ? 'bg-white text-indigo-950 shadow-sm' 
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Recientes
              </button>
            </div>
          </div>
        </div>

        {/* Category Filters row */}
        <div className="border-t border-slate-100 pt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-xs font-medium text-slate-400 mr-2 flex items-center">
              <Filter className="w-3.5 h-3.5 mr-1" /> Categoría:
            </span>
            <button
              id="cat-todas"
              onClick={() => setSelectedCategory('Todas')}
              className={`px-3 py-1 rounded-full text-xs font-medium border transition-all ${
                selectedCategory === 'Todas'
                  ? 'bg-indigo-50 border-indigo-200 text-indigo-700'
                  : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-600'
              }`}
            >
              Todas
            </button>
            {categories.map(cat => (
              <button
                key={cat}
                id={`cat-${cat}`}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1 rounded-full text-xs font-medium border transition-all ${
                  selectedCategory === cat
                    ? 'bg-indigo-50 border-indigo-200 text-indigo-700'
                    : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-600'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-xs font-medium text-slate-400">Estado:</span>
            <select
              id="status-select"
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="text-xs border border-slate-200 rounded-lg p-1 bg-white text-slate-600 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            >
              <option value="Todos">Todos los Estados</option>
              <option value="Pendiente">Pendiente</option>
              <option value="En Revisión">En Revisión</option>
              <option value="Aprobado">Aprobado / Listo</option>
              <option value="Resuelto">Resuelto</option>
            </select>
          </div>
        </div>
      </div>

      {/* Form Modal/Collapsible for adding proposal */}
      <AnimatePresence>
        {isFormOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50"
          >
            <motion.div
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 15 }}
              className="bg-white rounded-2xl p-6 max-w-lg w-full shadow-2xl border border-slate-100 max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <h3 className="text-lg font-bold text-slate-900 flex items-center space-x-2">
                  <Plus className="w-5 h-5 text-indigo-600" />
                  <span>Publicar propuesta de mejora</span>
                </h3>
                <button
                  id="btn-close-form"
                  onClick={() => setIsFormOpen(false)}
                  className="text-slate-400 hover:text-slate-600 text-lg font-bold p-1"
                >
                  &times;
                </button>
              </div>

              <form onSubmit={handleFormSubmit} className="mt-4 space-y-4">
                <div>
                  <label className="block text-xs font-medium text-slate-500 mb-1">Tu Nombre y Apellido *</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                    <input
                      id="form-author"
                      type="text"
                      placeholder="Ej. Juan Pérez"
                      required
                      value={newAuthorName}
                      onChange={(e) => setNewAuthorName(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-xl text-slate-700 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-sm"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-slate-500 mb-1">Grado y Sección *</label>
                    <select
                      id="form-grade"
                      value={newAuthorGrade}
                      onChange={(e) => setNewAuthorGrade(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl text-slate-700 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-sm"
                    >
                      <option value="1ro A">1ro A</option>
                      <option value="1ro B">1ro B</option>
                      <option value="2do A">2do A</option>
                      <option value="2do B">2do B</option>
                      <option value="3ro A">3ro A</option>
                      <option value="3ro B">3ro B</option>
                      <option value="3ro C">3ro C</option>
                      <option value="4to A">4to A</option>
                      <option value="4to B">4to B</option>
                      <option value="4to C">4to C</option>
                      <option value="5to A">5to A</option>
                      <option value="5to B">5to B</option>
                      <option value="5to C">5to C</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-500 mb-1">Categoría *</label>
                    <select
                      id="form-category"
                      value={newCategory}
                      onChange={(e) => setNewCategory(e.target.value as Proposal['category'])}
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl text-slate-700 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-sm"
                    >
                      {categories.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-500 mb-1">Título de la Propuesta *</label>
                  <input
                    id="form-title"
                    type="text"
                    placeholder="Ej. Reparación de los arcos de futsal"
                    required
                    maxLength={70}
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    className="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-slate-700 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-500 mb-1">Descripción Detallada *</label>
                  <textarea
                    id="form-description"
                    placeholder="Explica qué se necesita cambiar, por qué es importante para la comunidad grauna y cómo propones que se solucione..."
                    required
                    rows={4}
                    value={newDescription}
                    onChange={(e) => setNewDescription(e.target.value)}
                    className="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-slate-700 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-sm resize-none"
                  ></textarea>
                </div>

                <div className="bg-amber-50 rounded-xl p-3 border border-amber-100 flex items-start space-x-2 text-xs text-amber-800">
                  <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <p>
                    <strong>Nota:</strong> Tu propuesta pasará por el sistema para ser votada de forma democrática por tus compañeros. Recuerda expresarte con respeto y velar por el bien común.
                  </p>
                </div>

                <div className="flex space-x-2 justify-end pt-2 border-t border-slate-100">
                  <button
                    id="form-cancel"
                    type="button"
                    onClick={() => setIsFormOpen(false)}
                    className="px-4 py-2 text-xs font-semibold text-slate-500 hover:text-slate-700"
                  >
                    Cancelar
                  </button>
                  <button
                    id="form-submit"
                    type="submit"
                    className="px-5 py-2 text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-md transition-all"
                  >
                    Publicar
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Proposals list */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredProposals.length === 0 ? (
          <div className="col-span-full bg-slate-50 rounded-2xl py-12 px-4 text-center border-2 border-dashed border-slate-200">
            <TrendingUp className="w-8 h-8 text-slate-300 mx-auto mb-2" />
            <p className="text-slate-500 text-sm font-medium">No se encontraron propuestas con los filtros seleccionados.</p>
            <p className="text-slate-400 text-xs mt-1">¡Sé el primero en crear una propuesta sobre este tema!</p>
          </div>
        ) : (
          filteredProposals.map((proposal) => (
            <motion.div
              layout
              key={proposal.id}
              className="bg-white rounded-2xl p-5 border border-slate-100 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                {/* Proposal header */}
                <div className="flex items-center justify-between mb-3">
                  <span className="bg-indigo-50 text-indigo-700 text-xs font-semibold px-2.5 py-1 rounded-md border border-indigo-100">
                    {proposal.category}
                  </span>
                  <div className={`flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[11px] font-medium border ${getStatusColor(proposal.status)}`}>
                    {getStatusIcon(proposal.status)}
                    <span>{proposal.status}</span>
                  </div>
                </div>

                {/* Proposal content */}
                <h3 className="text-base font-bold text-slate-900 leading-snug mb-2">
                  {proposal.title}
                </h3>
                <p className="text-slate-600 text-xs leading-relaxed line-clamp-3 mb-4">
                  {proposal.description}
                </p>
              </div>

              {/* Proposal footer with interactive voting and comments toggle */}
              <div className="border-t border-slate-100 pt-4 mt-auto">
                <div className="flex items-center justify-between text-xs text-slate-400 mb-3">
                  <span className="flex items-center">
                    <User className="w-3.5 h-3.5 mr-1 text-slate-400" />
                    Por: <strong className="text-slate-700 font-medium ml-1">{proposal.author}</strong>
                  </span>
                  <span className="flex items-center">
                    <Calendar className="w-3.5 h-3.5 mr-1" />
                    {new Date(proposal.createdAt).toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })}
                  </span>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <button
                    id={`vote-btn-${proposal.id}`}
                    onClick={() => onVote(proposal.id)}
                    className="flex items-center space-x-1.5 px-3 py-1.5 bg-slate-50 hover:bg-emerald-50 text-slate-600 hover:text-emerald-700 font-bold rounded-lg border border-slate-100 hover:border-emerald-200 transition-all"
                  >
                    <ThumbsUp className="w-4 h-4 text-slate-400 group-hover:text-emerald-600" />
                    <span>{proposal.votes} Votos</span>
                  </button>

                  <button
                    id={`comment-toggle-${proposal.id}`}
                    onClick={() => setActiveProposalIdForComments(
                      activeProposalIdForComments === proposal.id ? null : proposal.id
                    )}
                    className="flex items-center space-x-1 px-2.5 py-1.5 hover:bg-slate-50 rounded-lg text-slate-500 hover:text-slate-800 font-medium transition-all"
                  >
                    <MessageSquare className="w-4 h-4 text-slate-400" />
                    <span>{proposal.comments.length} Comentarios</span>
                  </button>
                </div>
              </div>

              {/* Collapsible Comment Section */}
              <AnimatePresence>
                {activeProposalIdForComments === proposal.id && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="overflow-hidden border-t border-slate-100 mt-4 pt-4"
                  >
                    <h4 className="text-xs font-bold text-slate-700 mb-3 flex items-center">
                      <MessageSquare className="w-3.5 h-3.5 mr-1 text-indigo-500" />
                      Comentarios de la Comunidad ({proposal.comments.length})
                    </h4>

                    {/* Comment list */}
                    <div className="space-y-3 max-h-48 overflow-y-auto pr-1 mb-4">
                      {proposal.comments.length === 0 ? (
                        <p className="text-xs text-slate-400 italic">No hay comentarios aún. Deja tu opinión respetuosa abajo.</p>
                      ) : (
                        proposal.comments.map(c => (
                          <div key={c.id} className="bg-slate-50 rounded-xl p-2.5 border border-slate-100 text-xs">
                            <div className="flex items-center justify-between mb-1 text-slate-400">
                              <span className="font-semibold text-slate-700">{c.author}</span>
                              <span>{new Date(c.createdAt).toLocaleDateString('es-ES', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}</span>
                            </div>
                            <p className="text-slate-600 leading-relaxed">{c.text}</p>
                          </div>
                        ))
                      )}
                    </div>

                    {/* Add comment form */}
                    <form onSubmit={(e) => handleCommentSubmit(e, proposal.id)} className="space-y-2 bg-slate-50 p-3 rounded-xl border border-slate-100">
                      <div className="grid grid-cols-2 gap-2">
                        <input
                          id={`comment-author-${proposal.id}`}
                          type="text"
                          placeholder="Tu nombre"
                          required
                          value={commentAuthor}
                          onChange={(e) => setCommentAuthor(e.target.value)}
                          className="px-2.5 py-1.5 border border-slate-200 rounded-lg text-xs text-slate-700 bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                        />
                        <select
                          id={`comment-grade-${proposal.id}`}
                          value={commentGrade}
                          onChange={(e) => setCommentGrade(e.target.value)}
                          className="px-2.5 py-1.5 border border-slate-200 rounded-lg text-xs text-slate-500 bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                        >
                          <option value="1ro A">1ro A</option>
                          <option value="1ro B">1ro B</option>
                          <option value="2do A">2do A</option>
                          <option value="2do B">2do B</option>
                          <option value="3ro A">3ro A</option>
                          <option value="3ro B">3ro B</option>
                          <option value="3ro C">3ro C</option>
                          <option value="4to A">4to A</option>
                          <option value="4to B">4to B</option>
                          <option value="4to C">4to C</option>
                          <option value="5to A">5to A</option>
                          <option value="5to B">5to B</option>
                          <option value="5to C">5to C</option>
                        </select>
                      </div>
                      <div className="flex gap-1.5">
                        <input
                          id={`comment-text-${proposal.id}`}
                          type="text"
                          placeholder="Escribe un comentario constructivo..."
                          required
                          value={commentText}
                          onChange={(e) => setCommentText(e.target.value)}
                          className="flex-1 px-2.5 py-1.5 border border-slate-200 rounded-lg text-xs text-slate-700 bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                        />
                        <button
                          id={`comment-submit-${proposal.id}`}
                          type="submit"
                          className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-3 rounded-lg text-xs transition-all"
                        >
                          Enviar
                        </button>
                      </div>
                    </form>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}
