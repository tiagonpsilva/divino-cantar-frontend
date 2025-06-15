import { Calendar, Plus, Music, Save, Share2, Check, X, Search, Clock, Users, MapPin, Zap, Download, Copy, Trash2, Edit, BookOpen, Play, Volume2, ChevronLeft, ChevronRight } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/Card';
import { SongDetailModal } from '../../components/SongDetailModal';
import { ChordModal } from '../../components/ChordModal';
import { ShareModal } from '../../components/ShareModal';
import { useFavorites } from '../../hooks/useFavorites';
import { useToastContext } from '../../contexts/ToastContext';
import { mockSongs } from '../../data/mock';
import { useState, useEffect } from 'react';
import { cn } from '../../lib/utils';

interface MassMoment {
  id: string;
  moment: string;
  selected: boolean;
  suggestion: string;
  selectedSong?: any;
  required?: boolean;
  description?: string;
  color?: string;
}

interface MassPlanning {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  celebrant: string;
  liturgicalSeason: string;
  liturgicalColor: string;
  moments: MassMoment[];
  notes: string;
  participants: number;
  isPublic: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const liturgicalSeasons = [
  { value: 'comum', label: 'Tempo Comum', color: 'bg-green-100 text-green-700' },
  { value: 'advento', label: 'Advento', color: 'bg-purple-100 text-purple-700' },
  { value: 'natal', label: 'Natal', color: 'bg-red-100 text-red-700' },
  { value: 'quaresma', label: 'Quaresma', color: 'bg-purple-100 text-purple-700' },
  { value: 'pascoa', label: 'Páscoa', color: 'bg-yellow-100 text-yellow-700' },
];

const massTemplates = {
  dominical: 'Missa Dominical',
  semana: 'Missa da Semana',
  casamento: 'Missa de Casamento',
  funeral: 'Missa de Sétimo Dia',
  batismo: 'Missa com Batismo',
  primeira_comunhao: 'Primeira Comunhão',
  crisma: 'Crisma',
  festa_santo: 'Festa de Santo',
};

export function PlanningView() {
  const [selectedSong, setSelectedSong] = useState<any>(null);
  const [songForChords, setSongForChords] = useState<any>(null);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showShareModal, setShowShareModal] = useState(false);
  const [currentTemplate, setCurrentTemplate] = useState('dominical');
  const [savedPlannings, setSavedPlannings] = useState<MassPlanning[]>([]);
  const [showSavedPlannings, setShowSavedPlannings] = useState(false);
  const [currentMetricIndex, setCurrentMetricIndex] = useState(0);
  const { toggleFavorite, isFavorite } = useFavorites();
  const { success, error } = useToastContext();
  
  // Current planning state
  const [currentPlanning, setCurrentPlanning] = useState<Partial<MassPlanning>>({
    title: 'Nova Celebração',
    date: new Date().toISOString().split('T')[0],
    time: '10:00',
    location: 'Igreja Matriz',
    celebrant: 'Pe. João',
    liturgicalSeason: 'comum',
    liturgicalColor: 'verde',
    participants: 100,
    isPublic: true,
    notes: '',
  });

