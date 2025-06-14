import { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Music, Play, Pause, Plus, Edit, Trash2, Heart, Search, Calendar, Download, Users } from 'lucide-react';
import { Card } from '../../components/Card';
import { FavoriteButton } from '../../components/FavoriteButton';
import { SongDetailModal } from '../../components/SongDetailModal';
import { SongModal } from '../../components/SongModal';
import { useFavorites } from '../../hooks/useFavorites';
import { useToastContext } from '../../contexts/ToastContext';
import { AssistantAI } from '../../utils/assistantAI';
import { cn } from '../../lib/utils';

interface Message {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  actions?: MessageAction[];
  suggestedSongs?: any[];
}

interface MessageAction {
  id: string;
  label: string;
  icon: any;
  action: () => void;
  variant?: 'primary' | 'secondary' | 'danger';
}

const SUGGESTED_QUESTIONS = [
  {
    id: '1',
    text: 'Quais músicas são ideais para a entrada da missa?',
    category: 'Repertório',
    icon: Music
  },
  {
    id: '2', 
    text: 'Como transpor uma música para um tom mais fácil?',
    category: 'Técnico',
    icon: Edit
  },
  {
    id: '3',
    text: 'Quais são as cores litúrgicas do ano?',
    category: 'Liturgia',
    icon: Search
  },
  {
    id: '4',
    text: 'Crie um repertório para o Domingo de Ramos',
    category: 'Planejamento',
    icon: Plus
  },
  {
    id: '5',
    text: 'Mostre minhas músicas favoritas',
    category: 'Pessoal',
    icon: Heart
  },
  {
    id: '6',
    text: 'Sugestões para missa de Natal',
    category: 'Planejamento',
    icon: Calendar
  },
  {
    id: '7',
    text: 'Músicas para comunhão contemplativa',
    category: 'Repertório',
    icon: Music
  },
  {
    id: '8',
    text: 'Como organizar um ensaio musical?',
    category: 'Prático',
    icon: Users
  }
];

