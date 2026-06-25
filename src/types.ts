export interface Comment {
  id: string;
  author: string;
  text: string;
  createdAt: string;
}

export interface Proposal {
  id: string;
  title: string;
  category: 'Infraestructura' | 'Convivencia' | 'Deportes' | 'Académico' | 'Ecología' | 'Otros';
  description: string;
  author: string;
  votes: number;
  votedBy: string[]; // IP or local user names
  createdAt: string;
  status: 'Pendiente' | 'En Revisión' | 'Aprobado' | 'Resuelto';
  comments: Comment[];
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  category: 'Urgente' | 'Evento' | 'General' | 'Logro';
  date: string;
  author: string;
}
