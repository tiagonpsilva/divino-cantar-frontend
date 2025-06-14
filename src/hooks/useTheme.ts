import { useState, useEffect } from 'react';

const THEME_KEY = 'theme';
const SETTINGS_KEY = 'divino-cantar-settings';

export function useTheme() {
  const [isDarkMode, setIsDarkMode] = useState(false);

  const applyTheme = (isDark: boolean) => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    setIsDarkMode(isDark);
  };

  const initializeTheme = () => {
    // First, check if we have settings-based theme
    const settingsData = localStorage.getItem(SETTINGS_KEY);
    if (settingsData) {
      try {
        const settings = JSON.parse(settingsData);
        if (settings.theme) {
          if (settings.theme === 'dark') {
            applyTheme(true);
            return;
          } else if (settings.theme === 'light') {
            applyTheme(false);
            return;
          } else if (settings.theme === 'auto') {
            const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            applyTheme(prefersDark);
            return;
          }
        }
      } catch (error) {
        console.error('Error parsing settings:', error);
      }
    }

    // Fallback to legacy theme
    const savedTheme = localStorage.getItem(THEME_KEY);
    if (savedTheme === 'dark') {
      applyTheme(true);
    } else if (savedTheme === 'light') {
      applyTheme(false);
    } else {
      // Default to system preference
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      applyTheme(prefersDark);
    }
  };

  const toggleTheme = () => {
    const newMode = !isDarkMode;
    applyTheme(newMode);
    
    // Update legacy storage
    localStorage.setItem(THEME_KEY, newMode ? 'dark' : 'light');
    
    // Update settings storage if it exists
    const settingsData = localStorage.getItem(SETTINGS_KEY);
    if (settingsData) {
      try {
        const settings = JSON.parse(settingsData);
        settings.theme = newMode ? 'dark' : 'light';
        localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
      } catch (error) {
        console.error('Error updating settings theme:', error);
      }
    }
  };

  useEffect(() => {
    initializeTheme();

    // Listen for storage changes (when settings are updated)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === SETTINGS_KEY || e.key === THEME_KEY) {
        initializeTheme();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  return {
    isDarkMode,
    toggleTheme,
    applyTheme
  };
}