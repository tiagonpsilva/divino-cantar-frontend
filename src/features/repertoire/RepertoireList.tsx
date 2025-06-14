import { useState } from 'react';
import { Music, Plus, Share2, ChevronRight, Download } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/Card';
import { SongModal } from '../../components/SongModal';
import { ShareModal } from '../../components/ShareModal';
import { SongDetailModal } from '../../components/SongDetailModal';
import { FavoriteButton } from '../../components/FavoriteButton';
import { useFavorites } from '../../hooks/useFavorites';
import { exportRepertoireAsPDF, exportByMoment } from '../../utils/pdfExporter';
import { mockSongs } from '../../data/mock';
import { MassMoment } from '../../types';

const momentLabels: Record<MassMoment, string> = {
  entrada: 'Entrada',
  perdao: 'Perdão',
  gloria: 'Glória',
  salmo: 'Salmo',
  aclamacao: 'Aclamação',
  ofertorio: 'Ofertório',
  santo: 'Santo',
  cordeiro: 'Cordeiro',
  comunhao: 'Comunhão',
  acao_gracas: 'Ação de Graças',
  final: 'Final',
  quaresma: 'Quaresma',
  natal: 'Natal',
  especial: 'Especial'
};

const momentColors: Record<MassMoment, { bg: string; text: string }> = {
  entrada: { bg: 'bg-blue-100 dark:bg-blue-900/30', text: 'text-blue-700 dark:text-blue-300' },
  perdao: { bg: 'bg-purple-100 dark:bg-purple-900/30', text: 'text-purple-700 dark:text-purple-300' },
  gloria: { bg: 'bg-yellow-100 dark:bg-yellow-900/30', text: 'text-yellow-700 dark:text-yellow-300' },
  salmo: { bg: 'bg-green-100 dark:bg-green-900/30', text: 'text-green-700 dark:text-green-300' },
  aclamacao: { bg: 'bg-pink-100 dark:bg-pink-900/30', text: 'text-pink-700 dark:text-pink-300' },
  ofertorio: { bg: 'bg-indigo-100 dark:bg-indigo-900/30', text: 'text-indigo-700 dark:text-indigo-300' },
  santo: { bg: 'bg-orange-100 dark:bg-orange-900/30', text: 'text-orange-700 dark:text-orange-300' },
  cordeiro: { bg: 'bg-red-100 dark:bg-red-900/30', text: 'text-red-700 dark:text-red-300' },
  comunhao: { bg: 'bg-teal-100 dark:bg-teal-900/30', text: 'text-teal-700 dark:text-teal-300' },
  acao_gracas: { bg: 'bg-cyan-100 dark:bg-cyan-900/30', text: 'text-cyan-700 dark:text-cyan-300' },
  final: { bg: 'bg-gray-100 dark:bg-gray-700', text: 'text-gray-700 dark:text-gray-300' },
  quaresma: { bg: 'bg-purple-100 dark:bg-purple-900/30', text: 'text-purple-700 dark:text-purple-300' },
  natal: { bg: 'bg-red-100 dark:bg-red-900/30', text: 'text-red-700 dark:text-red-300' },
  especial: { bg: 'bg-amber-100 dark:bg-amber-900/30', text: 'text-amber-700 dark:text-amber-300' }
};

