import { useState } from 'react';
import { X, Play, Pause, Share2, Music, User, Tag, Clock, FileText, RotateCcw, ChevronUp, ChevronDown, Guitar, Piano } from 'lucide-react';
import { cn } from '../lib/utils';
import { FavoriteButton } from './FavoriteButton';
import { transposeChordLine, getSemitonesFromKeys, shouldUseFlats } from '../utils/chordTransposer';
import { ChordModal } from './ChordModal';

interface Song {
  id: string;
  title: string;
  artist: string;
  tone: string;
  moments: string[];
  tags: string[];
  lyrics?: string;
  chords?: string;
}

interface SongDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  song: Song;
  onToggleFavorite: (songId: string) => void;
  isFavorite: boolean;
}

const tones = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

const instruments = [
  { value: 'violao', label: 'Violão', icon: Guitar },
  { value: 'teclado', label: 'Teclado', icon: Piano },
];

export function SongDetailModal({ isOpen, onClose, song, onToggleFavorite, isFavorite }: SongDetailModalProps) {
  const [activeTab, setActiveTab] = useState<'lyrics' | 'chords'>('lyrics');
  const [isPlaying, setIsPlaying] = useState(false);
  const [selectedTone, setSelectedTone] = useState(song.tone);
  const [fontSize, setFontSize] = useState('base');
  const [showChordModal, setShowChordModal] = useState(false);
  const [selectedInstrument, setSelectedInstrument] = useState('violao');

  if (!isOpen) return null;

  const currentSemitones = getSemitonesFromKeys(song.tone, selectedTone);
  const useFlats = shouldUseFlats(selectedTone);

  const transposeUp = () => {
    const currentIndex = tones.indexOf(selectedTone);
    const newIndex = (currentIndex + 1) % tones.length;
    setSelectedTone(tones[newIndex]);
  };

  const transposeDown = () => {
    const currentIndex = tones.indexOf(selectedTone);
    const newIndex = (currentIndex - 1 + tones.length) % tones.length;
    setSelectedTone(tones[newIndex]);
  };

  const resetTone = () => {
    setSelectedTone(song.tone);
  };

  const getTransposedChords = () => {
    if (!song.chords || currentSemitones === 0) return song.chords || '';
    return transposeChordLine(song.chords, currentSemitones, useFlats);
  };

  const togglePlayback = () => {
    setIsPlaying(!isPlaying);
    // Aqui seria implementada a lógica real de reprodução de áudio
  };

  const shareSong = () => {
    const shareText = `🎵 ${song.title}\n👤 ${song.artist}\n🎼 Tom: ${selectedTone}\n📋 Momentos: ${song.moments.join(', ')}\n\n${song.lyrics || 'Letra não disponível'}\n\n📱 Compartilhado via DivinoCantar`;
    
    if (navigator.share) {
      navigator.share({
        title: song.title,
        text: shareText
      });
    } else {
      navigator.clipboard.writeText(shareText);
    }
  };

  const fontSizeClasses = {
    sm: 'text-sm',
    base: 'text-base',
    lg: 'text-lg',
    xl: 'text-xl'
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-neutral-800 rounded-2xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-neutral-200 dark:border-neutral-700 flex-shrink-0">
          <div className="flex items-center gap-4 flex-1">
            <div className="p-3 bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 rounded-xl">
              <Music size={24} />
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-neutral-700 dark:text-neutral-100 mb-1">
                {song.title}
              </h2>
              <div className="flex items-center gap-4 text-sm text-neutral-600 dark:text-neutral-400">
                <div className="flex items-center gap-1">
                  <User size={16} />
                  {song.artist}
                </div>
                <div className="flex items-center gap-1">
                  <Music size={16} />
                  Tom: {selectedTone}
                  {currentSemitones !== 0 && (
                    <span className="text-xs text-neutral-500">
                      (Original: {song.tone})
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-1">
                  <Clock size={16} />
                  {song.moments.join(', ')}
                </div>
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={togglePlayback}
              className={cn(
                'p-3 rounded-xl transition-colors',
                isPlaying
                  ? 'bg-primary-600 text-white hover:bg-primary-700'
                  : 'bg-neutral-100 dark:bg-neutral-700 text-neutral-600 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-600'
              )}
            >
              {isPlaying ? <Pause size={20} /> : <Play size={20} />}
            </button>
            
            <FavoriteButton
              isFavorite={isFavorite}
              onClick={() => onToggleFavorite(song.id)}
              size="lg"
            />

            <button
              onClick={shareSong}
              className="p-3 bg-neutral-100 dark:bg-neutral-700 text-neutral-600 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-600 rounded-xl transition-colors"
            >
              <Share2 size={20} />
            </button>

            <button
              onClick={onClose}
              className="p-3 hover:bg-neutral-100 dark:hover:bg-neutral-700 rounded-xl transition-colors"
            >
              <X size={20} className="text-neutral-600 dark:text-neutral-400" />
            </button>
          </div>
        </div>

        {/* Tabs and Controls */}
        <div className="flex items-center justify-between p-6 border-b border-neutral-200 dark:border-neutral-700 flex-shrink-0">
          {/* Tabs */}
          <div className="flex gap-1 bg-neutral-100 dark:bg-neutral-700 rounded-xl p-1">
            <button
              onClick={() => setActiveTab('lyrics')}
              className={cn(
                'px-4 py-2 rounded-lg font-medium transition-colors',
                activeTab === 'lyrics'
                  ? 'bg-white dark:bg-neutral-600 text-neutral-700 dark:text-neutral-100 shadow-sm'
                  : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-300'
              )}
            >
              <FileText size={16} className="inline mr-2" />
              Letra
            </button>
            <button
              onClick={() => setActiveTab('chords')}
              className={cn(
                'px-4 py-2 rounded-lg font-medium transition-colors',
                activeTab === 'chords'
                  ? 'bg-white dark:bg-neutral-600 text-neutral-700 dark:text-neutral-100 shadow-sm'
                  : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-300'
              )}
            >
              <Music size={16} className="inline mr-2" />
              Cifra
            </button>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-4">
            {/* Transpose controls (only for chords tab) */}
            {activeTab === 'chords' && (
              <div className="flex items-center gap-3">
                <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300">Tom:</span>
                <div className="flex items-center gap-1">
                  <button 
                    onClick={transposeDown}
                    className="p-1 hover:bg-neutral-100 dark:hover:bg-neutral-700 rounded-lg transition-colors text-neutral-600 dark:text-neutral-400"
                  >
                    <ChevronDown size={18} />
                  </button>
                  <select
                    value={selectedTone}
                    onChange={(e) => setSelectedTone(e.target.value)}
                    className="px-3 py-1 bg-neutral-100 dark:bg-neutral-700 text-neutral-700 dark:text-neutral-100 rounded-lg text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    {tones.map(tone => (
                      <option key={tone} value={tone}>{tone}</option>
                    ))}
                  </select>
                  <button 
                    onClick={transposeUp}
                    className="p-1 hover:bg-neutral-100 dark:hover:bg-neutral-700 rounded-lg transition-colors text-neutral-600 dark:text-neutral-400"
                  >
                    <ChevronUp size={18} />
                  </button>
                  {currentSemitones !== 0 && (
                    <button 
                      onClick={resetTone}
                      className="p-1 ml-2 hover:bg-neutral-100 dark:hover:bg-neutral-700 rounded-lg transition-colors text-orange-600 dark:text-orange-400"
                      title="Voltar ao tom original"
                    >
                      <RotateCcw size={16} />
                    </button>
                  )}
                </div>
              </div>
            )}
            
            {/* Instrument selection */}
            {activeTab === 'chords' && (
              <div className="flex items-center gap-3">
                <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300">Instrumento:</span>
                <div className="flex gap-1">
                  {instruments.map(instrument => {
                    const Icon = instrument.icon;
                    return (
                      <button
                        key={instrument.value}
                        onClick={() => setSelectedInstrument(instrument.value)}
                        className={cn(
                          'flex items-center gap-1 px-3 py-1 rounded-lg text-sm font-medium transition-colors',
                          selectedInstrument === instrument.value
                            ? 'bg-primary-600 text-white'
                            : 'bg-neutral-100 dark:bg-neutral-700 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-600'
                        )}
                      >
                        <Icon size={14} />
                        {instrument.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Font size controls */}
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300">Tamanho:</span>
              <div className="flex gap-1">
                {(['sm', 'base', 'lg', 'xl'] as const).map(size => (
                  <button
                    key={size}
                    onClick={() => setFontSize(size)}
                    className={cn(
                      'px-3 py-1 rounded-lg text-sm font-medium transition-colors',
                      fontSize === size
                        ? 'bg-primary-600 text-white'
                        : 'bg-neutral-100 dark:bg-neutral-700 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-600'
                    )}
                  >
                    {size === 'sm' ? 'P' : size === 'base' ? 'M' : size === 'lg' ? 'G' : 'XG'}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {activeTab === 'lyrics' ? (
            <div className={cn('whitespace-pre-wrap', fontSizeClasses[fontSize as keyof typeof fontSizeClasses], 'text-neutral-700 dark:text-neutral-100 leading-relaxed')}>
              {song.lyrics || (
                <div className="text-center text-neutral-500 dark:text-neutral-400 py-12">
                  <FileText size={48} className="mx-auto mb-4 opacity-50" />
                  <p>Letra não disponível para esta música.</p>
                  <p className="text-sm mt-2">Você pode editar a música para adicionar a letra.</p>
                </div>
              )}
            </div>
          ) : (
            <div className={cn('whitespace-pre-wrap font-mono', fontSizeClasses[fontSize as keyof typeof fontSizeClasses])}>
              {getTransposedChords() || song.chords ? (
                <div className="space-y-4">
                  {getTransposedChords()?.split('\n').map((line, index) => (
                    <div key={index} className="space-y-1">
                      {line.trim() && (
                        <>
                          <div className="text-primary-600 dark:text-primary-400 font-bold">{line}</div>
                        </>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center text-neutral-500 dark:text-neutral-400 py-12">
                  <Music size={48} className="mx-auto mb-4 opacity-50" />
                  <p>Cifra não disponível para esta música.</p>
                  <p className="text-sm mt-2">Você pode editar a música para adicionar a cifra.</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Action Button */}
        <div className="flex-shrink-0 p-6 border-t border-gray-200 dark:border-neutral-700">
          <button
            onClick={() => setShowChordModal(true)}
            className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-colors font-medium"
          >
            <Music size={20} />
            Ver Cifra Completa
          </button>
        </div>
        
        {/* Tags */}
        {song.tags.length > 0 && (
          <div className="flex-shrink-0 p-6 pt-0">
            <div className="flex items-center gap-2 flex-wrap">
              <Tag size={16} className="text-neutral-500 dark:text-neutral-400" />
              {song.tags.map(tag => (
                <span
                  key={tag}
                  className="px-3 py-1 bg-neutral-100 dark:bg-neutral-700 text-neutral-700 dark:text-neutral-300 rounded-lg text-sm"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
      
      {/* Chord Modal */}
      {showChordModal && (
        <ChordModal
          isOpen={showChordModal}
          onClose={() => setShowChordModal(false)}
          song={song}
          isFavorite={isFavorite}
          onToggleFavorite={onToggleFavorite}
        />
      )}
    </div>
  );
}