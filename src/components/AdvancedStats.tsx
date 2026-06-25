import React, { useState } from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  PieChart, 
  Pie, 
  Cell,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar
} from 'recharts';
import { 
  TrendingUp, 
  DollarSign, 
  Smile, 
  RefreshCw, 
  FileDown, 
  Activity, 
  Sparkles, 
  Zap, 
  Leaf, 
  Users,
  Award
} from 'lucide-react';

interface AdvancedStatsProps {
  proposalsCount: number;
  totalVotes: number;
}

export default function AdvancedStats({ proposalsCount, totalVotes }: AdvancedStatsProps) {
  const [isRefreshing, setIsRefreshing] = useState(false);

  // High fidelity dataset for Monthly student participation growth
  const monthlyData = [
    { name: 'Ene', estudiantes: 420, propuestas: 8 },
    { name: 'Feb', estudiantes: 580, propuestas: 14 },
    { name: 'Mar', estudiantes: 510, propuestas: 11 },
    { name: 'Abr', estudiantes: 890, propuestas: 19 },
    { name: 'May', estudiantes: 760, propuestas: 15 },
    { name: 'Jun', estudiantes: 1240, propuestas: proposalsCount + 22 },
  ];

  // Proposal distribution by Category
  const categoryData = [
    { category: 'Académico', value: 35, fullMark: 100 },
    { category: 'Infraestructura', value: 45, fullMark: 100 },
    { category: 'Deportes', value: 25, fullMark: 100 },
    { category: 'Ecología', value: 30, fullMark: 100 },
    { category: 'Convivencia', value: 20, fullMark: 100 },
    { category: 'Otros', value: 15, fullMark: 100 },
  ];

  // Pie chart for state distribution
  const stateData = [
    { name: 'Aprobados', value: 18, color: '#10b981' },
    { name: 'En Revisión', value: 25, color: '#3b82f6' },
    { name: 'Pendientes', value: 45, color: '#f59e0b' },
    { name: 'Resueltos', value: 12, color: '#8b5cf6' },
  ];

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
    }, 1000);
  };

  const handleExportPDF = () => {
    alert("Generando informe analítico completo de impacto en PDF... Descarga iniciada.");
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 space-y-6">
      
      {/* Header section */}
      <section className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b border-slate-800 pb-5">
        <div>
          <span className="text-xs uppercase tracking-wider font-bold text-red-400 flex items-center gap-1">
            <Activity className="w-3.5 h-3.5" />
            Monitoreo en Tiempo Real
          </span>
          <h2 className="font-headline text-3xl md:text-4xl text-slate-100 tracking-tight leading-none uppercase">Estadísticas Avanzadas</h2>
          <p className="text-sm text-slate-400 mt-1 max-w-2xl">Visualización analítica profunda del impacto institucional, participación estudiantil y gobernanza transparente.</p>
        </div>
        <div className="flex gap-2 shrink-0">
          <button 
            onClick={handleExportPDF}
            className="bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-xl px-4 py-2.5 text-xs font-bold text-slate-200 flex items-center gap-1.5 transition-all"
          >
            <FileDown className="w-4 h-4" /> 
            <span>Exportar Informe PDF</span>
          </button>
          <button 
            onClick={handleRefresh}
            className="bg-red-500 hover:bg-red-600 text-slate-950 px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-lg hover:shadow-red-500/20"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            <span>Actualizar Datos</span>
          </button>
        </div>
      </section>

      {/* Bento Grid Content */}
      <div className="grid grid-cols-12 gap-6">
        
        {/* Participation Growth (Area Chart - Col span 8) */}
        <div className="col-span-12 lg:col-span-8 bg-slate-900 rounded-2xl p-5 border border-slate-800 relative overflow-hidden flex flex-col justify-between">
          <div className="absolute top-0 left-0 w-1.5 h-full bg-red-500"></div>
          
          <div className="flex justify-between items-center mb-4">
            <div>
              <h3 className="text-xs font-bold text-red-400 uppercase tracking-widest flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
                Crecimiento de Participación Estudiantil
              </h3>
              <p className="text-xs text-slate-500">Estudiantes interactuando y votando activamente</p>
            </div>
            <span className="px-3 py-1 bg-slate-950 text-[10px] border border-slate-800 rounded-lg text-slate-400 font-mono">Ene - Jun 2026</span>
          </div>

          <div className="h-64 mt-4 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorEstudiantes" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f55d5c" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#f55d5c" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="name" stroke="#64748b" fontSize={11} />
                <YAxis stroke="#64748b" fontSize={11} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px' }}
                  labelStyle={{ color: '#94a3b8', fontWeight: 'bold' }}
                />
                <Area type="monotone" dataKey="estudiantes" name="Estudiantes Activos" stroke="#f55d5c" strokeWidth={3} fillOpacity={1} fill="url(#colorEstudiantes)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Impact Metrics Panel (Col span 4) */}
        <div className="col-span-12 lg:col-span-4 space-y-6">
          
          {/* Card 1: Resource optimization */}
          <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 relative overflow-hidden group hover:border-red-500/20 transition-all">
            <div className="absolute top-0 right-0 w-24 h-24 bg-red-500/5 rounded-full -translate-y-6 translate-x-6 blur-xl group-hover:bg-red-500/10 transition-all"></div>
            
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Ahorro Estimado de Recursos</span>
            <div className="flex items-end gap-2">
              <span className="text-3xl font-headline text-red-400 leading-none">$12,450 USD</span>
              <span className="text-emerald-400 text-xs font-bold flex items-center mb-0.5">▲ 14%</span>
            </div>
            
            <div className="w-full bg-slate-950 h-1.5 mt-4 rounded-full overflow-hidden border border-slate-800">
              <div className="bg-red-500 h-full rounded-full" style={{ width: '74%' }}></div>
            </div>
            <p className="text-[11px] text-slate-500 mt-2.5">Optimización presupuestaria mediante propuestas de reciclaje "Grau Verde" y eficiencia energética.</p>
          </div>

          {/* Card 2: Satisfaction Score */}
          <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 relative overflow-hidden group hover:border-red-500/20 transition-all">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Índice de Convivencia Escolar</span>
            <div className="flex items-end gap-2">
              <span className="text-3xl font-headline text-slate-200 leading-none">9.2</span>
              <span className="text-slate-500 text-xs font-bold mb-0.5">/ 10</span>
            </div>
            
            <div className="w-full bg-slate-950 h-1.5 mt-4 rounded-full overflow-hidden border border-slate-800">
              <div className="bg-emerald-500 h-full rounded-full" style={{ width: '92%' }}></div>
            </div>
            <p className="text-[11px] text-slate-500 mt-2.5">Nivel de satisfacción registrado tras las actividades de mediación y torneos organizados.</p>
          </div>
        </div>

        {/* Distribution by Category (Radar Chart - Col span 6) */}
        <div className="col-span-12 lg:col-span-6 bg-slate-900 rounded-2xl p-5 border border-slate-800 flex flex-col justify-between">
          <div>
            <h3 className="text-xs font-bold text-slate-200 uppercase tracking-widest mb-1">Categorías con Mayor Impacto</h3>
            <p className="text-xs text-slate-500 mb-4">Porcentaje de propuestas enviadas y priorizadas según rubro</p>
          </div>

          <div className="h-64 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="80%" data={categoryData}>
                <PolarGrid stroke="#1e293b" />
                <PolarAngleAxis dataKey="category" stroke="#94a3b8" fontSize={11} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#475569" fontSize={9} />
                <Radar name="Impacto" dataKey="value" stroke="#f55d5c" fill="#f55d5c" fillOpacity={0.25} />
              </RadarChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-3 gap-2 mt-4 pt-4 border-t border-slate-800/50">
            <div className="text-center p-2 bg-slate-950 rounded-xl border border-slate-800">
              <span className="text-[10px] text-slate-500 block">Votos Totales</span>
              <span className="text-sm font-bold text-red-400">{totalVotes + 186}</span>
            </div>
            <div className="text-center p-2 bg-slate-950 rounded-xl border border-slate-800">
              <span className="text-[10px] text-slate-500 block">Sostenibilidad</span>
              <span className="text-sm font-bold text-emerald-400">88%</span>
            </div>
            <div className="text-center p-2 bg-slate-950 rounded-xl border border-slate-800">
              <span className="text-[10px] text-slate-500 block">Plazos Cumplidos</span>
              <span className="text-sm font-bold text-purple-400">94%</span>
            </div>
          </div>
        </div>

        {/* Social Impact Area Indicators (Col span 6) */}
        <div className="col-span-12 lg:col-span-6 bg-slate-900 rounded-2xl p-5 border border-slate-800 flex flex-col justify-between">
          <div>
            <h3 className="text-xs font-bold text-red-400 uppercase tracking-widest mb-1">Compromiso Comunitario</h3>
            <p className="text-xs text-slate-500 mb-4">Indicadores clave de viabilidad social y ecológica</p>
          </div>

          <div className="space-y-4 my-auto">
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="text-slate-300 font-medium flex items-center gap-1.5">
                  <Leaf className="w-3.5 h-3.5 text-emerald-400" />
                  Sostenibilidad Ambiental
                </span>
                <span className="text-red-400 font-bold">88%</span>
              </div>
              <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden border border-slate-800">
                <div className="bg-emerald-400 h-full rounded-full" style={{ width: '88%' }}></div>
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="text-slate-300 font-medium flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 text-blue-400" />
                  Inclusión y Participación Estudiantil
                </span>
                <span className="text-red-400 font-bold">94%</span>
              </div>
              <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden border border-slate-800">
                <div className="bg-blue-400 h-full rounded-full" style={{ width: '94%' }}></div>
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="text-slate-300 font-medium flex items-center gap-1.5">
                  <Award className="w-3.5 h-3.5 text-yellow-400" />
                  Resolución de Propuestas Críticas
                </span>
                <span className="text-red-400 font-bold">76%</span>
              </div>
              <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden border border-slate-800">
                <div className="bg-yellow-400 h-full rounded-full" style={{ width: '76%' }}></div>
              </div>
            </div>
          </div>

          <div className="mt-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Zap className="w-6 h-6 text-red-400 animate-pulse" />
              <div>
                <span className="text-[10px] text-red-400 font-bold uppercase tracking-wider block">Alerta del Sistema</span>
                <span className="text-xs text-slate-200 font-bold uppercase">¡Récord histórico de votación hoy!</span>
              </div>
            </div>
            <span className="text-xs bg-red-500 text-slate-950 font-bold px-2.5 py-1 rounded-lg">LIVE</span>
          </div>
        </div>

        {/* Recent Interaction History (Col span 12) */}
        <div className="col-span-12 bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
          <div className="p-4 border-b border-slate-800 flex justify-between items-center bg-slate-950/40">
            <h3 className="text-xs font-bold text-slate-200 uppercase tracking-widest">Últimas Interacciones de Valor</h3>
            <span className="text-[10px] font-bold text-red-400 bg-red-950/50 border border-red-500/20 px-2.5 py-1 rounded-full">Actualizado hace unos instantes</span>
          </div>
          
          <div className="divide-y divide-slate-800/60">
            {/* Row 1 */}
            <div className="p-4 flex items-center justify-between hover:bg-slate-950/20 transition-all">
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 rounded-xl bg-emerald-950/50 border border-emerald-950 text-emerald-400 flex items-center justify-center">
                  <span className="material-symbols-outlined text-[20px]">eco</span>
                </div>
                <div>
                  <h5 className="text-xs font-bold text-slate-200">Propuesta de Huertos Urbanos Escolares</h5>
                  <span className="text-[10px] text-slate-500 block mt-0.5">Categoría: Ecología • Prioridad Alta</span>
                </div>
              </div>
              <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950/50 px-2.5 py-1 border border-emerald-500/20 rounded-full">ALTO IMPACTO</span>
            </div>

            {/* Row 2 */}
            <div className="p-4 flex items-center justify-between hover:bg-slate-950/20 transition-all">
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 rounded-xl bg-red-950/50 border border-red-950/50 text-red-400 flex items-center justify-center">
                  <span className="material-symbols-outlined text-[20px]">bolt</span>
                </div>
                <div>
                  <h5 className="text-xs font-bold text-slate-200">Optimización de Iluminación - Pabellón C</h5>
                  <span className="text-[10px] text-slate-500 block mt-0.5">Categoría: Infraestructura • Ejecución Corto Plazo</span>
                </div>
              </div>
              <span className="text-[10px] font-bold text-red-400 bg-red-950/50 px-2.5 py-1 border border-red-500/20 rounded-full">AHORRO RECURSOS</span>
            </div>

            {/* Row 3 */}
            <div className="p-4 flex items-center justify-between hover:bg-slate-950/20 transition-all">
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 rounded-xl bg-purple-950/50 border border-purple-950 text-purple-400 flex items-center justify-center">
                  <span className="material-symbols-outlined text-[20px]">groups</span>
                </div>
                <div>
                  <h5 className="text-xs font-bold text-slate-200">Taller de Mediación y Oratoria Estudiantil</h5>
                  <span className="text-[10px] text-slate-500 block mt-0.5">Categoría: Convivencia • Aprobada</span>
                </div>
              </div>
              <span className="text-[10px] font-bold text-purple-400 bg-purple-950/50 px-2.5 py-1 border border-purple-500/20 rounded-full">COHESIÓN SOCIAL</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