export function AssistantView() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [selectedSong, setSelectedSong] = useState<any>(null);
  const [editingSong, setEditingSong] = useState<any>(null);
  const [playingSong, setPlayingSong] = useState<string | null>(null);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toggleFavorite, isFavorite, favorites } = useFavorites();
  const { success } = useToastContext();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Welcome message
    const welcomeMessage: Message = {
      id: 'welcome',
      type: 'assistant',
      content: '🎵 Olá! Sou seu assistente musical do DivinoCantar. Como posso ajudá-lo hoje? Posso ajudar com repertórios, sugestões de músicas, transposições e muito mais!',
      timestamp: new Date()
    };
    setMessages([welcomeMessage]);
  }, []);

  const handleSendMessage = (content: string) => {
    if (!content.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: content.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const response = generateAssistantResponse(content.trim());
      setMessages(prev => [...prev, response]);
      setIsTyping(false);
    }, 1000 + Math.random() * 2000);
  };

  const generateAssistantResponse = (userInput: string): Message => {
    const input = userInput.toLowerCase();
    const intent = AssistantAI.analyzeIntent(input);
    
    let response;
    
    switch (intent) {
      case 'moment_query':
        const moment = AssistantAI.extractMoment(input);
        if (moment) {
          response = AssistantAI.generateMomentResponse(moment);
        } else {
          response = {
            content: '🎵 Para qual momento da missa você gostaria de sugestões? Posso ajudar com entrada, ofertório, comunhão, e muitos outros!'
          };
        }
        break;
        
      case 'technical_query':
        response = AssistantAI.generateTechnicalResponse(input);
        break;
        
      case 'liturgical_query':
        response = AssistantAI.generateLiturgicalResponse(input);
        break;
        
      case 'personal_query':
        if (input.includes('favorita') || input.includes('favorito')) {
          response = AssistantAI.generatePlaylistResponse('favoritas', favorites);
        } else {
          response = {
            content: '👤 Posso ajudar com suas preferências pessoais! Quer ver suas músicas favoritas ou configurar algo específico?'
          };
        }
        break;
        
      case 'planning_query':
        if (input.includes('ramos')) {
          response = AssistantAI.generatePlaylistResponse('ramos', favorites);
        } else if (input.includes('natal')) {
          response = AssistantAI.generatePlaylistResponse('natal', favorites);
        } else if (input.includes('páscoa') || input.includes('pascoa')) {
          response = AssistantAI.generatePlaylistResponse('páscoa', favorites);
        } else {
          response = AssistantAI.generatePlaylistResponse('dominical', favorites);
        }
        break;
        
      default:
        const defaultResponses = [
          '🎵 Interessante! Posso ajudar você com informações sobre repertório, transposições, ou sugestões litúrgicas. O que gostaria de saber?',
          '🎼 Que pergunta legal! Estou aqui para ajudar com tudo relacionado à música litúrgica. Quer algumas sugestões específicas?',
          '🎶 Ótima pergunta! Posso te ajudar a encontrar músicas, criar repertórios ou explicar conceitos musicais. Como posso ser útil?'
        ];
        response = {
          content: defaultResponses[Math.floor(Math.random() * defaultResponses.length)]
        };
    }
    
    // Convert AI response to Message format
    const actions = response.actions?.map(action => ({
      id: action.id,
      label: action.label,
      icon: getIconComponent(action.icon),
      action: () => handleAction(action.action),
      variant: action.variant
    }));
    
    return {
      id: (Date.now() + 1).toString(),
      type: 'assistant',
      content: response.content,
      timestamp: new Date(),
      suggestedSongs: response.suggestedSongs,
      actions
    };
  };
  
  const getIconComponent = (iconName: string) => {
    const icons: Record<string, any> = {
      Plus, Music, Search, Calendar, Download, Edit, Trash2, Heart, Play, Pause
    };
    return icons[iconName] || Music;
  };
  
  const handleAction = (action: string) => {
    switch (action) {
      case 'navigate_chords':
        window.location.hash = '#chords';
        success('Redirecionando para a página de Cifras...');
        break;
      case 'navigate_liturgy':
        window.location.hash = '#liturgy';
        success('Redirecionando para a Liturgia do Dia...');
        break;
      case 'navigate_planning':
        window.location.hash = '#planning';
        success('Redirecionando para o Planejamento...');
        break;
      case 'add_to_planning':
        success('Músicas adicionadas ao planejamento!');
        break;
      case 'create_planning':
        success('Planejamento criado com sucesso!');
        break;
      case 'export_playlist':
        success('Lista exportada com sucesso!');
        break;
      case 'search_moment':
        window.location.hash = '#search';
        success('Redirecionando para a busca...');
        break;
      default:
        success('Ação executada!');
    }
  };

  const handleSuggestedQuestion = (question: string) => {
    handleSendMessage(question);
  };

  const playSong = (songId: string) => {
    if (playingSong === songId) {
      setPlayingSong(null);
      success('Reprodução pausada');
    } else {
      setPlayingSong(songId);
      success('Reproduzindo música...');
    }
  };

  const deleteSong = () => {
    // Simulated deletion
    success('Música removida do repertório');
  };

  return (
    <div className="h-screen flex flex-col">
      {/* Header */}
      <div className="flex-shrink-0 p-6 border-b border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 rounded-2xl">
            <Bot size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-neutral-700 dark:text-neutral-100">
              Assistente Musical
            </h1>
            <p className="text-neutral-600 dark:text-neutral-400">
              Seu guia inteligente para repertório e liturgia
            </p>
          </div>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-hidden flex">
        {/* Messages */}
        <div className="flex-1 flex flex-col">
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {messages.map((message) => (
              <div key={message.id} className={cn(
                'flex gap-4 max-w-4xl',
                message.type === 'user' ? 'ml-auto flex-row-reverse' : ''
              )}>
                <div className={cn(
                  'flex-shrink-0 w-10 h-10 rounded-2xl flex items-center justify-center',
                  message.type === 'user' 
                    ? 'bg-primary-600 text-white' 
                    : 'bg-neutral-100 dark:bg-neutral-700 text-neutral-600 dark:text-neutral-400'
                )}>
                  {message.type === 'user' ? <User size={20} /> : <Bot size={20} />}
                </div>
                
                <div className={cn(
                  'flex-1 space-y-3',
                  message.type === 'user' ? 'text-right' : ''
                )}>
                  <div className={cn(
                    'inline-block p-4 rounded-2xl max-w-2xl',
                    message.type === 'user'
                      ? 'bg-primary-600 text-white'
                      : 'bg-neutral-100 dark:bg-neutral-700 text-neutral-700 dark:text-neutral-100'
                  )}>
                    <p className="whitespace-pre-wrap">{message.content}</p>
                    <p className={cn(
                      'text-xs mt-2 opacity-70',
                      message.type === 'user' ? 'text-primary-100' : 'text-neutral-500 dark:text-neutral-400'
                    )}>
                      {message.timestamp.toLocaleTimeString('pt-BR', { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                    </p>
                  </div>

                  {/* Actions */}
                  {message.actions && message.actions.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {message.actions.map(action => (
                        <button
                          key={action.id}
                          onClick={action.action}
                          className={cn(
                            'flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium transition-colors',
                            action.variant === 'danger' 
                              ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 hover:bg-red-200 dark:hover:bg-red-900/50'
                              : 'bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 hover:bg-primary-200 dark:hover:bg-primary-900/50'
                          )}
                        >
                          <action.icon size={16} />
                          {action.label}
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Suggested Songs */}
                  {message.suggestedSongs && message.suggestedSongs.length > 0 && (
                    <div className="space-y-3">
                      {message.suggestedSongs.map(song => (
                        <Card key={song.id} className="hover:shadow-md transition-shadow">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3 flex-1">
                              <div className="p-2 bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 rounded-xl">
                                <Music size={20} />
                              </div>
                              <div className="flex-1">
                                <h4 className="font-semibold text-neutral-700 dark:text-neutral-100">
                                  {song.title}
                                </h4>
                                <p className="text-sm text-neutral-600 dark:text-neutral-400">
                                  {song.artist} • Tom: {song.tone}
                                </p>
                              </div>
                            </div>
                            
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => playSong(song.id)}
                                className={cn(
                                  'p-2 rounded-xl transition-colors',
                                  playingSong === song.id
                                    ? 'bg-primary-600 text-white'
                                    : 'bg-neutral-100 dark:bg-neutral-700 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-200 dark:hover:bg-neutral-600'
                                )}
                              >
                                {playingSong === song.id ? <Pause size={16} /> : <Play size={16} />}
                              </button>
                              
                              <FavoriteButton
                                isFavorite={isFavorite(song.id)}
                                onClick={() => toggleFavorite(song.id)}
                                size="sm"
                              />
                              
                              <button
                                onClick={() => setSelectedSong(song)}
                                className="p-2 bg-neutral-100 dark:bg-neutral-700 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-200 dark:hover:bg-neutral-600 rounded-xl transition-colors"
                              >
                                <Search size={16} />
                              </button>
                              
                              <button
                                onClick={() => setEditingSong(song)}
                                className="p-2 bg-neutral-100 dark:bg-neutral-700 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-200 dark:hover:bg-neutral-600 rounded-xl transition-colors"
                              >
                                <Edit size={16} />
                              </button>
                              
                              <button
                                onClick={() => deleteSong()}
                                className="p-2 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-900/50 rounded-xl transition-colors"
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </div>
                        </Card>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-10 h-10 rounded-2xl bg-neutral-100 dark:bg-neutral-700 flex items-center justify-center">
                  <Bot size={20} className="text-neutral-600 dark:text-neutral-400" />
                </div>
                <div className="bg-neutral-100 dark:bg-neutral-700 p-4 rounded-2xl">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-neutral-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <div className="w-2 h-2 bg-neutral-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <div className="w-2 h-2 bg-neutral-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="flex-shrink-0 p-6 border-t border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage(inputMessage);
              }}
              className="flex gap-3"
            >
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="Digite sua pergunta sobre repertório, liturgia ou música..."
                className="flex-1 px-4 py-3 bg-neutral-100 dark:bg-neutral-700 text-neutral-700 dark:text-neutral-100 placeholder-neutral-500 dark:placeholder-neutral-400 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary-500"
                disabled={isTyping}
              />
              <button
                type="submit"
                disabled={!inputMessage.trim() || isTyping}
                className="px-6 py-3 bg-primary-600 text-white rounded-2xl hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send size={20} />
              </button>
            </form>
          </div>
        </div>

        {/* Sidebar with suggestions */}
        <div className="w-80 border-l border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800/50 p-4 overflow-y-auto">
          <h3 className="text-lg font-semibold text-neutral-700 dark:text-neutral-100 mb-4">
            💡 Sugestões
          </h3>
          <div className="space-y-2">
            {SUGGESTED_QUESTIONS.map(question => (
              <button
                key={question.id}
                onClick={() => handleSuggestedQuestion(question.text)}
                className="w-full text-left p-3 bg-white dark:bg-neutral-700 rounded-xl hover:bg-neutral-100 dark:hover:bg-neutral-600 transition-colors group"
              >
                <div className="flex items-start gap-3">
                  <div className="p-1.5 bg-neutral-100 dark:bg-neutral-600 rounded-lg group-hover:bg-primary-100 dark:group-hover:bg-primary-900/30 transition-colors">
                    <question.icon size={14} className="text-neutral-600 dark:text-neutral-400 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-neutral-700 dark:text-neutral-100 text-sm mb-1 leading-tight">
                      {question.text}
                    </p>
                    <span className="inline-block px-2 py-0.5 bg-neutral-100 dark:bg-neutral-600 text-neutral-600 dark:text-neutral-400 text-xs rounded-md">
                      {question.category}
                    </span>
                  </div>
                </div>
              </button>
            ))}
          </div>
          
          <div className="mt-6 pt-4 border-t border-neutral-200 dark:border-neutral-700">
            <h4 className="text-sm font-semibold text-neutral-600 dark:text-neutral-400 mb-3">
              🎯 Comandos Rápidos
            </h4>
            <div className="space-y-2 text-xs">
              <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <p className="text-blue-700 dark:text-blue-300 font-medium">"reproduzir [música]"</p>
                <p className="text-blue-600 dark:text-blue-400">Toca uma música específica</p>
              </div>
              <div className="p-2 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <p className="text-green-700 dark:text-green-300 font-medium">"adicionar favoritos"</p>
                <p className="text-green-600 dark:text-green-400">Marca músicas como favoritas</p>
              </div>
              <div className="p-2 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                <p className="text-purple-700 dark:text-purple-300 font-medium">"exportar repertório"</p>
                <p className="text-purple-600 dark:text-purple-400">Gera PDF do planejamento</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      {selectedSong && (
        <SongDetailModal
          isOpen={!!selectedSong}
          onClose={() => setSelectedSong(null)}
          song={selectedSong}
          onToggleFavorite={toggleFavorite}
          isFavorite={isFavorite(selectedSong.id)}
        />
      )}

      {editingSong && (
        <SongModal
          isOpen={!!editingSong}
          onClose={() => setEditingSong(null)}
          song={editingSong}
          onSave={() => {
            success('Música atualizada com sucesso!');
            setEditingSong(null);
          }}
        />
      )}
    </div>
  );
}