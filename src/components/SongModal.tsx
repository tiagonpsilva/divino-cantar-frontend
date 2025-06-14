import { useState } from 'react';
import { X, Music, Tag, Volume2 } from 'lucide-react';
import { cn } from '../lib/utils';
import { MassMoment } from '../types';

interface SongModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (song: SongData) => void;
  song?: SongData;
}

interface SongData {
  id?: string;
  title: string;
  artist: string;
  tone: string;
  moments: MassMoment[];
  tags: string[];
  lyrics?: string;
  chords?: string;
}

const availableMoments: { value: MassMoment; label: string }[] = [
  { value: 'entrada', label: 'Entrada' },
  { value: 'perdao', label: 'Perdão' },
  { value: 'gloria', label: 'Glória' },
  { value: 'salmo', label: 'Salmo' },
  { value: 'aclamacao', label: 'Aclamação' },
  { value: 'ofertorio', label: 'Ofertório' },
  { value: 'santo', label: 'Santo' },
  { value: 'cordeiro', label: 'Cordeiro' },
  { value: 'comunhao', label: 'Comunhão' },
  { value: 'acao_gracas', label: 'Ação de Graças' },
  { value: 'final', label: 'Final' },
  { value: 'quaresma', label: 'Quaresma' },
  { value: 'natal', label: 'Natal' },
  { value: 'especial', label: 'Especial' }
];

const availableTones = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

const commonTags = ['Tradicional', 'Contemporâneo', 'Gregoriano', 'Popular', 'Jovem', 'Infantil', 'Mariano', 'Adoração'];

