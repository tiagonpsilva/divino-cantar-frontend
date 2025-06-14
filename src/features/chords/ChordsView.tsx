import { useState, useEffect } from 'react';
import { FileText, ChevronUp, ChevronDown, Play, Share2, Download, RotateCcw } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/Card';
import { transposeChordLine, getSemitonesFromKeys, shouldUseFlats } from '../../utils/chordTransposer';

export function ChordsView() {
  const [selectedTone, setSelectedTone] = useState('C');
  const [fontSize, setFontSize] = useState('base');
  const [currentSemitones, setCurrentSemitones] = useState(0);

  const tones = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
  const fontSizes = [
    { value: 'sm', label: 'Pequeno' },
    { value: 'base', label: 'Médio' },
    { value: 'lg', label: 'Grande' },
  ];

  const originalSong = {
    title: 'Acolhe Senhor',
    artist: 'Ministério Amor e Adoração',
    tone: 'C',
    lyrics: [
      { text: 'Acolhe Senhor, com bondade', chord: 'C  G  Am  F' },
      { text: 'As ofertas de teu povo em oração', chord: 'C  G  C' },
      { text: 'Que te sejam agradáveis', chord: 'F  C  G  Am' },
      { text: 'E nos tragam salvação', chord: 'F  G  C' },
    ]
  };

  const [songExample, setSongExample] = useState(originalSong);

  useEffect(() => {
    const semitones = getSemitonesFromKeys('C', selectedTone);
    setCurrentSemitones(semitones);
    
    if (semitones === 0) {
      setSongExample(originalSong);
    } else {
      const useFlats = shouldUseFlats(selectedTone);
      const transposedLyrics = originalSong.lyrics.map(line => ({
        ...line,
        chord: transposeChordLine(line.chord, semitones, useFlats)
      }));
      
      setSongExample({
        ...originalSong,
        tone: selectedTone,
        lyrics: transposedLyrics
      });
    }
  }, [selectedTone]);

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
    setSelectedTone('C');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-neutral-700 dark:text-neutral-100 mb-2">
            Cifras
          </h1>
          <p className="text-neutral-600 dark:text-neutral-400">
            Visualize e edite cifras com transposição automática
          </p>
        </div>
      </div>

      {/* Song Card */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="text-2xl">{songExample.title}</CardTitle>
              <p className="text-neutral-600 dark:text-neutral-400 mt-1">{songExample.artist}</p>
            </div>
            <div className="flex gap-2">
              <button className="p-2 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 hover:bg-neutral-100 dark:hover:bg-neutral-700 rounded-xl transition-colors">
                <Play size={20} />
              </button>
              <button className="p-2 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 hover:bg-neutral-100 dark:hover:bg-neutral-700 rounded-xl transition-colors">
                <Share2 size={20} />
              </button>
              <button className="p-2 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 hover:bg-neutral-100 dark:hover:bg-neutral-700 rounded-xl transition-colors">
                <Download size={20} />
              </button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Controls */}
          <div className="flex flex-wrap gap-4 mb-6 pb-6 border-b border-neutral-200 dark:border-neutral-700">
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                Tom: {currentSemitones !== 0 && (
                  <span className="text-xs text-neutral-500 dark:text-neutral-400 ml-1">
                    (Original: C, {currentSemitones > 0 ? '+' : ''}{currentSemitones} semitons)
                  </span>
                )}
              </span>
              <div className="flex items-center gap-1">
                <button 
                  onClick={transposeDown}
                  className="p-1 hover:bg-neutral-100 dark:hover:bg-neutral-700 rounded-lg transition-colors text-neutral-600 dark:text-neutral-400"
                  title="Transpor para baixo"
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
                  title="Transpor para cima"
                >
                  <ChevronUp size={18} />
                </button>
                {currentSemitones !== 0 && (
                  <button 
                    onClick={resetTone}
                    className="p-1 ml-2 hover:bg-neutral-100 dark:hover:bg-neutral-700 rounded-lg transition-colors text-orange-600 dark:text-orange-400"
                    title="Voltar ao tom original (C)"
                  >
                    <RotateCcw size={16} />
                  </button>
                )}
              </div>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300">Tamanho:</span>
              <div className="flex gap-1">
                {fontSizes.map(size => (
                  <button
                    key={size.value}
                    onClick={() => setFontSize(size.value)}
                    className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                      fontSize === size.value
                        ? 'bg-primary-600 text-white'
                        : 'bg-neutral-100 dark:bg-neutral-700 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-600'
                    }`}
                  >
                    {size.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Lyrics with Chords */}
          <div className={`space-y-4 font-mono text-${fontSize}`}>
            {songExample.lyrics.map((line, index) => (
              <div key={index} className="space-y-1">
                <div className="text-primary-600 dark:text-primary-400 font-bold">{line.chord}</div>
                <div className="text-neutral-700 dark:text-neutral-100">{line.text}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Chords */}
      <div>
        <h2 className="text-xl font-semibold text-neutral-700 dark:text-neutral-100 mb-4">Cifras Recentes</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <Card key={i} hover className="cursor-pointer">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 rounded-xl">
                  <FileText size={20} />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-neutral-700 dark:text-neutral-100">Vem, Senhor Jesus</h3>
                  <p className="text-sm text-neutral-600 dark:text-neutral-400">Comunidade Canção Nova</p>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">Tom: D</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}