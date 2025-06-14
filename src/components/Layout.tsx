import { useState, useEffect } from 'react';
import { Menu, X, Home, Music, Calendar, Search, BookOpen, Settings, FileText, Users, Sun, Moon, ChevronLeft, ChevronRight, Bot } from 'lucide-react';
import { useTheme } from '../hooks/useTheme';
import { cn } from '../lib/utils';

interface LayoutProps {
  children: React.ReactNode;
  currentView: string;
  onNavigate: (view: string) => void;
}

export function Layout({ children, currentView, onNavigate }: LayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const { isDarkMode, toggleTheme } = useTheme();

  useEffect(() => {
    // Carregar estado do menu - por padrão fechado
    const savedMinimized = localStorage.getItem('sidebarMinimized');
    setIsMinimized(savedMinimized !== 'false'); // true por padrão, false apenas se explicitamente salvo
  }, []);


  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

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

  const handleNavigate = (viewId: string) => {
    onNavigate(viewId);
    setIsSidebarOpen(false);
  };

  const sidebarWidth = isMinimized ? 'w-16' : 'w-72';
  const mainMargin = isMinimized ? 'lg:ml-16' : 'lg:ml-72';

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-900 transition-colors">
      {/* Header */}
      <header className="bg-white dark:bg-neutral-800 border-b border-neutral-200 dark:border-neutral-700 sticky top-0 z-40 h-20 overflow-visible">
        <div className="flex items-center justify-between px-4 h-full">
          {/* Left side - Menu button */}
          <div className="flex items-center w-1/4">
            <button
              onClick={toggleSidebar}
              className="p-2 rounded-xl text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors lg:hidden"
            >
              {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

          {/* Center - Logo */}
          <div className="flex items-center justify-center w-1/2 h-full py-2 overflow-visible">
            <img 
              src={isDarkMode ? `${import.meta.env.BASE_URL}images/logo-dark.png` : `${import.meta.env.BASE_URL}images/logo-light.png`}
              alt="DivinoCantar" 
              className="h-[calc(100%*3)] w-auto transform scale-100 origin-center"
              style={{ height: 'calc(100% * 3)' }}
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

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-50 bg-white dark:bg-neutral-800 border-r border-neutral-200 dark:border-neutral-700 transform transition-all duration-300 ease-in-out',
          sidebarWidth,
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0',
          'pt-20 lg:pt-0'
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
                      'w-full flex items-center rounded-2xl transition-all duration-200 space-x-3 px-4 py-3',
                      // No desktop, aplicar estilos de minimização
                      isMinimized && 'lg:justify-center lg:space-x-0 lg:p-3',
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
                    {/* Sempre mostrar no mobile, no desktop mostrar apenas se não minimizado */}
                    <span className={cn(
                      'block',
                      isMinimized && 'lg:hidden'
                    )}>
                      {item.label}
                    </span>
                  </button>
                  
                  {/* Tooltip para menu minimizado - apenas no desktop */}
                  {isMinimized && (
                    <div className="hidden lg:block absolute left-full top-1/2 transform -translate-y-1/2 ml-2 px-3 py-2 bg-neutral-900 dark:bg-neutral-700 text-white text-sm rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap z-50">
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

      {/* Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm lg:hidden"
          onClick={toggleSidebar}
        />
      )}

      {/* Main Content */}
      <main className={cn(mainMargin, 'animate-fade-in transition-all duration-300')}>
        <div className="max-w-7xl mx-auto px-4 lg:px-6 pt-4 pb-4 lg:pt-6 lg:pb-6">
          {children}
        </div>
      </main>
    </div>
  );
}