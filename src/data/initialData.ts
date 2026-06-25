import { Proposal, Announcement } from '../types';

export const INITIAL_PROPOSALS: Proposal[] = [
  {
    id: 'prop-1',
    title: 'Sombreadores para el patio principal',
    category: 'Infraestructura',
    description: 'Debido a la alta radiación solar en Abancay durante las horas de recreo y educación física, proponemos instalar mallas raschel en el patio principal para proteger la salud de todos los estudiantes.',
    author: 'Arian (5to B)',
    votes: 42,
    votedBy: ['demo-1', 'demo-2'],
    createdAt: '2026-06-20T10:30:00Z',
    status: 'En Revisión',
    comments: [
      {
        id: 'c-1',
        author: 'Rafael (4to A)',
        text: 'Excelente iniciativa, el calor es insoportable a mediodía.',
        createdAt: '2026-06-20T11:15:00Z'
      },
      {
        id: 'c-2',
        author: 'Director Técnico',
        text: 'Estamos evaluando el presupuesto y los anclajes de seguridad en el patio.',
        createdAt: '2026-06-21T09:00:00Z'
      }
    ]
  },
  {
    id: 'prop-2',
    title: 'Campaña de reciclaje "Grau Verde"',
    category: 'Ecología',
    description: 'Implementar tachos diferenciados para plástico, papel y orgánicos en cada pabellón. Lo recaudado vendiendo botellas plásticas puede servir para comprar balones de fútbol y básquet.',
    author: 'Ghio (3ro C)',
    votes: 29,
    votedBy: ['demo-3'],
    createdAt: '2026-06-21T14:20:00Z',
    status: 'Pendiente',
    comments: [
      {
        id: 'c-3',
        author: 'Yohan (5to A)',
        text: 'Apoyo total. Así cuidamos el colegio y conseguimos implementos deportivos.',
        createdAt: '2026-06-21T15:00:00Z'
      }
    ]
  },
  {
    id: 'prop-3',
    title: 'Torneo Intersecciones de Futsal y Voley',
    category: 'Deportes',
    description: 'Proponemos reactivar los campeonatos en las horas de la tarde o durante el recreo largo. Fomenta el deporte, desestresa a las secciones y une a los salones.',
    author: 'Rafael (4to A)',
    votes: 56,
    votedBy: [],
    createdAt: '2026-06-18T08:00:00Z',
    status: 'Aprobado',
    comments: [
      {
        id: 'c-4',
        author: 'Rolando (5to B)',
        text: '¡Sí! Ya tenemos los equipos listos. Solo falta el permiso del subdirector.',
        createdAt: '2026-06-18T09:30:00Z'
      }
    ]
  },
  {
    id: 'prop-4',
    title: 'Mejora del internet en el Aula de Innovación',
    category: 'Académico',
    description: 'Para realizar trabajos de investigación del curso de Educación para el Trabajo (EPT) o Ciencia y Tecnología, necesitamos que la velocidad del internet mejore o se organice mejor el horario de uso.',
    author: 'Yohan (5to A)',
    votes: 38,
    votedBy: [],
    createdAt: '2026-06-22T11:00:00Z',
    status: 'Pendiente',
    comments: []
  },
  {
    id: 'prop-5',
    title: 'Talleres de Oratoria y Liderazgo los Sábados',
    category: 'Académico',
    description: 'Queremos proponer un taller libre donde podamos aprender a expresarnos en público, debatir y ganar confianza. Nos ayudará mucho para cuando vayamos a la universidad o institutos.',
    author: 'Ayala (4to C)',
    votes: 21,
    votedBy: [],
    createdAt: '2026-06-23T15:45:00Z',
    status: 'Pendiente',
    comments: []
  }
];

export const INITIAL_ANNOUNCEMENTS: Announcement[] = [
  {
    id: 'ann-1',
    title: 'Reunión con el Municipio Escolar',
    content: 'Este viernes a las 11:00 AM se realizará la mesa de diálogo entre el Municipio Escolar y la Dirección para revisar las propuestas con más de 30 votos en la Grau App. ¡Tu participación rinde frutos!',
    category: 'Urgente',
    date: '2026-06-24T12:00:00Z',
    author: 'Dirección Miguel Grau'
  },
  {
    id: 'ann-2',
    title: 'Mantenimiento del Aula de Innovación Tecnológica',
    content: 'Se informa que el día de mañana jueves las computadoras del pabellón B estarán en mantenimiento de software para optimizar la velocidad y acceso de Grau App.',
    category: 'General',
    date: '2026-06-23T08:00:00Z',
    author: 'Área de Soporte Técnico'
  },
  {
    id: 'ann-3',
    title: 'Ganadores de los Juegos Florales - Etapa UGEL',
    content: 'Felicitamos calurosamente a nuestros compañeros que representaron al colegio en poesía y dibujo, logrando el primer puesto. ¡Orgullo grauno!',
    category: 'Logro',
    date: '2026-06-22T16:30:00Z',
    author: 'Municipio Escolar'
  }
];
