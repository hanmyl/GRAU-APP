import React, { useState } from 'react';
import { 
  HelpCircle, 
  Send, 
  CheckCircle2, 
  Bug, 
  HelpCircle as HelpIcon, 
  Lock, 
  Cpu, 
  BookOpen,
  Activity,
  ChevronDown,
  RefreshCw
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface FaqItem {
  question: string;
  answer: string;
}

export default function SupportCenter() {
  const [ticketType, setTicketType] = useState('Falla Técnica Crítica');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsTyping] = useState(false);
  const [success, setSuccess] = useState(false);
  const [activeFaqIdx, setActiveFaqIdx] = useState<number | null>(null);

  const faqs: FaqItem[] = [
    {
      question: '¿Cómo redactar una propuesta de alto impacto?',
      answer: 'Utiliza el marco institucional del Municipio Escolar: define claramente el problema, propón una solución medible, calcula un plazo de ejecución, y si es posible, añade un croquis o plano visual. Las propuestas bien redactadas tienen 40% más de votos.'
    },
    {
      question: 'No puedo cargar mi archivo PDF o imagen, ¿qué hago?',
      answer: 'Asegúrate de que el archivo no supere los 10MB y esté en formato JPG, PNG o PDF. Evita usar caracteres especiales en el nombre del archivo. Si el problema persiste, limpia el caché de la Grau App e inténtalo de nuevo.'
    },
    {
      question: '¿Cuál es el tiempo de respuesta del Municipio Escolar?',
      answer: 'Las propuestas enviadas a través del portal de votaciones se analizan de manera continua. Al superar los 30 votos de quorum, el Municipio Escolar emite el dictamen técnico a Subdirección en un plazo máximo de 48 horas.'
    }
  ];

  const handleTicketSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim() || !message.trim()) return;

    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      setSuccess(true);
      setSubject('');
      setMessage('');
      
      setTimeout(() => {
        setSuccess(false);
      }, 3000);
    }, 1500);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      
      <div className="mb-6">
        <span className="text-xs uppercase tracking-wider font-bold text-red-400 flex items-center gap-1.5 mb-1">
          <HelpCircle className="w-3.5 h-3.5" />
          Operaciones Estudiantiles
        </span>
        <h2 className="font-headline text-3xl md:text-4xl text-slate-100 tracking-tight leading-none uppercase">Centro de Soporte</h2>
        <p className="text-sm text-slate-400 mt-1">Operamos con precisión para resolver tus dudas técnicas y académicas. Reporta incidencias o solicita guía estratégica.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Guides & FAQs (Col span 7) */}
        <div className="lg:col-span-7 space-y-6">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div 
              onClick={() => alert("Abriendo Guía Oficial de Redacción de Propuestas estudiantiles...")}
              className="bg-slate-900 border border-slate-800 hover:border-red-500/20 p-5 rounded-2xl transition-all cursor-pointer group flex flex-col justify-between"
            >
              <BookOpen className="w-8 h-8 text-red-400 mb-2 group-hover:scale-105 transition-transform" />
              <div>
                <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wide">Guía de Redacción</h4>
                <p className="text-[11px] text-slate-500 leading-relaxed mt-1">Estructura, metas y pautas para formular propuestas viables.</p>
              </div>
            </div>

            <div 
              onClick={() => alert("Abriendo centro de asistencia de cuentas de acceso estudiantil...")}
              className="bg-slate-900 border border-slate-800 hover:border-red-500/20 p-5 rounded-2xl transition-all cursor-pointer group flex flex-col justify-between"
            >
              <Bug className="w-8 h-8 text-red-400 mb-2 group-hover:scale-105 transition-transform" />
              <div>
                <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wide">Incidencias de Cuenta</h4>
                <p className="text-[11px] text-slate-500 leading-relaxed mt-1">Soporte con el PIN de acceso, subida de archivos y perfiles.</p>
              </div>
            </div>
          </div>

          {/* Accordion FAQ */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
            <div className="p-4 bg-slate-950/40 border-b border-slate-800">
              <h3 className="text-xs font-bold text-slate-200 uppercase tracking-widest">Preguntas Frecuentes (FAQs)</h3>
            </div>

            <div className="divide-y divide-slate-800/60">
              {faqs.map((faq, idx) => {
                const isOpen = activeFaqIdx === idx;
                return (
                  <div key={idx} className="transition-all">
                    <button 
                      onClick={() => setActiveFaqIdx(isOpen ? null : idx)}
                      className="w-full flex items-center justify-between p-4 hover:bg-slate-950/20 text-left transition-colors text-xs font-bold text-slate-200 outline-none"
                    >
                      <span>{faq.question}</span>
                      <ChevronDown className={`w-4 h-4 text-red-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                    </button>
                    
                    <AnimatePresence initial={false}>
                      {isOpen && (
                        <motion.div
                          initial={{ height: 0 }}
                          animate={{ height: 'auto' }}
                          exit={{ height: 0 }}
                          className="overflow-hidden bg-slate-950/20"
                        >
                          <p className="p-4 pt-1 text-[11px] text-slate-400 leading-relaxed border-l-2 border-red-500/30 ml-4 mb-2">
                            {faq.answer}
                          </p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: Ticket submit Form (Col span 5) */}
        <div className="lg:col-span-5">
          <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-2xl relative overflow-hidden flex flex-col justify-between h-full">
            <div className="absolute top-0 left-0 w-full h-1 bg-red-500"></div>

            <div className="mb-4">
              <h3 className="text-sm font-bold text-slate-100 uppercase tracking-wide">Contacto Directo</h3>
              <p className="text-[11px] text-slate-500 mt-1">Envía una solicitud técnica o académica a nuestra central de operaciones.</p>
            </div>

            <form onSubmit={handleTicketSubmit} className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold text-red-400 uppercase tracking-wider mb-1.5">Tipo de Solicitud</label>
                <select 
                  value={ticketType}
                  onChange={(e) => setTicketType(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 text-slate-200 py-2.5 px-3 rounded-xl focus:border-red-400 focus:ring-1 focus:ring-red-400 outline-none text-xs"
                >
                  <option>Falla Técnica Crítica</option>
                  <option>Orientación de Propuesta</option>
                  <option>Duda de Calificaciones</option>
                  <option>Otros</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-red-400 uppercase tracking-wider mb-1.5">Asunto</label>
                <input 
                  type="text" 
                  required
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="Ej: Error al adjuntar plano PDF" 
                  className="w-full bg-slate-950 border border-slate-800 text-slate-100 py-2.5 px-3 rounded-xl focus:border-red-400 focus:ring-1 focus:ring-red-400 outline-none text-xs placeholder-slate-700"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-red-400 uppercase tracking-wider mb-1.5">Mensaje</label>
                <textarea 
                  required
                  rows={4}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Explica la incidencia o duda con precisión..." 
                  className="w-full bg-slate-950 border border-slate-800 text-slate-100 py-2.5 px-3 rounded-xl focus:border-red-400 focus:ring-1 focus:ring-red-400 outline-none text-xs placeholder-slate-700 resize-none"
                />
              </div>

              <button 
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-red-500 hover:bg-red-600 disabled:opacity-50 text-slate-950 py-3.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-lg hover:shadow-red-500/10 cursor-pointer"
              >
                {isSubmitting ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Enviando...</span>
                  </>
                ) : success ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-slate-950" />
                    <span>¡Enviado con Éxito!</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Enviar Reporte</span>
                  </>
                )}
              </button>
            </form>

            {/* Pulse Indicator */}
            <div className="mt-4 flex items-center gap-2 bg-slate-950 border border-slate-800 p-2.5 rounded-xl">
              <div className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
              </div>
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Agentes de soporte: <span className="text-slate-300">En línea</span></p>
            </div>
          </div>
        </div>

      </div>

      {/* Systems Status Bar */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-6">
        <div className="lg:col-span-8 bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col justify-end relative overflow-hidden h-40">
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 to-transparent"></div>
          
          <div className="relative z-10 space-y-1.5">
            <p className="text-[10px] font-bold text-red-400 uppercase tracking-widest flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5" /> Estatus de Infraestructura Digital
            </p>
            
            <div className="flex flex-wrap gap-4 pt-1.5">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_#10b981]"></span>
                <span className="text-[10px] font-bold text-slate-400 font-mono">Servidores: OK</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_#10b981]"></span>
                <span className="text-[10px] font-bold text-slate-400 font-mono">Base de Datos: OK</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-red-500 shadow-[0_0_8px_#f55d5c]"></span>
                <span className="text-[10px] font-bold text-slate-400 font-mono">API Gateway: Latencia 40ms</span>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-4 bg-red-500/5 border border-red-500/20 rounded-2xl p-5 flex flex-col justify-center items-center text-center">
          <Lock className="w-8 h-8 text-red-400 mb-3" />
          <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wide">Seguridad de Datos</h4>
          <p className="text-[11px] text-slate-500 leading-relaxed mt-1">Toda consulta escolar está encriptada bajo estándares del plantel Miguel Grau.</p>
        </div>
      </div>

    </div>
  );
}
