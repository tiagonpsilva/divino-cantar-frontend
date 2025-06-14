import { useState } from 'react';
import { X, Copy, Mail, MessageCircle, Download, Link2, Check } from 'lucide-react';
import { cn } from '../lib/utils';

interface Song {
  id: string;
  title: string;
  artist: string;
  tone: string;
  moments: string[];
}

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  songs: Song[];
  title?: string;
  type?: 'repertoire' | 'moment' | 'song';
}

export function ShareModal({ isOpen, onClose, songs, title = 'Repertório' }: ShareModalProps) {
  const [copied, setCopied] = useState(false);
  const [shareFormat, setShareFormat] = useState<'text' | 'json'>('text');

  if (!isOpen) return null;

  const generateShareText = () => {
    const header = `🎵 ${title} - DivinoCantar\n${'='.repeat(title.length + 20)}\n\n`;
    
    const songsList = songs.map((song, index) => {
      return `${index + 1}. ${song.title}\n   Artista: ${song.artist}\n   Tom: ${song.tone}\n   Momentos: ${song.moments.join(', ')}\n`;
    }).join('\n');
    
    const footer = `\n📱 Gerado pelo DivinoCantar - Gestão de Repertório Musical\n📅 ${new Date().toLocaleDateString('pt-BR')}`;
    
    return header + songsList + footer;
  };

  const generateShareData = () => {
    return {
      title,
      songs: songs.map(song => ({
        title: song.title,
        artist: song.artist,
        tone: song.tone,
        moments: song.moments
      })),
      exportedAt: new Date().toISOString(),
      source: 'DivinoCantar'
    };
  };

  const getShareContent = () => {
    return shareFormat === 'text' ? generateShareText() : JSON.stringify(generateShareData(), null, 2);
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(getShareContent());
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const shareViaEmail = () => {
    const subject = encodeURIComponent(`${title} - DivinoCantar`);
    const body = encodeURIComponent(getShareContent());
    window.open(`mailto:?subject=${subject}&body=${body}`);
  };

  const shareViaWhatsApp = () => {
    const content = encodeURIComponent(getShareContent());
    window.open(`https://wa.me/?text=${content}`);
  };

  const downloadAsFile = () => {
    const content = getShareContent();
    const blob = new Blob([content], { type: shareFormat === 'text' ? 'text/plain' : 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${title.toLowerCase().replace(/\s+/g, '-')}.${shareFormat === 'text' ? 'txt' : 'json'}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-neutral-800 rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-neutral-200 dark:border-neutral-700">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 rounded-xl">
              <Link2 size={24} />
            </div>
            <h2 className="text-2xl font-bold text-neutral-700 dark:text-neutral-100">
              Compartilhar {title}
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
        <div className="p-6 space-y-6">
          {/* Format Selection */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-neutral-700 dark:text-neutral-100">
              Formato de Compartilhamento
            </h3>
            <div className="flex gap-2">
              <button
                onClick={() => setShareFormat('text')}
                className={cn(
                  'px-4 py-2 rounded-xl font-medium transition-colors',
                  shareFormat === 'text'
                    ? 'bg-primary-600 text-white'
                    : 'bg-neutral-100 dark:bg-neutral-700 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-600'
                )}
              >
                Texto Formatado
              </button>
              <button
                onClick={() => setShareFormat('json')}
                className={cn(
                  'px-4 py-2 rounded-xl font-medium transition-colors',
                  shareFormat === 'json'
                    ? 'bg-primary-600 text-white'
                    : 'bg-neutral-100 dark:bg-neutral-700 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-600'
                )}
              >
                Dados Estruturados (JSON)
              </button>
            </div>
          </div>

          {/* Preview */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-neutral-700 dark:text-neutral-100">
              Pré-visualização
            </h3>
            <div className="bg-neutral-50 dark:bg-neutral-700 rounded-xl p-4 max-h-48 overflow-y-auto">
              <pre className="text-sm text-neutral-700 dark:text-neutral-300 whitespace-pre-wrap font-mono">
                {getShareContent()}
              </pre>
            </div>
          </div>

          {/* Share Options */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-neutral-700 dark:text-neutral-100">
              Opções de Compartilhamento
            </h3>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={copyToClipboard}
                className="flex items-center gap-3 p-4 bg-neutral-100 dark:bg-neutral-700 hover:bg-neutral-200 dark:hover:bg-neutral-600 rounded-xl transition-colors"
              >
                {copied ? (
                  <Check size={20} className="text-green-600 dark:text-green-400" />
                ) : (
                  <Copy size={20} className="text-neutral-600 dark:text-neutral-400" />
                )}
                <div className="text-left">
                  <div className="font-medium text-neutral-700 dark:text-neutral-100">
                    {copied ? 'Copiado!' : 'Copiar'}
                  </div>
                  <div className="text-sm text-neutral-600 dark:text-neutral-400">
                    Área de transferência
                  </div>
                </div>
              </button>

              <button
                onClick={shareViaEmail}
                className="flex items-center gap-3 p-4 bg-neutral-100 dark:bg-neutral-700 hover:bg-neutral-200 dark:hover:bg-neutral-600 rounded-xl transition-colors"
              >
                <Mail size={20} className="text-blue-600 dark:text-blue-400" />
                <div className="text-left">
                  <div className="font-medium text-neutral-700 dark:text-neutral-100">Email</div>
                  <div className="text-sm text-neutral-600 dark:text-neutral-400">
                    Abrir cliente de email
                  </div>
                </div>
              </button>

              <button
                onClick={shareViaWhatsApp}
                className="flex items-center gap-3 p-4 bg-neutral-100 dark:bg-neutral-700 hover:bg-neutral-200 dark:hover:bg-neutral-600 rounded-xl transition-colors"
              >
                <MessageCircle size={20} className="text-green-600 dark:text-green-400" />
                <div className="text-left">
                  <div className="font-medium text-neutral-700 dark:text-neutral-100">WhatsApp</div>
                  <div className="text-sm text-neutral-600 dark:text-neutral-400">
                    Compartilhar via app
                  </div>
                </div>
              </button>

              <button
                onClick={downloadAsFile}
                className="flex items-center gap-3 p-4 bg-neutral-100 dark:bg-neutral-700 hover:bg-neutral-200 dark:hover:bg-neutral-600 rounded-xl transition-colors"
              >
                <Download size={20} className="text-purple-600 dark:text-purple-400" />
                <div className="text-left">
                  <div className="font-medium text-neutral-700 dark:text-neutral-100">Download</div>
                  <div className="text-sm text-neutral-600 dark:text-neutral-400">
                    Salvar como arquivo
                  </div>
                </div>
              </button>
            </div>
          </div>

          {/* Info */}
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4">
            <div className="flex items-start gap-3">
              <div className="p-1 bg-blue-200 dark:bg-blue-800 rounded-lg">
                <Link2 size={16} className="text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-1">
                  Compartilhamento Seguro
                </h4>
                <p className="text-sm text-blue-700 dark:text-blue-300">
                  {songs.length} {songs.length === 1 ? 'música' : 'músicas'} serão compartilhadas. 
                  Os dados são formatados de forma legível e podem ser importados por outros usuários do DivinoCantar.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 p-6 pt-0">
          <button
            onClick={onClose}
            className="flex-1 px-6 py-3 bg-neutral-100 dark:bg-neutral-700 text-neutral-700 dark:text-neutral-300 rounded-xl hover:bg-neutral-200 dark:hover:bg-neutral-600 transition-colors font-medium"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
}