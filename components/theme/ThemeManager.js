
import { useSyncExternalStore } from 'react';

import { LightMode } from './LightMode';
import { DarkMode } from './DarkMode';

// Default
let currentMode = 'dark';

// Stores screens listening for theme changes
const listeners = new Set();

// Subscribe to theme changes
const subscribe = (listener) => {
  listeners.add(listener);

  return () => 
    {
    listeners.delete(listener);
  };
};

// Returns currently selected mode
const getSnapshot = () => currentMode;

// Changes the selected theme
export const setTheme = (mode) => {
  if (mode !== 'light' && mode !== 'dark') {
    return;
  }

  if (currentMode === mode) {
    return;
  }

  currentMode = mode;

  // Notify subscribed screens
  listeners.forEach((listener) => listener());
};

// Switch between light and dark
export const toggleTheme = () => {
  if (currentMode === 'light') {
    setTheme('dark');
  } else {
    setTheme('light');
  }
};

// Access the active theme in any screen
export const useAppTheme = () => {
  const mode = useSyncExternalStore(
    subscribe,
    getSnapshot
  );

  const theme =
    mode === 'dark' ? DarkMode : LightMode;

  return {
    theme,
    mode,
    toggleTheme,
    setTheme,
  };
};
