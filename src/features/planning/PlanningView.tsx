import { Calendar, Plus, Music, Save, Share2, Check, X, Search } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/Card';
import { SongDetailModal } from '../../components/SongDetailModal';
import { useFavorites } from '../../hooks/useFavorites';
import { mockSongs } from '../../data/mock';
import { useState } from 'react';
import { cn } from '../../lib/utils';

interface MassMoment {
  moment: string;
  selected: boolean;
  suggestion: string;
  selectedSong?: any;
}

export function PlanningView() {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedSong, setSelectedSong] = useState<any>(null);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [notes, setNotes] = useState('');
  const { toggleFavorite, isFavorite } = useFavorites();

  const [massTemplate, setMassTemplate] = useState<MassMoment[]>([
    { moment: 'Entrada', selected: false, suggestion: 'Eu Vim Para Escutar' },
    { moment: 'Ato Penitencial', selected: false, suggestion: 'Senhor, Piedade' },
    { moment: 'Glória', selected: false, suggestion: 'Glória a Deus nas Alturas' },
    { moment: 'Salmo', selected: true, suggestion: 'O Senhor é meu pastor' },
    { moment: 'Aclamação', selected: false, suggestion: 'Aleluia' },
    { moment: 'Ofertório', selected: true, suggestion: 'Acolhe Senhor' },
    { moment: 'Santo', selected: false, suggestion: 'Santo' },
    { moment: 'Cordeiro', selected: false, suggestion: 'Cordeiro de Deus' },
    { moment: 'Comunhão', selected: true, suggestion: 'Vem, Senhor Jesus' },
    { moment: 'Pós-Comunhão', selected: false, suggestion: 'Te Agradeço' },
    { moment: 'Final', selected: false, suggestion: 'Ide Por Todo Mundo' },
  ]);

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

  const saveMassPlanning = () => {
    const planningData = {
      date: selectedDate,
      moments: massTemplate.filter(item => item.selected),
      notes,
      createdAt: new Date().toISOString()
    };
    console.log('Saving mass planning:', planningData);
    // Aqui seria implementado o salvamento real
    alert('Planejamento salvo com sucesso!');
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
        <button 
          className="flex items-center gap-2 px-3 py-2 lg:px-4 lg:py-2 bg-primary-600 dark:bg-primary-500 text-white rounded-xl hover:bg-primary-700 dark:hover:bg-primary-600 transition-colors flex-shrink-0"
          title="Nova Celebração"
        >
          <Plus size={18} className="lg:w-5 lg:h-5" />
          <span className="hidden sm:inline">Nova Celebração</span>
        </button>
      </div>

      {/* Date Selection */}
      <Card>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Calendar className="text-purple-600 dark:text-purple-400" size={24} />
            <div>
              <p className="text-sm text-neutral-600 dark:text-neutral-400">Data da celebração</p>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="mt-1 text-lg font-medium text-neutral-700 dark:text-neutral-100 bg-transparent focus:outline-none"
              />
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm text-neutral-600 dark:text-neutral-400">Tempo litúrgico</p>
            <p className="text-lg font-medium text-green-600 dark:text-green-400">Tempo Comum</p>
          </div>
        </div>
      </Card>

      {/* Mass Planning */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Momentos da Missa</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {massTemplate.map((item, index) => (
                <div key={index} className="relative">
                  <div className={cn(
                    "flex items-center justify-between p-3 rounded-xl transition-colors",
                    item.selected 
                      ? "bg-primary-50 dark:bg-primary-900/20 border border-primary-200 dark:border-primary-800"
                      : "bg-neutral-50 dark:bg-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-600"
                  )}>
                    <div className="flex items-center gap-3 flex-1">
                      <input
                        type="checkbox"
                        checked={item.selected}
                        onChange={() => toggleMomentSelection(index)}
                        className="w-5 h-5 text-primary-600 bg-white dark:bg-neutral-700 border-neutral-300 dark:border-neutral-600 rounded-lg focus:ring-primary-500"
                      />
                      <div className="flex-1">
                        <p className="font-medium text-neutral-700 dark:text-neutral-100">{item.moment}</p>
                        {item.selectedSong ? (
                          <div className="flex items-center gap-2 mt-1">
                            <p className="text-sm text-primary-600 dark:text-primary-400 font-medium">
                              {item.selectedSong.title} - {item.selectedSong.artist}
                            </p>
                            <button
                              onClick={() => removeSongFromMoment(index)}
                              className="p-1 text-red-500 hover:text-red-700 dark:hover:text-red-400"
                              title="Remover música"
                            >
                              <X size={14} />
                            </button>
                          </div>
                        ) : (
                          <p className="text-sm text-neutral-600 dark:text-neutral-400">{item.suggestion}</p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {item.selectedSong && (
                        <button
                          onClick={() => setSelectedSong(item.selectedSong)}
                          className="p-2 text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300"
                          title="Ver detalhes da música"
                        >
                          <Music size={18} />
                        </button>
                      )}
                      <button
                        onClick={() => setActiveDropdown(activeDropdown === `moment-${index}` ? null : `moment-${index}`)}
                        className="p-2 text-neutral-600 dark:text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-100"
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
          <Card>
            <CardHeader>
              <CardTitle>Sugestões Baseadas na Liturgia</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="p-3 bg-purple-50 dark:bg-purple-900/30 rounded-xl">
                  <p className="font-medium text-purple-900 dark:text-purple-100 mb-1">Entrada</p>
                  <p className="text-sm text-purple-700 dark:text-purple-300">
                    "Vinde, cristãos" - Combina com o tema da primeira leitura
                  </p>
                </div>
                <div className="p-3 bg-green-50 dark:bg-green-900/30 rounded-xl">
                  <p className="font-medium text-green-900 dark:text-green-100 mb-1">Comunhão</p>
                  <p className="text-sm text-green-700 dark:text-green-300">
                    "Eu sou o Pão da Vida" - Relacionada ao evangelho do dia
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Observações</CardTitle>
            </CardHeader>
            <CardContent>
              <textarea
                placeholder="Adicione notas sobre a celebração..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full p-3 bg-neutral-50 dark:bg-neutral-700 text-neutral-700 dark:text-neutral-100 placeholder-neutral-500 dark:placeholder-neutral-400 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-primary-500"
                rows={4}
              />
            </CardContent>
          </Card>

          <div className="bg-neutral-50 dark:bg-neutral-700 rounded-xl p-4 mb-6">
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-medium text-neutral-700 dark:text-neutral-100">Resumo da Celebração</h4>
              <span className="text-sm text-neutral-600 dark:text-neutral-400">
                {getSelectedSongsCount()} momentos selecionados
              </span>
            </div>
            <div className="flex flex-wrap gap-2">
              {massTemplate.filter(item => item.selected).map((item, index) => (
                <span key={index} className="px-3 py-1 bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 rounded-lg text-sm">
                  {item.moment}
                </span>
              ))}
            </div>
          </div>
          
          <div className="flex gap-3">
            <button 
              onClick={saveMassPlanning}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-neutral-100 dark:bg-neutral-700 text-neutral-700 dark:text-neutral-300 rounded-xl hover:bg-neutral-200 dark:hover:bg-neutral-600 transition-colors"
            >
              <Save size={20} />
              Salvar Rascunho
            </button>
            <button className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-primary-600 dark:bg-primary-500 text-white rounded-xl hover:bg-primary-700 dark:hover:bg-primary-600 transition-colors">
              <Share2 size={20} />
              Compartilhar
            </button>
          </div>
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
    </div>
  );
}