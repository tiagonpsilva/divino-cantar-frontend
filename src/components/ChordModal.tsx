import { useState } from 'react';
import { X, Music, Plus, Minus, Download, Share2, Heart, Play, Pause, Guitar, Piano } from 'lucide-react';
import { cn } from '../lib/utils';

interface Song {
  id: string;
  title: string;
  artist: string;
  lyrics: string;
  chords: string;
  tone: string;
  tags: string[];
  moments: string[];
}

interface ChordModalProps {
  isOpen: boolean;
  onClose: () => void;
  song: Song;
  isFavorite?: boolean;
  onToggleFavorite?: (songId: string) => void;
}

const instruments = [
  { value: 'violao', label: 'Violão', icon: Guitar },
  { value: 'teclado', label: 'Teclado', icon: Piano },
];

export function ChordModal({ isOpen, onClose, song, isFavorite = false, onToggleFavorite }: ChordModalProps) {
  const [fontSize, setFontSize] = useState(16);
  const [transposition, setTransposition] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showChords, setShowChords] = useState(true);
  const [selectedInstrument, setSelectedInstrument] = useState('violao');

  if (!isOpen) return null;

  // Simulação de transposição simples
  const transposeChord = (chord: string, semitones: number) => {
    const notes = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
    const chordPattern = /([A-G][#b]?)(.*)/;
    const match = chord.match(chordPattern);
    
    if (!match) return chord;
    
    const [, note, suffix] = match;
    let noteIndex = notes.indexOf(note.replace('b', '#'));
    
    if (noteIndex === -1) return chord;
    
    noteIndex = (noteIndex + semitones + 12) % 12;
    return notes[noteIndex] + suffix;
  };

  const getTransposedTone = () => {
    return transposeChord(song.tone, transposition);
  };

  const formatChordsForInstrument = (chord: string, instrument: string) => {
    // Simulação de formatação específica por instrumento
    const transposedChord = transposeChord(chord, transposition);
    
    if (instrument === 'teclado') {
      // Para teclado, mostrar acordes com inversões simples
      const chordMap: Record<string, string> = {
        'C': 'C (Dó-Mi-Sol)',
        'D': 'D (Ré-F#-Lá)',
        'E': 'E (Mi-G#-Si)',
        'F': 'F (Fá-Lá-Dó)',
        'G': 'G (Sol-Si-Ré)',
        'A': 'A (Lá-C#-Mi)',
        'B': 'B (Si-D#-F#)',
        'Am': 'Am (Lá-Dó-Mi)',
        'Em': 'Em (Mi-Sol-Si)',
      };
      return chordMap[transposedChord] || transposedChord;
    }
    
    // Para violão, manter formato tradicional
    return transposedChord;
  };
  
  const formatLyricsWithChords = (lyrics: string, chords: string) => {
    // Simulação simples de formatação de cifra
    const lines = lyrics.split('\n');
    const chordArray = chords.split(' ');
    
    return lines.map((line, lineIndex) => {
      if (line.trim() === '') return { type: 'space', content: '' };
      
      // Adiciona acordes de forma simulada
      const hasChords = lineIndex % 2 === 0 && showChords;
      
      return {
        type: 'verse',
        content: line,
        chords: hasChords ? chordArray.slice(0, 2).map(chord => formatChordsForInstrument(chord, selectedInstrument)) : []
      };
    });
  };

  const formattedContent = formatLyricsWithChords(song.lyrics, song.chords);

  const togglePlayback = () => {
    setIsPlaying(!isPlaying);
  };

  const downloadChord = () => {
    const selectedInstr = instruments.find(i => i.value === selectedInstrument);
    const content = `${song.title} - ${song.artist}\nTom: ${getTransposedTone()}\nInstrumento: ${selectedInstr?.label}\n\n${song.lyrics}`;
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${song.title.toLowerCase().replace(/\s+/g, '-')}-${selectedInstrument}-cifra.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-neutral-800 rounded-2xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-neutral-700 bg-gray-50 dark:bg-neutral-800/50">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 rounded-xl">
              <Music size={24} />
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-neutral-700 dark:text-neutral-100">
                {song.title}
              </h2>
              <div className="flex items-center gap-4 mt-1">
                <p className="text-neutral-600 dark:text-neutral-400">
                  {song.artist} • Tom: <span className="font-mono font-semibold text-primary-600 dark:text-primary-400">{getTransposedTone()}</span>
                </p>
                <div className="flex items-center gap-2">
                  {instruments.map(instrument => {
                    const Icon = instrument.icon;
                    return (
                      <button
                        key={instrument.value}
                        onClick={() => setSelectedInstrument(instrument.value)}
                        className={cn(
                          "flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium transition-colors",
                          selectedInstrument === instrument.value
                            ? "bg-primary-600 text-white"
                            : "bg-gray-200 dark:bg-neutral-700 text-neutral-700 dark:text-neutral-300 hover:bg-gray-300 dark:hover:bg-neutral-600"
                        )}
                      >
                        <Icon size={14} />
                        {instrument.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-200 dark:hover:bg-neutral-700 rounded-xl transition-colors"
          >
            <X size={24} className="text-neutral-600 dark:text-neutral-400" />
          </button>
        </div>

        {/* Controls */}
        <div className="p-4 border-b border-gray-200 dark:border-neutral-700 bg-gray-50 dark:bg-neutral-800/50">
          {/* Instrument Indicator */}
          <div className="flex items-center justify-center mb-4">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-white dark:bg-neutral-700 border border-gray-200 dark:border-neutral-600 rounded-lg">
              {(() => {
                const selectedInstr = instruments.find(i => i.value === selectedInstrument);
                const Icon = selectedInstr?.icon || Guitar;
                return (
                  <>
                    <Icon size={16} className="text-primary-600 dark:text-primary-400" />
                    <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                      Cifra para {selectedInstr?.label}
                    </span>
                  </>
                );
              })()} 
            </div>
          </div>
          
          <div className="flex items-center justify-between flex-wrap gap-4">
            {/* Transposition */}
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300">Tom:</span>
              <button
                onClick={() => setTransposition(prev => prev - 1)}
                className="p-1.5 bg-white dark:bg-neutral-700 border border-gray-200 dark:border-neutral-600 rounded-lg hover:bg-gray-100 dark:hover:bg-neutral-600 transition-colors"
              >
                <Minus size={16} />
              </button>
              <span className="font-mono font-semibold text-primary-600 dark:text-primary-400 min-w-[2rem] text-center">
                {getTransposedTone()}
              </span>
              <button
                onClick={() => setTransposition(prev => prev + 1)}
                className="p-1.5 bg-white dark:bg-neutral-700 border border-gray-200 dark:border-neutral-600 rounded-lg hover:bg-gray-100 dark:hover:bg-neutral-600 transition-colors"
              >
                <Plus size={16} />
              </button>
            </div>

            {/* Font Size */}
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300">Fonte:</span>
              <button
                onClick={() => setFontSize(prev => Math.max(12, prev - 2))}
                className="p-1.5 bg-white dark:bg-neutral-700 border border-gray-200 dark:border-neutral-600 rounded-lg hover:bg-gray-100 dark:hover:bg-neutral-600 transition-colors"
              >
                <Minus size={16} />
              </button>
              <span className="font-medium text-neutral-700 dark:text-neutral-300 min-w-[2rem] text-center text-sm">
                {fontSize}px
              </span>
              <button
                onClick={() => setFontSize(prev => Math.min(24, prev + 2))}
                className="p-1.5 bg-white dark:bg-neutral-700 border border-gray-200 dark:border-neutral-600 rounded-lg hover:bg-gray-100 dark:hover:bg-neutral-600 transition-colors"
              >
                <Plus size={16} />
              </button>
            </div>

            {/* Toggle Chords */}
            <button
              onClick={() => setShowChords(!showChords)}
              className={cn(
                "px-3 py-1.5 rounded-lg text-sm font-medium transition-colors",
                showChords
                  ? "bg-primary-600 text-white"
                  : "bg-white dark:bg-neutral-700 border border-gray-200 dark:border-neutral-600 text-neutral-700 dark:text-neutral-300 hover:bg-gray-100 dark:hover:bg-neutral-600"
              )}
            >
              {showChords ? 'Ocultar acordes' : 'Mostrar acordes'}
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="max-w-3xl mx-auto">
            {formattedContent.map((item, index) => (
              <div key={index} className="mb-4">
                {item.type === 'space' ? (
                  <div className="h-4" />
                ) : (
                  <div>
                    {/* Chords line */}
                    {item.chords && item.chords.length > 0 && (
                      <div className="mb-1">
                        {item.chords.map((chord, chordIndex) => (
                          <span
                            key={chordIndex}
                            className="inline-block font-mono font-bold text-primary-600 dark:text-primary-400 mr-8"
                            style={{ fontSize: `${fontSize + 2}px` }}
                          >
                            {chord}
                          </span>
                        ))}
                      </div>
                    )}
                    {/* Lyrics line */}
                    <div
                      className="text-neutral-700 dark:text-neutral-200 leading-relaxed"
                      style={{ fontSize: `${fontSize}px` }}
                    >
                      {item.content}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between p-6 border-t border-gray-200 dark:border-neutral-700 bg-gray-50 dark:bg-neutral-800/50">
          <div className="flex items-center gap-3">
            <button
              onClick={togglePlayback}
              className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-colors"
            >
              {isPlaying ? <Pause size={18} /> : <Play size={18} />}
              {isPlaying ? 'Pausar' : 'Reproduzir'}
            </button>
            
            {onToggleFavorite && (
              <button
                onClick={() => onToggleFavorite(song.id)}
                className={cn(
                  "p-2 rounded-xl transition-colors",
                  isFavorite
                    ? "text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
                    : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-neutral-700"
                )}
              >
                <Heart size={20} className={isFavorite ? "fill-current" : ""} />
              </button>
            )}
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={downloadChord}
              className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-neutral-700 text-neutral-700 dark:text-neutral-300 border border-gray-200 dark:border-neutral-600 rounded-xl hover:bg-gray-100 dark:hover:bg-neutral-600 transition-colors"
            >
              <Download size={18} />
              Download
            </button>
            
            <button className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-neutral-700 text-neutral-700 dark:text-neutral-300 border border-gray-200 dark:border-neutral-600 rounded-xl hover:bg-gray-100 dark:hover:bg-neutral-600 transition-colors">
              <Share2 size={18} />
              Compartilhar
            </button>
            
            <button
              onClick={onClose}
              className="px-6 py-2 bg-gray-200 dark:bg-neutral-600 text-neutral-700 dark:text-neutral-300 rounded-xl hover:bg-gray-300 dark:hover:bg-neutral-500 transition-colors"
            >
              Fechar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}