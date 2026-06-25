import React, { useState, useEffect, useRef } from 'react';
import { 
  Send, 
  Smile, 
  PlusCircle, 
  Volume2, 
  MessageSquare, 
  CheckCheck, 
  Archive, 
  CornerUpLeft,
  Mail,
  User,
  Paperclip,
  Bot
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface ChatMessage {
  id: string;
  sender: 'user' | 'other';
  senderName: string;
  text: string;
  time: string;
  attachment?: { name: string; type: string };
}

interface ChatChannel {
  id: string;
  name: string;
  role: string;
  lastMessage: string;
  time: string;
  unread: boolean;
  avatarIcon: string;
  category: 'Dirección' | 'Feedback' | 'Sistema';
  messages: ChatMessage[];
}

export default function MessagingPanel() {
  const [channels, setChannels] = useState<ChatChannel[]>([
    {
      id: 'ch-1',
      name: 'Dirección General',
      role: 'Mesa Directiva',
      lastMessage: 'Nueva normativa para el uso de laboratorios de alta tecnología.',
      time: '10:45 AM',
      unread: true,
      avatarIcon: 'campaign',
      category: 'Dirección',
      messages: [
        {
          id: 'm1-1',
          sender: 'other',
          senderName: 'Dirección General',
          text: 'Estimado estudiante,\n\nLe informamos que a partir del próximo lunes, el acceso a los laboratorios de cómputo avanzado requerirá de una reserva previa a través de la Grau App. Esta medida se toma para optimizar el uso de los recursos y garantizar que todos los alumnos cuenten con un espacio asignado.\n\nPor favor, revise el manual de usuario adjunto para conocer el nuevo procedimiento de reserva.',
          time: '10:45 AM',
          attachment: { name: 'Manual_Laboratorios_2024.pdf', type: 'PDF' }
        }
      ]
    },
    {
      id: 'ch-2',
      name: 'Prof. Carlos Méndez',
      role: 'Tutor de Ciencias',
      lastMessage: 'Tu propuesta para el proyecto final ha sido revisada.',
      time: 'Ayer',
      unread: false,
      avatarIcon: 'reviews',
      category: 'Feedback',
      messages: [
        {
          id: 'm2-1',
          sender: 'other',
          senderName: 'Prof. Carlos Méndez',
          text: 'Hola. Revisé la propuesta del panel solar para el Campus Este y me parece una excelente propuesta de innovación para EPT. Agrega un desglose de mantenimiento y ya estará lista.',
          time: 'Ayer'
        }
      ]
    },
    {
      id: 'ch-3',
      name: 'Área de Soporte Técnico',
      role: 'Grau App Soporte',
      lastMessage: 'Se han añadido nuevas funcionalidades al módulo de biblioteca.',
      time: 'Lunes',
      unread: false,
      avatarIcon: 'update',
      category: 'Sistema',
      messages: [
        {
          id: 'm3-1',
          sender: 'other',
          senderName: 'Soporte Técnico',
          text: 'Hola Juan. Tu ticket #2284 ha sido cerrado. Ya puedes subir archivos PDF de hasta 10MB sin inconvenientes desde tu celular.',
          time: 'Lunes'
        }
      ]
    }
  ]);

  const [activeChannelId, setActiveChannelId] = useState('ch-1');
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const activeChannel = channels.find(ch => ch.id === activeChannelId) || channels[0];

  useEffect(() => {
    // Scroll to bottom of chat history when changing channels or receiving messages
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeChannel.messages, isTyping]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const messageText = inputText.trim();
    const now = new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
    
    // Add user message to active channel
    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      senderName: 'Tú',
      text: messageText,
      time: now
    };

    setChannels(prev => prev.map(ch => {
      if (ch.id === activeChannelId) {
        return {
          ...ch,
          lastMessage: messageText,
          time: 'Ahora',
          unread: false,
          messages: [...ch.messages, userMsg]
        };
      }
      return ch;
    }));

    setInputText('');

    // Trigger smart automatic bot reply simulation
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      let replyText = '';
      if (activeChannelId === 'ch-1') {
        replyText = 'Gracias por tu respuesta. He registrado tu consulta sobre los laboratorios. Las reservas tendrán un límite máximo de 2 horas por sesión para asegurar la rotación de todos los alumnos.';
      } else if (activeChannelId === 'ch-2') {
        replyText = 'Excelente, nos vemos en clase para afinar ese presupuesto. ¡Sigue así!';
      } else {
        replyText = 'Entendido. Si experimentas alguna otra dificultad con la Grau App, no dudes en reabrir un reporte.';
      }

      const botMsg: ChatMessage = {
        id: `bot-${Date.now()}`,
        sender: 'other',
        senderName: activeChannel.name,
        text: replyText,
        time: new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })
      };

      setChannels(prev => prev.map(ch => {
        if (ch.id === activeChannelId) {
          return {
            ...ch,
            lastMessage: replyText,
            time: 'Ahora',
            messages: [...ch.messages, botMsg]
          };
        }
        return ch;
      }));
    }, 1500);
  };

  const handleConfirmRead = () => {
    alert("✓ Has confirmado la lectura de esta directiva institucional correctamente.");
    setChannels(prev => prev.map(ch => {
      if (ch.id === 'ch-1') {
        return {
          ...ch,
          unread: false
        };
      }
      return ch;
    }));
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-[650px] bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
        
        {/* Left pane: Message List (35%) */}
        <section className="lg:col-span-4 border-r border-slate-800 flex flex-col bg-slate-950/40">
          <div className="p-5 border-b border-slate-800">
            <h3 className="font-headline text-2xl text-slate-100 uppercase tracking-tight">Comunicaciones</h3>
            <p className="text-xs text-slate-500 mt-1">Canales oficiales de orientación y directivas</p>
          </div>

          <div className="flex-1 overflow-y-auto divide-y divide-slate-800/40 custom-scrollbar">
            {channels.map((ch) => {
              const isActive = ch.id === activeChannelId;
              return (
                <div 
                  key={ch.id}
                  onClick={() => {
                    setActiveChannelId(ch.id);
                    // Mark as read
                    setChannels(prev => prev.map(item => item.id === ch.id ? { ...item, unread: false } : item));
                  }}
                  className={`p-4 flex gap-3.5 transition-all duration-200 cursor-pointer relative group ${
                    isActive ? 'bg-slate-900' : 'hover:bg-slate-900/40'
                  }`}
                >
                  {ch.unread && (
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-red-500"></div>
                  )}

                  <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                    ch.unread ? 'bg-red-500/10 border border-red-500/20 text-red-400' : 'bg-slate-900 text-slate-400'
                  }`}>
                    <span className="material-symbols-outlined text-[20px]">{ch.avatarIcon}</span>
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-baseline mb-0.5">
                      <h4 className={`text-xs font-bold truncate ${isActive ? 'text-red-400' : 'text-slate-200'}`}>{ch.name}</h4>
                      <span className="text-[9px] text-slate-500 font-medium shrink-0 ml-2">{ch.time}</span>
                    </div>
                    <span className="text-[10px] text-slate-400 font-medium block uppercase tracking-wide opacity-80">{ch.role}</span>
                    <p className="text-xs text-slate-500 truncate mt-1">{ch.lastMessage}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Right pane: Active Chat History (65%) */}
        <section className="lg:col-span-8 flex flex-col justify-between bg-slate-950/20">
          
          {/* Chat header */}
          <div className="p-4 border-b border-slate-800 bg-slate-900/60 backdrop-blur-md flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 flex items-center justify-center">
                <span className="material-symbols-outlined text-[22px]">{activeChannel.avatarIcon}</span>
              </div>
              <div>
                <h3 className="text-xs font-bold text-slate-100 uppercase tracking-wide leading-none">{activeChannel.name}</h3>
                <span className="text-[10px] text-slate-400 font-medium block mt-1">{activeChannel.role} • Canal Oficial</span>
              </div>
            </div>

            <div className="flex space-x-2 shrink-0">
              <button 
                onClick={() => alert("Mensaje archivado.")}
                className="p-2 border border-slate-800 hover:border-slate-700 hover:bg-slate-900 text-slate-400 hover:text-slate-200 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5"
              >
                <Archive className="w-3.5 h-3.5" />
                <span className="hidden md:inline">Archivar</span>
              </button>
            </div>
          </div>

          {/* Messages feed */}
          <div className="flex-1 p-5 overflow-y-auto space-y-6 custom-scrollbar bg-slate-950/10">
            
            <div className="flex justify-center">
              <span className="bg-slate-900 text-slate-500 px-3.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">
                Buzón de Comunicaciones de la Grau App
              </span>
            </div>

            {activeChannel.messages.map((msg) => {
              const isUser = msg.sender === 'user';
              return (
                <div key={msg.id} className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}>
                  <div className="flex items-center space-x-2 mb-1.5 px-2">
                    <span className="text-[10px] font-bold text-slate-400">{msg.senderName}</span>
                    <span className="text-[9px] text-slate-600 font-mono">{msg.time}</span>
                  </div>

                  <div className={`p-4 rounded-2xl max-w-xl text-xs leading-relaxed border ${
                    isUser 
                      ? 'bg-red-500 text-slate-950 font-medium border-transparent rounded-tr-none shadow-lg shadow-red-500/5' 
                      : 'bg-slate-900 text-slate-300 border-slate-800 rounded-tl-none'
                  }`}>
                    <p className="whitespace-pre-line">{msg.text}</p>
                    
                    {msg.attachment && (
                      <div className="mt-3.5 p-2 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between text-[11px] group cursor-pointer hover:border-red-400/40 transition-colors">
                        <div className="flex items-center space-x-2 truncate">
                          <Paperclip className="w-3.5 h-3.5 text-red-400 shrink-0" />
                          <span className="text-slate-300 truncate font-mono">{msg.attachment.name}</span>
                        </div>
                        <span className="text-red-400 font-bold hover:underline shrink-0 text-[10px] uppercase font-mono ml-2">Descargar</span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}

            {isTyping && (
              <div className="flex flex-col items-start animate-pulse">
                <div className="flex items-center space-x-2 mb-1.5 px-2">
                  <span className="text-[10px] font-bold text-slate-400">{activeChannel.name}</span>
                  <span className="text-[9px] text-slate-600 font-mono">Escribiendo...</span>
                </div>
                <div className="bg-slate-900 border border-slate-800 text-slate-500 p-4 rounded-2xl rounded-tl-none flex items-center space-x-1.5">
                  <div className="w-2 h-2 bg-red-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-red-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  <div className="w-2 h-2 bg-red-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                </div>
              </div>
            )}

            <div ref={chatEndRef} />
          </div>

          {/* Actionable direct read confirmation only on Dirección General channel */}
          {activeChannelId === 'ch-1' && (
            <div className="px-5 py-4 border-t border-slate-800/40 bg-slate-900/40 relative">
              <div className="flex gap-4 items-start">
                <div className="w-10 h-10 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl flex items-center justify-center shrink-0">
                  <CheckCheck className="w-5 h-5 text-red-400" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-red-400 uppercase tracking-wide">Confirmación Obligatoria de Lectura</h4>
                  <p className="text-[11px] text-slate-400 leading-normal">
                    Para asegurar la comunicación de las normativas de laboratorio, Dirección solicita confirmar que has comprendido el nuevo instructivo.
                  </p>
                  <button 
                    onClick={handleConfirmRead}
                    className="mt-3 px-4 py-1.5 bg-red-500 hover:bg-red-600 text-slate-950 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all"
                  >
                    Confirmar Lectura Entendida
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Chat Input Bar */}
          <div className="p-4 border-t border-slate-800 bg-slate-900/40">
            <form onSubmit={handleSendMessage} className="flex items-center gap-3 bg-slate-950 rounded-xl px-4 py-2 border border-slate-800 focus-within:ring-1 focus-within:ring-red-400 transition-all">
              <button 
                type="button"
                onClick={() => alert("Simulando archivos adjuntos...")}
                className="text-slate-500 hover:text-slate-300 transition-colors shrink-0"
              >
                <PlusCircle className="w-5 h-5" />
              </button>
              
              <input 
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Escribe tu mensaje oficial o consulta aquí..."
                className="flex-1 bg-transparent border-none text-slate-200 placeholder-slate-600 text-xs focus:ring-0 outline-none h-9"
              />

              <div className="flex items-center space-x-2 shrink-0">
                <button 
                  type="submit"
                  className="p-2 bg-red-500 hover:bg-red-600 text-slate-950 rounded-lg transition-transform hover:scale-105 active:scale-95"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </form>
            <div className="mt-2 flex justify-between px-1 text-[10px] text-slate-600 font-bold uppercase tracking-widest">
              <span>Municipio Escolar • I.E. Miguel Grau</span>
              <span>Presiona ENTER para enviar</span>
            </div>
          </div>

        </section>

      </div>
    </div>
  );
}
