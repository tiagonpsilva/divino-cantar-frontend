import { Calendar, BookOpen, Palette } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/Card';
import { mockLiturgy } from '../../data/mock';
import { cn } from '../../lib/utils';

export function LiturgyView() {
  const liturgy = mockLiturgy;
  const today = new Date().toLocaleDateString('pt-BR', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const liturgicalColorMap = {
    verde: { bg: 'bg-green-100 dark:bg-green-900/30', text: 'text-green-700 dark:text-green-300', label: 'Verde' },
    roxo: { bg: 'bg-purple-100 dark:bg-purple-900/30', text: 'text-purple-700 dark:text-purple-300', label: 'Roxo' },
    branco: { bg: 'bg-neutral-100 dark:bg-neutral-700', text: 'text-neutral-700 dark:text-neutral-300', label: 'Branco' },
    vermelho: { bg: 'bg-red-100 dark:bg-red-900/30', text: 'text-red-700 dark:text-red-300', label: 'Vermelho' },
    rosa: { bg: 'bg-pink-100 dark:bg-pink-900/30', text: 'text-pink-700 dark:text-pink-300', label: 'Rosa' }
  };

  const color = liturgy.liturgicalColor ? liturgicalColorMap[liturgy.liturgicalColor] : null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-neutral-700 dark:text-neutral-100 mb-2">
          Liturgia do Dia
        </h1>
        <p className="text-neutral-600 capitalize">{today}</p>
      </div>

      {/* Celebration Card */}
      <Card className="overflow-hidden">
        <div className={cn('h-2', color?.bg || 'bg-neutral-200')} />
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl">{liturgy.celebration}</CardTitle>
              {color && (
                <div className="flex items-center gap-2 mt-2">
                  <Palette size={16} className={color.text} />
                  <span className={cn('text-sm font-medium', color.text)}>
                    Cor litúrgica: {color.label}
                  </span>
                </div>
              )}
            </div>
            <Calendar className="text-neutral-400" size={32} />
          </div>
        </CardHeader>
      </Card>

      {/* Readings */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {liturgy.readings.first && (
          <Card hover>
            <div className="flex items-start gap-3">
              <div className="p-2 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-xl">
                <BookOpen size={20} />
              </div>
              <div>
                <h4 className="font-semibold text-neutral-700 dark:text-neutral-100 mb-1">Primeira Leitura</h4>
                <p className="text-sm text-neutral-600 dark:text-neutral-400">{liturgy.readings.first}</p>
              </div>
            </div>
          </Card>
        )}
        
        {liturgy.readings.psalm && (
          <Card hover>
            <div className="flex items-start gap-3">
              <div className="p-2 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-xl">
                <BookOpen size={20} />
              </div>
              <div>
                <h4 className="font-semibold text-neutral-700 dark:text-neutral-100 mb-1">Salmo Responsorial</h4>
                <p className="text-sm text-neutral-600 dark:text-neutral-400">{liturgy.readings.psalm}</p>
              </div>
            </div>
          </Card>
        )}
        
        {liturgy.readings.second && (
          <Card hover>
            <div className="flex items-start gap-3">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-xl">
                <BookOpen size={20} />
              </div>
              <div>
                <h4 className="font-semibold text-neutral-700 dark:text-neutral-100 mb-1">Segunda Leitura</h4>
                <p className="text-sm text-neutral-600 dark:text-neutral-400">{liturgy.readings.second}</p>
              </div>
            </div>
          </Card>
        )}
        
        {liturgy.readings.gospel && (
          <Card hover>
            <div className="flex items-start gap-3">
              <div className="p-2 bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 rounded-xl">
                <BookOpen size={20} />
              </div>
              <div>
                <h4 className="font-semibold text-neutral-700 dark:text-neutral-100 mb-1">Evangelho</h4>
                <p className="text-sm text-neutral-600 dark:text-neutral-400">{liturgy.readings.gospel}</p>
              </div>
            </div>
          </Card>
        )}
      </div>

      {/* Suggested Songs */}
      {liturgy.suggestedSongs && liturgy.suggestedSongs.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Músicas Sugeridas para Hoje</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {liturgy.suggestedSongs.map((song) => (
                <div key={song.id} className="p-4 rounded-xl bg-neutral-50 dark:bg-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-600 transition-colors cursor-pointer">
                  <h5 className="font-medium text-neutral-700 dark:text-neutral-100 mb-1">{song.title}</h5>
                  <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-2">{song.artist}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-neutral-500 dark:text-neutral-400">
                      {song.moments.map(m => m.charAt(0).toUpperCase() + m.slice(1)).join(', ')}
                    </span>
                    <span className="text-xs bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 px-2 py-1 rounded-lg font-medium">
                      Tom: {song.tone}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}