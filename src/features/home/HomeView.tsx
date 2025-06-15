import { useState } from 'react';
import { Calendar, Music, TrendingUp, Users, Star, ChevronLeft, ChevronRight } from 'lucide-react';
import { Card, CardContent } from '../../components/Card';
import { cn } from '../../lib/utils';

export function HomeView() {
  const [currentStatIndex, setCurrentStatIndex] = useState(0);
  
  const quickStats = [
    { label: 'Músicas no repertório', value: '127', icon: Music, color: 'bg-pink-100 dark:bg-pink-900/30 text-pink-600 dark:text-pink-400' },
    { label: 'Artistas únicos', value: '18', icon: Users, color: 'bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400' },
    { label: 'Missas planejadas', value: '12', icon: Calendar, color: 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400' },
    { label: 'Mais tocada', value: 'Acolhe Senhor', icon: TrendingUp, color: 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400' },
  ];

  const recentActivities = [
    { type: 'song', title: 'Nova música adicionada', subtitle: 'Vem, Senhor Jesus', time: '2 horas atrás' },
    { type: 'mass', title: 'Missa planejada', subtitle: 'Domingo, 16/06', time: '5 horas atrás' },
    { type: 'chord', title: 'Cifra atualizada', subtitle: 'Santo - Tom: D', time: '1 dia atrás' },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Title */}
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold text-neutral-700 dark:text-neutral-100 mb-6">
          👋🏿 Olá! Paz e Bem!
        </h1>
      </div>

      {/* Welcome Card */}
      <Card className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-50 to-purple-50 dark:from-primary-900/20 dark:to-purple-900/20"></div>
        <div className="relative">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-white/80 dark:bg-neutral-800/80 backdrop-blur-sm rounded-2xl shadow-sm">
              <Music className="text-primary-600 dark:text-primary-400" size={28} />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-3">
                <h2 className="text-lg font-medium text-neutral-700 dark:text-neutral-100">
                  Seja bem-vindo(a) ao <span className="font-bold">DivinoCantar</span>!
                </h2>
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-primary-400 rounded-full animate-pulse"></div>
                  <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }}></div>
                  <div className="w-2 h-2 bg-pink-400 rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
                </div>
              </div>
              <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed">
                Aqui você pode organizar repertórios, planejar celebrações e encontrar a música perfeita para cada momento especial.
              </p>
            </div>
          </div>
          
          <div className="flex items-center justify-between pt-4 border-t border-neutral-200/50 dark:border-neutral-700/50">
            <div className="text-sm text-neutral-500 dark:text-neutral-400">
              Que a música seja sua oração de hoje 🎵
            </div>
            <div className="flex items-center gap-2 text-xs text-neutral-400 dark:text-neutral-500">
              <Star size={12} className="text-yellow-500" />
              <span>Inspire-se</span>
            </div>
          </div>
        </div>
      </Card>

      {/* Quick Stats - Desktop Grid / Mobile Carousel */}
      <div className="relative">
        {/* Desktop Grid */}
        <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickStats.map((stat, index) => (
            <Card key={index} hover>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-1">{stat.label}</p>
                  <p className="text-2xl font-semibold text-neutral-700 dark:text-neutral-100">{stat.value}</p>
                </div>
                <div className={`p-3 rounded-2xl ${stat.color}`}>
                  <stat.icon size={24} />
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Mobile Carousel */}
        <div className="md:hidden">
          <div className="flex items-center gap-2">
            {/* Previous Button */}
            <button
              onClick={() => setCurrentStatIndex(Math.max(0, currentStatIndex - 1))}
              disabled={currentStatIndex === 0}
              className={cn(
                "p-2 rounded-xl transition-colors",
                currentStatIndex === 0
                  ? "text-gray-300 dark:text-gray-600 cursor-not-allowed"
                  : "text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-neutral-800"
              )}
            >
              <ChevronLeft size={20} />
            </button>

            {/* Card Container */}
            <div className="flex-1 overflow-hidden">
              <div 
                className="flex transition-transform duration-300 ease-in-out"
                style={{ transform: `translateX(-${currentStatIndex * 100}%)` }}
              >
                {quickStats.map((stat, index) => (
                  <div key={index} className="w-full flex-shrink-0 px-1">
                    <Card hover>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-1">{stat.label}</p>
                          <p className="text-2xl font-semibold text-neutral-700 dark:text-neutral-100">{stat.value}</p>
                        </div>
                        <div className={`p-3 rounded-2xl ${stat.color}`}>
                          <stat.icon size={24} />
                        </div>
                      </div>
                    </Card>
                  </div>
                ))}
              </div>
            </div>

            {/* Next Button */}
            <button
              onClick={() => setCurrentStatIndex(Math.min(quickStats.length - 1, currentStatIndex + 1))}
              disabled={currentStatIndex === quickStats.length - 1}
              className={cn(
                "p-2 rounded-xl transition-colors",
                currentStatIndex === quickStats.length - 1
                  ? "text-gray-300 dark:text-gray-600 cursor-not-allowed"
                  : "text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-neutral-800"
              )}
            >
              <ChevronRight size={20} />
            </button>
          </div>

          {/* Carousel Indicators */}
          <div className="flex justify-center gap-1.5 mt-4">
            {quickStats.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentStatIndex(index)}
                className={cn(
                  "w-1.5 h-1.5 rounded-full transition-all duration-300",
                  index === currentStatIndex
                    ? "w-6 bg-primary-600 dark:bg-primary-400"
                    : "bg-gray-300 dark:bg-gray-600"
                )}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <div className="flex items-center mb-4">
            <Calendar className="text-purple-600 dark:text-purple-400 mr-3" size={24} />
            <h2 className="text-xl font-semibold text-neutral-700 dark:text-neutral-100">Próximas Celebrações</h2>
          </div>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center p-3 bg-neutral-100 dark:bg-neutral-700/50 rounded-xl">
                <div>
                  <p className="font-medium text-neutral-700 dark:text-neutral-100">Domingo - 15º Tempo Comum</p>
                  <p className="text-sm text-neutral-600 dark:text-neutral-400">16 de junho, 10h</p>
                </div>
                <button className="text-primary-600 dark:text-primary-400 text-sm font-medium hover:text-primary-700 dark:hover:text-primary-300">
                  Ver detalhes
                </button>
              </div>
              <div className="flex justify-between items-center p-3 bg-neutral-100 dark:bg-neutral-700/50 rounded-xl">
                <div>
                  <p className="font-medium text-neutral-700 dark:text-neutral-100">Festa de São João</p>
                  <p className="text-sm text-neutral-600 dark:text-neutral-400">24 de junho, 19h</p>
                </div>
                <button className="text-primary-600 dark:text-primary-400 text-sm font-medium hover:text-primary-700 dark:hover:text-primary-300">
                  Planejar
                </button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <div className="flex items-center mb-4">
            <Star className="text-yellow-600 dark:text-yellow-400 mr-3" size={24} />
            <h2 className="text-xl font-semibold text-neutral-700 dark:text-neutral-100">Atividades Recentes</h2>
          </div>
          <CardContent>
            <div className="space-y-3">
              {recentActivities.map((activity, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-primary-400 dark:bg-primary-500 rounded-full mt-2"></div>
                  <div className="flex-1">
                    <p className="font-medium text-neutral-700 dark:text-neutral-100">{activity.title}</p>
                    <p className="text-sm text-neutral-600 dark:text-neutral-400">{activity.subtitle}</p>
                    <p className="text-xs text-neutral-500 dark:text-neutral-500 mt-1">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Suggestion Card */}
      <Card className="bg-gradient-to-r from-primary-50 to-blue-50 dark:from-primary-900/20 dark:to-blue-900/20 border-0">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-neutral-700 dark:text-neutral-100 mb-1">
              Dica do dia
            </h3>
            <p className="text-neutral-600 dark:text-neutral-400">
              Que tal revisar o repertório para o próximo domingo? Temos sugestões baseadas nas leituras!
            </p>
          </div>
          <button className="px-4 py-2 bg-primary-600 dark:bg-primary-500 text-white rounded-xl hover:bg-primary-700 dark:hover:bg-primary-600 transition-colors">
            Ver sugestões
          </button>
        </div>
      </Card>
    </div>
  );
}