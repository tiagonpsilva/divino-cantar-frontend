import { Calendar, FileText, Users, BookOpen, Settings } from 'lucide-react';
import { Card } from '../../components/Card';

interface MoreMenuViewProps {
  onNavigate: (view: string) => void;
}

export function MoreMenuView({ onNavigate }: MoreMenuViewProps) {
  const menuOptions = [
    {
      id: 'liturgy',
      icon: Calendar,
      title: 'Liturgia do Dia',
      description: 'Consulte as leituras e informações litúrgicas',
      color: 'text-purple-600 dark:text-purple-400',
      bgColor: 'bg-purple-100 dark:bg-purple-900/30'
    },
    {
      id: 'chords',
      icon: FileText,
      title: 'Cifras',
      description: 'Visualize e edite cifras das músicas',
      color: 'text-orange-600 dark:text-orange-400',
      bgColor: 'bg-orange-100 dark:bg-orange-900/30'
    },
    {
      id: 'planning',
      icon: Users,
      title: 'Planejar Missa',
      description: 'Organize o repertório para celebrações',
      color: 'text-indigo-600 dark:text-indigo-400',
      bgColor: 'bg-indigo-100 dark:bg-indigo-900/30'
    },
    {
      id: 'library',
      icon: BookOpen,
      title: 'Minha Biblioteca',
      description: 'Acesse sua coleção pessoal de músicas',
      color: 'text-red-600 dark:text-red-400',
      bgColor: 'bg-red-100 dark:bg-red-900/30'
    },
    {
      id: 'settings',
      icon: Settings,
      title: 'Configurações',
      description: 'Personalize sua experiência no app',
      color: 'text-gray-600 dark:text-gray-400',
      bgColor: 'bg-gray-100 dark:bg-gray-900/30'
    }
  ];

  return (
    <div className="p-4 lg:p-6 space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-2xl lg:text-3xl font-bold text-neutral-700 dark:text-neutral-100 mb-2">
          Menu Principal
        </h1>
        <p className="text-neutral-600 dark:text-neutral-400">
          Acesse todas as funcionalidades do DivinoCantar
        </p>
      </div>

      {/* Menu Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {menuOptions.map((option) => (
          <div
            key={option.id}
            onClick={() => onNavigate(option.id)}
            className="cursor-pointer hover:scale-105 transition-all duration-200"
          >
            <Card className="p-6 hover:shadow-lg transition-all duration-200">
            <div className="flex flex-col items-center text-center space-y-4">
              <div className={`p-4 rounded-2xl ${option.bgColor}`}>
                <option.icon size={32} className={option.color} />
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-neutral-700 dark:text-neutral-100 mb-2">
                  {option.title}
                </h3>
                <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
                  {option.description}
                </p>
              </div>
            </div>
            </Card>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="mt-8 pt-6 border-t border-neutral-200 dark:border-neutral-700">
        <h2 className="text-lg font-semibold text-neutral-700 dark:text-neutral-100 mb-4">
          Ações Rápidas
        </h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <button
            onClick={() => onNavigate('search')}
            className="p-3 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 rounded-xl hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors text-sm font-medium"
          >
            🔍 Buscar Músicas
          </button>
          <button
            onClick={() => onNavigate('repertoire')}
            className="p-3 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 rounded-xl hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors text-sm font-medium"
          >
            🎵 Repertório
          </button>
          <button
            onClick={() => onNavigate('assistant')}
            className="p-3 bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300 rounded-xl hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-colors text-sm font-medium"
          >
            🤖 Assistente
          </button>
          <button
            onClick={() => onNavigate('home')}
            className="p-3 bg-orange-50 dark:bg-orange-900/20 text-orange-700 dark:text-orange-300 rounded-xl hover:bg-orange-100 dark:hover:bg-orange-900/30 transition-colors text-sm font-medium"
          >
            🏠 Início
          </button>
        </div>
      </div>
    </div>
  );
}