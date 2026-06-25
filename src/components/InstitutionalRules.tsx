import React, { useState } from 'react';
import { 
  BookOpen, 
  Search, 
  ChevronDown, 
  Download, 
  Share2, 
  AlertTriangle,
  Award,
  BookMarked,
  Printer,
  FileText
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface Rule {
  id: string;
  article: string;
  title: string;
  category: 'Convivencia' | 'Académico' | 'Espacios' | 'Sanciones';
  description: string;
  details: string;
}

export default function InstitutionalRules() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('TODOS');
  const [activeRuleId, setActiveRuleId] = useState<string | null>('rule-1');

  const rules: Rule[] = [
    {
      id: 'rule-1',
      article: 'ARTÍCULO 12',
      title: 'Código de Respeto Mutuo y Dignidad',
      category: 'Convivencia',
      description: 'Todo miembro de la comunidad educativa Grauina tiene derecho a ser tratado con dignidad y respeto en todo momento.',
      details: 'Queda terminantemente prohibido cualquier acto de discriminación, acoso (bullying) o agresión verbal y física dentro y fuera de los perímetros institucionales. Los incidentes serán canalizados directamente mediante el Municipio Escolar y la Dirección de Convivencia.'
    },
    {
      id: 'rule-2',
      article: 'ARTÍCULO 15',
      title: 'Puntualidad y Asistencia Técnica',
      category: 'Convivencia',
      description: 'El ingreso a las sesiones de aprendizaje debe realizarse con puntualidad para no interrumpir el desarrollo escolar.',
      details: 'Se establece un máximo de 5 minutos de tolerancia para el ingreso a aulas presenciales o laboratorios. Las inasistencias deben ser justificadas formalmente por el padre o apoderado legal a través de la oficina virtual de la Grau App en un plazo máximo de 48 horas.'
    },
    {
      id: 'rule-3',
      article: 'ARTÍCULO 24',
      title: 'Sistema de Calificación y Evaluaciones',
      category: 'Académico',
      description: 'Criterios objetivos para la evaluación del desempeño y rendimiento académico en las asignaturas.',
      details: 'Se utiliza el sistema de calificación vigesimal de 0 a 20. La nota mínima aprobatoria para cualquier curso o taller de educación secundaria es de 13. Las evaluaciones bimestrales son obligatorias y reprogramables únicamente bajo constancia médica de salud certificada.'
    },
    {
      id: 'rule-4',
      article: 'ARTÍCULO 28',
      title: 'Cuadro de Honor y Mérito Estudiantil',
      category: 'Académico',
      description: 'Reconocimiento institucional a los estudiantes con desempeños sobresalientes durante el año.',
      details: 'Se publicará bimestralmente un cuadro de honor reconociendo a los tres primeros puestos de cada grado. Los estudiantes que mantengan un promedio superior a 17 calificarán a beneficios de becas y representaciones prioritarias en eventos nacionales.'
    },
    {
      id: 'rule-5',
      article: 'ARTÍCULO 33',
      title: 'Protocolos de Uso del Aula de Innovación',
      category: 'Espacios',
      description: 'Normas de cuidado para las computadoras, proyectores e internet del laboratorio de tecnología.',
      details: 'El ingreso al Aula de Innovación Tecnológica (AIT) requiere reserva del docente o asignación específica. Queda prohibido el ingreso con alimentos, bebidas u objetos punzocortantes. El uso del internet del plantel está estrictamente reservado para fines de investigación académica.'
    },
    {
      id: 'rule-6',
      article: 'ARTÍCULO 37',
      title: 'Normativa de Indumentaria en el Polideportivo',
      category: 'Espacios',
      description: 'Uso obligatorio del uniforme escolar oficial de educación física y calzado apropiado.',
      details: 'Para ingresar a las canchas deportivas o áreas recreativas durante las sesiones de educación física, los alumnos deberán vestir el buzo institucional completo. Queda restringido el uso de calzado que dañe la superficie sintética de las canchas.'
    }
  ];

  const handleToggle = (id: string) => {
    setActiveRuleId(activeRuleId === id ? null : id);
  };

  const handleExport = (format: string) => {
    alert(`Descargando Reglamento Oficial de la I.E. Miguel Grau en formato ${format}...`);
  };

  const filteredRules = rules.filter(rule => {
    const matchesSearch = rule.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          rule.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          rule.article.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'TODOS' || rule.category.toUpperCase() === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      
      {/* Hero Header */}
      <section className="relative bg-slate-900 border border-slate-800 rounded-2xl p-6 md:p-8 overflow-hidden mb-6 shadow-2xl">
        <div className="absolute top-0 right-0 w-64 h-64 bg-red-500/5 rounded-full blur-3xl translate-x-20 -translate-y-20"></div>
        <div className="relative z-10 max-w-3xl">
          <span className="inline-block bg-red-500/10 text-red-400 border border-red-500/20 px-3 py-1 font-bold text-xs uppercase tracking-wider rounded-lg mb-3">
            Repositorio Oficial del Plantel
          </span>
          <h2 className="font-headline text-3xl md:text-5xl text-slate-100 tracking-tight leading-none mb-3">
            REGLAMENTO <span className="text-red-400">INSTITUCIONAL</span>
          </h2>
          <p className="text-sm md:text-base text-slate-400 leading-relaxed">
            Normas de convivencia escolar, lineamientos académicos y protocolos de uso de espacios tecnológicos de la I.E. Miguel Grau. Actualizado para el periodo escolar 2026.
          </p>
        </div>
      </section>

      {/* Search & Filter Controls */}
      <section className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col md:flex-row gap-4 items-center mb-6 sticky top-20 z-30 shadow-lg">
        {/* Search input */}
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 w-4 h-4" />
          <input 
            type="text" 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar artículo o norma..."
            className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2 pl-10 pr-4 text-xs text-slate-100 focus:border-red-400 focus:ring-1 focus:ring-red-400 transition-all outline-none"
          />
        </div>

        {/* Filter buttons */}
        <div className="flex flex-wrap gap-2 w-full md:w-auto">
          {['TODOS', 'CONVIVENCIA', 'ACADÉMICO', 'ESPACIOS'].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all border ${
                selectedCategory === cat 
                  ? 'bg-red-500/10 text-red-400 border-red-500/30' 
                  : 'text-slate-400 border-slate-800 hover:bg-slate-950/40 hover:text-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Counter */}
        <div className="md:ml-auto text-[11px] font-bold text-slate-500 uppercase tracking-wider">
          Mostrando <span className="text-red-400 font-bold">{filteredRules.length}</span> de {rules.length} normas
        </div>
      </section>

      {/* Rules Accordion & Sidebar layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Rules Accordion list */}
        <div className="col-span-12 lg:col-span-8 space-y-4">
          <AnimatePresence mode="wait">
            {filteredRules.length === 0 ? (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="bg-slate-900 border border-slate-800 p-8 text-center rounded-2xl text-slate-500 italic"
              >
                No se encontraron artículos o normas que coincidan con la búsqueda.
              </motion.div>
            ) : (
              filteredRules.map((rule) => {
                const isOpen = activeRuleId === rule.id;
                return (
                  <motion.div 
                    key={rule.id}
                    layout
                    className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden transition-all hover:border-slate-700"
                  >
                    <div 
                      onClick={() => handleToggle(rule.id)}
                      className="p-5 flex justify-between items-start cursor-pointer select-none"
                    >
                      <div className="space-y-1 pr-4">
                        <div className="flex items-center space-x-2">
                          <span className={`text-[9px] font-bold px-2 py-0.5 rounded border ${
                            rule.category === 'Convivencia' ? 'bg-red-950/40 text-red-400 border-red-500/20' :
                            rule.category === 'Académico' ? 'bg-blue-950/40 text-blue-400 border-blue-500/20' :
                            'bg-emerald-950/40 text-emerald-400 border-emerald-500/20'
                          }`}>
                            {rule.article}
                          </span>
                          <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Normas de {rule.category}</span>
                        </div>
                        <h4 className="text-sm font-bold text-slate-100 group-hover:text-red-400 transition-colors uppercase tracking-tight">{rule.title}</h4>
                        <p className="text-xs text-slate-400">{rule.description}</p>
                      </div>
                      <ChevronDown className={`w-5 h-5 text-slate-400 transition-transform duration-300 shrink-0 ${isOpen ? 'rotate-180 text-red-400' : ''}`} />
                    </div>

                    <AnimatePresence initial={false}>
                      {isOpen && (
                        <motion.div
                          initial={{ height: 0 }}
                          animate={{ height: 'auto' }}
                          exit={{ height: 0 }}
                          transition={{ duration: 0.2 }}
                          className="overflow-hidden bg-slate-950/40 border-t border-slate-800/50"
                        >
                          <div className="p-5 space-y-4">
                            <p className="text-xs text-slate-300 leading-relaxed border-l-2 border-red-500/50 pl-4 py-0.5">
                              {rule.details}
                            </p>
                            
                            <div className="flex gap-2.5 pt-2">
                              <button 
                                onClick={() => handleExport('PDF')}
                                className="bg-red-500 hover:bg-red-600 text-slate-950 text-[10px] font-bold px-3 py-1.5 rounded-lg flex items-center gap-1 transition-all"
                              >
                                <Download className="w-3.5 h-3.5" /> Descargar PDF
                              </button>
                              <button 
                                onClick={() => alert("Enlace del artículo copiado al portapapeles.")}
                                className="border border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-900 text-[10px] font-bold px-3 py-1.5 rounded-lg flex items-center gap-1 transition-all"
                              >
                                <Share2 className="w-3.5 h-3.5" /> Compartir Artículo
                              </button>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                );
              })
            )}
          </AnimatePresence>
        </div>

        {/* Right Column: Information & Help Sidebar */}
        <div className="col-span-12 lg:col-span-4 space-y-6">
          
          {/* Direct Incident Report Card */}
          <div className="bg-slate-900 border border-slate-800 border-t-4 border-t-red-500 rounded-2xl p-6 shadow-xl flex flex-col justify-between">
            <div className="space-y-3">
              <AlertTriangle className="w-8 h-8 text-red-400" />
              <h4 className="text-sm font-bold text-slate-100 uppercase tracking-wide">¿PRESENCIAS ALGÚN INCUMPLIMIENTO?</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Si eres testigo de bullying, discriminación o mal uso de la infraestructura escolar, repórtalo inmediatamente.
              </p>
              <p className="text-xs text-slate-500">
                Puedes enviar un reporte completamente anónimo a través de nuestra central de soporte estudiantil.
              </p>
            </div>
            
            <button 
              onClick={() => alert("Abriendo formulario seguro de reporte anónimo... Redireccionando.")}
              className="mt-6 w-full bg-slate-950 hover:bg-red-500/10 text-red-400 hover:text-red-300 border-2 border-red-500/20 hover:border-red-500/40 text-xs font-bold py-3.5 rounded-xl transition-all"
            >
              REPORTARFALTA / INCIDENTE
            </button>
          </div>

          {/* Highlights & Bulletins */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
            <div className="flex items-center space-x-2 pb-3 border-b border-slate-800/60">
              <BookMarked className="w-4 h-4 text-red-400" />
              <h5 className="text-xs font-bold text-slate-200 uppercase tracking-wider">Recursos de Convivencia</h5>
            </div>
            
            <div className="space-y-3 text-xs">
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 hover:border-slate-700 transition-all cursor-pointer">
                <p className="font-bold text-slate-300 mb-0.5">Evaluación Escolar</p>
                <p className="text-[11px] text-slate-500">Nota mínima aprobatoria es 13. Exámenes de recuperación programados para diciembre.</p>
              </div>
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 hover:border-slate-700 transition-all">
                <p className="font-bold text-slate-300">Uso de Laboratorios</p>
                <p className="text-[11px] text-slate-500">Obligatorio portar el carnet de biblioteca y registrar ingreso.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