  const [massTemplate, setMassTemplate] = useState<MassMoment[]>([
    { id: '1', moment: 'Entrada', selected: false, suggestion: 'Eu Vim Para Escutar', required: true, description: 'Acolhida da assembleia', color: 'bg-blue-100 text-blue-700' },
    { id: '2', moment: 'Ato Penitencial', selected: false, suggestion: 'Senhor, Piedade', required: false, description: 'Momento de perdão', color: 'bg-purple-100 text-purple-700' },
    { id: '3', moment: 'Glória', selected: false, suggestion: 'Glória a Deus nas Alturas', required: false, description: 'Hino de louvor', color: 'bg-yellow-100 text-yellow-700' },
    { id: '4', moment: 'Salmo', selected: true, suggestion: 'O Senhor é meu pastor', required: true, description: 'Salmo responsorial', color: 'bg-green-100 text-green-700' },
    { id: '5', moment: 'Aclamação', selected: false, suggestion: 'Aleluia', required: true, description: 'Antes do Evangelho', color: 'bg-pink-100 text-pink-700' },
    { id: '6', moment: 'Ofertório', selected: true, suggestion: 'Acolhe Senhor', required: false, description: 'Apresentação das oferendas', color: 'bg-indigo-100 text-indigo-700' },
    { id: '7', moment: 'Santo', selected: false, suggestion: 'Santo', required: true, description: 'Aclamação eucarística', color: 'bg-orange-100 text-orange-700' },
    { id: '8', moment: 'Cordeiro', selected: false, suggestion: 'Cordeiro de Deus', required: true, description: 'Fração do pão', color: 'bg-red-100 text-red-700' },
    { id: '9', moment: 'Comunhão', selected: true, suggestion: 'Vem, Senhor Jesus', required: false, description: 'Durante a comunhão', color: 'bg-teal-100 text-teal-700' },
    { id: '10', moment: 'Pós-Comunhão', selected: false, suggestion: 'Te Agradeço', required: false, description: 'Ação de graças', color: 'bg-cyan-100 text-cyan-700' },
    { id: '11', moment: 'Final', selected: false, suggestion: 'Ide Por Todo Mundo', required: false, description: 'Envio missionário', color: 'bg-gray-100 text-gray-700' },
  ]);
  
  // Load saved plannings on mount
  useEffect(() => {
    const saved = localStorage.getItem('massPlannings');
    if (saved) {
      setSavedPlannings(JSON.parse(saved));
    }
  }, []);

  const toggleMomentSelection = (index: number) => {
    setMassTemplate(prev => 
      prev.map((item, i) => 
        i === index ? { ...item, selected: !item.selected } : item
      )
    );
  };

  const selectSongForMoment = (index: number, song: any) => {
    setMassTemplate(prev => 
      prev.map((item, i) => 
        i === index ? { ...item, selectedSong: song, selected: true } : item
      )
    );
    setActiveDropdown(null);
  };

  const removeSongFromMoment = (index: number) => {
    setMassTemplate(prev => 
      prev.map((item, i) => 
        i === index ? { ...item, selectedSong: undefined, selected: false } : item
      )
    );
  };

