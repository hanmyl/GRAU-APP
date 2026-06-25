import React, { useState } from 'react';
import { 
  Bell, 
  Mail, 
  Save, 
  Smartphone, 
  Volume2, 
  HelpCircle, 
  Settings, 
  Sliders, 
  Activity, 
  Moon,
  Trash2,
  AlertTriangle,
  History,
  CheckCircle,
  Clock
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface NotificationLog {
  id: string;
  title: string;
  category: 'Administración' | 'Votación' | 'Académico' | 'Sistema';
  time: string;
  details: string;
  read: boolean;
}

export default function AlertSettings() {
  const [pushEnabled, setPushEnabled] = useState(true);
  const [emailEnabled, setEmailEnabled] = useState(false);
  const [votationEnabled, setVotationEnabled] = useState(true);
  const [commentsEnabled, setCommentEnabled] = useState(true);
  const [isQuietHoursActive, setIsQuietHoursActive] = useState(true);
  const [showSaveSuccess, setShowSaveSaveSuccess] = useState(false);

  const [logs, setLogs] = useState<NotificationLog[]>([
    {
      id: 'log-1',
      title: 'Nueva Directiva: Uso de Laboratorios',
      category: 'Administración',
      time: 'Hace 10 min',
      details: 'La Dirección publicó el reglamento de reservas para el Aula de Innovación.',
      read: false
    },
    {
      id: 'log-2',
      title: 'Quorum alcanzado: Sombreadores de Patio',
      category: 'Votación',
      time: 'Hace 2 horas',
      details: 'La propuesta alcanzó 42 votos y califica a la mesa de diálogo.',
      read: false
    },
    {
      id: 'log-3',
      title: 'Mantenimiento del software del servidor',
      category: 'Sistema',
      time: 'Ayer',
      details: 'Se optimizó la Grau App para mejorar la visualización móvil.',
      read: true
    }
  ]);

  const handleSaveSettings = () => {
    setShowSaveSaveSuccess(true);
    setTimeout(() => {
      setShowSaveSaveSuccess(false);
    }, 2000);
  };

  const handleClearLogs = () => {
    if (confirm("¿Estás seguro de que deseas limpiar todo tu historial de notificaciones leídas?")) {
      setLogs(logs.filter(log => !log.read));
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 space-y-6">
      
      <AnimatePresence>
        {showSaveSuccess && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-6 right-6 z-50 bg-emerald-950 border border-emerald-500 text-emerald-200 px-6 py-4 rounded-xl shadow-2xl flex items-center space-x-3"
          >
            <CheckCircle className="w-6 h-6 text-emerald-400" />
            <div>
              <p className="font-bold">¡Preferencias Guardadas!</p>
              <p className="text-xs text-emerald-400">Tus canales de comunicación fueron actualizados.</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header section */}
      <section className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b border-slate-800 pb-5">
        <div>
          <span className="text-xs uppercase tracking-wider font-bold text-red-400 flex items-center gap-1">
            <Sliders className="w-3.5 h-3.5" />
            Configuración Personal
          </span>
          <h2 className="font-headline text-3xl md:text-4xl text-slate-100 tracking-tight leading-none uppercase">Centro de Alertas</h2>
          <p className="text-sm text-slate-400 mt-1 max-w-2xl">Gestiona tus preferencias de comunicación y mantente al tanto de la actividad institucional en tiempo real.</p>
        </div>
        <div className="flex gap-2 bg-slate-900 border border-slate-800 rounded-xl p-2 items-center">
          <div className="w-2.5 h-2.5 bg-red-400 rounded-full animate-pulse mx-1"></div>
          <span className="text-[10px] font-bold text-red-400 uppercase tracking-widest">Monitoreo Activo</span>
        </div>
      </section>

      {/* Bento Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Toggles Preference Dashboard (Col span 7) */}
        <div className="col-span-12 lg:col-span-7 space-y-6">
          
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-6 shadow-xl relative overflow-hidden">
            <div className="flex justify-between items-center mb-1">
              <h3 className="text-xs font-bold text-red-400 uppercase tracking-widest flex items-center gap-2">
                <Sliders className="w-4 h-4" /> Preferencias de Recepción
              </h3>
              
              <button 
                onClick={handleSaveSettings}
                className="bg-red-500 hover:bg-red-600 text-slate-950 px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-lg hover:shadow-red-500/10 cursor-pointer"
              >
                <Save className="w-3.5 h-3.5" /> Guardar Cambios
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Toggle Push */}
              <div className={`p-4 bg-slate-950 rounded-xl border transition-all ${
                pushEnabled ? 'border-red-500/30 bg-red-950/5' : 'border-slate-800/80'
              }`}>
                <div className="flex items-start justify-between">
                  <div className="flex gap-3">
                    <Smartphone className={`w-5 h-5 mt-0.5 ${pushEnabled ? 'text-red-400' : 'text-slate-500'}`} />
                    <div>
                      <p className="text-xs font-bold text-slate-200">Notificaciones Push</p>
                      <p className="text-[11px] text-slate-500 mt-0.5">Alertas de Dirección directo en navegador</p>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={pushEnabled} 
                      onChange={(e) => setPushEnabled(e.target.checked)}
                      className="sr-only peer" 
                    />
                    <div className="w-10 h-5 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-slate-400 after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-red-500 peer-checked:after:bg-slate-950"></div>
                  </label>
                </div>
              </div>

              {/* Toggle Email */}
              <div className={`p-4 bg-slate-950 rounded-xl border transition-all ${
                emailEnabled ? 'border-red-500/30 bg-red-950/5' : 'border-slate-800/80'
              }`}>
                <div className="flex items-start justify-between">
                  <div className="flex gap-3">
                    <Mail className={`w-5 h-5 mt-0.5 ${emailEnabled ? 'text-red-400' : 'text-slate-500'}`} />
                    <div>
                      <p className="text-xs font-bold text-slate-200">Correo Electrónico</p>
                      <p className="text-[11px] text-slate-500 mt-0.5">Resúmenes semanales y avisos críticos</p>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={emailEnabled} 
                      onChange={(e) => setEmailEnabled(e.target.checked)}
                      className="sr-only peer" 
                    />
                    <div className="w-10 h-5 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-slate-400 after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-red-500 peer-checked:after:bg-slate-950"></div>
                  </label>
                </div>
              </div>
            </div>

            {/* Categorized Types */}
            <div className="space-y-3 pt-2">
              <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Categorías de Notificación</h4>
              
              <div className="space-y-2">
                {/* Row 1: Dirección */}
                <div className="flex items-center justify-between p-3.5 bg-slate-950 rounded-xl border-l-4 border-l-red-500 border border-slate-800">
                  <div className="flex items-center space-x-3 pr-4">
                    <Volume2 className="w-5 h-5 text-red-400 shrink-0" />
                    <div>
                      <p className="text-xs font-bold text-slate-200">Anuncios de la Dirección</p>
                      <p className="text-[11px] text-slate-500">Avisos de urgencia, suspensiones o cambio de calendario.</p>
                    </div>
                  </div>
                  <span className="text-[9px] font-bold text-red-400 bg-red-950/50 border border-red-500/20 px-2 py-0.5 rounded-full shrink-0">CRÍTICO</span>
                </div>

                {/* Row 2: Votación */}
                <div className="flex items-center justify-between p-3.5 bg-slate-950 rounded-xl border-l-4 border-l-yellow-500 border border-slate-800">
                  <div className="flex items-center space-x-3 pr-4">
                    <Settings className="w-5 h-5 text-yellow-500 shrink-0" />
                    <div>
                      <p className="text-xs font-bold text-slate-200">Actividad de Votación</p>
                      <p className="text-[11px] text-slate-500">Alertas de nuevos votos o quorum en tus propuestas.</p>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer shrink-0">
                    <input 
                      type="checkbox" 
                      checked={votationEnabled} 
                      onChange={(e) => setVotationEnabled(e.target.checked)}
                      className="sr-only peer" 
                    />
                    <div className="w-8 h-4 bg-slate-800 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-slate-400 after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-red-500"></div>
                  </label>
                </div>

                {/* Row 3: Comentarios */}
                <div className="flex items-center justify-between p-3.5 bg-slate-950 rounded-xl border-l-4 border-l-blue-500 border border-slate-800">
                  <div className="flex items-center space-x-3 pr-4">
                    <Sliders className="w-5 h-5 text-blue-400 shrink-0" />
                    <div>
                      <p className="text-xs font-bold text-slate-200">Nuevos Comentarios</p>
                      <p className="text-[11px] text-slate-500">Interacciones en las discusiones de tus iniciativas.</p>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer shrink-0">
                    <input 
                      type="checkbox" 
                      checked={commentsEnabled} 
                      onChange={(e) => setCommentEnabled(e.target.checked)}
                      className="sr-only peer" 
                    />
                    <div className="w-8 h-4 bg-slate-800 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-slate-400 after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-red-500"></div>
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Quiet Hours Card */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl flex items-center justify-between relative overflow-hidden">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 rounded-xl bg-purple-950/40 border border-purple-500/20 flex items-center justify-center shrink-0">
                <Moon className="w-6 h-6 text-purple-400" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-200">Modo Silencio (Quiet Hours)</h4>
                <p className="text-[11px] text-slate-500 leading-normal">Pausa todas las alertas intrusivas durante horas de estudio.</p>
              </div>
            </div>

            <div className="flex items-center space-x-4 shrink-0">
              <span className="text-xs text-slate-400 font-mono hidden md:inline">22:00 — 07:00</span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={isQuietHoursActive} 
                  onChange={(e) => setIsQuietHoursActive(e.target.checked)}
                  className="sr-only peer" 
                />
                <div className="w-10 h-5 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-slate-400 after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-red-500 peer-checked:after:bg-slate-950"></div>
              </label>
            </div>
          </div>
        </div>

        {/* Right Column: Recent Notification logs history (Col span 5) */}
        <div className="col-span-12 lg:col-span-5 flex flex-col h-full">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl flex-1 flex flex-col overflow-hidden shadow-2xl">
            
            <div className="p-5 border-b border-slate-800/80 bg-slate-950/40">
              <h3 className="text-xs font-bold text-slate-200 uppercase tracking-widest flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <History className="w-4 h-4 text-red-400" /> Historial Reciente
                </span>
                <span className="text-[10px] font-mono bg-slate-950 border border-slate-800 px-2 py-0.5 rounded text-slate-500">
                  {logs.length} Registros
                </span>
              </h3>
            </div>

            {/* List */}
            <div className="flex-1 p-3 overflow-y-auto max-h-[350px] custom-scrollbar space-y-2">
              {logs.map((log) => (
                <div key={log.id} className="p-3 bg-slate-950 rounded-xl border border-slate-800/60 flex gap-3 hover:border-slate-700 transition-all cursor-pointer">
                  <div className="w-8 h-8 rounded-full bg-slate-900 border border-slate-800/50 flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-red-400 text-lg">
                      {log.category === 'Administración' ? 'campaign' : log.category === 'Votación' ? 'how_to_vote' : 'notifications'}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-baseline mb-0.5">
                      <p className="text-xs font-bold text-slate-200 truncate">{log.title}</p>
                      <span className="text-[9px] text-slate-500 font-medium shrink-0 ml-2">{log.time}</span>
                    </div>
                    <p className="text-[11px] text-slate-400 leading-normal line-clamp-1">{log.details}</p>
                    <div className="flex gap-2 items-center mt-1.5">
                      <span className="text-[8px] font-bold uppercase tracking-wider text-red-400">{log.category}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Clear button footer */}
            <div className="p-4 border-t border-slate-800 bg-slate-950/40 text-center">
              <button 
                onClick={handleClearLogs}
                className="text-[10px] font-bold text-slate-500 hover:text-rose-500 uppercase tracking-widest flex items-center justify-center gap-1.5 mx-auto transition-colors cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" /> Limpiar Historial Leído
              </button>
            </div>
          </div>
        </div>

      </div>

      {/* Global Alerts Summary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
        <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-lg bg-red-950/30 text-red-400 flex items-center justify-center shrink-0">
            <Bell className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xl font-headline text-slate-200 leading-none">04</p>
            <p className="text-[10px] text-slate-500 font-bold uppercase mt-1">Sin Leer</p>
          </div>
        </div>

        <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-lg bg-red-950/30 text-red-400 flex items-center justify-center shrink-0">
            <Smartphone className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xl font-headline text-slate-200 leading-none">12</p>
            <p className="text-[10px] text-slate-500 font-bold uppercase mt-1">Push Hoy</p>
          </div>
        </div>

        <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 flex items-center gap-3.5 border-l-4 border-l-red-500">
          <div className="w-10 h-10 rounded-lg bg-red-950/50 text-red-400 flex items-center justify-center shrink-0">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xl font-headline text-slate-200 leading-none">01</p>
            <p className="text-[10px] text-slate-500 font-bold uppercase mt-1">Alerta Crítica</p>
          </div>
        </div>

        <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-lg bg-red-950/30 text-red-400 flex items-center justify-center shrink-0">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xl font-headline text-slate-200 leading-none">09h</p>
            <p className="text-[10px] text-slate-500 font-bold uppercase mt-1">Silencio Activo</p>
          </div>
        </div>
      </div>

    </div>
  );
}
