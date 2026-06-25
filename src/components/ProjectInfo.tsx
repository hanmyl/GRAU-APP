import React from 'react';
import { motion } from 'motion/react';
import { 
  BookOpen, 
  MapPin, 
  DollarSign, 
  Award, 
  QrCode, 
  Facebook, 
  Clock, 
  CheckCircle2, 
  Sparkles,
  Play,
  Heart,
  TrendingUp,
  HelpCircle
} from 'lucide-react';

interface TeamMember {
  name: string;
  role: string;
  specialty: string;
  avatar: string;
}

const TEAM: TeamMember[] = [
  { name: 'Arian', role: 'Coordinador General', specialty: 'Liderazgo y Gestión de Alianzas', avatar: '🎓' },
  { name: 'Yohan', role: 'Desarrollador Tecnológico', specialty: 'Arquitectura de Datos y Lógica', avatar: '💻' },
  { name: 'Rafael', role: 'Diseñador de Interfaz', specialty: 'Estructura Visual y Experiencia', avatar: '🎨' },
  { name: 'Rolando', role: 'Estratega de Comunicación', specialty: 'Redacción y Difusión Directiva', avatar: '📢' },
  { name: 'Ghio', role: 'Especialista de Sostenibilidad', specialty: 'Planificación Financiera y Recursos', avatar: '🌱' },
  { name: 'Ayala', role: 'Analista de Feedback', specialty: 'Investigación Estudiantil y Pruebas', avatar: '📊' }
];

