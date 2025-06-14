import { useState } from 'react';
import { Search, Filter, Music, Clock, Tag } from 'lucide-react';
import { Card } from '../../components/Card';
import { FavoriteButton } from '../../components/FavoriteButton';
import { useFavorites } from '../../hooks/useFavorites';
import { mockSongs } from '../../data/mock';

export function SearchView() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMoment, setSelectedMoment] = useState('todos');
  const { toggleFavorite, isFavorite } = useFavorites();

  const moments = [
    { value: 'todos', label: 'Todos os momentos' },
    { value: 'entrada', label: 'Entrada' },
    { value: 'ofertorio', label: 'Ofertório' },
    { value: 'comunhao', label: 'Comunhão' },
    { value: 'final', label: 'Final' },
  ];

  const filteredSongs = mockSongs.filter(song => {
    const matchesQuery = song.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        song.artist?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesMoment = selectedMoment === 'todos' || song.moments.includes(selectedMoment as any);
    return matchesQuery && matchesMoment;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-neutral-700 dark:text-neutral-100 mb-2">
          Buscar Músicas
        </h1>
        <p className="text-neutral-600 dark:text-neutral-400">
          Encontre a música perfeita para cada momento da celebração
        </p>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-neutral-400 dark:text-neutral-500" size={20} />
        <input
          type="text"
          placeholder="Buscar por título, artista ou letra..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-12 pr-4 py-4 bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-neutral-700 dark:text-neutral-100 placeholder-neutral-500 dark:placeholder-neutral-400"
        />
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4 flex-wrap">
        <div className="flex items-center gap-2">
          <Filter className="text-neutral-600 dark:text-neutral-400" size={20} />
          <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300">Filtrar por:</span>
        </div>
        <div className="flex gap-2 flex-wrap">
          {moments.map((moment) => (
            <button
              key={moment.value}
              onClick={() => setSelectedMoment(moment.value)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                selectedMoment === moment.value
                  ? 'bg-primary-600 text-white'
                  : 'bg-neutral-100 dark:bg-neutral-700 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-600'
              }`}
            >
              {moment.label}
            </button>
          ))}
        </div>
      </div>

      {/* Results */}
      <div className="space-y-4">
        <p className="text-sm text-neutral-600 dark:text-neutral-400">
          {filteredSongs.length} músicas encontradas
        </p>
        
        {filteredSongs.map((song) => (
          <Card key={song.id} hover>
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <Music className="text-pink-600 dark:text-pink-400" size={20} />
                  <h3 className="text-lg font-semibold text-neutral-700 dark:text-neutral-100">{song.title}</h3>
                </div>
                <p className="text-neutral-600 dark:text-neutral-400 mb-3">{song.artist}</p>
                
                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-1 text-neutral-500 dark:text-neutral-400">
                    <Clock size={16} />
                    <span>{song.moments.join(', ')}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Tag size={16} className="text-neutral-500 dark:text-neutral-400" />
                    <div className="flex gap-2">
                      {song.tags.map((tag) => (
                        <span key={tag} className="text-xs bg-neutral-100 dark:bg-neutral-700 text-neutral-700 dark:text-neutral-300 px-2 py-1 rounded-lg">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col items-end gap-2">
                <div className="flex items-center gap-2">
                  <FavoriteButton
                    isFavorite={isFavorite(song.id)}
                    onClick={() => toggleFavorite(song.id)}
                    size="sm"
                  />
                  <span className="text-sm bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400 px-3 py-1 rounded-lg font-medium">
                    Tom: {song.tone}
                  </span>
                </div>
                <button className="text-sm text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-medium">
                  Ver cifra →
                </button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}