import { useState } from 'react';
import { Search, Filter, Music, Clock, Tag, Play, ChevronDown, X, TrendingUp, Star } from 'lucide-react';
import { Card } from '../../components/Card';
import { FavoriteButton } from '../../components/FavoriteButton';
import { ChordModal } from '../../components/ChordModal';
import { useFavorites } from '../../hooks/useFavorites';
import { mockSongs } from '../../data/mock';

export function SearchView() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMoment, setSelectedMoment] = useState('todos');
  const [selectedTone, setSelectedTone] = useState('todos');
  const [selectedArtist, setSelectedArtist] = useState('todos');
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [sortBy, setSortBy] = useState('name');
  const [searchHistory, setSearchHistory] = useState<string[]>(['Santo', 'Acolhe Senhor', 'Entrada']);
  const [selectedSong, setSelectedSong] = useState<any>(null);
  const { toggleFavorite, isFavorite } = useFavorites();

  const moments = [
    { value: 'todos', label: 'Todos os momentos' },
    { value: 'entrada', label: 'Entrada' },
    { value: 'ofertorio', label: 'Ofertório' },
    { value: 'comunhao', label: 'Comunhão' },
    { value: 'final', label: 'Final' },
    { value: 'santo', label: 'Santo' },
    { value: 'cordeiro', label: 'Cordeiro' },
    { value: 'gloria', label: 'Glória' },
    { value: 'perdao', label: 'Perdão' },
    { value: 'aclamacao', label: 'Aclamação' },
    { value: 'acao_gracas', label: 'Ação de Graças' },
  ];

  const tones = [
    { value: 'todos', label: 'Todos os tons' },
    { value: 'C', label: 'C (Dó)' },
    { value: 'D', label: 'D (Ré)' },
    { value: 'E', label: 'E (Mi)' },
    { value: 'F', label: 'F (Fá)' },
    { value: 'G', label: 'G (Sol)' },
    { value: 'A', label: 'A (Lá)' },
    { value: 'B', label: 'B (Si)' },
    { value: 'Em', label: 'Em (Mi menor)' },
    { value: 'Am', label: 'Am (Lá menor)' },
  ];

  const artists = [
    { value: 'todos', label: 'Todos os artistas' },
    ...Array.from(new Set(mockSongs.map(song => song.artist))).map(artist => ({
      value: artist,
      label: artist
    }))
  ];

  const sortOptions = [
    { value: 'name', label: 'Nome (A-Z)' },
    { value: 'artist', label: 'Artista' },
    { value: 'tone', label: 'Tom' },
    { value: 'recent', label: 'Mais recentes' },
  ];

  const filteredSongs = mockSongs.filter(song => {
    const matchesQuery = searchQuery === '' ||
                        song.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        song.artist?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        song.lyrics?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        song.tags?.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesMoment = selectedMoment === 'todos' || song.moments.includes(selectedMoment as any);
    const matchesTone = selectedTone === 'todos' || song.tone === selectedTone;
    const matchesArtist = selectedArtist === 'todos' || song.artist === selectedArtist;
    return matchesQuery && matchesMoment && matchesTone && matchesArtist;
  }).sort((a, b) => {
    switch (sortBy) {
      case 'name':
        return a.title.localeCompare(b.title);
      case 'artist':
        return a.artist.localeCompare(b.artist);
      case 'tone':
        return a.tone.localeCompare(b.tone);
      case 'recent':
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      default:
        return 0;
    }
  });

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query && !searchHistory.includes(query)) {
      setSearchHistory(prev => [query, ...prev.slice(0, 4)]);
    }
  };

  const clearSearch = () => {
    setSearchQuery('');
  };

  const removeFromHistory = (term: string) => {
    setSearchHistory(prev => prev.filter(item => item !== term));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold text-neutral-700 dark:text-neutral-100 mb-2">
          Buscar Músicas
        </h1>
        <p className="text-sm lg:text-base text-neutral-600 dark:text-neutral-400">
          Encontre a música perfeita para cada momento da celebração
        </p>
      </div>

      {/* Search Bar */}
      <div className="space-y-3">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-neutral-400 dark:text-neutral-500" size={20} />
          <input
            type="text"
            placeholder="Buscar por título, artista, letra ou tags..."
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            className="w-full pl-12 pr-12 py-4 bg-white dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-neutral-700 dark:text-neutral-100 placeholder-neutral-500 dark:placeholder-neutral-400 shadow"
          />
          {searchQuery && (
            <button
              onClick={clearSearch}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-neutral-400 dark:text-neutral-500 hover:text-neutral-600 dark:hover:text-neutral-300"
            >
              <X size={20} />
            </button>
          )}
        </div>
        
        {/* Search History */}
        {searchQuery === '' && searchHistory.length > 0 && (
          <div className="bg-white dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 rounded-xl p-4 shadow-sm">
            <div className="flex items-center gap-2 mb-3">
              <Clock className="text-neutral-500 dark:text-neutral-400" size={16} />
              <span className="text-sm font-medium text-neutral-600 dark:text-neutral-400">Buscas recentes</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {searchHistory.map((term, index) => (
                <div key={index} className="flex items-center gap-1 bg-gray-100 dark:bg-neutral-700 px-3 py-1.5 rounded-lg group">
                  <button
                    onClick={() => handleSearch(term)}
                    className="text-sm text-neutral-700 dark:text-neutral-300 hover:text-primary-600 dark:hover:text-primary-400"
                  >
                    {term}
                  </button>
                  <button
                    onClick={() => removeFromHistory(term)}
                    className="opacity-0 group-hover:opacity-100 text-neutral-500 hover:text-red-500 transition-opacity"
                  >
                    <X size={12} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Filters */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Filter className="text-neutral-600 dark:text-neutral-400" size={20} />
            <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300">Filtros:</span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
              className="flex items-center gap-1 px-3 py-1.5 text-sm text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 transition-colors"
            >
              Avançados
              <ChevronDown className={`transform transition-transform ${showAdvancedFilters ? 'rotate-180' : ''}`} size={16} />
            </button>
            <div className="flex items-center gap-2">
              <span className="text-xs text-neutral-500 dark:text-neutral-400">Ordenar:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="text-xs bg-white dark:bg-neutral-700 border border-gray-200 dark:border-neutral-600 rounded-lg px-2 py-1 text-neutral-700 dark:text-neutral-300"
              >
                {sortOptions.map(option => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
        
        {/* Basic Filters */}
        <div className="flex gap-2 flex-wrap">
          {moments.slice(0, 6).map((moment) => (
            <button
              key={moment.value}
              onClick={() => setSelectedMoment(moment.value)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                selectedMoment === moment.value
                  ? 'bg-primary-600 text-white'
                  : 'bg-white dark:bg-neutral-700 text-neutral-700 dark:text-neutral-300 hover:bg-gray-50 dark:hover:bg-neutral-600 border border-gray-200 dark:border-neutral-600 shadow-sm'
              }`}
            >
              {moment.label}
            </button>
          ))}
        </div>
        
        {/* Advanced Filters */}
        {showAdvancedFilters && (
          <div className="bg-gray-50 dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 rounded-xl p-4 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* All Moments */}
              <div>
                <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2 block">Momento da Missa</label>
                <select
                  value={selectedMoment}
                  onChange={(e) => setSelectedMoment(e.target.value)}
                  className="w-full bg-white dark:bg-neutral-700 border border-gray-200 dark:border-neutral-600 rounded-lg px-3 py-2 text-sm text-neutral-700 dark:text-neutral-300"
                >
                  {moments.map(moment => (
                    <option key={moment.value} value={moment.value}>{moment.label}</option>
                  ))}
                </select>
              </div>
              
              {/* Tone Filter */}
              <div>
                <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2 block">Tom Musical</label>
                <select
                  value={selectedTone}
                  onChange={(e) => setSelectedTone(e.target.value)}
                  className="w-full bg-white dark:bg-neutral-700 border border-gray-200 dark:border-neutral-600 rounded-lg px-3 py-2 text-sm text-neutral-700 dark:text-neutral-300"
                >
                  {tones.map(tone => (
                    <option key={tone.value} value={tone.value}>{tone.label}</option>
                  ))}
                </select>
              </div>
              
              {/* Artist Filter */}
              <div>
                <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2 block">Artista</label>
                <select
                  value={selectedArtist}
                  onChange={(e) => setSelectedArtist(e.target.value)}
                  className="w-full bg-white dark:bg-neutral-700 border border-gray-200 dark:border-neutral-600 rounded-lg px-3 py-2 text-sm text-neutral-700 dark:text-neutral-300"
                >
                  {artists.map(artist => (
                    <option key={artist.value} value={artist.value}>{artist.label}</option>
                  ))}
                </select>
              </div>
            </div>
            
            {/* Clear Filters */}
            <div className="flex justify-end">
              <button
                onClick={() => {
                  setSelectedMoment('todos');
                  setSelectedTone('todos');
                  setSelectedArtist('todos');
                }}
                className="px-4 py-2 text-sm text-neutral-600 dark:text-neutral-400 hover:text-neutral-800 dark:hover:text-neutral-200 transition-colors"
              >
                Limpar filtros
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Results */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <p className="text-sm text-neutral-600 dark:text-neutral-400">
            {filteredSongs.length} {filteredSongs.length === 1 ? 'música encontrada' : 'músicas encontradas'}
          </p>
          {filteredSongs.length > 0 && (
            <div className="flex items-center gap-2 text-xs text-neutral-500 dark:text-neutral-400">
              <TrendingUp size={14} />
              <span>Ordenado por {sortOptions.find(opt => opt.value === sortBy)?.label}</span>
            </div>
          )}
        </div>
        
        {/* Empty State */}
        {filteredSongs.length === 0 && searchQuery && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 dark:bg-neutral-700 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="text-gray-400 dark:text-neutral-500" size={24} />
            </div>
            <h3 className="text-lg font-medium text-neutral-700 dark:text-neutral-100 mb-2">
              Nenhuma música encontrada
            </h3>
            <p className="text-neutral-600 dark:text-neutral-400 mb-4">
              Tente buscar por outros termos ou ajustar os filtros
            </p>
            <div className="flex justify-center gap-2">
              <button
                onClick={clearSearch}
                className="px-4 py-2 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-colors text-sm"
              >
                Limpar busca
              </button>
              <button
                onClick={() => {
                  setSelectedMoment('todos');
                  setSelectedTone('todos');
                  setSelectedArtist('todos');
                }}
                className="px-4 py-2 bg-gray-100 dark:bg-neutral-700 text-neutral-700 dark:text-neutral-300 rounded-xl hover:bg-gray-200 dark:hover:bg-neutral-600 transition-colors text-sm"
              >
                Remover filtros
              </button>
            </div>
          </div>
        )}
        
        {filteredSongs.map((song) => (
          <Card key={song.id} hover>
            <div className="space-y-3">
              {/* Header com título e tom */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <Music className="text-pink-600 dark:text-pink-400 flex-shrink-0" size={20} />
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-semibold text-neutral-700 dark:text-neutral-100 truncate">{song.title}</h3>
                    <p className="text-neutral-600 dark:text-neutral-400 truncate">{song.artist}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <span className="text-xs bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400 px-2 py-1 rounded-lg font-medium">
                    {song.tone}
                  </span>
                  <FavoriteButton
                    isFavorite={isFavorite(song.id)}
                    onClick={() => toggleFavorite(song.id)}
                    size="sm"
                  />
                </div>
              </div>
              
              {/* Informações secundárias */}
              <div className="space-y-2">
                <div className="flex items-center gap-1 text-sm text-neutral-500 dark:text-neutral-400">
                  <Clock size={14} className="flex-shrink-0" />
                  <span className="truncate">{song.moments.join(', ')}</span>
                </div>
                <div className="flex items-start gap-1">
                  <Tag size={14} className="text-neutral-500 dark:text-neutral-400 flex-shrink-0 mt-0.5" />
                  <div className="flex gap-1 flex-wrap">
                    {song.tags.map((tag) => (
                      <span key={tag} className="text-xs bg-neutral-100 dark:bg-neutral-700 text-neutral-700 dark:text-neutral-300 px-2 py-1 rounded-lg">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              
              {/* Ações */}
              <div className="pt-2 border-t border-neutral-100 dark:border-neutral-700 flex items-center justify-between">
                <button 
                  onClick={() => setSelectedSong(song)}
                  className="text-sm text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-medium transition-colors"
                >
                  Ver cifra →
                </button>
                <button className="flex items-center gap-1 px-3 py-1.5 bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400 rounded-lg hover:bg-primary-200 dark:hover:bg-primary-900/50 transition-colors text-sm">
                  <Play size={14} />
                  Reproduzir
                </button>
              </div>
            </div>
          </Card>
        ))}
      </div>
      
      {/* Chord Modal */}
      {selectedSong && (
        <ChordModal
          isOpen={!!selectedSong}
          onClose={() => setSelectedSong(null)}
          song={selectedSong}
          isFavorite={isFavorite(selectedSong.id)}
          onToggleFavorite={toggleFavorite}
        />
      )}
    </div>
  );
}