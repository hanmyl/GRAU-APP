import React, { useState, useEffect } from 'react';
import { 
  BookOpen, 
  Plus, 
  Award, 
  Users, 
  CheckCircle2, 
  Share2, 
  ExternalLink, 
  Lock, 
  Settings, 
  Key, 
  RefreshCw, 
  AlertCircle, 
  Calendar, 
  ArrowRight, 
  GraduationCap, 
  Info,
  ChevronRight,
  Sparkles,
  User,
  ListFilter
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Proposal } from '../types';

interface ClassroomCourse {
  id: string;
  name: string;
  section?: string;
  descriptionHeading?: string;
  room?: string;
  alternateLink?: string;
  courseState?: string;
}

interface ClassroomAnnouncement {
  id: string;
  text: string;
  alternateLink?: string;
  creationTime: string;
}

interface ClassroomCourseWork {
  id: string;
  title: string;
  description?: string;
  alternateLink?: string;
  dueDate?: {
    year: number;
    month: number;
    day: number;
  };
  maxPoints?: number;
  workType?: string;
}

interface ClassroomIntegrationProps {
  proposals: Proposal[];
}

// Scopes required for Google Classroom
const GOOGLE_CLASSROOM_SCOPES = [
  'https://www.googleapis.com/auth/classroom.courses.readonly',
  'https://www.googleapis.com/auth/classroom.coursework.me',
  'https://www.googleapis.com/auth/classroom.announcements',
  'https://www.googleapis.com/auth/classroom.profile.emails',
  'https://www.googleapis.com/auth/classroom.profile.photos'
];