  const getFilteredSongs = () => {
    return mockSongs.filter(song => 
      song.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      song.artist?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  const getSelectedSongsCount = () => {
    return massTemplate.filter(item => item.selected).length;
  };
  
  const getRequiredMomentsCount = () => {
    return massTemplate.filter(item => item.required).length;
  };
  
  const getCompletedRequiredCount = () => {
    return massTemplate.filter(item => item.required && item.selected).length;
  };
  
  const getCompletionPercentage = () => {
    const required = getRequiredMomentsCount();
    const completed = getCompletedRequiredCount();
    return Math.round((completed / required) * 100);
  };

  const saveMassPlanning = async () => {
    try {
      const planningData: MassPlanning = {
        id: String(Date.now()),
        ...currentPlanning as MassPlanning,
        moments: massTemplate,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      const updated = [...savedPlannings, planningData];
      setSavedPlannings(updated);
      localStorage.setItem('massPlannings', JSON.stringify(updated));
      
      success('Planejamento salvo com sucesso!');
    } catch (err) {
      error('Erro ao salvar planejamento');
    }
  };
  
  const loadPlanning = (planning: MassPlanning) => {
    setCurrentPlanning(planning);
    setMassTemplate(planning.moments);
    setShowSavedPlannings(false);
    success('Planejamento carregado!');
  };
  
  const deletePlanning = (id: string) => {
    const updated = savedPlannings.filter(p => p.id !== id);
    setSavedPlannings(updated);
    localStorage.setItem('massPlannings', JSON.stringify(updated));
    success('Planejamento excluído!');
  };
  
  const duplicatePlanning = (planning: MassPlanning) => {
    const duplicated = {
      ...planning,
      id: String(Date.now()),
      title: `${planning.title} (Cópia)`,
      date: new Date().toISOString().split('T')[0],
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    const updated = [...savedPlannings, duplicated];
    setSavedPlannings(updated);
    localStorage.setItem('massPlannings', JSON.stringify(updated));
    success('Planejamento duplicado!');
  };
  
  const exportPlanningAsPDF = () => {
    // Simulação de exportação PDF
    const selectedSongs = massTemplate.filter(m => m.selectedSong);
    success(`Exportando ${selectedSongs.length} músicas selecionadas...`);
  };
  
  const sharePlanning = () => {
    const selectedSongs = massTemplate.filter(m => m.selectedSong).map(m => m.selectedSong);
    if (selectedSongs.length === 0) {
      error('Selecione pelo menos uma música para compartilhar');
      return;
    }
    setShowShareModal(true);
  };
  
  const applyTemplate = (templateType: string) => {
    // Reset template and apply specific configurations
    const resetTemplate = massTemplate.map(m => ({ ...m, selected: false, selectedSong: undefined }));
    
    switch (templateType) {
      case 'dominical':
        // Marca momentos essenciais para missa dominical
        resetTemplate.forEach(m => {
          if (['Entrada', 'Salmo', 'Aclamação', 'Santo', 'Cordeiro', 'Final'].includes(m.moment)) {
            m.selected = true;
          }
        });
        break;
      case 'casamento':
        resetTemplate.forEach(m => {
          if (['Entrada', 'Ofertório', 'Comunhão', 'Final'].includes(m.moment)) {
            m.selected = true;
          }
        });
        break;
      case 'funeral':
        resetTemplate.forEach(m => {
          if (['Entrada', 'Salmo', 'Ofertório', 'Comunhão', 'Final'].includes(m.moment)) {
            m.selected = true;
          }
        });
        break;
    }
    
    setMassTemplate(resetTemplate);
    setCurrentTemplate(templateType);
    success(`Modelo ${massTemplates[templateType as keyof typeof massTemplates]} aplicado!`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <h1 className="text-2xl lg:text-3xl font-bold text-neutral-700 dark:text-neutral-100 mb-2">
            Planejar Missa
          </h1>
          <p className="text-sm lg:text-base text-neutral-600 dark:text-neutral-400">
            Monte o repertório completo para sua celebração
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={() => setShowSavedPlannings(true)}
            className="flex items-center gap-2 px-3 py-2 lg:px-4 lg:py-2 bg-white dark:bg-neutral-700 text-neutral-700 dark:text-neutral-300 border border-gray-200 dark:border-neutral-600 rounded-xl hover:bg-gray-100 dark:hover:bg-neutral-600 transition-colors flex-shrink-0"
          >
            <BookOpen size={18} className="lg:w-5 lg:h-5" />
            <span className="hidden sm:inline">Salvos ({savedPlannings.length})</span>
          </button>
          <button 
            onClick={() => {
              setCurrentPlanning({
                title: 'Nova Celebração',
                date: new Date().toISOString().split('T')[0],
                time: '10:00',
                location: 'Igreja Matriz',
                celebrant: 'Pe. João',
                liturgicalSeason: 'comum',
                liturgicalColor: 'verde',
                participants: 100,
                isPublic: true,
                notes: '',
              });
              setMassTemplate(prev => prev.map(m => ({ ...m, selected: false, selectedSong: undefined })));
            }}
            className="flex items-center gap-2 px-3 py-2 lg:px-4 lg:py-2 bg-primary-600 dark:bg-primary-500 text-white rounded-xl hover:bg-primary-700 dark:hover:bg-primary-600 transition-colors flex-shrink-0"
          >
            <Plus size={18} className="lg:w-5 lg:h-5" />
            <span className="hidden sm:inline">Nova Celebração</span>
          </button>
        </div>
      </div>
      
      {/* Progress & Quick Stats */}
      <Card>
        {/* Desktop Grid */}
        <div className="hidden md:grid md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-3xl font-bold text-primary-600 dark:text-primary-400">{getCompletionPercentage()}%</div>
            <div className="text-sm text-neutral-600 dark:text-neutral-400">Completo</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-green-600 dark:text-green-400">{getSelectedSongsCount()}</div>
            <div className="text-sm text-neutral-600 dark:text-neutral-400">Músicas selecionadas</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-orange-600 dark:text-orange-400">{getCompletedRequiredCount()}/{getRequiredMomentsCount()}</div>
            <div className="text-sm text-neutral-600 dark:text-neutral-400">Momentos obrigatórios</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">{currentPlanning.participants || 0}</div>
            <div className="text-sm text-neutral-600 dark:text-neutral-400">Participantes</div>
          </div>
        </div>

        {/* Mobile Carousel */}
        <div className="md:hidden">
          <div className="flex items-center gap-2">
            {/* Previous Button */}
            <button
              onClick={() => setCurrentMetricIndex(Math.max(0, currentMetricIndex - 1))}
              disabled={currentMetricIndex === 0}
              className={cn(
                "p-2 rounded-xl transition-colors",
                currentMetricIndex === 0
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
                style={{ transform: `translateX(-${currentMetricIndex * 100}%)` }}
              >
                <div className="w-full flex-shrink-0 px-1">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-primary-600 dark:text-primary-400">{getCompletionPercentage()}%</div>
                    <div className="text-sm text-neutral-600 dark:text-neutral-400">Completo</div>
                  </div>
                </div>
                <div className="w-full flex-shrink-0 px-1">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-600 dark:text-green-400">{getSelectedSongsCount()}</div>
                    <div className="text-sm text-neutral-600 dark:text-neutral-400">Músicas selecionadas</div>
                  </div>
                </div>
                <div className="w-full flex-shrink-0 px-1">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-orange-600 dark:text-orange-400">{getCompletedRequiredCount()}/{getRequiredMomentsCount()}</div>
                    <div className="text-sm text-neutral-600 dark:text-neutral-400">Momentos obrigatórios</div>
                  </div>
                </div>
                <div className="w-full flex-shrink-0 px-1">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">{currentPlanning.participants || 0}</div>
                    <div className="text-sm text-neutral-600 dark:text-neutral-400">Participantes</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Next Button */}
            <button
              onClick={() => setCurrentMetricIndex(Math.min(3, currentMetricIndex + 1))}
              disabled={currentMetricIndex === 3}
              className={cn(
                "p-2 rounded-xl transition-colors",
                currentMetricIndex === 3
                  ? "text-gray-300 dark:text-gray-600 cursor-not-allowed"
                  : "text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-neutral-800"
              )}
            >
              <ChevronRight size={20} />
            </button>
          </div>

          {/* Carousel Indicators */}
          <div className="flex justify-center gap-1.5 mt-4">
            {[0, 1, 2, 3].map((index) => (
              <button
                key={index}
                onClick={() => setCurrentMetricIndex(index)}
                className={cn(
                  "w-1.5 h-1.5 rounded-full transition-all duration-300",
                  index === currentMetricIndex
                    ? "w-6 bg-primary-600 dark:bg-primary-400"
                    : "bg-gray-300 dark:bg-gray-600"
                )}
              />
            ))}
          </div>
        </div>
      </Card>

      {/* Planning Details */}
      <Card>
        <CardHeader>
          <CardTitle>Detalhes da Celebração</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2 block">Título</label>
              <input
                type="text"
                value={currentPlanning.title || ''}
                onChange={(e) => setCurrentPlanning(prev => ({ ...prev, title: e.target.value }))}
                className="w-full px-3 py-2 bg-white dark:bg-neutral-700 border border-gray-200 dark:border-neutral-600 rounded-lg text-neutral-700 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="Nome da celebração"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2 block">Data</label>
              <input
                type="date"
                value={currentPlanning.date || ''}
                onChange={(e) => setCurrentPlanning(prev => ({ ...prev, date: e.target.value }))}
                className="w-full px-3 py-2 bg-white dark:bg-neutral-700 border border-gray-200 dark:border-neutral-600 rounded-lg text-neutral-700 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2 block">Horário</label>
              <input
                type="time"
                value={currentPlanning.time || ''}
                onChange={(e) => setCurrentPlanning(prev => ({ ...prev, time: e.target.value }))}
                className="w-full px-3 py-2 bg-white dark:bg-neutral-700 border border-gray-200 dark:border-neutral-600 rounded-lg text-neutral-700 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2 block">Local</label>
              <input
                type="text"
                value={currentPlanning.location || ''}
                onChange={(e) => setCurrentPlanning(prev => ({ ...prev, location: e.target.value }))}
                className="w-full px-3 py-2 bg-white dark:bg-neutral-700 border border-gray-200 dark:border-neutral-600 rounded-lg text-neutral-700 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="Igreja, capela..."
              />
            </div>
            <div>
              <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2 block">Celebrante</label>
              <input
                type="text"
                value={currentPlanning.celebrant || ''}
                onChange={(e) => setCurrentPlanning(prev => ({ ...prev, celebrant: e.target.value }))}
                className="w-full px-3 py-2 bg-white dark:bg-neutral-700 border border-gray-200 dark:border-neutral-600 rounded-lg text-neutral-700 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="Pe. João, Diácono..."
              />
            </div>
            <div>
              <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2 block">Tempo Litúrgico</label>
              <select
                value={currentPlanning.liturgicalSeason || 'comum'}
                onChange={(e) => setCurrentPlanning(prev => ({ ...prev, liturgicalSeason: e.target.value }))}
                className="w-full px-3 py-2 bg-white dark:bg-neutral-700 border border-gray-200 dark:border-neutral-600 rounded-lg text-neutral-700 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                {liturgicalSeasons.map(season => (
                  <option key={season.value} value={season.value}>{season.label}</option>
                ))}
              </select>
            </div>
          </div>
          
          {/* Templates */}
          <div className="mt-6">
            <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-3 block">Modelos de Celebração</label>
            <div className="flex flex-wrap gap-2">
              {Object.entries(massTemplates).map(([key, label]) => (
                <button
                  key={key}
                  onClick={() => applyTemplate(key)}
                  className={cn(
                    "px-3 py-1.5 rounded-lg text-sm font-medium transition-colors",
                    currentTemplate === key
                      ? "bg-primary-600 text-white"
                      : "bg-gray-100 dark:bg-neutral-700 text-neutral-700 dark:text-neutral-300 hover:bg-gray-200 dark:hover:bg-neutral-600"
                  )}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Mass Planning */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Momentos da Missa</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {massTemplate.map((item, index) => (
                <div key={item.id} className="relative">
                  <div className={cn(
                    "flex items-center justify-between p-4 rounded-xl transition-all duration-200 border",
                    item.selected 
                      ? "bg-primary-50 dark:bg-primary-900/20 border-primary-200 dark:border-primary-800 shadow-sm"
                      : "bg-white dark:bg-neutral-700 border-gray-200 dark:border-neutral-600 hover:bg-gray-50 dark:hover:bg-neutral-600"
                  )}>
                    <div className="flex items-center gap-4 flex-1">
                      <div className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          checked={item.selected}
                          onChange={() => toggleMomentSelection(index)}
                          className="w-5 h-5 text-primary-600 bg-white dark:bg-neutral-700 border-neutral-300 dark:border-neutral-600 rounded-lg focus:ring-primary-500"
                        />
                        {item.required && (
                          <span className="w-2 h-2 bg-red-500 rounded-full" title="Momento obrigatório" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="font-semibold text-neutral-700 dark:text-neutral-100">{item.moment}</p>
                          {item.color && (
                            <span className={cn("px-2 py-0.5 rounded-md text-xs font-medium", item.color)}>
                              {item.description}
                            </span>
                          )}
                        </div>
                        {item.selectedSong ? (
                          <div className="flex items-center gap-2">
                            <div className="flex-1 min-w-0">
                              <p className="text-sm text-primary-600 dark:text-primary-400 font-medium truncate">
                                ♫ {item.selectedSong.title} - {item.selectedSong.artist}
                              </p>
                              <p className="text-xs text-neutral-500 dark:text-neutral-400">
                                Tom: {item.selectedSong.tone}
                              </p>
                            </div>
                            <div className="flex items-center gap-1">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSongForChords(item.selectedSong);
                                }}
                                className="p-1.5 text-primary-600 dark:text-primary-400 hover:bg-primary-100 dark:hover:bg-primary-900/20 rounded-lg transition-colors"
                                title="Ver cifra"
                              >
                                <Music size={14} />
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  removeSongFromMoment(index);
                                }}
                                className="p-1.5 text-red-500 hover:bg-red-100 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                                title="Remover música"
                              >
                                <X size={14} />
                              </button>
                            </div>
                          </div>
                        ) : (
                          <p className="text-sm text-neutral-600 dark:text-neutral-400 italic">
                            Sugestão: {item.suggestion}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <button
                        onClick={() => setActiveDropdown(activeDropdown === `moment-${index}` ? null : `moment-${index}`)}
                        className="p-2 text-neutral-600 dark:text-neutral-400 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-gray-100 dark:hover:bg-neutral-600 rounded-lg transition-colors"
                        title="Escolher música"
                      >
                        <Plus size={18} />
                      </button>
                    </div>
                  </div>
                  
                  {/* Dropdown for song selection */}
                  {activeDropdown === `moment-${index}` && (
                    <div className="absolute top-full left-0 right-0 z-10 mt-2 bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl shadow-lg max-h-64 overflow-hidden">
                      <div className="p-3 border-b border-neutral-200 dark:border-neutral-700">
                        <div className="relative">
                          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400" size={16} />
                          <input
                            type="text"
                            placeholder="Buscar música..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 bg-neutral-50 dark:bg-neutral-700 border border-neutral-200 dark:border-neutral-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
                          />
                        </div>
                      </div>
                      <div className="max-h-48 overflow-y-auto">
                        {getFilteredSongs().map(song => (
                          <button
                            key={song.id}
                            onClick={() => selectSongForMoment(index, song)}
                            className="w-full flex items-center justify-between p-3 hover:bg-neutral-50 dark:hover:bg-neutral-700 transition-colors text-left"
                          >
                            <div>
                              <p className="font-medium text-neutral-700 dark:text-neutral-100">{song.title}</p>
                              <p className="text-sm text-neutral-600 dark:text-neutral-400">{song.artist} • Tom: {song.tone}</p>
                            </div>
                            {item.selectedSong?.id === song.id && (
                              <Check size={16} className="text-primary-600 dark:text-primary-400" />
                            )}
                          </button>
                        ))}
                        {getFilteredSongs().length === 0 && (
                          <div className="p-6 text-center text-neutral-500 dark:text-neutral-400">
                            <Music size={32} className="mx-auto mb-2 opacity-50" />
                            <p>Nenhuma música encontrada</p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Ações Rápidas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-3">
                <button 
                  onClick={saveMassPlanning}
                  className="flex items-center justify-center gap-2 px-3 py-2 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-lg hover:bg-green-200 dark:hover:bg-green-900/50 transition-colors text-sm"
                >
                  <Save size={16} />
                  Salvar
                </button>
                <button 
                  onClick={sharePlanning}
                  className="flex items-center justify-center gap-2 px-3 py-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors text-sm"
                >
                  <Share2 size={16} />
                  Compartilhar
                </button>
                <button 
                  onClick={exportPlanningAsPDF}
                  className="flex items-center justify-center gap-2 px-3 py-2 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-lg hover:bg-purple-200 dark:hover:bg-purple-900/50 transition-colors text-sm"
                >
                  <Download size={16} />
                  PDF
                </button>
                <button 
                  onClick={() => {
                    navigator.clipboard.writeText(JSON.stringify({
                      title: currentPlanning.title,
                      date: currentPlanning.date,
                      moments: massTemplate.filter(m => m.selected)
                    }, null, 2));
                    success('Planejamento copiado!');
                  }}
                  className="flex items-center justify-center gap-2 px-3 py-2 bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 rounded-lg hover:bg-orange-200 dark:hover:bg-orange-900/50 transition-colors text-sm"
                >
                  <Copy size={16} />
                  Copiar
                </button>
              </div>
            </CardContent>
          </Card>
          
          {/* Progress Summary */}
          <Card>
            <CardHeader>
              <CardTitle>Progresso</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300">Conclusão</span>
                    <span className="text-sm text-neutral-600 dark:text-neutral-400">{getCompletionPercentage()}%</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-neutral-700 rounded-full h-2">
                    <div 
                      className="bg-primary-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${getCompletionPercentage()}%` }}
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <div className="text-lg font-bold text-green-600 dark:text-green-400">{getSelectedSongsCount()}</div>
                    <div className="text-xs text-neutral-600 dark:text-neutral-400">Selecionadas</div>
                  </div>
                  <div>
                    <div className="text-lg font-bold text-orange-600 dark:text-orange-400">{getCompletedRequiredCount()}/{getRequiredMomentsCount()}</div>
                    <div className="text-xs text-neutral-600 dark:text-neutral-400">Obrigatórias</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Selected Moments Summary */}
          <Card>
            <CardHeader>
              <CardTitle>Momentos Selecionados</CardTitle>
            </CardHeader>
            <CardContent>
              {massTemplate.filter(item => item.selected).length > 0 ? (
                <div className="space-y-2">
                  {massTemplate.filter(item => item.selected).map((item) => (
                    <div key={item.id} className="flex items-center justify-between p-2 bg-gray-50 dark:bg-neutral-700 rounded-lg">
                      <div className="flex items-center gap-2">
                        {item.required && <span className="w-1.5 h-1.5 bg-red-500 rounded-full" />}
                        <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300">{item.moment}</span>
                      </div>
                      {item.selectedSong ? (
                        <span className="text-xs text-primary-600 dark:text-primary-400 truncate max-w-20">
                          {item.selectedSong.title}
                        </span>
                      ) : (
                        <span className="text-xs text-neutral-500 dark:text-neutral-500">Sem música</span>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6 text-neutral-500 dark:text-neutral-400">
                  <Music size={32} className="mx-auto mb-2 opacity-50" />
                  <p className="text-sm">Nenhum momento selecionado</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Notes */}
          <Card>
            <CardHeader>
              <CardTitle>Observações</CardTitle>
            </CardHeader>
            <CardContent>
              <textarea
                placeholder="Adicione notas sobre a celebração..."
                value={currentPlanning.notes || ''}
                onChange={(e) => setCurrentPlanning(prev => ({ ...prev, notes: e.target.value }))}
                className="w-full p-3 bg-gray-50 dark:bg-neutral-700 text-neutral-700 dark:text-neutral-100 placeholder-neutral-500 dark:placeholder-neutral-400 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-primary-500 border border-gray-200 dark:border-neutral-600"
                rows={4}
              />
            </CardContent>
          </Card>
        </div>
      </div>
      
      {/* Song Detail Modal */}
      {selectedSong && (
        <SongDetailModal
          isOpen={!!selectedSong}
          onClose={() => setSelectedSong(null)}
          song={selectedSong}
          onToggleFavorite={toggleFavorite}
          isFavorite={isFavorite(selectedSong.id)}
        />
      )}
      
      {/* Chord Modal */}
      {songForChords && (
        <ChordModal
          isOpen={!!songForChords}
          onClose={() => setSongForChords(null)}
          song={songForChords}
          isFavorite={isFavorite(songForChords.id)}
          onToggleFavorite={toggleFavorite}
        />
      )}
      
      {/* Share Modal */}
      {showShareModal && (
        <ShareModal
          isOpen={showShareModal}
          onClose={() => setShowShareModal(false)}
          songs={massTemplate.filter(m => m.selectedSong).map(m => m.selectedSong)}
          title={`${currentPlanning.title} - ${new Date(currentPlanning.date || '').toLocaleDateString('pt-BR')}`}
          type="repertoire"
        />
      )}
      
      {/* Saved Plannings Modal */}
      {showSavedPlannings && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-neutral-800 rounded-2xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-neutral-700">
              <h2 className="text-2xl font-bold text-neutral-700 dark:text-neutral-100">
                Planejamentos Salvos ({savedPlannings.length})
              </h2>
              <button
                onClick={() => setShowSavedPlannings(false)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-neutral-700 rounded-xl transition-colors"
              >
                <X size={24} className="text-neutral-600 dark:text-neutral-400" />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
              {savedPlannings.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {savedPlannings.map((planning) => (
                    <Card key={planning.id} className="hover:shadow-md transition-shadow">
                      <div className="p-4">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-neutral-700 dark:text-neutral-100 truncate">
                              {planning.title}
                            </h3>
                            <div className="flex items-center gap-4 mt-1 text-sm text-neutral-600 dark:text-neutral-400">
                              <span className="flex items-center gap-1">
                                <Calendar size={14} />
                                {new Date(planning.date).toLocaleDateString('pt-BR')}
                              </span>
                              <span className="flex items-center gap-1">
                                <Clock size={14} />
                                {planning.time}
                              </span>
                            </div>
                            <div className="flex items-center gap-4 mt-1 text-sm text-neutral-600 dark:text-neutral-400">
                              <span className="flex items-center gap-1">
                                <MapPin size={14} />
                                {planning.location}
                              </span>
                              <span className="flex items-center gap-1">
                                <Users size={14} />
                                {planning.participants}
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center gap-1 ml-2">
                            <button
                              onClick={() => loadPlanning(planning)}
                              className="p-2 text-primary-600 dark:text-primary-400 hover:bg-primary-100 dark:hover:bg-primary-900/20 rounded-lg transition-colors"
                              title="Carregar planejamento"
                            >
                              <Play size={16} />
                            </button>
                            <button
                              onClick={() => duplicatePlanning(planning)}
                              className="p-2 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                              title="Duplicar planejamento"
                            >
                              <Copy size={16} />
                            </button>
                            <button
                              onClick={() => deletePlanning(planning.id)}
                              className="p-2 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                              title="Excluir planejamento"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-neutral-600 dark:text-neutral-400">Momentos selecionados:</span>
                            <span className="font-medium text-neutral-700 dark:text-neutral-100">
                              {planning.moments.filter(m => m.selected).length}
                            </span>
                          </div>
                          <div className="flex flex-wrap gap-1">
                            {planning.moments.filter(m => m.selected).slice(0, 4).map((moment) => (
                              <span key={moment.id} className="px-2 py-0.5 bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 rounded text-xs">
                                {moment.moment}
                              </span>
                            ))}
                            {planning.moments.filter(m => m.selected).length > 4 && (
                              <span className="px-2 py-0.5 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded text-xs">
                                +{planning.moments.filter(m => m.selected).length - 4}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <BookOpen size={48} className="mx-auto mb-4 text-gray-400 dark:text-gray-500 opacity-50" />
                  <h3 className="text-lg font-medium text-neutral-700 dark:text-neutral-100 mb-2">
                    Nenhum planejamento salvo
                  </h3>
                  <p className="text-neutral-600 dark:text-neutral-400">
                    Seus planejamentos salvos aparecerão aqui
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}