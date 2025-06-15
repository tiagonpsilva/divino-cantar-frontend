import { useState, useEffect, useRef } from 'react';
import { Home, Music, Calendar, Search, BookOpen, Settings, FileText, Users, Sun, Moon, ChevronLeft, ChevronRight, Bot, X, Clock, TrendingUp } from 'lucide-react';
import { useTheme } from '../hooks/useTheme';
import { cn } from '../lib/utils';
import { mockSongs } from '../data/mock';

interface LayoutProps {
  children: React.ReactNode;
  currentView: string;
  onNavigate: (view: string) => void;
}

export function Layout({ children, currentView, onNavigate }: LayoutProps) {
  const [isMinimized, setIsMinimized] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchHistory, setSearchHistory] = useState<string[]>(['Santo', 'Acolhe Senhor', 'Entrada']);
  const { isDarkMode, toggleTheme } = useTheme();
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Função para obter caminho correto dos assets
  const getAssetPath = (path: string) => {
    const base = import.meta.env.BASE_URL;
    // Se o base já termina com '/', não adicionar outra
    const cleanPath = path.startsWith('/') ? path.slice(1) : path;
    return base.endsWith('/') ? `${base}${cleanPath}` : `${base}/${cleanPath}`;
  };

  useEffect(() => {
    // Carregar estado do menu - por padrão fechado
    const savedMinimized = localStorage.getItem('sidebarMinimized');
    setIsMinimized(savedMinimized !== 'false'); // true por padrão, false apenas se explicitamente salvo
  }, []);

  useEffect(() => {
    // Detectar se é mobile
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    checkIfMobile();
    window.addEventListener('resize', checkIfMobile);
    
    return () => window.removeEventListener('resize', checkIfMobile);
  }, []);

  useEffect(() => {
    // Focar no input quando o modal de busca abre
    if (showSearchModal && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [showSearchModal]);

  useEffect(() => {
    // Atalho de teclado para abrir busca (Ctrl/Cmd + K)
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setShowSearchModal(true);
      }
      if (e.key === 'Escape' && showSearchModal) {
        setShowSearchModal(false);
        setSearchQuery('');
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [showSearchModal]);


  const toggleMinimized = () => {
    const newMinimized = !isMinimized;
    setIsMinimized(newMinimized);
    localStorage.setItem('sidebarMinimized', newMinimized.toString());
  };

  const menuItems = [
    { id: 'home', icon: Home, label: 'Início', color: 'text-primary-600 dark:text-primary-400' },
    { id: 'assistant', icon: Bot, label: 'Assistente', color: 'text-emerald-600 dark:text-emerald-400' },
    { id: 'liturgy', icon: Calendar, label: 'Liturgia do Dia', color: 'text-purple-600 dark:text-purple-400' },
    { id: 'repertoire', icon: Music, label: 'Repertório', color: 'text-pink-600 dark:text-pink-400' },
    { id: 'search', icon: Search, label: 'Buscar Músicas', color: 'text-green-600 dark:text-green-400' },
    { id: 'chords', icon: FileText, label: 'Cifras', color: 'text-orange-600 dark:text-orange-400' },
    { id: 'planning', icon: Users, label: 'Planejar Missa', color: 'text-indigo-600 dark:text-indigo-400' },
    { id: 'library', icon: BookOpen, label: 'Minha Biblioteca', color: 'text-red-600 dark:text-red-400' },
    { id: 'settings', icon: Settings, label: 'Configurações', color: 'text-gray-600 dark:text-gray-400' },
  ];

  // Itens principais para bottom navigation (mobile)
  const bottomNavItems = [
    { id: 'home', icon: Home, label: 'Início', color: 'text-primary-600 dark:text-primary-400' },
    { id: 'assistant', icon: Bot, label: 'Assistente', color: 'text-emerald-600 dark:text-emerald-400' },
    { id: 'repertoire', icon: Music, label: 'Repertório', color: 'text-pink-600 dark:text-pink-400' },
    { id: 'search', icon: Search, label: 'Buscar', color: 'text-green-600 dark:text-green-400' },
    { id: 'more', icon: Settings, label: 'Mais', color: 'text-gray-600 dark:text-gray-400' },
  ];

  const handleNavigate = (viewId: string) => {
    onNavigate(viewId);
  };

  // Funções de busca
  const filteredSongs = mockSongs.filter(song => {
    if (!searchQuery) return false;
    return song.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
           song.artist?.toLowerCase().includes(searchQuery.toLowerCase()) ||
           song.lyrics?.toLowerCase().includes(searchQuery.toLowerCase()) ||
           song.tags?.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
  }).slice(0, 5); // Limitar a 5 resultados

  const popularSearches = ['Santo', 'Aleluia', 'Entrada', 'Comunhão', 'Ofertório'];

  const handleSearchSelect = (song: any) => {
    // Navegar para a busca com a música selecionada
    onNavigate('search');
    setShowSearchModal(false);
    setSearchQuery('');
    
    // Adicionar ao histórico
    if (!searchHistory.includes(song.title)) {
      setSearchHistory(prev => [song.title, ...prev.slice(0, 4)]);
    }
  };

  const handleSearchSubmit = (query: string) => {
    if (!query.trim()) return;
    
    // Navegar para a página de busca
    onNavigate('search');
    setShowSearchModal(false);
    setSearchQuery('');
    
    // Adicionar ao histórico
    if (!searchHistory.includes(query)) {
      setSearchHistory(prev => [query, ...prev.slice(0, 4)]);
    }
  };

  const removeFromHistory = (term: string) => {
    setSearchHistory(prev => prev.filter(item => item !== term));
  };

  const sidebarWidth = isMinimized ? 'w-16' : 'w-72';
  const mainMargin = isMinimized ? 'lg:ml-16' : 'lg:ml-72';

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-neutral-900 transition-colors">
      {/* Container principal com padding bottom no mobile para o bottom nav */}
      <div className="lg:min-h-screen pb-20 lg:pb-0">
      {/* Header */}
      <header className="bg-white dark:bg-neutral-800 border-b border-gray-200 dark:border-neutral-700 sticky top-0 z-40 h-20 overflow-visible shadow">
        <div className="flex items-center justify-between px-4 h-full">
          {/* Left side - Menu button (removido para usar bottom nav no mobile) */}
          <div className="flex items-center w-1/4">
            {/* Menu hambúrguer removido - usamos bottom navigation no mobile */}
          </div>

          {/* Center - Logo */}
          <div className="flex items-center justify-center w-1/2 h-full py-2 overflow-visible">
            <img 
              src={getAssetPath(isDarkMode ? 'images/logo-dark.png' : 'images/logo-light.png')}
              alt="DivinoCantar" 
              className="h-[calc(100%*3)] w-auto transform scale-100 origin-center"
              style={{ height: 'calc(100% * 3)' }}
              onError={(e) => {
                console.error('Logo failed to load:', e.currentTarget.src);
                // Fallback: tentar caminho absoluto
                e.currentTarget.src = isDarkMode ? '/images/logo-dark.png' : '/images/logo-light.png';
              }}
            />
          </div>

          {/* Right side - Actions */}
          <div className="flex items-center justify-end gap-2 w-1/4">
            <button 
              onClick={() => setShowSearchModal(true)}
              className="flex items-center gap-2 px-3 py-2 rounded-xl text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors"
              title="Buscar (Ctrl+K)"
            >
              <Search size={18} />
              <span className="hidden sm:block text-xs text-neutral-500 dark:text-neutral-400">Ctrl+K</span>
            </button>
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors"
            >
              {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
          </div>
        </div>
      </header>

      {/* Sidebar - apenas no desktop */}
      <aside
        className={cn(
          'hidden lg:fixed inset-y-0 left-0 z-50 bg-white dark:bg-neutral-800 border-r border-neutral-100 dark:border-neutral-700 transform transition-all duration-300 ease-in-out lg:block shadow-sm',
          sidebarWidth,
          'pt-0'
        )}
      >
        <div className={cn('p-6', isMinimized && 'lg:px-3')}>
          {/* Toggle Button - apenas no desktop */}
          <div className="hidden lg:flex justify-end mb-4">
            <button
              onClick={toggleMinimized}
              className="p-1.5 rounded-xl text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors"
            >
              {isMinimized ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
            </button>
          </div>

          <nav className="space-y-1">
            {menuItems.map((item) => {
              const isActive = currentView === item.id;
              return (
                <div key={item.id} className="relative group">
                  <button
                    onClick={() => handleNavigate(item.id)}
                    className={cn(
                      'w-full flex items-center rounded-2xl transition-all duration-200',
                      // Mobile: apenas ícones centralizados
                      // Desktop não minimizado: layout normal com texto
                      // Desktop minimizado: apenas ícones centralizados
                      (isMobile || isMinimized) ? 'justify-center p-3' : 'space-x-3 px-4 py-3',
                      isActive
                        ? 'bg-neutral-100 dark:bg-neutral-700 text-neutral-700 dark:text-neutral-100 font-medium'
                        : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-50 dark:hover:bg-neutral-700/50 hover:text-neutral-700 dark:hover:text-neutral-100'
                    )}
                  >
                    <item.icon 
                      size={20} 
                      className={cn(
                        isActive ? item.color : 'text-neutral-400 dark:text-neutral-500'
                      )}
                    />
                    {/* Mostrar texto APENAS no desktop não minimizado */}
                    {!isMobile && !isMinimized && (
                      <span>{item.label}</span>
                    )}
                  </button>
                  
                  {/* Tooltip quando só mostra ícones - mobile ou desktop minimizado */}
                  {(isMobile || isMinimized) && (
                    <div className="absolute left-full top-1/2 transform -translate-y-1/2 ml-2 px-3 py-2 bg-neutral-900 dark:bg-neutral-700 text-white text-sm rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap z-50">
                      {item.label}
                      <div className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-full">
                        <div className="w-2 h-2 bg-neutral-900 dark:bg-neutral-700 rotate-45"></div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </nav>
        </div>
      </aside>

      {/* Overlay removido - não necessário com bottom navigation */}

      {/* Main Content */}
      <main className={cn('lg:' + mainMargin.replace('lg:', ''), 'animate-fade-in transition-all duration-300')}>
        <div className="max-w-7xl mx-auto px-4 lg:px-6 pt-4 pb-4 lg:pt-6 lg:pb-6">
          {children}
        </div>
        
        {/* Footer */}
        <footer className="border-t border-gray-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 mt-8">
          <div className="max-w-7xl mx-auto px-4 lg:px-6 py-4">
            <div className="text-center text-sm text-neutral-600 dark:text-neutral-400">
              <p>
                Criado por{' '}
                <a 
                  href="https://tiagopinto.io" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="font-medium text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 transition-colors"
                >
                  Tiago Pinto
                </a>
              </p>
            </div>
          </div>
        </footer>
      </main>

      {/* Bottom Navigation - apenas no mobile */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-neutral-800 border-t border-neutral-200 dark:border-neutral-700">
        <div className="flex items-center justify-around px-2 py-2">
          {bottomNavItems.map((item) => {
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavigate(item.id)}
                className={cn(
                  'flex flex-col items-center justify-center p-2 rounded-xl transition-all duration-200 min-w-0 flex-1',
                  isActive
                    ? 'bg-neutral-100 dark:bg-neutral-700'
                    : 'hover:bg-neutral-50 dark:hover:bg-neutral-700/50'
                )}
              >
                <item.icon 
                  size={20} 
                  className={cn(
                    'mb-1',
                    isActive ? item.color : 'text-neutral-400 dark:text-neutral-500'
                  )}
                />
                <span className={cn(
                  'text-xs font-medium truncate',
                  isActive 
                    ? 'text-neutral-700 dark:text-neutral-100' 
                    : 'text-neutral-600 dark:text-neutral-400'
                )}>
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>
      </nav>
      </div>

      {/* Search Modal */}
      {showSearchModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] flex items-start justify-center p-4 pt-20">
          <div className="bg-white dark:bg-neutral-800 rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden animate-fade-in">
            {/* Search Input */}
            <div className="p-6 border-b border-gray-200 dark:border-neutral-700">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-neutral-400 dark:text-neutral-500" size={20} />
                <input
                  ref={searchInputRef}
                  type="text"
                  placeholder="Buscar músicas, artistas, letras..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && searchQuery.trim()) {
                      handleSearchSubmit(searchQuery);
                    }
                  }}
                  className="w-full pl-12 pr-12 py-4 bg-gray-50 dark:bg-neutral-700 border-0 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 text-neutral-700 dark:text-neutral-100 placeholder-neutral-500 dark:placeholder-neutral-400 text-lg"
                />
                <button
                  onClick={() => {
                    setShowSearchModal(false);
                    setSearchQuery('');
                  }}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-neutral-400 dark:text-neutral-500 hover:text-neutral-600 dark:hover:text-neutral-300"
                >
                  <X size={20} />
                </button>
              </div>
              <div className="flex items-center justify-between mt-3">
                <span className="text-xs text-neutral-500 dark:text-neutral-400">
                  Digite para buscar • Enter para pesquisar
                </span>
                <span className="text-xs text-neutral-500 dark:text-neutral-400">
                  ESC para fechar
                </span>
              </div>
            </div>

            {/* Search Results */}
            <div className="max-h-96 overflow-y-auto">
              {searchQuery ? (
                filteredSongs.length > 0 ? (
                  <div className="p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <Music className="text-primary-600 dark:text-primary-400" size={16} />
                      <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                        {filteredSongs.length} {filteredSongs.length === 1 ? 'música encontrada' : 'músicas encontradas'}
                      </span>
                    </div>
                    <div className="space-y-2">
                      {filteredSongs.map((song) => (
                        <button
                          key={song.id}
                          onClick={() => handleSearchSelect(song)}
                          className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-neutral-700 transition-colors text-left"
                        >
                          <div className="w-10 h-10 bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 rounded-xl flex items-center justify-center flex-shrink-0">
                            <Music size={18} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium text-neutral-700 dark:text-neutral-100 truncate">
                              {song.title}
                            </h4>
                            <div className="flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-400">
                              <span className="truncate">{song.artist}</span>
                              <span>•</span>
                              <span className="text-xs bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400 px-2 py-0.5 rounded">
                                {song.tone}
                              </span>
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                    {filteredSongs.length === 5 && (
                      <button
                        onClick={() => handleSearchSubmit(searchQuery)}
                        className="w-full mt-3 p-3 text-center text-primary-600 dark:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded-xl transition-colors text-sm font-medium"
                      >
                        Ver todos os resultados para "{searchQuery}"
                      </button>
                    )}
                  </div>
                ) : (
                  <div className="p-6 text-center">
                    <div className="w-16 h-16 bg-gray-100 dark:bg-neutral-700 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Search className="text-gray-400 dark:text-neutral-500" size={24} />
                    </div>
                    <h3 className="text-lg font-medium text-neutral-700 dark:text-neutral-100 mb-2">
                      Nenhuma música encontrada
                    </h3>
                    <p className="text-neutral-600 dark:text-neutral-400 mb-4">
                      Tente buscar por outros termos
                    </p>
                    <button
                      onClick={() => handleSearchSubmit(searchQuery)}
                      className="px-4 py-2 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-colors text-sm"
                    >
                      Buscar "{searchQuery}" na biblioteca completa
                    </button>
                  </div>
                )
              ) : (
                <div className="p-4 space-y-6">
                  {/* Search History */}
                  {searchHistory.length > 0 && (
                    <div>
                      <div className="flex items-center gap-2 mb-3">
                        <Clock className="text-neutral-500 dark:text-neutral-400" size={16} />
                        <span className="text-sm font-medium text-neutral-600 dark:text-neutral-400">Buscas recentes</span>
                      </div>
                      <div className="space-y-1">
                        {searchHistory.map((term, index) => (
                          <div key={index} className="flex items-center justify-between group">
                            <button
                              onClick={() => handleSearchSubmit(term)}
                              className="flex-1 flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-neutral-700 transition-colors text-left"
                            >
                              <Clock className="text-neutral-400 dark:text-neutral-500" size={16} />
                              <span className="text-neutral-700 dark:text-neutral-300">{term}</span>
                            </button>
                            <button
                              onClick={() => removeFromHistory(term)}
                              className="opacity-0 group-hover:opacity-100 p-2 text-neutral-400 hover:text-red-500 transition-all"
                            >
                              <X size={14} />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Popular Searches */}
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <TrendingUp className="text-neutral-500 dark:text-neutral-400" size={16} />
                      <span className="text-sm font-medium text-neutral-600 dark:text-neutral-400">Buscas populares</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {popularSearches.map((term) => (
                        <button
                          key={term}
                          onClick={() => handleSearchSubmit(term)}
                          className="px-3 py-2 bg-gray-100 dark:bg-neutral-700 text-neutral-700 dark:text-neutral-300 rounded-lg hover:bg-gray-200 dark:hover:bg-neutral-600 transition-colors text-sm"
                        >
                          {term}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}