export default function ClassroomIntegration({ proposals }: ClassroomIntegrationProps) {
  // Google Configuration
  const [clientId, setClientId] = useState(() => {
    return localStorage.getItem('grau_google_client_id') || '';
  });
  const [showConfig, setShowConfig] = useState(false);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isDemoMode, setIsDemoMode] = useState(true); // Default to true so users can interact immediately
  const [userProfile, setUserProfile] = useState<{ name: string; email: string; picture?: string } | null>(null);

  // Classroom API States
  const [courses, setCourses] = useState<ClassroomCourse[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<ClassroomCourse | null>(null);
  const [announcements, setAnnouncements] = useState<ClassroomAnnouncement[]>([]);
  const [coursework, setCoursework] = useState<ClassroomCourseWork[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(false);
  
  // Tab within Course View
  const [courseTab, setCourseTab] = useState<'announcements' | 'coursework' | 'share'>('announcements');
  
  // Create New Announcement Form
  const [newAnnText, setNewAnnText] = useState('');
  const [isSubmittingAnn, setIsSubmittingAnn] = useState(false);
  const [annSuccess, setAnnSuccess] = useState(false);

  // Link Proposal Form
  const [selectedProposalId, setSelectedProposalId] = useState('');
  const [isLinking, setIsLinking] = useState(false);
  const [linkSuccess, setLinkSuccess] = useState(false);

  // Compute dynamic Redirect URI
  const redirectUri = window.location.origin;

  // Demo Mock Data
  const DEMO_COURSES: ClassroomCourse[] = [
    {
      id: 'demo-1',
      name: '5to Grado A - Desarrollo Personal y Cívica',
      section: 'Secundaria',
      descriptionHeading: 'Formación ciudadana y democracia escolar - Miguel Grau',
      room: 'Aula 104',
      alternateLink: 'https://classroom.google.com',
      courseState: 'ACTIVE'
    },
    {
      id: 'demo-2',
      name: 'Ciencia, Tecnología y Ambiente (CTA)',
      section: '5to B',
      descriptionHeading: 'Ecología, proyectos sostenibles y experimentos de biohuerto',
      room: 'Laboratorio de Ciencias',
      alternateLink: 'https://classroom.google.com',
      courseState: 'ACTIVE'
    },
    {
      id: 'demo-3',
      name: 'Educación Física y Deportes',
      section: 'General',
      descriptionHeading: 'Torneos inter-aulas, olimpiadas grauinas y salud integral',
      room: 'Campo Deportivo',
      alternateLink: 'https://classroom.google.com',
      courseState: 'ACTIVE'
    }
  ];

  const DEMO_ANNOUNCEMENTS: Record<string, ClassroomAnnouncement[]> = {
    'demo-1': [
      {
        id: 'ann-1',
        text: 'Estimados estudiantes, recuerden revisar las propuestas vigentes del Municipio Escolar en la Grau App. Mañana tendremos debate en la hora de cívica.',
        creationTime: new Date(Date.now() - 3600000 * 2).toISOString()
      },
      {
        id: 'ann-2',
        text: 'Se ha publicado el cronograma oficial de debates escolares. Participen con respeto aportando sugerencias viables.',
        creationTime: new Date(Date.now() - 3600000 * 24).toISOString()
      }
    ],
    'demo-2': [
      {
        id: 'ann-3',
        text: '¡Atención! La propuesta "Biohuerto Escolar Autosostenible" ha alcanzado el quorum de votación. Estaremos discutiendo la implementación técnica con los materiales que tengamos el viernes.',
        creationTime: new Date(Date.now() - 3600000 * 4).toISOString()
      }
    ],
    'demo-3': []
  };

  const DEMO_COURSEWORK: Record<string, ClassroomCourseWork[]> = {
    'demo-1': [
      {
        id: 'cw-1',
        title: 'Ensayo Crítico: El rol de los municipios escolares',
        description: 'Redactar un ensayo de 2 páginas sobre la importancia de la participación democrática estudiantil dentro de la I.E. Miguel Grau. Subir en PDF.',
        dueDate: { year: 2026, month: 7, day: 5 },
        maxPoints: 20,
        workType: 'ASSIGNMENT',
        alternateLink: 'https://classroom.google.com'
      },
      {
        id: 'cw-2',
        title: 'Foro de Debate: Propuestas de infraestructura',
        description: '¿Cuál crees que es la prioridad número uno del colegio? Responde y comenta al menos a dos compañeros.',
        dueDate: { year: 2026, month: 6, day: 28 },
        maxPoints: 10,
        workType: 'SHORT_ANSWER_QUESTION',
        alternateLink: 'https://classroom.google.com'
      }
    ],
    'demo-2': [
      {
        id: 'cw-3',
        title: 'Plan de Gestión de Residuos Sólidos',
        description: 'Diseña un croquis o flujograma para la recolección selectiva de residuos plásticos en los patios durante el recreo.',
        dueDate: { year: 2026, month: 7, day: 12 },
        maxPoints: 20,
        workType: 'ASSIGNMENT',
        alternateLink: 'https://classroom.google.com'
      }
    ],
    'demo-3': []
  };

  // Save Client ID
  const handleSaveClientId = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem('grau_google_client_id', clientId);
    setShowConfig(false);
  };

  // Handle OAuth Success message from Popup
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.origin !== window.location.origin) return;

      if (event.data?.type === 'GOOGLE_OAUTH_SUCCESS' && event.data?.hash) {
        const hash = event.data.hash;
        const params = new URLSearchParams(hash.substring(1)); // remove '#'
        const token = params.get('access_token');
        if (token) {
          setAccessToken(token);
          setIsDemoMode(false);
          fetchUserProfile(token);
        }
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  // Fetch User Profile
  const fetchUserProfile = async (token: string) => {
    try {
      const res = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setUserProfile({
          name: data.name,
          email: data.email,
          picture: data.picture
        });
      }
    } catch (e) {
      console.error('Error fetching google user profile', e);
    }
  };

  // Load Courses (Real or Demo)
  useEffect(() => {
    if (isDemoMode) {
      setCourses(DEMO_COURSES);
      setSelectedCourse(DEMO_COURSES[0]);
    } else if (accessToken) {
      fetchRealCourses();
    }
  }, [isDemoMode, accessToken]);

  // Load Course Content on course change
  useEffect(() => {
    if (!selectedCourse) return;

    if (isDemoMode) {
      setAnnouncements(DEMO_ANNOUNCEMENTS[selectedCourse.id] || []);
      setCoursework(DEMO_COURSEWORK[selectedCourse.id] || []);
    } else if (accessToken) {
      fetchRealCourseData(selectedCourse.id);
    }
  }, [selectedCourse, isDemoMode, accessToken]);

  // Fetch Real Classroom Courses
  const fetchRealCourses = async () => {
    setIsLoadingData(true);
    try {
      const res = await fetch('https://classroom.googleapis.com/v1/courses?courseStates=ACTIVE', {
        headers: { Authorization: `Bearer ${accessToken}` }
      });
      if (res.ok) {
        const data = await res.json();
        const list = data.courses || [];
        setCourses(list);
        if (list.length > 0) {
          setSelectedCourse(list[0]);
        } else {
          setSelectedCourse(null);
        }
      } else {
        console.error('Failed to fetch real courses, status:', res.status);
      }
    } catch (e) {
      console.error('Network error fetching classroom courses', e);
    } finally {
      setIsLoadingData(false);
    }
  };

  // Fetch Real Coursework & Announcements
  const fetchRealCourseData = async (courseId: string) => {
    setIsLoadingData(true);
    try {
      // Fetch Announcements
      const annRes = await fetch(`https://classroom.googleapis.com/v1/courses/${courseId}/announcements`, {
        headers: { Authorization: `Bearer ${accessToken}` }
      });
      const annList = annRes.ok ? (await annRes.json()).announcements || [] : [];
      
      // Fetch Coursework
      const cwRes = await fetch(`https://classroom.googleapis.com/v1/courses/${courseId}/courseWork`, {
        headers: { Authorization: `Bearer ${accessToken}` }
      });
      const cwList = cwRes.ok ? (await cwRes.json()).courseWork || [] : [];

      setAnnouncements(annList);
      setCoursework(cwList);
    } catch (e) {
      console.error('Error fetching course data', e);
    } finally {
      setIsLoadingData(false);
    }
  };

  // Initiate OAuth Popup
  const handleConnectGoogle = () => {
    if (!clientId) {
      setShowConfig(true);
      return;
    }

    const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?` + 
      `client_id=${encodeURIComponent(clientId)}` +
      `&redirect_uri=${encodeURIComponent(redirectUri)}` +
      `&response_type=token` +
      `&scope=${encodeURIComponent(GOOGLE_CLASSROOM_SCOPES.join(' '))}` +
      `&state=classroom`;

    const popup = window.open(authUrl, 'oauth_popup', 'width=600,height=650');
    if (!popup) {
      alert('Por favor habilita las ventanas emergentes en tu navegador para iniciar sesión con Google.');
    }
  };

  const handleLogout = () => {
    setAccessToken(null);
    setUserProfile(null);
    setIsDemoMode(true);
  };

  // Submit New Announcement
  const handleCreateAnnouncement = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCourse || !newAnnText.trim()) return;

    setIsSubmittingAnn(true);
    if (isDemoMode) {
      // Simulate submission
      setTimeout(() => {
        const newAnn: ClassroomAnnouncement = {
          id: `ann-${Date.now()}`,
          text: newAnnText,
          creationTime: new Date().toISOString()
        };
        setAnnouncements(prev => [newAnn, ...prev]);
        setNewAnnText('');
        setIsSubmittingAnn(false);
        setAnnSuccess(true);
        setTimeout(() => setAnnSuccess(false), 3000);
      }, 1000);
    } else {
      // Real API POST Call
      try {
        const res = await fetch(`https://classroom.googleapis.com/v1/courses/${selectedCourse.id}/announcements`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            text: newAnnText
          })
        });

        if (res.ok) {
          const created = await res.json();
          setAnnouncements(prev => [created, ...prev]);
          setNewAnnText('');
          setAnnSuccess(true);
          setTimeout(() => setAnnSuccess(false), 3000);
        } else {
          alert('Error de API al publicar anuncio. Asegúrate de tener permisos de docente en esta clase.');
        }
      } catch (e) {
        console.error('Error creating announcement', e);
      } finally {
        setIsSubmittingAnn(false);
      }
    }
  };

  // Link Portal Proposal
  const handleLinkProposal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCourse || !selectedProposalId) return;

    const proposal = proposals.find(p => p.id === selectedProposalId);
    if (!proposal) return;

    setIsLinking(true);
    const textToPublish = `🗳️ [Municipio Escolar Miguel Grau]\n` +
      `Propuesta: ${proposal.title}\n` +
      `Categoría: ${proposal.category}\n` +
      `Estatus actual: ${proposal.status}\n` +
      `Votos acumulados: ${proposal.votes}\n\n` +
      `"${proposal.description}"\n\n` +
      `Publicado desde la Grau App para debate estudiantil colaborativo.`;

    if (isDemoMode) {
      // Simulate linking
      setTimeout(() => {
        const newAnn: ClassroomAnnouncement = {
          id: `ann-${Date.now()}`,
          text: textToPublish,
          creationTime: new Date().toISOString()
        };
        setAnnouncements(prev => [newAnn, ...prev]);
        setIsLinking(false);
        setLinkSuccess(true);
        setSelectedProposalId('');
        setTimeout(() => setLinkSuccess(false), 3000);
      }, 1200);
    } else {
      // Real API POST Call
      try {
        const res = await fetch(`https://classroom.googleapis.com/v1/courses/${selectedCourse.id}/announcements`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            text: textToPublish
          })
        });

        if (res.ok) {
          const created = await res.json();
          setAnnouncements(prev => [created, ...prev]);
          setLinkSuccess(true);
          setSelectedProposalId('');
          setTimeout(() => setLinkSuccess(false), 3000);
        } else {
          alert('Error de API al vincular propuesta. Asegúrate de tener permisos en este curso.');
        }
      } catch (e) {
        console.error('Error linking proposal', e);
      } finally {
        setIsLinking(false);
      }
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      
      {/* Header section */}
      <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-xs uppercase tracking-wider font-bold text-red-400 flex items-center gap-1.5 mb-1">
            <GraduationCap className="w-3.5 h-3.5" />
            Integración Educativa Oficial
          </span>
          <h2 className="font-headline text-3xl md:text-4xl text-slate-100 tracking-tight leading-none uppercase">Google Classroom</h2>
          <p className="text-sm text-slate-400 mt-1">Sincroniza y debate las propuestas del Municipio Escolar directamente en tus aulas virtuales de Google.</p>
        </div>

        <div className="flex items-center gap-2">
          {isDemoMode ? (
            <span className="bg-amber-500/10 border border-amber-500/20 text-amber-400 text-[10px] uppercase font-bold tracking-wider px-3 py-1.5 rounded-full flex items-center gap-1.5">
              <Sparkles className="w-3 h-3 animate-pulse" /> Modo Demo Activo
            </span>
          ) : (
            <span className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] uppercase font-bold tracking-wider px-3 py-1.5 rounded-full flex items-center gap-1.5">
              <CheckCircle2 className="w-3 h-3" /> Real API Conectado
            </span>
          )}

          <button 
            onClick={() => setShowConfig(!showConfig)}
            className="bg-slate-900 border border-slate-800 hover:border-slate-700 p-2 rounded-xl text-slate-300 transition-colors"
            title="Configurar Google API credentials"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Google Developer Credentials Modal/Drawer */}
      <AnimatePresence>
        {showConfig && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="mb-6 bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-xl space-y-4"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2.5">
                <Key className="text-red-400 w-5 h-5" />
                <h3 className="text-xs font-bold uppercase text-slate-100 tracking-wider">Credenciales de API de Google (Google Cloud Console)</h3>
              </div>
              <button 
                onClick={() => setShowConfig(false)}
                className="text-slate-500 hover:text-slate-300 text-xs font-bold"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed">
              Para conectarte a Google Classroom real, necesitas configurar tu propio **Google Client ID** de tipo <em>Aplicación Web</em> en la Google Cloud Console.
            </p>

            <form onSubmit={handleSaveClientId} className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
              <div className="md:col-span-8">
                <label className="block text-[10px] font-bold text-red-400 uppercase tracking-wider mb-1.5">Google OAuth Client ID</label>
                <input 
                  type="text"
                  required
                  value={clientId}
                  onChange={(e) => setClientId(e.target.value)}
                  placeholder="Ej: 123456789-abc.apps.googleusercontent.com"
                  className="w-full bg-slate-950 border border-slate-800 text-slate-100 py-2.5 px-3 rounded-xl focus:border-red-400 focus:ring-1 focus:ring-red-400 outline-none text-xs placeholder-slate-700"
                />
              </div>
              <div className="md:col-span-4 flex gap-2">
                <button 
                  type="submit"
                  className="flex-1 bg-red-500 hover:bg-red-600 text-slate-950 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all"
                >
                  Guardar ID
                </button>
                {clientId && (
                  <button 
                    type="button"
                    onClick={() => {
                      localStorage.removeItem('grau_google_client_id');
                      setClientId('');
                    }}
                    className="bg-slate-950 border border-slate-800 text-slate-400 hover:text-red-400 hover:border-red-500/20 px-3.5 rounded-xl text-xs transition-all"
                  >
                    Borrar
                  </button>
                )}
              </div>
            </form>

            <div className="bg-slate-950 border border-slate-800/60 p-4 rounded-xl space-y-2">
              <h4 className="text-[10px] font-bold text-slate-300 uppercase tracking-widest flex items-center gap-1.5">
                <Info className="w-3.5 h-3.5 text-red-400" /> Paso a paso para habilitar el acceso:
              </h4>
              <ol className="list-decimal list-inside text-[11px] text-slate-400 space-y-1 ml-1 leading-relaxed">
                <li>Ve a la <a href="https://console.cloud.google.com/" target="_blank" rel="noreferrer" className="text-red-400 underline hover:text-red-300">Google Cloud Console</a> y crea un proyecto.</li>
                <li>Habilita la <strong>Google Classroom API</strong> en la biblioteca de APIs.</li>
                <li>Configura la pantalla de consentimiento OAuth externa con tu correo escolar o personal.</li>
                <li>Crea credenciales de tipo <strong>ID de cliente de OAuth 2.0</strong> para una <em>Aplicación Web</em>.</li>
                <li>Añade este URI exacto como <strong>Origen de JavaScript autorizado</strong> y <strong>URI de redireccionamiento autorizado</strong>:
                  <div className="mt-1.5 p-2 bg-slate-900 border border-slate-800 rounded font-mono text-[10px] text-red-400 flex items-center justify-between">
                    <span>{redirectUri}</span>
                    <button 
                      onClick={() => {
                        navigator.clipboard.writeText(redirectUri);
                        alert('¡Copiado al portapapeles!');
                      }}
                      className="text-[9px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded border border-slate-700 hover:border-red-400 hover:text-red-400 transition-all"
                    >
                      Copiar
                    </button>
                  </div>
                </li>
              </ol>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Connection State Panel */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 mb-6 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4 w-full md:w-auto">
          <div className="bg-red-500/10 border border-red-500/20 w-12 h-12 rounded-xl flex items-center justify-center text-red-400 shrink-0">
            <Users className="w-6 h-6" />
          </div>
          <div>
            {isDemoMode ? (
              <>
                <h3 className="text-xs font-bold text-slate-100 uppercase tracking-wider">Conexión: Escuela Demo Miguel Grau</h3>
                <p className="text-[11px] text-slate-500 mt-0.5">Estás explorando la interfaz usando cursos e historiales de simulación grauinos.</p>
              </>
            ) : userProfile ? (
              <>
                <div className="flex items-center gap-2">
                  {userProfile.picture && (
                    <img src={userProfile.picture} alt="Google Avatar" className="w-5 h-5 rounded-full" referrerPolicy="no-referrer" />
                  )}
                  <h3 className="text-xs font-bold text-slate-100 uppercase tracking-wider">{userProfile.name}</h3>
                </div>
                <p className="text-[11px] text-emerald-400 mt-0.5">Sesión de Google activa: <span className="text-slate-400 font-mono">{userProfile.email}</span></p>
              </>
            ) : (
              <>
                <h3 className="text-xs font-bold text-slate-100 uppercase tracking-wider">Clases Desconectadas</h3>
                <p className="text-[11px] text-slate-500 mt-0.5">Introduce tu Client ID en la configuración para enlazar aulas reales.</p>
              </>
            )}
          </div>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          {isDemoMode && (
            <button 
              onClick={() => {
                if (!clientId) {
                  setShowConfig(true);
                  alert('Por favor configura un Google Client ID primero para realizar la conexión real.');
                } else {
                  handleConnectGoogle();
                }
              }}
              className="w-full md:w-auto bg-red-500 hover:bg-red-600 text-slate-950 px-5 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2"
            >
              <Users className="w-4 h-4" />
              <span>Conectar Google Real</span>
            </button>
          )}

          {!isDemoMode && (
            <button 
              onClick={handleLogout}
              className="w-full md:w-auto bg-slate-950 border border-slate-800 text-slate-400 hover:text-red-400 hover:border-red-500/20 px-5 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all"
            >
              Desconectar Google
            </button>
          )}

          {!isDemoMode && (
            <button 
              onClick={fetchRealCourses}
              disabled={isLoadingData}
              className="bg-slate-950 border border-slate-800 text-slate-400 hover:text-red-400 hover:border-red-500/20 p-2.5 rounded-xl transition-all"
              title="Sincronizar Datos"
            >
              <RefreshCw className={`w-4 h-4 ${isLoadingData ? 'animate-spin' : ''}`} />
            </button>
          )}
        </div>
      </div>

      {/* Main Classroom split stage */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left column: Courses list (Col span 4) */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
            <div className="p-4 bg-slate-950/40 border-b border-slate-800 flex items-center justify-between">
              <h3 className="text-xs font-bold text-slate-200 uppercase tracking-widest flex items-center gap-1.5">
                <BookOpen className="w-4 h-4 text-red-400" /> Cursos Registrados
              </h3>
              <span className="text-[10px] bg-slate-950 px-2 py-0.5 rounded-full border border-slate-800 text-slate-500 font-mono">
                {courses.length}
              </span>
            </div>

            <div className="divide-y divide-slate-800/50 max-h-[400px] overflow-y-auto">
              {courses.length === 0 ? (
                <div className="p-6 text-center text-slate-500">
                  <p className="text-xs font-bold uppercase">No se hallaron cursos</p>
                  <p className="text-[11px] mt-1">Conéctate o añade clases activas.</p>
                </div>
              ) : (
                courses.map((course) => {
                  const isSelected = selectedCourse?.id === course.id;
                  return (
                    <button
                      key={course.id}
                      onClick={() => setSelectedCourse(course)}
                      className={`w-full text-left p-4 transition-all flex items-start gap-3 outline-none ${
                        isSelected 
                          ? 'bg-slate-950/80 border-l-4 border-l-red-500' 
                          : 'hover:bg-slate-950/20'
                      }`}
                    >
                      <div className={`p-2 rounded-lg ${isSelected ? 'bg-red-500/20 text-red-400' : 'bg-slate-950 border border-slate-800 text-slate-500'} shrink-0 mt-0.5`}>
                        <GraduationCap className="w-4 h-4" />
                      </div>
                      
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-bold text-slate-200 truncate">{course.name}</p>
                        {course.section && (
                          <p className="text-[10px] text-slate-500 mt-0.5 uppercase tracking-wider">{course.section} {course.room ? `• ${course.room}` : ''}</p>
                        )}
                        {course.descriptionHeading && (
                          <p className="text-[10px] text-slate-500 truncate mt-1 leading-normal italic">{course.descriptionHeading}</p>
                        )}
                      </div>

                      <ChevronRight className={`w-3.5 h-3.5 self-center text-slate-600 transition-transform ${isSelected ? 'translate-x-1 text-red-400' : ''}`} />
                    </button>
                  );
                })
              )}
            </div>
          </div>

          {/* Connected student portal state card */}
          <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/5 rounded-full blur-3xl -z-10"></div>
            <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wide flex items-center gap-1.5 mb-2">
              <Sparkles className="w-3.5 h-3.5 text-red-400" /> Flujo de Integración
            </h4>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              Los debates del Municipio Escolar ganan peso al ser difundidos en Classroom. Los profesores pueden publicar tareas relacionadas o foros de cívica usando las propuestas del portal de manera bidireccional.
            </p>
          </div>
        </div>

        {/* Right column: Course Content & Actions (Col span 8) */}
        <div className="lg:col-span-8">
          {selectedCourse ? (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl flex flex-col min-h-[500px]">
              
              {/* Selected Course Header Banner */}
              <div className="p-6 bg-slate-950/60 border-b border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <span className="text-[9px] bg-red-500/10 border border-red-500/20 text-red-400 font-bold px-2 py-0.5 rounded uppercase font-mono">
                    ID: {selectedCourse.id}
                  </span>
                  <h3 className="text-lg font-bold text-slate-100 mt-1">{selectedCourse.name}</h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {selectedCourse.section || 'Sin sección'} {selectedCourse.room ? `• Aula: ${selectedCourse.room}` : ''}
                  </p>
                </div>

                {selectedCourse.alternateLink && (
                  <a 
                    href={selectedCourse.alternateLink} 
                    target="_blank" 
                    rel="noreferrer" 
                    className="self-start sm:self-center bg-slate-900 hover:bg-slate-850 text-slate-300 hover:text-red-400 border border-slate-800 hover:border-red-500/20 py-1.5 px-3 rounded-xl font-bold text-[10px] uppercase tracking-wider transition-all flex items-center gap-1.5"
                  >
                    Abrir Classroom <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>

              {/* Course Navigation Tabs */}
              <div className="flex border-b border-slate-800 bg-slate-950/20">
                <button
                  onClick={() => setCourseTab('announcements')}
                  className={`flex-1 py-3 px-4 text-center text-xs font-bold uppercase tracking-wider border-b-2 transition-all outline-none ${
                    courseTab === 'announcements' 
                      ? 'border-b-red-500 text-red-400 bg-slate-900/50' 
                      : 'border-b-transparent text-slate-500 hover:text-slate-300'
                  }`}
                >
                  Stream / Anuncios
                </button>
                <button
                  onClick={() => setCourseTab('coursework')}
                  className={`flex-1 py-3 px-4 text-center text-xs font-bold uppercase tracking-wider border-b-2 transition-all outline-none ${
                    courseTab === 'coursework' 
                      ? 'border-b-red-500 text-red-400 bg-slate-900/50' 
                      : 'border-b-transparent text-slate-500 hover:text-slate-300'
                  }`}
                >
                  Trabajo de Clase
                </button>
                <button
                  onClick={() => setCourseTab('share')}
                  className={`flex-1 py-3 px-4 text-center text-xs font-bold uppercase tracking-wider border-b-2 transition-all outline-none ${
                    courseTab === 'share' 
                      ? 'border-b-red-500 text-red-400 bg-slate-900/50' 
                      : 'border-b-transparent text-slate-500 hover:text-slate-300'
                  }`}
                >
                  ⚙ Vinculador Grau App
                </button>
              </div>

              {/* Course Tab Stages */}
              <div className="p-6 flex-1 bg-slate-900/40">
                {isLoadingData ? (
                  <div className="h-48 flex flex-col items-center justify-center gap-3">
                    <RefreshCw className="w-8 h-8 text-red-400 animate-spin" />
                    <p className="text-xs text-slate-500 uppercase tracking-widest font-bold">Cargando datos de Classroom...</p>
                  </div>
                ) : (
                  <>
                    {/* 1. Announcements Stream Tab */}
                    {courseTab === 'announcements' && (
                      <div className="space-y-6">
                        
                        {/* Stream posting form */}
                        <form onSubmit={handleCreateAnnouncement} className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-3">
                          <div className="flex items-center gap-2 text-slate-400">
                            <Plus className="w-4 h-4 text-red-400" />
                            <span className="text-[10px] font-bold uppercase tracking-wider">Publicar anuncio para los alumnos</span>
                          </div>
                          
                          <textarea 
                            required
                            rows={3}
                            value={newAnnText}
                            onChange={(e) => setNewAnnText(e.target.value)}
                            placeholder="Comparte información, recordatorios o debates sobre el Municipio Escolar..."
                            className="w-full bg-slate-900 border border-slate-800 text-slate-200 py-2.5 px-3 rounded-xl focus:border-red-400 focus:ring-1 focus:ring-red-400 outline-none text-xs placeholder-slate-600 resize-none"
                          />

                          <div className="flex items-center justify-between">
                            <span className="text-[9px] text-slate-500 font-bold uppercase">Clase activa: {selectedCourse.name}</span>
                            <button
                              type="submit"
                              disabled={isSubmittingAnn || !newAnnText.trim()}
                              className="bg-red-500 hover:bg-red-600 disabled:opacity-50 text-slate-950 py-1.5 px-4 rounded-xl font-bold text-[10px] uppercase tracking-wider transition-all flex items-center gap-1 cursor-pointer"
                            >
                              {isSubmittingAnn ? <RefreshCw className="w-3 h-3 animate-spin" /> : null}
                              <span>{annSuccess ? '¡Publicado!' : 'Publicar Stream'}</span>
                            </button>
                          </div>
                        </form>

                        {/* Stream List */}
                        <div className="space-y-4">
                          <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Novedades de la clase</h4>
                          {announcements.length === 0 ? (
                            <div className="border border-dashed border-slate-800 rounded-xl p-6 text-center text-slate-500">
                              <p className="text-xs">El stream de novedades está vacío.</p>
                              <p className="text-[10px] mt-1">Sé el primero en publicar un aviso sobre el Municipio Escolar.</p>
                            </div>
                          ) : (
                            announcements.map((ann) => (
                              <div key={ann.id} className="bg-slate-950 border border-slate-850 p-4 rounded-xl space-y-2">
                                <div className="flex justify-between items-start gap-4">
                                  <div className="flex items-center gap-2">
                                    <div className="w-6 h-6 bg-slate-900 border border-slate-800 rounded-full flex items-center justify-center text-slate-500">
                                      <User className="w-3.5 h-3.5" />
                                    </div>
                                    <div>
                                      <p className="text-[10px] font-bold text-slate-300">Docente / Admin</p>
                                      <p className="text-[9px] text-slate-500 font-mono">
                                        {new Date(ann.creationTime).toLocaleString()}
                                      </p>
                                    </div>
                                  </div>

                                  {ann.alternateLink && (
                                    <a href={ann.alternateLink} target="_blank" rel="noreferrer" className="text-slate-600 hover:text-red-400 transition-colors">
                                      <ExternalLink className="w-3.5 h-3.5" />
                                    </a>
                                  )}
                                </div>
                                <p className="text-xs text-slate-300 leading-relaxed whitespace-pre-wrap">{ann.text}</p>
                              </div>
                            ))
                          )}
                        </div>

                      </div>
                    )}

                    {/* 2. Coursework Tab */}
                    {courseTab === 'coursework' && (
                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Asignaciones y Cuestionarios</h4>
                          <span className="text-[9px] bg-slate-950 px-2 py-0.5 rounded border border-slate-800 text-slate-500 font-mono">
                            {coursework.length} items
                          </span>
                        </div>

                        {coursework.length === 0 ? (
                          <div className="border border-dashed border-slate-800 rounded-xl p-8 text-center text-slate-500">
                            <BookOpen className="w-8 h-8 text-slate-700 mx-auto mb-2" />
                            <p className="text-xs font-bold uppercase">No hay trabajos asignados</p>
                            <p className="text-[10px] mt-1">Crea tareas escolares en la app oficial de Google Classroom.</p>
                          </div>
                        ) : (
                          <div className="space-y-3">
                            {coursework.map((item) => (
                              <div key={item.id} className="bg-slate-950 border border-slate-850 p-4.5 rounded-xl hover:border-slate-800 transition-colors flex items-start gap-3 justify-between">
                                <div className="flex items-start gap-3 min-w-0">
                                  <div className="p-2 bg-slate-900 border border-slate-850 rounded-lg text-red-400 mt-0.5">
                                    <Calendar className="w-4 h-4" />
                                  </div>
                                  <div className="min-w-0">
                                    <h5 className="text-xs font-bold text-slate-200 truncate">{item.title}</h5>
                                    {item.description && (
                                      <p className="text-[10px] text-slate-500 mt-1 line-clamp-2 leading-relaxed">{item.description}</p>
                                    )}
                                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-2.5">
                                      {item.dueDate ? (
                                        <span className="text-[9px] bg-red-500/10 text-red-400 px-2 py-0.5 rounded font-bold font-mono">
                                          Vence: {item.dueDate.day}/{item.dueDate.month}/{item.dueDate.year}
                                        </span>
                                      ) : (
                                        <span className="text-[9px] bg-slate-900 text-slate-500 px-2 py-0.5 rounded font-mono">
                                          Sin fecha de vencimiento
                                        </span>
                                      )}
                                      {item.maxPoints && (
                                        <span className="text-[9px] bg-slate-900 text-slate-400 px-2 py-0.5 rounded font-mono">
                                          Puntaje: {item.maxPoints} pts
                                        </span>
                                      )}
                                      <span className="text-[9px] text-slate-600 uppercase tracking-wider font-bold">
                                        Tipo: {item.workType?.replace('_', ' ')}
                                      </span>
                                    </div>
                                  </div>
                                </div>

                                {item.alternateLink && (
                                  <a href={item.alternateLink} target="_blank" rel="noreferrer" className="text-slate-500 hover:text-red-400 transition-colors shrink-0">
                                    <ExternalLink className="w-4 h-4" />
                                  </a>
                                )}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}

                    {/* 3. Link Proposals Tab */}
                    {courseTab === 'share' && (
                      <div className="space-y-6">
                        <div className="bg-slate-950 border border-slate-800 p-4.5 rounded-xl">
                          <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wide flex items-center gap-1.5">
                            <Share2 className="w-4 h-4 text-red-400" /> Enlace de Propuestas de Municipio Escolar
                          </h4>
                          <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
                            Publica las peticiones y proyectos de la Grau App directamente en Classroom. Esto notificará a los alumnos del curso sobre el quorum y habilitará el debate en clase.
                          </p>
                        </div>

                        <form onSubmit={handleLinkProposal} className="space-y-4">
                          <div>
                            <label className="block text-[10px] font-bold text-red-400 uppercase tracking-wider mb-1.5">Seleccionar Propuesta de la Grau App</label>
                            <select 
                              value={selectedProposalId}
                              onChange={(e) => setSelectedProposalId(e.target.value)}
                              required
                              className="w-full bg-slate-950 border border-slate-800 text-slate-200 py-2.5 px-3 rounded-xl focus:border-red-400 focus:ring-1 focus:ring-red-400 outline-none text-xs"
                            >
                              <option value="">-- Elige una propuesta escolar para vincular --</option>
                              {proposals.map(p => (
                                <option key={p.id} value={p.id}>
                                  [{p.category}] {p.title} ({p.votes} votos)
                                </option>
                              ))}
                            </select>
                          </div>

                          {selectedProposalId && (
                            <div className="p-4 bg-slate-950/60 border border-slate-800 rounded-xl space-y-2">
                              {(() => {
                                const prop = proposals.find(p => p.id === selectedProposalId);
                                if (!prop) return null;
                                return (
                                  <>
                                    <div className="flex items-center justify-between">
                                      <span className="text-[9px] font-bold text-red-400 uppercase tracking-widest">{prop.category}</span>
                                      <span className="text-[9px] bg-slate-900 border border-slate-800 px-2 py-0.5 rounded font-mono text-slate-400">Estatus: {prop.status}</span>
                                    </div>
                                    <h5 className="text-xs font-bold text-slate-200">{prop.title}</h5>
                                    <p className="text-[11px] text-slate-400 italic line-clamp-3 leading-normal">"{prop.description}"</p>
                                  </>
                                );
                              })()}
                            </div>
                          )}

                          <button
                            type="submit"
                            disabled={isLinking || !selectedProposalId}
                            className="w-full bg-red-500 hover:bg-red-600 disabled:opacity-50 text-slate-950 py-3 rounded-xl font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer"
                          >
                            {isLinking ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Share2 className="w-4 h-4" />}
                            <span>{linkSuccess ? '¡Propuesta Vinculada con Éxito!' : 'Vincular y Publicar en Stream'}</span>
                          </button>
                        </form>
                      </div>
                    )}
                  </>
                )}
              </div>

            </div>
          ) : (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 text-center text-slate-500 flex flex-col items-center justify-center min-h-[500px]">
              <GraduationCap className="w-12 h-12 text-slate-700 mb-3" />
              <p className="text-sm font-bold uppercase text-slate-400">Ningún curso seleccionado</p>
              <p className="text-xs text-slate-500 mt-1 max-w-sm">Haz clic en una clase en la columna izquierda para inspeccionar novedades, tareas y vincular propuestas estudiantiles.</p>
            </div>
          )}
        </div>

      </div>

    </div>
  );
}
