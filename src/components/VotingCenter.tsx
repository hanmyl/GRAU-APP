import React, { useState, useEffect } from 'react';
import { Proposal } from '../types';
import { 
  Vote, 
  ShieldCheck, 
  Lock, 
  Clock, 
  CheckCircle, 
  TrendingUp,
  AlertTriangle,
  Flame,
  Fingerprint
} from 'lucide-react';
import { motion } from 'motion/react';

interface VotingCenterProps {
  proposals: Proposal[];
  onVote: (id: string) => void;
}

interface VoteTransaction {
  hash: string;
  proposalTitle: string;
  time: string;
  status: 'CONTABILIZADO' | 'PENDIENTE';
}

export default function VotingCenter({ proposals, onVote }: VotingCenterProps) {
  const [transactions, setTransactions] = useState<VoteTransaction[]>([
    { hash: '#VX-9921-A4', proposalTitle: 'Sombreadores para el patio principal', time: 'Hace 2 minutos', status: 'CONTABILIZADO' },
    { hash: '#VX-8812-C2', proposalTitle: 'Campaña de reciclaje "Grau Verde"', time: 'Hace 15 minutos', status: 'CONTABILIZADO' },
    { hash: '#VX-7741-X9', proposalTitle: 'Torneo Intersecciones de Futsal', time: 'Hace 1 hora', status: 'CONTABILIZADO' }
  ]);
  
  // Real countdown simulation
  const [timeLeft, setTimeLeft] = useState({ days: 2, hours: 14, minutes: 22, seconds: 45 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        } else if (prev.days > 0) {
          return { ...prev, days: prev.days - 1, hours: 23, minutes: 59, seconds: 59 };
        }
        return prev;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Filter high interest proposals (voted > 15) to showcase in Quorum view
  const featuredProposal = proposals.reduce((prev, current) => {
    return (prev.votes > current.votes) ? prev : current;
  }, proposals[0] || { 
    id: 'demo',
    title: 'Reforma de Reglamento Escolar', 
    category: 'Otros',
    description: 'Ampliación de plazos para entrega de tareas', 
    votes: 45, 
    votedBy: [],
    createdAt: new Date().toISOString(),
    status: 'Pendiente',
    comments: []
  });

  const handleCastVote = (id: string, title: string) => {
    onVote(id);
    
    // Generate a random transaction hash to append to anonymized voter ledger
    const randomHex = Math.random().toString(16).substring(2, 6).toUpperCase();
    const newTx: VoteTransaction = {
      hash: `#VX-${Math.floor(1000 + Math.random() * 9000)}-${randomHex}`,
      proposalTitle: title,
      time: 'Hace unos instantes',
      status: 'CONTABILIZADO'
    };
    
    setTransactions(prev => [newTx, ...prev]);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 space-y-6">
      
      {/* Header section */}
      <section className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b border-slate-800 pb-5">
        <div className="space-y-1">
          <span className="text-xs uppercase tracking-wider font-bold text-red-400 flex items-center gap-1.5">
            <Fingerprint className="w-3.5 h-3.5 animate-pulse" />
            Municipio Escolar - Grau App
          </span>
          <h2 className="font-headline text-3xl md:text-4xl text-slate-100 tracking-tight leading-none uppercase">Gobernanza y Votaciones</h2>
          <p className="text-sm text-slate-400 mt-1">Tu opinión importa. Apoya las propuestas estudiantiles para que se conviertan en reglamentaciones de dirección.</p>
        </div>
        <div className="flex gap-3 shrink-0">
          <div className="bg-slate-900 px-4 py-2 rounded-xl border border-slate-800 text-center">
            <span className="text-[9px] text-slate-500 uppercase font-bold tracking-wider block">Propuestas Activas</span>
            <span className="text-lg font-headline text-red-400">{proposals.length}</span>
          </div>
          <div className="bg-slate-900 px-4 py-2 rounded-xl border border-slate-800 text-center">
            <span className="text-[9px] text-slate-500 uppercase font-bold tracking-wider block">Quorum General</span>
            <span className="text-lg font-headline text-yellow-500">62%</span>
          </div>
        </div>
      </section>

      {/* Featured Voting Section (Bento Grid asymmetry) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Card: Main Featured Proposal */}
        <div className="lg:col-span-8 bg-slate-900 rounded-2xl p-6 border-l-4 border-red-500 border border-slate-800 shadow-2xl relative overflow-hidden flex flex-col justify-between">
          <div className="absolute top-4 right-4 bg-red-950/50 border border-red-500/20 text-red-400 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-lg flex items-center gap-1">
            <Flame className="w-3 h-3 text-red-500 animate-bounce" />
            URGENTE / DESTACADO
          </div>

          <div className="space-y-2 mt-4 lg:mt-0">
            <span className="text-[10px] font-bold text-red-400 uppercase tracking-widest block">{featuredProposal.category || 'General'}</span>
            <h3 className="text-lg lg:text-xl font-bold text-slate-100 leading-snug uppercase tracking-tight">{featuredProposal.title}</h3>
            <p className="text-xs lg:text-sm text-slate-400 leading-relaxed max-w-2xl">{featuredProposal.description}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-6">
            {/* Quorum indicator */}
            <div className="space-y-2">
              <div className="flex justify-between items-end text-xs font-semibold">
                <span className="text-slate-400 uppercase">Quorum Obtenido ({featuredProposal.votes} votos)</span>
                <span className="text-red-400 font-mono">Meta: 50+</span>
              </div>
              <div className="w-full h-3 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                <div 
                  className="h-full bg-red-500 rounded-full transition-all duration-1000 ease-out" 
                  style={{ width: `${Math.min((featuredProposal.votes / 50) * 100, 100)}%` }}
                ></div>
              </div>
              <p className="text-[10px] text-slate-500 italic">
                {featuredProposal.votes >= 50 
                  ? '✓ ¡Meta alcanzada! Propuesta enviada a Dirección.' 
                  : `Faltan ${50 - featuredProposal.votes} votos para calificar al informe técnico.`
                }
              </p>
            </div>

            {/* Countdown clock */}
            <div className="bg-slate-950 p-3.5 border border-slate-800 rounded-xl flex items-center space-x-3.5">
              <Clock className="w-8 h-8 text-red-400 shrink-0" />
              <div>
                <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">Cierre de Votación</span>
                <div className="flex space-x-1 text-sm font-mono font-bold text-red-400">
                  <span>{String(timeLeft.days).padStart(2, '0')}d</span>
                  <span>:</span>
                  <span>{String(timeLeft.hours).padStart(2, '0')}h</span>
                  <span>:</span>
                  <span>{String(timeLeft.minutes).padStart(2, '0')}m</span>
                  <span>:</span>
                  <span>{String(timeLeft.seconds).padStart(2, '0')}s</span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <button 
              onClick={() => handleCastVote(featuredProposal.id, featuredProposal.title)}
              className="bg-red-500 hover:bg-red-600 text-slate-950 px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all shadow-lg hover:shadow-red-500/25 cursor-pointer"
            >
              <Vote className="w-4 h-4" />
              <span>Emitir Voto / Apoyar</span>
            </button>
            <span className="text-xs text-slate-500 self-center">Identidad de voto totalmente encriptada.</span>
          </div>
        </div>

        {/* Right Card: Secondary proposals with active vote controls */}
        <div className="lg:col-span-4 flex flex-col gap-4">
          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Otras Propuestas para Apoyo</h4>
          
          <div className="space-y-3 overflow-y-auto max-h-[350px] pr-1 custom-scrollbar">
            {proposals.filter(p => p.id !== featuredProposal.id).map(p => (
              <div key={p.id} className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-xl p-4 transition-all group flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-[9px] font-bold bg-slate-950 border border-slate-800 text-slate-400 px-2 py-0.5 rounded-md uppercase tracking-wider">{p.category}</span>
                    <span className="text-[10px] text-yellow-500 font-bold flex items-center gap-0.5">
                      <Flame className="w-3 h-3" /> {p.votes} votos
                    </span>
                  </div>
                  <h5 className="text-xs font-bold text-slate-200 group-hover:text-red-400 transition-colors line-clamp-1">{p.title}</h5>
                  <p className="text-[11px] text-slate-500 line-clamp-2 mt-1">{p.description}</p>
                </div>

                <div className="mt-3 pt-3 border-t border-slate-800/50 flex justify-between items-center">
                  <span className="text-[10px] text-slate-500">Por: {p.author}</span>
                  <button 
                    onClick={() => handleCastVote(p.id, p.title)}
                    className="bg-slate-950 hover:bg-red-500 hover:text-slate-950 text-red-400 border border-red-500/20 hover:border-transparent text-[11px] font-bold px-3 py-1.5 rounded-lg transition-all"
                  >
                    Votar
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Bottom Section: Vote History Ledger & Blockchain Encryption Box */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pt-2">
        
        {/* Ledger Column */}
        <div className="lg:col-span-8 space-y-3">
          <h3 className="text-xs font-bold text-slate-300 uppercase tracking-widest flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            Historial de Votos Contabilizados (Anónimo)
          </h3>
          
          <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-950 border-b border-slate-800 text-slate-500 font-semibold">
                    <th className="p-3">Hash Transacción</th>
                    <th className="p-3">Iniciativa / Propuesta</th>
                    <th className="p-3">Registro de Tiempo</th>
                    <th className="p-3 text-right">Estatus</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/50 text-slate-300 font-sans">
                  {transactions.map((tx, idx) => (
                    <tr key={idx} className="hover:bg-slate-950/20 transition-all">
                      <td className="p-3 font-mono text-red-400 font-bold">{tx.hash}</td>
                      <td className="p-3 font-semibold text-slate-200 max-w-xs truncate">{tx.proposalTitle}</td>
                      <td className="p-3 text-slate-500 text-[11px]">{tx.time}</td>
                      <td className="p-3 text-right">
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-400 bg-emerald-950/50 border border-emerald-500/10 px-2 py-0.5 rounded-full">
                          <CheckCircle className="w-3 h-3 text-emerald-400" />
                          {tx.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Encryption / Block info column */}
        <div className="lg:col-span-4 bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl flex flex-col justify-between relative overflow-hidden">
          <div className="absolute -right-6 -bottom-6 opacity-5">
            <Lock className="w-40 h-40" />
          </div>

          <div className="space-y-2">
            <h3 className="text-xs font-bold text-red-400 uppercase tracking-wider">Criptografía y Privacidad</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              El sistema utiliza firmas asimétricas de un solo sentido. Validamos tu credencial de alumno matriculado en la I.E. Miguel Grau para autorizar un único voto por propuesta, sin embargo, el sentido de tu elección se disocia de forma irreversible de tu perfil.
            </p>
          </div>

          <div className="bg-slate-950 p-3 border border-slate-800 border-l-red-500 border-l-2 rounded-xl mt-4">
            <div className="flex items-center space-x-2.5">
              <Lock className="w-4 h-4 text-red-400 shrink-0" />
              <span className="text-[10px] font-bold text-slate-300 uppercase tracking-wider">Protocolo Blockchain v2.4 Activo</span>
            </div>
          </div>

          <ul className="space-y-2 mt-4 text-[11px] text-slate-500">
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-red-400 rounded-full shrink-0"></span>
              Auditable de forma independiente por el Municipio Escolar.
            </li>
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-red-400 rounded-full shrink-0"></span>
              Recibo digital inmutable generado por cada interacción.
            </li>
          </ul>
        </div>

      </div>

    </div>
  );
}
