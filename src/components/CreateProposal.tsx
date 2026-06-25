import React, { useState } from 'react';
import { Proposal } from '../types';
import { 
  FileText, 
  Sparkles, 
  PlusCircle, 
  Trash2, 
  Upload, 
  CheckCircle, 
  HelpCircle,
  TrendingUp,
  FileUp,
  CheckCircle2
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface CreateProposalProps {
  onAddProposal: (newProp: Omit<Proposal, 'id' | 'votes' | 'votedBy' | 'createdAt' | 'status' | 'comments'>) => void;
  setActiveTab: (tab: any) => void;
}

export default function CreateProposal({ onAddProposal, setActiveTab }: CreateProposalProps) {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<Proposal['category']>('Infraestructura');
  const [term, setTerm] = useState('corto');
  const [description, setDescription] = useState('');
  const [authorName, setAuthorName] = useState('');
  const [authorGrade, setAuthorGrade] = useState('5to A');
  const [objectives, setObjectives] = useState<string[]>(['']);
  const [files, setFiles] = useState<{ name: string; size: string }[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [successMessage, setSuccessMessage] = useState(false);

  // Dynamic quality calculation based on filled fields
  const calculateQuality = () => {
    let score = 20; // base score
    if (title.trim().length > 10) score += 20;
    if (description.trim().length > 30) score += 20;
    if (authorName.trim().length > 2) score += 10;
    const validObjectives = objectives.filter(obj => obj.trim().length > 0);
    if (validObjectives.length >= 1) score += 15;
    if (validObjectives.length >= 3) score += 10;
    if (files.length > 0) score += 5;
    return Math.min(score, 100);
  };

  const handleAddObjective = () => {
    setObjectives([...objectives, '']);
  };

  const handleObjectiveChange = (index: number, value: string) => {
    const updated = [...objectives];
    updated[index] = value;
    setObjectives(updated);
  };

  const handleRemoveObjective = (index: number) => {
    if (objectives.length === 1) {
      setObjectives(['']);
    } else {
      setObjectives(objectives.filter((_, i) => i !== index));
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const newFiles = Array.from(e.dataTransfer.files).map((file: any) => ({
        name: file.name,
        size: (file.size / (1024 * 1024)).toFixed(2) + ' MB'
      }));
      setFiles([...files, ...newFiles]);
    }
  };

  const triggerMockUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files).map((file: any) => ({
        name: file.name,
        size: (file.size / (1024 * 1024)).toFixed(2) + ' MB'
      }));
      setFiles([...files, ...newFiles]);
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim() || !authorName.trim()) {
      alert('Por favor completa todos los campos requeridos marcados.');
      return;
    }

    onAddProposal({
      title: title.trim(),
      category,
      description: description.trim(),
      author: `${authorName.trim()} (${authorGrade})`
    });

    setSuccessMessage(true);
    setTimeout(() => {
      setSuccessMessage(false);
      // Redirect to proposals view
      setActiveTab('propuestas');
    }, 2500);

    // Reset fields
    setTitle('');
    setDescription('');
    setAuthorName('');
    setObjectives(['']);
    setFiles([]);
  };

  const qualityScore = calculateQuality();

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      <AnimatePresence>
        {successMessage && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-6 right-6 z-50 bg-emerald-950 border border-emerald-500 text-emerald-200 px-6 py-4 rounded-xl shadow-2xl flex items-center space-x-3"
          >
            <CheckCircle2 className="w-6 h-6 text-emerald-400 animate-bounce" />
            <div>
              <p className="font-bold">¡Propuesta Publicada!</p>
              <p className="text-xs text-emerald-400">Se registró correctamente en la base del portal.</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="mb-6">
        <span className="text-xs uppercase tracking-wider font-bold text-red-400 flex items-center gap-1.5 mb-1">
          <Sparkles className="w-3.5 h-3.5" />
          Editor de Propuestas
        </span>
        <h2 className="font-headline text-3xl md:text-4xl text-slate-100 tracking-tight leading-none">NUEVA PROPUESTA</h2>
        <p className="text-sm text-slate-400 mt-1">Define tu visión para mejorar la comunidad estudiantil. Completa los campos detalladamente para que tenga mayor aceptación.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Form Editor */}
        <form onSubmit={handleFormSubmit} className="lg:col-span-8 space-y-6">
          {/* Basic Info Section */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1.5 h-full bg-red-500"></div>
            <h3 className="text-sm font-bold text-slate-200 mb-4 uppercase tracking-wider flex items-center gap-2">
              <span className="material-symbols-outlined text-red-400">info</span>
              Información Básica
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Título de la Propuesta *</label>
                <input 
                  type="text" 
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Ej: Implementación de Puntos de Carga Solar" 
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl focus:border-red-400 focus:ring-1 focus:ring-red-400 transition-all text-sm py-3 px-4 text-slate-100 placeholder-slate-600 outline-none"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Categoría *</label>
                  <select 
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl focus:border-red-400 focus:ring-1 focus:ring-red-400 transition-all text-sm py-3 px-4 text-slate-200 outline-none"
                  >
                    <option value="Infraestructura">Infraestructura</option>
                    <option value="Convivencia">Convivencia</option>
                    <option value="Deportes">Deportes</option>
                    <option value="Académico">Académico</option>
                    <option value="Ecología">Ecología</option>
                    <option value="Otros">Otros</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Plazo Estimado de Ejecución</label>
                  <select 
                    value={term}
                    onChange={(e) => setTerm(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl focus:border-red-400 focus:ring-1 focus:ring-red-400 transition-all text-sm py-3 px-4 text-slate-200 outline-none"
                  >
                    <option value="corto">Corto Plazo (1-3 meses)</option>
                    <option value="medio">Medio Plazo (3-6 meses)</option>
                    <option value="largo">Largo Plazo (+6 meses)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Nombre del Proponente *</label>
                  <input 
                    type="text" 
                    required
                    value={authorName}
                    onChange={(e) => setAuthorName(e.target.value)}
                    placeholder="Ej: Alex Martínez" 
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl focus:border-red-400 focus:ring-1 focus:ring-red-400 transition-all text-sm py-3 px-4 text-slate-100 placeholder-slate-600 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Grado / Sección *</label>
                  <select 
                    value={authorGrade}
                    onChange={(e) => setAuthorGrade(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl focus:border-red-400 focus:ring-1 focus:ring-red-400 transition-all text-sm py-3 px-4 text-slate-200 outline-none"
                  >
                    <option value="1ro A">1ro de Secundaria - Sección A</option>
                    <option value="1ro B">1ro de Secundaria - Sección B</option>
                    <option value="2do A">2do de Secundaria - Sección A</option>
                    <option value="2do B">2do de Secundaria - Sección B</option>
                    <option value="3ro A">3ro de Secundaria - Sección A</option>
                    <option value="3ro B">3ro de Secundaria - Sección B</option>
                    <option value="4to A">4to de Secundaria - Sección A</option>
                    <option value="4to B">4to de Secundaria - Sección B</option>
                    <option value="5to A">5to de Secundaria - Sección A</option>
                    <option value="5to B">5to de Secundaria - Sección B</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Description Section */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl">
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Descripción Detallada *</label>
            <textarea 
              required
              rows={5}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Explica detalladamente cuál es el problema actual en el colegio y cómo tu propuesta lo resuelve de forma práctica..." 
              className="w-full bg-slate-950 border border-slate-800 rounded-xl focus:border-red-400 focus:ring-1 focus:ring-red-400 transition-all text-sm py-3 px-4 text-slate-100 placeholder-slate-600 outline-none resize-none"
            />
          </div>

          {/* Objectives Section */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl">
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Objetivos Clave</label>
            <p className="text-xs text-slate-500 mb-3">Define al menos 3 metas medibles o acciones concretas que contempla tu proyecto.</p>
            
            <div className="space-y-3">
              {objectives.map((obj, index) => (
                <div key={index} className="flex gap-2 items-center">
                  <input 
                    type="text"
                    value={obj}
                    onChange={(e) => handleObjectiveChange(index, e.target.value)}
                    placeholder={`Objetivo #${index + 1}`}
                    className="flex-1 bg-slate-950 border border-slate-800 rounded-xl focus:border-red-400 focus:ring-1 focus:ring-red-400 transition-all text-sm py-2 px-4 text-slate-100 outline-none"
                  />
                  {objectives.length > 1 && (
                    <button 
                      type="button"
                      onClick={() => handleRemoveObjective(index)}
                      className="p-2 text-slate-500 hover:text-rose-500 rounded-lg hover:bg-rose-950/20 transition-all"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
              
              <button 
                type="button"
                onClick={handleAddObjective}
                className="mt-2 text-xs font-bold text-red-400 hover:text-red-300 transition-all flex items-center space-x-1"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Añadir un objetivo específico</span>
              </button>
            </div>
          </div>

          {/* Attachments Section */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl">
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Archivos y Referencias Visuales</label>
            <div 
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`border-2 border-dashed rounded-2xl p-6 text-center transition-all cursor-pointer group ${
                isDragging ? 'border-red-400 bg-red-950/10' : 'border-slate-800 hover:border-red-500/50'
              }`}
            >
              <div className="flex flex-col items-center">
                <FileUp className="w-10 h-10 text-slate-500 group-hover:text-red-400 transition-all mb-2" />
                <p className="text-sm text-slate-300">Arrastra archivos aquí o <span className="text-red-400 font-bold hover:underline">explora tus carpetas</span></p>
                <p className="text-xs text-slate-500 mt-1">Formatos aceptados: JPG, PNG, PDF (Máx 10MB)</p>
                
                <input 
                  type="file" 
                  multiple 
                  onChange={triggerMockUpload}
                  className="hidden" 
                  id="file-upload-input" 
                />
                <button 
                  type="button"
                  onClick={() => document.getElementById('file-upload-input')?.click()}
                  className="mt-3 px-4 py-1.5 bg-slate-950 border border-slate-800 hover:border-slate-700 rounded-lg text-xs font-bold text-slate-300 transition-all"
                >
                  Seleccionar Archivo
                </button>
              </div>
            </div>

            {files.length > 0 && (
              <div className="mt-4 space-y-2">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Archivos Seleccionados ({files.length})</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {files.map((file, i) => (
                    <div key={i} className="flex items-center justify-between p-2.5 bg-slate-950 rounded-xl border border-slate-800 text-xs">
                      <div className="flex items-center space-x-2 truncate">
                        <FileText className="w-4 h-4 text-red-400 shrink-0" />
                        <span className="text-slate-300 truncate font-medium">{file.name}</span>
                      </div>
                      <span className="text-slate-500 font-mono text-[10px] shrink-0 ml-2">{file.size}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Action Bar */}
          <div className="flex items-center justify-between pt-2">
            <button 
              type="button"
              onClick={() => {
                if(confirm("¿Seguro que deseas salir? Se perderán los cambios.")) {
                  setActiveTab('propuestas');
                }
              }}
              className="px-5 py-2.5 text-slate-400 hover:text-slate-200 hover:bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-xl text-xs font-bold transition-all"
            >
              Cancelar
            </button>
            <button 
              type="submit"
              className="bg-red-500 hover:bg-red-600 text-slate-950 font-bold py-3 px-8 rounded-xl text-xs transition-all flex items-center space-x-2 shadow-lg hover:shadow-red-500/20"
            >
              <span className="material-symbols-outlined text-[18px]">rocket_launch</span>
              <span>Publicar Propuesta</span>
            </button>
          </div>
        </form>

        {/* Right Column: Sidebar Quality & Guidelines */}
        <div className="lg:col-span-4 space-y-6">
          {/* Quality Meter Card */}
          <div className="bg-slate-900 border border-slate-800 border-t-4 border-t-red-500 rounded-2xl p-5 shadow-xl sticky top-24">
            <h3 className="text-sm font-bold text-slate-200 mb-1 uppercase tracking-wider">Calidad de Propuesta</h3>
            <p className="text-xs text-slate-400 mb-4">Completa más campos para aumentar la claridad y probabilidad de aprobación.</p>
            
            <div className="relative pt-1">
              <div className="flex mb-2 items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold inline-block py-1 px-2.5 uppercase rounded-full text-red-300 bg-red-950/50 border border-red-500/20">
                    {qualityScore < 50 ? 'Borrador Básico' : qualityScore < 85 ? 'Excelente Nivel' : 'Nivel de Excelencia'}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-xs font-bold text-red-400 font-mono">
                    {qualityScore}%
                  </span>
                </div>
              </div>
              <div className="overflow-hidden h-2.5 rounded-full bg-slate-950 flex border border-slate-800">
                <div 
                  className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-red-500 transition-all duration-500" 
                  style={{ width: `${qualityScore}%` }}
                ></div>
              </div>
            </div>

            <ul className="space-y-4 mt-6">
              <li className="flex items-start gap-3">
                <CheckCircle className={`w-5 h-5 shrink-0 mt-0.5 ${title.trim().length > 10 ? 'text-red-400' : 'text-slate-600'}`} />
                <div className="flex-1">
                  <p className="text-xs font-bold text-slate-300">Título Detallado</p>
                  <p className="text-[11px] text-slate-500">Un título claro y descriptivo ayuda a identificar el fin.</p>
                </div>
              </li>
              
              <li className="flex items-start gap-3">
                <CheckCircle className={`w-5 h-5 shrink-0 mt-0.5 ${description.trim().length > 30 ? 'text-red-400' : 'text-slate-600'}`} />
                <div className="flex-1">
                  <p className="text-xs font-bold text-slate-300">Descripción Amplia</p>
                  <p className="text-[11px] text-slate-500">Explica el contexto y solución detalladamente.</p>
                </div>
              </li>

              <li className="flex items-start gap-3">
                <CheckCircle className={`w-5 h-5 shrink-0 mt-0.5 ${objectives.filter(o => o.trim()).length >= 3 ? 'text-red-400' : 'text-slate-600'}`} />
                <div className="flex-1">
                  <p className="text-xs font-bold text-slate-300">Mínimo 3 Objetivos</p>
                  <p className="text-[11px] text-slate-500">Demuestra metas claras e impactos cuantificables.</p>
                </div>
              </li>

              <li className="flex items-start gap-3">
                <CheckCircle className={`w-5 h-5 shrink-0 mt-0.5 ${files.length > 0 ? 'text-red-400' : 'text-slate-600'}`} />
                <div className="flex-1">
                  <p className="text-xs font-bold text-slate-300">Evidencia o Planos</p>
                  <p className="text-[11px] text-slate-500">Adjuntar imágenes o planos incrementa la aprobación en 40%.</p>
                </div>
              </li>
            </ul>

            <div className="mt-6 p-4 bg-slate-950 border border-slate-800 rounded-xl italic text-xs text-slate-400 leading-relaxed">
              "Las propuestas bien argumentadas con fotos o presupuestos tienen mayor probabilidad de ser votadas por la comunidad y revisadas por la Dirección."
            </div>
          </div>

          {/* Advice Card */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl">
            <div className="flex items-center gap-2 mb-3">
              <span className="material-symbols-outlined text-yellow-500 text-xl">lightbulb</span>
              <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider">Consejos para Tu Propuesta</h4>
            </div>
            <ul className="space-y-2.5 text-xs text-slate-400 leading-relaxed">
              <li>• <strong className="text-slate-300">Hazlo cuantificable:</strong> En lugar de "comprar balones", especifica "comprar 5 balones de futsal y 3 de voley para los recreos".</li>
              <li>• <strong className="text-slate-300">Define los beneficiarios:</strong> Menciona a cuántos estudiantes o pabellones ayuda directamente el cambio.</li>
              <li>• <strong className="text-slate-300">Filtra por viabilidad:</strong> Asegúrate de que no altere de forma destructiva la infraestructura del plantel.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
