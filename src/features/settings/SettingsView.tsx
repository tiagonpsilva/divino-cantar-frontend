import { User, Bell, Palette, Shield, HelpCircle, LogOut, Volume2, Settings2 } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/Card';
import { useSettings } from '../../hooks/useSettings';
import { useToastContext } from '../../contexts/ToastContext';

export function SettingsView() {
  const { settings, updateProfile, updateNotifications, updateAppearance, updateAudio, updateBehavior } = useSettings();
  const { success } = useToastContext();
  
  const handleProfileSave = (field: 'name' | 'email' | 'parish', value: string) => {
    updateProfile({ [field]: value } as Pick<typeof settings, 'name' | 'email' | 'parish'>);
    success('Perfil atualizado com sucesso!');
  };
  
  const handleNotificationToggle = (field: 'massReminders' | 'repertoireSuggestions' | 'liturgicalUpdates', value: boolean) => {
    updateNotifications({ [field]: value } as Pick<typeof settings, 'massReminders' | 'repertoireSuggestions' | 'liturgicalUpdates'>);
    success('Configurações de notificação atualizadas!');
  };
  
  const handleAppearanceChange = (field: 'theme' | 'fontSize', value: string) => {
    updateAppearance({ [field]: value } as Pick<typeof settings, 'theme' | 'fontSize'>);
    success('Aparência atualizada!');
  };
  
  const handleAudioChange = (field: 'autoplay' | 'volume', value: any) => {
    updateAudio({ [field]: value } as Pick<typeof settings, 'autoplay' | 'volume'>);
    success('Configurações de áudio atualizadas!');
  };
  
  const handleBehaviorChange = (field: 'autoSave' | 'confirmDelete', value: boolean) => {
    updateBehavior({ [field]: value } as Pick<typeof settings, 'autoSave' | 'confirmDelete'>);
    success('Comportamento atualizado!');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-neutral-700 dark:text-neutral-100 mb-2">
          Configurações
        </h1>
        <p className="text-neutral-600 dark:text-neutral-400">
          Personalize sua experiência no DivinoCantar
        </p>
      </div>

      {/* Settings Sections */}
      <div className="space-y-6">
        {/* Profile Section */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <User className="text-neutral-600 dark:text-neutral-400" size={24} />
              <CardTitle>Perfil</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between py-2">
                <span className="text-neutral-700 dark:text-neutral-300">Nome</span>
                <input 
                  type="text" 
                  value={settings.name}
                  onChange={(e) => handleProfileSave('name', e.target.value)}
                  className="px-3 py-1 bg-neutral-100 dark:bg-neutral-700 text-neutral-700 dark:text-neutral-100 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
              <div className="flex items-center justify-between py-2">
                <span className="text-neutral-700 dark:text-neutral-300">Email</span>
                <input 
                  type="email" 
                  value={settings.email}
                  onChange={(e) => handleProfileSave('email', e.target.value)}
                  className="px-3 py-1 bg-neutral-100 dark:bg-neutral-700 text-neutral-700 dark:text-neutral-100 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
              <div className="flex items-center justify-between py-2">
                <span className="text-neutral-700 dark:text-neutral-300">Paróquia</span>
                <input 
                  type="text" 
                  value={settings.parish}
                  onChange={(e) => handleProfileSave('parish', e.target.value)}
                  className="px-3 py-1 bg-neutral-100 dark:bg-neutral-700 text-neutral-700 dark:text-neutral-100 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Notifications Section */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <Bell className="text-neutral-600 dark:text-neutral-400" size={24} />
              <CardTitle>Notificações</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between py-2">
                <span className="text-neutral-700 dark:text-neutral-300">Lembretes de missa</span>
                <button 
                  onClick={() => handleNotificationToggle('massReminders', !settings.massReminders)}
                  className={`w-12 h-6 rounded-full transition-colors ${
                    settings.massReminders ? 'bg-primary-600' : 'bg-neutral-300 dark:bg-neutral-600'
                  }`}
                >
                  <div className={`w-5 h-5 bg-white rounded-full shadow-sm transition-transform ${
                    settings.massReminders ? 'translate-x-6' : 'translate-x-0.5'
                  }`} />
                </button>
              </div>
              <div className="flex items-center justify-between py-2">
                <span className="text-neutral-700 dark:text-neutral-300">Sugestões de repertório</span>
                <button 
                  onClick={() => handleNotificationToggle('repertoireSuggestions', !settings.repertoireSuggestions)}
                  className={`w-12 h-6 rounded-full transition-colors ${
                    settings.repertoireSuggestions ? 'bg-primary-600' : 'bg-neutral-300 dark:bg-neutral-600'
                  }`}
                >
                  <div className={`w-5 h-5 bg-white rounded-full shadow-sm transition-transform ${
                    settings.repertoireSuggestions ? 'translate-x-6' : 'translate-x-0.5'
                  }`} />
                </button>
              </div>
              <div className="flex items-center justify-between py-2">
                <span className="text-neutral-700 dark:text-neutral-300">Atualizações litúrgicas</span>
                <button 
                  onClick={() => handleNotificationToggle('liturgicalUpdates', !settings.liturgicalUpdates)}
                  className={`w-12 h-6 rounded-full transition-colors ${
                    settings.liturgicalUpdates ? 'bg-primary-600' : 'bg-neutral-300 dark:bg-neutral-600'
                  }`}
                >
                  <div className={`w-5 h-5 bg-white rounded-full shadow-sm transition-transform ${
                    settings.liturgicalUpdates ? 'translate-x-6' : 'translate-x-0.5'
                  }`} />
                </button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Appearance Section */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <Palette className="text-neutral-600 dark:text-neutral-400" size={24} />
              <CardTitle>Aparência</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between py-2">
                <span className="text-neutral-700 dark:text-neutral-300">Tema</span>
                <select 
                  value={settings.theme} 
                  onChange={(e) => handleAppearanceChange('theme', e.target.value)}
                  className="px-3 py-1 bg-neutral-100 dark:bg-neutral-700 text-neutral-700 dark:text-neutral-100 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="light">Claro</option>
                  <option value="dark">Escuro</option>
                  <option value="auto">Automático</option>
                </select>
              </div>
              <div className="flex items-center justify-between py-2">
                <span className="text-neutral-700 dark:text-neutral-300">Tamanho da fonte</span>
                <select 
                  value={settings.fontSize} 
                  onChange={(e) => handleAppearanceChange('fontSize', e.target.value)}
                  className="px-3 py-1 bg-neutral-100 dark:bg-neutral-700 text-neutral-700 dark:text-neutral-100 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="small">Pequeno</option>
                  <option value="medium">Médio</option>
                  <option value="large">Grande</option>
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Audio Section */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <Volume2 className="text-neutral-600 dark:text-neutral-400" size={24} />
              <CardTitle>Áudio</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between py-2">
                <span className="text-neutral-700 dark:text-neutral-300">Reprodução automática</span>
                <button 
                  onClick={() => handleAudioChange('autoplay', !settings.autoplay)}
                  className={`w-12 h-6 rounded-full transition-colors ${
                    settings.autoplay ? 'bg-primary-600' : 'bg-neutral-300 dark:bg-neutral-600'
                  }`}
                >
                  <div className={`w-5 h-5 bg-white rounded-full shadow-sm transition-transform ${
                    settings.autoplay ? 'translate-x-6' : 'translate-x-0.5'
                  }`} />
                </button>
              </div>
              <div className="flex items-center justify-between py-2">
                <span className="text-neutral-700 dark:text-neutral-300">Volume</span>
                <div className="flex items-center gap-3">
                  <input 
                    type="range" 
                    min="0" 
                    max="100" 
                    value={settings.volume}
                    onChange={(e) => handleAudioChange('volume', parseInt(e.target.value))}
                    className="w-24"
                  />
                  <span className="text-sm text-neutral-600 dark:text-neutral-400 w-10">{settings.volume}%</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Behavior Section */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <Settings2 className="text-neutral-600 dark:text-neutral-400" size={24} />
              <CardTitle>Comportamento</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between py-2">
                <span className="text-neutral-700 dark:text-neutral-300">Salvamento automático</span>
                <button 
                  onClick={() => handleBehaviorChange('autoSave', !settings.autoSave)}
                  className={`w-12 h-6 rounded-full transition-colors ${
                    settings.autoSave ? 'bg-primary-600' : 'bg-neutral-300 dark:bg-neutral-600'
                  }`}
                >
                  <div className={`w-5 h-5 bg-white rounded-full shadow-sm transition-transform ${
                    settings.autoSave ? 'translate-x-6' : 'translate-x-0.5'
                  }`} />
                </button>
              </div>
              <div className="flex items-center justify-between py-2">
                <span className="text-neutral-700 dark:text-neutral-300">Confirmar exclusões</span>
                <button 
                  onClick={() => handleBehaviorChange('confirmDelete', !settings.confirmDelete)}
                  className={`w-12 h-6 rounded-full transition-colors ${
                    settings.confirmDelete ? 'bg-primary-600' : 'bg-neutral-300 dark:bg-neutral-600'
                  }`}
                >
                  <div className={`w-5 h-5 bg-white rounded-full shadow-sm transition-transform ${
                    settings.confirmDelete ? 'translate-x-6' : 'translate-x-0.5'
                  }`} />
                </button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Additional Options */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card hover className="cursor-pointer">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-xl">
              <Shield size={24} />
            </div>
            <div>
              <h3 className="font-semibold text-neutral-700 dark:text-neutral-100">Privacidade e Segurança</h3>
              <p className="text-sm text-neutral-600 dark:text-neutral-400">Gerencie seus dados e preferências</p>
            </div>
          </div>
        </Card>

        <Card hover className="cursor-pointer">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-xl">
              <HelpCircle size={24} />
            </div>
            <div>
              <h3 className="font-semibold text-neutral-700 dark:text-neutral-100">Ajuda e Suporte</h3>
              <p className="text-sm text-neutral-600 dark:text-neutral-400">Tire dúvidas e entre em contato</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Logout Button */}
      <div className="pt-6 border-t border-neutral-200 dark:border-neutral-700">
        <button className="flex items-center gap-2 px-4 py-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-colors">
          <LogOut size={20} />
          Sair da conta
        </button>
      </div>
    </div>
  );
}