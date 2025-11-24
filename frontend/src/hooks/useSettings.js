import { useCallback, useEffect, useState } from 'react';
import { DEFAULT_SETTINGS, SETTINGS_STORAGE_KEY } from '../settings/defaults';

const parseStoredSettings = () => {
  if (typeof window === 'undefined') return DEFAULT_SETTINGS;
  try {
    const stored = localStorage.getItem(SETTINGS_STORAGE_KEY);
    if (!stored) return DEFAULT_SETTINGS;
    const parsed = JSON.parse(stored);
    return {
      ...DEFAULT_SETTINGS,
      ...parsed,
      councilModels: parsed.councilModels || DEFAULT_SETTINGS.councilModels,
      chairmanModel: parsed.chairmanModel || DEFAULT_SETTINGS.chairmanModel,
    };
  } catch (err) {
    console.warn('Failed to parse stored settings, using defaults', err);
    return DEFAULT_SETTINGS;
  }
};

export function useSettings() {
  const [settings, setSettings] = useState(parseStoredSettings);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings));
  }, [settings]);

  const updateSettings = useCallback((next) => {
    setSettings((prev) => ({ ...prev, ...next }));
  }, []);

  const resetSettings = useCallback(() => {
    setSettings(DEFAULT_SETTINGS);
  }, []);

  return { settings, updateSettings, resetSettings };
}