export default function ProjectInfo() {
  return (
    <div className="space-y-6">
      
      {/* Institution Info Banner */}
      <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-4">
          <div className="inline-flex items-center space-x-2 bg-indigo-50 border border-indigo-100 px-3 py-1 rounded-full text-xs text-indigo-700 font-medium">
            <BookOpen className="w-3.5 h-3.5" />
            <span>Ficha del Proyecto Escolar</span>
          </div>
          <h2 className="text-xl md:text-2xl font-sans font-bold text-slate-900 leading-tight">
            I.E. Miguel Grau - Innovación en la Educación Pública
          </h2>
          <p className="text-slate-600 text-xs md:text-sm leading-relaxed">
            Nuestra institución, de gestión pública directa, atiende al nivel de educación secundaria de menores en el turno de la mañana en Abancay. Conscientes de la necesidad de modernizar la interacción institucional, diseñamos <strong>Grau App</strong> como un puente entre la voz del alumnado y las autoridades directivas.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-500">
            <div className="flex items-center space-x-2">
              <MapPin className="w-4 h-4 text-indigo-500 shrink-0" />
              <span>Avenida Seoane, Abancay, Apurímac</span>
            </div>
            <div className="flex items-center space-x-2">
              <Clock className="w-4 h-4 text-indigo-500 shrink-0" />
              <span>Nivel Secundaria - Turno Mañana</span>
            </div>
          </div>
        </div>

        <div className="bg-slate-50 rounded-xl p-5 border border-slate-200/60 flex flex-col justify-center items-center text-center">
          <Award className="w-8 h-8 text-indigo-600 mb-2" />
          <h4 className="text-xs font-bold text-slate-900 uppercase">Visión Social</h4>
          <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
            "Fomentar la convivencia armónica y la democracia participativa desde las aulas."
          </p>
        </div>
      </div>

      {/* Team Section */}
      <div className="space-y-4">
        <div>
          <h3 className="text-base font-bold text-slate-900 flex items-center space-x-1.5">
            <Sparkles className="w-4 h-4 text-indigo-600" />
            <span>Equipo Emprendedor Lider</span>
          </h3>
          <p className="text-xs text-slate-400">Estudiantes comprometidos en transformar la comunicación escolar grauna.</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {TEAM.map((member) => (
            <motion.div
              key={member.name}
              whileHover={{ y: -4 }}
              className="bg-white rounded-2xl p-4 border border-slate-100 shadow-xs hover:shadow-md transition-all text-center flex flex-col justify-between"
            >
              <div>
                <span className="text-3xl block mb-2" role="img" aria-label="avatar">
                  {member.avatar}
                </span>
                <h4 className="font-bold text-slate-900 text-sm leading-none mb-1">{member.name}</h4>
                <p className="text-[10px] text-indigo-600 font-medium mb-2">{member.role}</p>
              </div>
              <p className="text-[9px] text-slate-400 leading-tight pt-2 border-t border-slate-100">
                {member.specialty}
              </p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Sustainability and Promotion row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Cost & Sustainability Model */}
        <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-slate-900 flex items-center space-x-1.5">
            <DollarSign className="w-4 h-4 text-emerald-600" />
            <span>Modelo de Sostenibilidad de Bajo Costo (S/ 30.00)</span>
          </h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            A diferencia de los sistemas de software comerciales que cuestan miles de soles en licencias, <strong>Grau App</strong> fue diseñada bajo un modelo de <strong>Sostenibilidad Social</strong>. Demostramos que el presupuesto no es un obstáculo para la innovación escolar:
          </p>

          <div className="space-y-2 text-xs">
            <div className="flex items-start space-x-2 text-slate-600">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
              <span><strong>Infraestructura Gratuita:</strong> Desplegado en servidores en la nube sin costo (con capas gratuitas para proyectos estudiantiles en Vercel, Netlify o Cloud Run).</span>
            </div>
            <div className="flex items-start space-x-2 text-slate-600">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
              <span><strong>Base de Datos Eficiente:</strong> Integrado con Firebase Firestore en su plan gratuito, permitiendo miles de visitas mensuales sin requerir pagos extras.</span>
            </div>
            <div className="flex items-start space-x-2 text-slate-600">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
              <span><strong>Presupuesto de S/ 30.00:</strong> Destinado principalmente a la impresión física de volantes con códigos QR, recarga de internet móvil para soporte administrativo y promoción de campo.</span>
            </div>
          </div>
        </div>

        {/* Multichannel Access and QR Strategy */}
        <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm space-y-4 flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900 flex items-center space-x-1.5">
              <QrCode className="w-4 h-4 text-indigo-600" />
              <span>Estrategia de Difusión y Accesibilidad</span>
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed mb-3">
              Para garantizar que ningún estudiante se quede fuera del proceso democrático, habilitamos accesos rápidos en puntos clave de la I.E. Miguel Grau:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                <p className="font-bold text-slate-700">Códigos QR</p>
                <p className="text-[10px] text-slate-400">Pegados en el patio, el mural escolar y las pizarras de los salones.</p>
              </div>
              <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                <p className="font-bold text-slate-700">Presencia en TikTok</p>
                <p className="text-[10px] text-slate-400">Videos explicativos dinámicos hechos por el mismo equipo responsable.</p>
              </div>
            </div>
          </div>

          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/60 flex items-center space-x-4">
            <div className="bg-white p-2 rounded-lg border border-slate-300 shrink-0 shadow-xs relative group cursor-pointer">
              {/* Simulated QR Code using nested grids */}
              <div className="grid grid-cols-5 gap-0.5 w-14 h-14 bg-slate-900 p-1 rounded-sm">
                <div className="bg-white rounded-xs"></div>
                <div className="bg-slate-900"></div>
                <div className="bg-white rounded-xs"></div>
                <div className="bg-white rounded-xs"></div>
                <div className="bg-white rounded-xs"></div>
                
                <div className="bg-white rounded-xs"></div>
                <div className="bg-slate-900"></div>
                <div className="bg-slate-900"></div>
                <div className="bg-white rounded-xs"></div>
                <div className="bg-slate-900"></div>
                
                <div className="bg-slate-900"></div>
                <div className="bg-white rounded-xs"></div>
                <div className="bg-slate-900"></div>
                <div className="bg-white rounded-xs"></div>
                <div className="bg-slate-900"></div>
                
                <div className="bg-white rounded-xs"></div>
                <div className="bg-slate-900"></div>
                <div className="bg-white rounded-xs"></div>
                <div className="bg-slate-900"></div>
                <div className="bg-white rounded-xs"></div>
                
                <div className="bg-slate-900"></div>
                <div className="bg-white rounded-xs"></div>
                <div className="bg-slate-900"></div>
                <div className="bg-white rounded-xs"></div>
                <div className="bg-slate-900"></div>
              </div>
              <div className="absolute inset-0 bg-indigo-600/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-lg">
                <span className="text-[9px] font-bold text-indigo-700">GRAU QR</span>
              </div>
            </div>
            
            <div className="text-xs">
              <p className="font-bold text-slate-800">¡Comparte la aplicación!</p>
              <p className="text-[10px] text-slate-500">Muestra este código QR en las aulas de la I.E. Miguel Grau para que tus compañeros ingresen al instante.</p>
            </div>
          </div>
        </div>

      </div>

      {/* Frequently Asked Questions */}
      <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm space-y-4">
        <h3 className="text-sm font-bold text-slate-900 flex items-center space-x-1.5">
          <HelpCircle className="w-4.5 h-4.5 text-indigo-500" />
          <span>Preguntas Frecuentes del Emprendimiento Escolar</span>
        </h3>

        <div className="space-y-3 text-xs text-slate-600">
          <div>
            <p className="font-bold text-slate-800 mb-0.5">¿Por qué es un emprendimiento si no genera ganancias monetarias?</p>
            <p className="leading-relaxed">Porque es un <strong>Emprendimiento Social</strong>. El valor generado no es dinero, sino "capital social": mayor cohesión, resolución pacífica de quejas estudiantiles, participación cívica activa y alivio de tensiones mediante una comunicación transparente.</p>
          </div>
          <div className="border-t border-slate-100 pt-2.5">
            <p className="font-bold text-slate-800 mb-0.5">¿Qué pasa si un alumno publica contenido ofensivo?</p>
            <p className="leading-relaxed">El sistema está diseñado con moderación de contenido. Todas las propuestas y comentarios llevan el nombre, grado y sección del remitente (verificado mediante credenciales o listas de alumnos), promoviendo la cultura del respeto y la responsabilidad digital.</p>
          </div>
        </div>
      </div>

    </div>
  );
}