export function SongModal({ isOpen, onClose, onSave, song }: SongModalProps) {
  const [formData, setFormData] = useState<SongData>({
    title: song?.title || '',
    artist: song?.artist || '',
    tone: song?.tone || 'C',
    moments: song?.moments || [],
    tags: song?.tags || [],
    lyrics: song?.lyrics || '',
    chords: song?.chords || ''
  });

  const [newTag, setNewTag] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.title && formData.artist) {
      onSave(formData);
      onClose();
    }
  };

  const toggleMoment = (moment: MassMoment) => {
    setFormData(prev => ({
      ...prev,
      moments: prev.moments.includes(moment)
        ? prev.moments.filter(m => m !== moment)
        : [...prev.moments, moment]
    }));
  };

  const addTag = (tag: string) => {
    if (tag && !formData.tags.includes(tag)) {
      setFormData(prev => ({ ...prev, tags: [...prev.tags, tag] }));
    }
    setNewTag('');
  };

  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-neutral-800 rounded-2xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-neutral-200 dark:border-neutral-700">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 rounded-xl">
              <Music size={24} />
            </div>
            <h2 className="text-2xl font-bold text-neutral-700 dark:text-neutral-100">
              {song ? 'Editar Música' : 'Nova Música'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-neutral-100 dark:hover:bg-neutral-700 rounded-xl transition-colors"
          >
            <X size={24} className="text-neutral-600 dark:text-neutral-400" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left Column */}
            <div className="space-y-6">
              {/* Basic Info */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-neutral-700 dark:text-neutral-100 flex items-center gap-2">
                  <Music size={20} />
                  Informações Básicas
                </h3>
                
                <div>
                  <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                    Título da Música *
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    className="w-full px-4 py-3 bg-neutral-50 dark:bg-neutral-700 border border-neutral-200 dark:border-neutral-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 text-neutral-700 dark:text-neutral-100"
                    placeholder="Ex: Acolhe Senhor"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                    Artista/Compositor *
                  </label>
                  <input
                    type="text"
                    value={formData.artist}
                    onChange={(e) => setFormData(prev => ({ ...prev, artist: e.target.value }))}
                    className="w-full px-4 py-3 bg-neutral-50 dark:bg-neutral-700 border border-neutral-200 dark:border-neutral-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 text-neutral-700 dark:text-neutral-100"
                    placeholder="Ex: Ministério Amor e Adoração"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                    Tom
                  </label>
                  <select
                    value={formData.tone}
                    onChange={(e) => setFormData(prev => ({ ...prev, tone: e.target.value }))}
                    className="w-full px-4 py-3 bg-neutral-50 dark:bg-neutral-700 border border-neutral-200 dark:border-neutral-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 text-neutral-700 dark:text-neutral-100"
                  >
                    {availableTones.map(tone => (
                      <option key={tone} value={tone}>{tone}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Moments */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-neutral-700 dark:text-neutral-100">
                  Momentos da Missa
                </h3>
                <div className="grid grid-cols-2 gap-2">
                  {availableMoments.map(moment => (
                    <label key={moment.value} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.moments.includes(moment.value)}
                        onChange={() => toggleMoment(moment.value)}
                        className="w-4 h-4 text-primary-600 bg-white dark:bg-neutral-700 border-neutral-300 dark:border-neutral-600 rounded focus:ring-primary-500"
                      />
                      <span className="text-sm text-neutral-700 dark:text-neutral-300">{moment.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Tags */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-neutral-700 dark:text-neutral-100 flex items-center gap-2">
                  <Tag size={20} />
                  Tags
                </h3>
                
                <div className="flex flex-wrap gap-2 mb-3">
                  {formData.tags.map(tag => (
                    <span
                      key={tag}
                      className="inline-flex items-center gap-1 px-3 py-1 bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 rounded-lg text-sm"
                    >
                      {tag}
                      <button
                        type="button"
                        onClick={() => removeTag(tag)}
                        className="hover:text-primary-900 dark:hover:text-primary-100"
                      >
                        <X size={14} />
                      </button>
                    </span>
                  ))}
                </div>

                <div className="flex gap-2 flex-wrap">
                  {commonTags.filter(tag => !formData.tags.includes(tag)).map(tag => (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => addTag(tag)}
                      className="px-3 py-1 bg-neutral-100 dark:bg-neutral-700 text-neutral-700 dark:text-neutral-300 rounded-lg text-sm hover:bg-neutral-200 dark:hover:bg-neutral-600 transition-colors"
                    >
                      + {tag}
                    </button>
                  ))}
                </div>

                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    placeholder="Tag personalizada"
                    className="flex-1 px-3 py-2 bg-neutral-50 dark:bg-neutral-700 border border-neutral-200 dark:border-neutral-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-neutral-700 dark:text-neutral-100 text-sm"
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag(newTag))}
                  />
                  <button
                    type="button"
                    onClick={() => addTag(newTag)}
                    className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors text-sm"
                  >
                    Adicionar
                  </button>
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              {/* Lyrics */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-neutral-700 dark:text-neutral-100 flex items-center gap-2">
                  <Volume2 size={20} />
                  Letra
                </h3>
                <textarea
                  value={formData.lyrics}
                  onChange={(e) => setFormData(prev => ({ ...prev, lyrics: e.target.value }))}
                  placeholder="Cole aqui a letra da música..."
                  className="w-full h-48 px-4 py-3 bg-neutral-50 dark:bg-neutral-700 border border-neutral-200 dark:border-neutral-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 text-neutral-700 dark:text-neutral-100 resize-none"
                />
              </div>

              {/* Chords */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-neutral-700 dark:text-neutral-100">
                  Cifra (Acordes)
                </h3>
                <textarea
                  value={formData.chords}
                  onChange={(e) => setFormData(prev => ({ ...prev, chords: e.target.value }))}
                  placeholder="Cole aqui a cifra com os acordes..."
                  className="w-full h-48 px-4 py-3 bg-neutral-50 dark:bg-neutral-700 border border-neutral-200 dark:border-neutral-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 text-neutral-700 dark:text-neutral-100 font-mono text-sm resize-none"
                />
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 mt-8 pt-6 border-t border-neutral-200 dark:border-neutral-700">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 bg-neutral-100 dark:bg-neutral-700 text-neutral-700 dark:text-neutral-300 rounded-xl hover:bg-neutral-200 dark:hover:bg-neutral-600 transition-colors font-medium"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={!formData.title || !formData.artist}
              className={cn(
                "flex-1 px-6 py-3 rounded-xl font-medium transition-colors",
                formData.title && formData.artist
                  ? "bg-primary-600 hover:bg-primary-700 text-white"
                  : "bg-neutral-300 dark:bg-neutral-600 text-neutral-500 dark:text-neutral-400 cursor-not-allowed"
              )}
            >
              {song ? 'Salvar Alterações' : 'Adicionar Música'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}