export function RepertoireList() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [selectedSong, setSelectedSong] = useState<any>(null);
  const [songs, setSongs] = useState(mockSongs);
  const { toggleFavorite, isFavorite } = useFavorites();

  const songsByMoment = songs.reduce((acc, song) => {
    song.moments.forEach(moment => {
      if (!acc[moment]) acc[moment] = [];
      acc[moment].push(song);
    });
    return acc;
  }, {} as Record<MassMoment, typeof mockSongs>);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-neutral-700 dark:text-neutral-100 mb-2">
            Repertório Musical
          </h1>
          <p className="text-neutral-600">
            Organize suas músicas por momento da celebração
          </p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={() => exportRepertoireAsPDF(songs, 'repertorio-completo.pdf')}
            className="flex items-center gap-2 px-4 py-2 bg-neutral-100 dark:bg-neutral-700 text-neutral-700 dark:text-neutral-300 rounded-xl hover:bg-neutral-200 dark:hover:bg-neutral-600 transition-colors"
          >
            <Download size={20} />
            Exportar PDF
          </button>
          <button 
            onClick={() => setIsShareModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-neutral-100 dark:bg-neutral-700 text-neutral-700 dark:text-neutral-300 rounded-xl hover:bg-neutral-200 dark:hover:bg-neutral-600 transition-colors"
          >
            <Share2 size={20} />
            Compartilhar
          </button>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-colors"
          >
            <Plus size={20} />
            Nova Música
          </button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="text-center">
          <p className="text-3xl font-bold text-neutral-700 dark:text-neutral-100">{mockSongs.length}</p>
          <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">Total de músicas</p>
        </Card>
        <Card className="text-center">
          <p className="text-3xl font-bold text-primary-600 dark:text-primary-400">{Object.keys(songsByMoment).length}</p>
          <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">Momentos cobertos</p>
        </Card>
        <Card className="text-center">
          <p className="text-3xl font-bold text-green-600 dark:text-green-400">5</p>
          <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">Tons diferentes</p>
        </Card>
        <Card className="text-center">
          <p className="text-3xl font-bold text-purple-600 dark:text-purple-400">3</p>
          <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">Artistas</p>
        </Card>
      </div>

      {/* Songs by Moment */}
      <div className="space-y-4">
        {Object.entries(songsByMoment).map(([moment, songs]) => {
          const color = momentColors[moment as MassMoment];
          return (
            <Card key={moment} className="overflow-hidden">
              <div className={`h-1 ${color.bg}`} />
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-xl ${color.bg}`}>
                      <Music size={20} className={color.text} />
                    </div>
                    <CardTitle>{momentLabels[moment as MassMoment]}</CardTitle>
                    <span className="text-sm text-neutral-500">{songs.length} músicas</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        exportByMoment(mockSongs, moment, {
                          title: `Repertório - ${momentLabels[moment as MassMoment]}`,
                          subtitle: `${songs.length} músicas • DivinoCantar`
                        });
                      }}
                      className="p-2 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-600 rounded-lg transition-colors"
                      title="Exportar este momento em PDF"
                    >
                      <Download size={16} />
                    </button>
                    <ChevronRight className="text-neutral-400" size={20} />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {songs.map((song) => (
                    <div 
                      key={song.id} 
                      className="flex items-center justify-between p-3 rounded-xl bg-neutral-50 dark:bg-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-600 cursor-pointer transition-colors group"
                      onClick={() => setSelectedSong(song)}
                    >
                      <div className="flex-1">
                        <h5 className="font-medium text-neutral-700 dark:text-neutral-100">{song.title}</h5>
                        <p className="text-sm text-neutral-600 dark:text-neutral-400">{song.artist}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <FavoriteButton
                          isFavorite={isFavorite(song.id)}
                          onClick={() => toggleFavorite(song.id)}
                          size="sm"
                        />
                        <span className="text-xs bg-white dark:bg-neutral-600 text-neutral-700 dark:text-neutral-300 px-2 py-1 rounded-lg border border-neutral-200 dark:border-neutral-500">
                          Tom: {song.tone}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Song Modal */}
      <SongModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={(newSong) => {
          const song = {
            ...newSong,
            id: String(Date.now()),
            createdAt: new Date(),
            updatedAt: new Date()
          };
          setSongs(prev => [...prev, song]);
          setIsModalOpen(false);
        }}
      />

      {/* Share Modal */}
      <ShareModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        songs={songs}
        title="Repertório Musical Completo"
        type="repertoire"
      />

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