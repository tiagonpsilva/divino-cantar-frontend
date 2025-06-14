import { Download, Upload, Folder, FileText, Star } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/Card';

export function LibraryView() {
  const collections = [
    { name: 'Favoritos', count: 23, icon: Star, color: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400' },
    { name: 'Quaresma', count: 15, icon: Folder, color: 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400' },
    { name: 'Natal', count: 18, icon: Folder, color: 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400' },
    { name: 'Marianas', count: 12, icon: Folder, color: 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400' },
  ];

  const recentDocuments = [
    { name: 'Repertório - Domingo 16/06', type: 'PDF', size: '245 KB', date: '14/06/2024' },
    { name: 'Cifras - Quaresma 2024', type: 'PDF', size: '1.2 MB', date: '10/06/2024' },
    { name: 'Cantos do Ordinário', type: 'DOCX', size: '156 KB', date: '05/06/2024' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-neutral-700 dark:text-neutral-100 mb-2">
            Minha Biblioteca
          </h1>
          <p className="text-neutral-600 dark:text-neutral-400">
            Organize seus repertórios e documentos musicais
          </p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-neutral-100 dark:bg-neutral-700 text-neutral-700 dark:text-neutral-300 rounded-xl hover:bg-neutral-200 dark:hover:bg-neutral-600 transition-colors">
            <Upload size={20} />
            Importar
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-primary-600 dark:bg-primary-500 text-white rounded-xl hover:bg-primary-700 dark:hover:bg-primary-600 transition-colors">
            <Download size={20} />
            Exportar
          </button>
        </div>
      </div>

      {/* Collections */}
      <div>
        <h2 className="text-xl font-semibold text-neutral-700 dark:text-neutral-100 mb-4">Coleções</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {collections.map((collection, index) => (
            <Card key={index} hover className="cursor-pointer">
              <div className="flex items-center justify-between mb-3">
                <div className={`p-3 rounded-xl ${collection.color}`}>
                  <collection.icon size={24} />
                </div>
                <span className="text-2xl font-semibold text-neutral-700 dark:text-neutral-100">{collection.count}</span>
              </div>
              <h3 className="font-medium text-neutral-700 dark:text-neutral-100">{collection.name}</h3>
              <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">músicas</p>
            </Card>
          ))}
        </div>
      </div>

      {/* Recent Documents */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Documentos Recentes</CardTitle>
            <button className="text-sm text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-medium">
              Ver todos
            </button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recentDocuments.map((doc, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-neutral-50 dark:bg-neutral-700 rounded-xl hover:bg-neutral-100 dark:hover:bg-neutral-600 transition-colors cursor-pointer">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white dark:bg-neutral-600 rounded-xl border border-neutral-200 dark:border-neutral-500">
                    <FileText className="text-neutral-600 dark:text-neutral-400" size={20} />
                  </div>
                  <div>
                    <p className="font-medium text-neutral-700 dark:text-neutral-100">{doc.name}</p>
                    <p className="text-sm text-neutral-600 dark:text-neutral-400">{doc.type} • {doc.size}</p>
                  </div>
                </div>
                <span className="text-sm text-neutral-500 dark:text-neutral-400">{doc.date}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Storage Info */}
      <Card className="bg-gradient-to-r from-neutral-50 to-neutral-100 dark:from-neutral-800 dark:to-neutral-700 border-0">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-neutral-700 dark:text-neutral-100 mb-1">
              Armazenamento
            </h3>
            <p className="text-neutral-600 dark:text-neutral-400">
              Você está usando 2.3 GB de 5 GB disponíveis
            </p>
          </div>
          <div className="w-32 h-2 bg-neutral-200 dark:bg-neutral-600 rounded-full overflow-hidden">
            <div className="w-[46%] h-full bg-primary-600 rounded-full"></div>
          </div>
        </div>
      </Card>
    </div>
  );
}