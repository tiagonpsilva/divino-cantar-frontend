import { useState, useEffect } from 'react';

interface Settings {
  // Profile
  name: string;
  email: string;
  parish: string;
  
  // Notifications
  massReminders: boolean;
  repertoireSuggestions: boolean;
  liturgicalUpdates: boolean;
  
  // Appearance
  theme: 'light' | 'dark' | 'auto';
  fontSize: 'small' | 'medium' | 'large';
  
  // Audio
  autoplay: boolean;
  volume: number;
  
  // Behavior
  autoSave: boolean;
  confirmDelete: boolean;
}

const DEFAULT_SETTINGS: Settings = {
  name: 'João Silva',
  email: 'joao@example.com',
  parish: 'São José',
  massReminders: true,
  repertoireSuggestions: true,
  liturgicalUpdates: false,
  theme: 'auto',
  fontSize: 'medium',
  autoplay: false,
  volume: 70,
  autoSave: true,
  confirmDelete: true
};

const SETTINGS_KEY = 'divino-cantar-settings';

export function useSettings() {
  const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Load settings from localStorage
    const savedSettings = localStorage.getItem(SETTINGS_KEY);
    if (savedSettings) {
      try {
        const parsed = JSON.parse(savedSettings);
        setSettings({ ...DEFAULT_SETTINGS, ...parsed });
      } catch (error) {
        console.error('Error loading settings:', error);
      }
    }
    setIsLoading(false);
  }, []);

  const updateSettings = (newSettings: Partial<Settings>) => {
    const updated = { ...settings, ...newSettings };
    setSettings(updated);
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(updated));
  };

  const resetSettings = () => {
    setSettings(DEFAULT_SETTINGS);
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(DEFAULT_SETTINGS));
  };

  const updateProfile = (profile: Pick<Settings, 'name' | 'email' | 'parish'>) => {
    updateSettings(profile);
  };

  const updateNotifications = (notifications: Pick<Settings, 'massReminders' | 'repertoireSuggestions' | 'liturgicalUpdates'>) => {
    updateSettings(notifications);
  };

  const updateAppearance = (appearance: Pick<Settings, 'theme' | 'fontSize'>) => {
    updateSettings(appearance);
    
    // Apply theme immediately
    if (appearance.theme) {
      applyTheme(appearance.theme);
      // Update legacy theme storage for Layout compatibility
      if (appearance.theme !== 'auto') {
        localStorage.setItem('theme', appearance.theme);
      }
    }
  };

  const updateAudio = (audio: Pick<Settings, 'autoplay' | 'volume'>) => {
    updateSettings(audio);
  };

  const updateBehavior = (behavior: Pick<Settings, 'autoSave' | 'confirmDelete'>) => {
    updateSettings(behavior);
  };

  const applyTheme = (theme: Settings['theme']) => {
    const root = document.documentElement;
    
    if (theme === 'dark') {
      root.classList.add('dark');
    } else if (theme === 'light') {
      root.classList.remove('dark');
    } else {
      // Auto mode - use system preference
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      if (prefersDark) {
        root.classList.add('dark');
      } else {
        root.classList.remove('dark');
      }
    }
  };

  // Apply theme on load
  useEffect(() => {
    if (!isLoading) {
      applyTheme(settings.theme);
      // Also update the legacy theme storage for Layout compatibility
      if (settings.theme !== 'auto') {
        localStorage.setItem('theme', settings.theme);
      }
    }
  }, [settings.theme, isLoading]);

  return {
    settings,
    isLoading,
    updateSettings,
    resetSettings,
    updateProfile,
    updateNotifications,
    updateAppearance,
    updateAudio,
    updateBehavior
  };
}