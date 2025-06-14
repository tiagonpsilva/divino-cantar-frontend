import { useState, useEffect } from 'react';
import { Home, Music, Calendar, Search, BookOpen, Settings, FileText, Users, Sun, Moon, ChevronLeft, ChevronRight, Bot } from 'lucide-react';
import { useTheme } from '../hooks/useTheme';
import { cn } from '../lib/utils';

interface LayoutProps {
  children: React.ReactNode;
  currentView: string;
  onNavigate: (view: string) => void;
}

export function Layout({ children, currentView, onNavigate }: LayoutProps) {
  const [isMinimized, setIsMinimized] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const { isDarkMode, toggleTheme } = useTheme();

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

  const sidebarWidth = isMinimized ? 'w-16' : 'w-72';
  const mainMargin = isMinimized ? 'lg:ml-16' : 'lg:ml-72';

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-neutral-900 transition-colors">
      {/* Container principal com padding bottom no mobile para o bottom nav */}
      <div className="lg:min-h-screen pb-16 lg:pb-0">
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
              onClick={() => onNavigate('search')}
              className="p-2 rounded-xl text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors"
            >
              <Search size={20} />
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
    </div>
  );
}